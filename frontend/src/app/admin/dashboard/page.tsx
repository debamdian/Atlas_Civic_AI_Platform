'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, avgResolution: '2.4 days' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/complaints'); // Admin gets all
                const all = res.data;
                setStats({
                    total: all.length,
                    open: all.filter((c: any) => c.status !== 'resolved' && c.status !== 'verified').length,
                    critical: all.filter((c: any) => c.severity === 'critical').length,
                    avgResolution: '2.4 days' // Mock for now
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 font-bold uppercase text-xs">Total Complaints</h3>
                    <p className="text-3xl font-bold text-black">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 font-bold uppercase text-xs">Open Issues</h3>
                    <p className="text-3xl font-bold text-black">{stats.open}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                    <h3 className="text-gray-500 font-bold uppercase text-xs">Critical Severity</h3>
                    <p className="text-3xl font-bold text-black">{stats.critical}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 font-bold uppercase text-xs">Avg Resolution</h3>
                    <p className="text-3xl font-bold text-black">{stats.avgResolution}</p>
                </div>
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow h-64 flex items-center justify-center text-gray-400">
                    [Chart: Complaints by Category]
                </div>
                <div className="bg-white p-6 rounded shadow h-64 flex items-center justify-center text-gray-400">
                    [Chart: Complaints per Ward]
                </div>
            </div>
        </div>
    );
}
