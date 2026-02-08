import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '../../components/admin/Editor';
import { projects } from '../../data/projects';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProjectEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        year: new Date().getFullYear().toString(),
        description: '',
        image: '',
        project_type: 'selected_work', // Default
        role: '',
        client: '',
        className: '', // For grid layout
        is_published: true, // Default
    });

    useEffect(() => {
        if (isEditing) {
            const project = projects.find(p => p.id === id);
            if (project) {
                // For now, if it's a local static project, we just load it. 
                // In a real app we'd try to fetch from supabase first.
                setFormData({
                    title: project.title,
                    category: project.category,
                    year: project.year,
                    description: project.description || '',
                    image: project.image,
                    project_type: project.project_type || 'selected_work',
                    role: project.role || '',
                    client: project.client || '',
                    className: project.className || '',
                    is_published: project.is_published ?? true,
                })
            } else {
                // Try fetching from supabase
                const fetchProject = async () => {
                    const { data, error } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (data) {
                        setFormData({
                            title: data.title,
                            category: data.category,
                            year: data.year,
                            description: data.description,
                            image: data.image,
                            project_type: data.project_type || 'selected_work',
                            // Map DB columns to form state
                            role: data.role || '',
                            client: data.client || '',
                            className: data.class_name || '', // Map class_name from DB to className in form
                            is_published: data.is_published ?? true,
                        });
                    }
                };
                fetchProject();
            }
        }
    }, [id, isEditing]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const projectData = {
                title: formData.title,
                category: formData.category,
                year: formData.year,
                description: formData.description,
                image: formData.image,
                project_type: formData.project_type,
                role: formData.role,
                client: formData.client,
                class_name: formData.className, // Map form className to DB class_name
                is_published: formData.is_published,
                // updated_at: new Date().toISOString(), // Column not in DB yet
            };

            // Clean projectData: only include class_name if it has a value, 
            // to avoid PGRST204 if column doesn't exist (though ideally migration is run)
            const cleanProjectData: any = { ...projectData };
            if (!cleanProjectData.class_name) delete cleanProjectData.class_name;
            if (!cleanProjectData.role) delete cleanProjectData.role;
            if (!cleanProjectData.client) delete cleanProjectData.client;

            const { error } = await supabase
                .from('projects')
                .upsert(isEditing ? { id, ...cleanProjectData } : cleanProjectData);

            if (error) throw error;

            alert('Saved successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project');
        } finally {
            setLoading(false);
        }
    };

    const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `cover-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            if (data) {
                setFormData(prev => ({ ...prev, image: data.publicUrl }));
            }
        } catch (error) {
            console.error('Error uploading cover:', error);
            alert('Error uploading cover image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Validating Edit Project' : 'New Project'}</h1>
                        <p className="text-sm text-gray-500">{isEditing ? `Editing ${formData.title}` : 'Create a new case study'}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-medium text-lg"
                            placeholder="e.g. Minimalist Architecture"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Story / Case Study</label>
                        <Editor
                            content={formData.description}
                            onChange={(content) => setFormData({ ...formData, description: content })}
                        />
                    </div>
                </div>

                {/* Sidebar Meta */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Meta Data</h3>

                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Type</label>
                            <select
                                value={formData.project_type}
                                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                            >
                                <option value="case_study">Case Study</option>
                                <option value="selected_work">Selected Work</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                                placeholder="e.g. UI/UX Design"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Client</label>
                            <input
                                type="text"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                                placeholder="e.g. Adobe"
                            />
                        </div>

                        {formData.project_type === 'selected_work' && (
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-600">Grid Layout</label>
                                <select
                                    value={formData.className}
                                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                                >
                                    <option value="">Square (Default)</option>
                                    <option value="md:col-span-2 aspect-[16/9]">Wide (2 Columns)</option>
                                    <option value="row-span-2 aspect-[9/16]">Tall (2 Rows)</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Cover Image</label>

                            {/* File Upload UI */}
                            <div className="mb-3">
                                <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full justify-center">
                                    <Upload size={16} className="text-gray-500" />
                                    <span className="text-sm text-gray-600 font-medium">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm mb-2"
                                placeholder="Or enter image URL"
                            />
                            {formData.image && (
                                <div className="mt-2 rounded-md overflow-hidden aspect-video relative group">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">Visible on Site</span>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
                                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.is_published ? 'bg-black' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_published ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
