import React, { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, HardDrive, AlertCircle } from 'lucide-react';

function StorageWidget() {
    const [stats, setStats] = useState<{ usedBytes: number; maxBytes: number; percentage: number; fileCount: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/.netlify/functions/storage-stats')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setStats(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-24 bg-gray-50 animate-pulse rounded-xl border border-gray-100 mb-8"></div>;
    if (error) return <div className="h-24 bg-red-50 text-red-600 flex items-center px-6 rounded-xl border border-red-100 mb-8 text-sm"><AlertCircle className="w-4 h-4 mr-2" /> Error loading storage: {error}</div>;
    if (!stats) return null;

    const usedGB = (stats.usedBytes / (1024 ** 3)).toFixed(2);
    const maxGB = (stats.maxBytes / (1024 ** 3)).toFixed(0);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-gray-500" />
                    <h3 className="font-medium text-gray-900">Cloudflare R2 Storage</h3>
                </div>
                <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{usedGB} GB</span> / {maxGB} GB
                </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-2.5 rounded-full ${stats.percentage > 90 ? 'bg-red-500' : 'bg-black'}`} 
                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                ></div>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex justify-between">
                <span>{stats.fileCount} images uploaded</span>
                <span>{stats.percentage.toFixed(2)}% used</span>
            </div>
        </div>
    );
}

export function Dashboard() {
    const { projects, loading, deleteProject, togglePublish } = useProjects();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<any>(null); // Using any to avoid importing Project type duplication for now

    const handleDeleteClick = (project: any) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            await deleteProject(projectToDelete.id);
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading projects...</div>
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-gray-500 mt-2">Manage your portfolio items.</p>
                </div>
                <Link
                    to="/admin/create"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    Create New
                </Link>
            </div>

            <StorageWidget />

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Year</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map((project) => (
                            <tr key={project.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{project.title}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.project_type === 'case_study'
                                        ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
                                        : 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                                        }`}>
                                        {project.project_type === 'case_study' ? 'Case Study' : 'Selected Work'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{project.category}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{project.year}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => togglePublish(project.id, project.is_published ?? true)}
                                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${project.is_published !== false ? 'bg-black' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${project.is_published !== false ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors" title="View">
                                            <Eye size={16} />
                                        </button>
                                        <Link to={`/admin/edit/${project.id}`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors" title="Edit">
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(project)}
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

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <span className="font-medium text-gray-900">"{projectToDelete?.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium text-sm"
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

