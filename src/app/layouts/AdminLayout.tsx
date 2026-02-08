import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

export function AdminLayout() {
    const { user, loading, signOut } = useAuth();
    const location = useLocation();

    if (loading) {
        // Simple loading spinner
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-white">
            {/* Admin Sidebar / Nav */}
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-gray-50 border-r border-gray-100 p-6 hidden md:flex flex-col">
                <div className="mb-8 pl-2">
                    <h1 className="font-bold tracking-tight text-xl">Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage your content</p>
                </div>

                <nav className="space-y-1 flex-1">
                    <Link
                        to="/admin/dashboard"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/dashboard') ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Projects</span>
                    </Link>
                    <Link
                        to="/admin/create"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/create') ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                    >
                        <PlusCircle size={18} />
                        <span>New Project</span>
                    </Link>
                </nav>

                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors mt-auto"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden border-b border-gray-100 p-4 flex justify-between items-center bg-white sticky top-0 z-10">
                <span className="font-bold">Dashboard</span>
                <button onClick={() => signOut()}><LogOut size={18} /></button>
            </div>

            {/* Main Content */}
            <div className="md:ml-64 p-8 max-w-5xl mx-auto">
                <Outlet />
            </div>
        </div>
    );
}
