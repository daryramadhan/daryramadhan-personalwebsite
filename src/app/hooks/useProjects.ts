import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { projects as staticProjects, Project } from '../data/projects';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching projects:', error);
                    // Fallback to static data if error (or empty for now, user choice)
                    // merging static and dynamic for demo purposes
                    setProjects([...(data || []) as Project[], ...staticProjects]);
                } else {
                    // Combine DB projects with static ones, prioritizing DB versions
                    const dbProjects = (data || []).map((p: any) => ({
                        ...p,
                        className: p.class_name || p.className // Map DB class_name to className
                    })) as Project[];
                    const dbIds = new Set(dbProjects.map(p => p.id));

                    const filteredStaticProjects = staticProjects.filter(p => !dbIds.has(p.id));

                    setProjects([...dbProjects, ...filteredStaticProjects]);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setProjects(staticProjects);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const deleteProject = async (id: string) => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting project:', error);
                throw error;
            }

            // Update local state
            setProjects(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (err) {
            console.error('Unexpected error deleting project:', err);
            return false;
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const nextStatus = !currentStatus;
            const { error } = await supabase
                .from('projects')
                .update({ is_published: nextStatus })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setProjects(prev => prev.map(p =>
                p.id === id ? { ...p, is_published: nextStatus } : p
            ));
            return true;
        } catch (err) {
            console.error('Error toggling publish status:', err);
            return false;
        }
    };

    return { projects, loading, deleteProject, togglePublish };
}

// Helper to map DB project to Frontend Project interface
function mapProject(data: any): Project {
    return {
        ...data,
        className: data.class_name || data.className, // Handle simple mapping
    };
}
