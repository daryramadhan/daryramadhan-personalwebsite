import React, { useState, useRef } from 'react';
import { usePartners } from '../../hooks/usePartners';
import { Trash2, ChevronUp, ChevronDown, Upload, Info, ImageIcon } from 'lucide-react';

export function PartnersManager() {
    const { partners, loading, addPartner, deletePartner, movePartner } = usePartners();
    const [name, setName] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        }
    };

    const handleAdd = async () => {
        if (!name.trim() || !logoFile) return;
        setSaving(true);
        const success = await addPartner(name.trim(), logoFile);
        if (success) {
            setName('');
            setLogoFile(null);
            setLogoPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
        setSaving(false);
    };

    const confirmDelete = async () => {
        if (!deleteModal) return;
        await deletePartner(deleteModal.id);
        setDeleteModal(null);
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading partners...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
                    <p className="text-gray-500 mt-2">Manage your collaborations & partner logos.</p>
                </div>
            </div>

            {/* Add Partner Form */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Add New Partner</h3>

                {/* Info badge */}
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5">
                    <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Optimal logo size: <strong>200 × 80px</strong>. Use <strong>PNG or SVG</strong> with a transparent background for best results. Logos will be displayed in a horizontal scrolling marquee.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-gray-600">Partner Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                            placeholder="e.g. Archaus Studio"
                        />
                    </div>

                    {/* Logo upload */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-gray-600">Logo</label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex items-center gap-3 px-4 py-2.5 border border-dashed rounded-lg cursor-pointer transition-all text-sm ${isDragging
                                ? 'border-black bg-gray-100'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" className="h-8 max-w-[120px] object-contain" />
                            ) : (
                                <Upload size={16} className="text-gray-400" />
                            )}
                            <span className="text-gray-500 truncate">
                                {logoFile ? logoFile.name : 'Drop logo or click to upload'}
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!name.trim() || !logoFile || saving}
                    className="mt-5 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {saving ? 'Adding...' : 'Add Partner'}
                </button>
            </div>

            {/* Partners List */}
            {partners.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <ImageIcon size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No partners yet. Add your first one above.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4 w-12">#</th>
                                <th className="px-6 py-4">Logo</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {partners.map((partner, index) => (
                                <tr key={partner.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="h-10 w-28 bg-gray-50 rounded-md flex items-center justify-center p-1.5">
                                            <img
                                                src={partner.logo_url}
                                                alt={partner.name}
                                                className="h-full max-w-full object-contain"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{partner.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => movePartner(partner.id, 'up')}
                                                disabled={index === 0}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move up"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => movePartner(partner.id, 'down')}
                                                disabled={index === partners.length - 1}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move down"
                                            >
                                                <ChevronDown size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ id: partner.id, name: partner.name })}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Partner</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <span className="font-medium text-gray-900">"{deleteModal.name}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium text-sm"
                            >
                                Delete Partner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
