'use client';

import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-4">Loading...</div>;

    // Basic role check (redirect handled in AuthContext/Login, but good to have safeguard)
    if (!user || user.role !== 'citizen') {
        // In a real app, you might redirect here or show "Unauthorized"
        return <div className="p-4 text-red-500">Unauthorized. Please log in as a citizen.</div>
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Citizen Sidebar */}
            <aside className="w-64 bg-teal-800 text-white min-h-screen p-4 flex flex-col">
                <div className="mb-6 text-2xl font-bold">Atlas Civic</div>
                <nav className="space-y-2 flex-1">
                    <Link href="/citizen/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-700">
                        Dashboard
                    </Link>
                    <Link href="/citizen/complaints/new" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-700">
                        Report Issue
                    </Link>
                    <Link href="/citizen/complaints" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-700">
                        My Complaints
                    </Link>
                </nav>
                <div className="mt-auto">
                    <div className="text-sm opacity-75">Logged in as: {user.name}</div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Citizen Portal</h1>
                    {/* Logout button or profile menu could go here */}
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
