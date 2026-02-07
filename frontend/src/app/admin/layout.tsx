'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
            // Redirect unauthorized users
            // router.push('/auth/login'); 
            // Commented out to avoid flicker if role update is slow, handled by Guard ideally
        }
    }, [user, loading, router]);

    if (loading) return <div className="p-4">Loading...</div>;

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return <div className="p-4 text-red-500">Unauthorized. Access Restricted to Admins.</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-indigo-900 text-white min-h-screen p-4 flex flex-col">
                <div className="mb-6 text-2xl font-bold">Atlas Admin</div>
                <nav className="space-y-2 flex-1">
                    <Link href="/admin/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        Dashboard
                    </Link>
                    <Link href="/admin/complaints" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        Complaints
                    </Link>
                    <Link href="/admin/map" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        Live Map
                    </Link>
                    <Link href="/admin/analytics" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        Analytics
                    </Link>
                </nav>
                <div className="mt-auto">
                    <div className="text-sm opacity-75">Admin: {user.name}</div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">City Management Portal</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
