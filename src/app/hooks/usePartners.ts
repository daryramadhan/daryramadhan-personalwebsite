import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Partner {
    id: string;
    name: string;
    logo_url: string;
    sort_order: number;
    created_at?: string;
}

export function usePartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPartners = async () => {
        try {
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) {
                console.error('Error fetching partners:', error);
                setPartners([]);
            } else {
                setPartners((data || []) as Partner[]);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setPartners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const addPartner = async (name: string, logoFile: File) => {
        try {
            // Upload logo to storage
            const fileExt = logoFile.name.split('.').pop();
            const fileName = `partner-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(fileName, logoFile);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('project-images')
                .getPublicUrl(fileName);

            if (!urlData) throw new Error('Failed to get public URL');

            // Get the next sort order
            const maxOrder = partners.length > 0
                ? Math.max(...partners.map(p => p.sort_order))
                : 0;

            // Insert partner record
            const { data, error } = await supabase
                .from('partners')
                .insert({
                    name,
                    logo_url: urlData.publicUrl,
                    sort_order: maxOrder + 1,
                })
                .select()
                .single();

            if (error) throw error;

            setPartners(prev => [...prev, data as Partner]);
            return true;
        } catch (err) {
            console.error('Error adding partner:', err);
            return false;
        }
    };

    const deletePartner = async (id: string) => {
        try {
            const { error } = await supabase
                .from('partners')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setPartners(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting partner:', err);
            return false;
        }
    };

    const movePartner = async (id: string, direction: 'up' | 'down') => {
        const index = partners.findIndex(p => p.id === id);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === partners.length - 1) return;

        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const current = partners[index];
        const swap = partners[swapIndex];

        try {
            // Swap sort_order values in DB
            await Promise.all([
                supabase.from('partners').update({ sort_order: swap.sort_order }).eq('id', current.id),
                supabase.from('partners').update({ sort_order: current.sort_order }).eq('id', swap.id),
            ]);

            // Swap in local state
            const updated = [...partners];
            updated[index] = { ...swap, sort_order: current.sort_order };
            updated[swapIndex] = { ...current, sort_order: swap.sort_order };
            updated.sort((a, b) => a.sort_order - b.sort_order);
            setPartners(updated);
        } catch (err) {
            console.error('Error reordering partners:', err);
        }
    };

    return { partners, loading, addPartner, deletePartner, movePartner };
}
