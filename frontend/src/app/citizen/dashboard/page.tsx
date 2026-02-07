'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
    total: number;
    open: number;
    resolved: number;
}

export default function CitizenDashboard() {
    const [stats, setStats] = useState<Stats>({ total: 0, open: 0, resolved: 0 });
    const [recent, setRecent] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/complaints/my');
                const complaints = res.data;

                setStats({
                    total: complaints.length,
                    open: complaints.filter((c: any) => c.status !== 'resolved' && c.status !== 'verified').length,
                    resolved: complaints.filter((c: any) => c.status === 'resolved' || c.status === 'verified').length
                });

                setRecent(complaints.slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Total Reports</h3>
                    <p className="text-3xl font-bold text-black">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Open Issues</h3>
                    <p className="text-3xl font-bold text-black">{stats.open}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Resolved</h3>
                    <p className="text-3xl font-bold text-black">{stats.resolved}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-black">Recent Activity</h3>
                    <Link href="/citizen/complaints" className="text-blue-600 hover:underline">View All</Link>
                </div>
                {recent.length === 0 ? (
                    <p className="text-gray-500">No recent activity.</p>
                ) : (
                    <ul className="divide-y">
                        {recent.map(c => (
                            <li key={c.id} className="py-3">
                                <Link href={`/citizen/complaints/${c.id}`} className="flex justify-between hover:bg-gray-50 p-2 rounded">
                                    <span className="font-medium text-black">{c.title}</span>
                                    <span className="text-sm text-gray-500">{c.status}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-6 text-center">
                <Link href="/citizen/complaints/new" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 shadow-lg">
                    + Report New Issue
                </Link>
            </div>
        </div>
    );
}
