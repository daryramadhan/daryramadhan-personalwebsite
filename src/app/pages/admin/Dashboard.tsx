import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';

export function Dashboard() {
    const { projects, loading, deleteProject } = useProjects();
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

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Year</th>
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

