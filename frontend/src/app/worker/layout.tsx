'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Basic role check
    }, [user, loading, router]);

    if (loading) return <div className="p-4">Loading...</div>;

    if (!user || user.role !== 'worker') {
        return <div className="p-4 text-red-500">Unauthorized. Access Restricted to Workers.</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Worker Sidebar */}
            <aside className="w-64 bg-orange-800 text-white min-h-screen p-4 flex flex-col">
                <div className="mb-6 text-2xl font-bold">Atlas Field</div>
                <nav className="space-y-2 flex-1">
                    <Link href="/worker/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-700">
                        Dashboard
                    </Link>
                    <Link href="/worker/tasks" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-700">
                        My Tasks
                    </Link>
                </nav>
                <div className="mt-auto">
                    <div className="text-sm opacity-75">Worker: {user.name}</div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Field Operations</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
