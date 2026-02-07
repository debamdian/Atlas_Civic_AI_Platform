'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Complaint Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {['created', 'in_progress', 'resolved', 'rejected'].map(status => (
                    <div key={status} className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500 font-bold uppercase text-xs mb-1">{status.replace('_', ' ')}</h3>
                        <p className="text-2xl font-bold text-black">{stats.byStatus[status] || 0}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="font-bold text-gray-700 mb-4">By Severity</h3>
                    <div className="space-y-3">
                        {Object.entries(stats.bySeverity).map(([severity, count]: [string, any]) => (
                            <div key={severity}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-gray-700">{severity}</span>
                                    <span className="font-bold text-gray-900">{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${severity === 'critical' ? 'bg-red-600' :
                                                severity === 'high' ? 'bg-orange-500' :
                                                    severity === 'medium' ? 'bg-yellow-400' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="font-bold text-gray-700 mb-4">Performance Metrics</h3>
                    <p className="text-sm text-gray-600 mb-2">Total Complaints: <span className="font-bold text-black">{stats.total}</span></p>
                    <p className="text-sm text-gray-600 mb-2">Resolution Rate: <span className="font-bold text-black">
                        {stats.total > 0 ? ((stats.byStatus.resolved / stats.total) * 100).toFixed(1) : 0}%
                    </span></p>
                    <div className="mt-4 p-4 bg-gray-50 rounded text-center">
                        <p className="text-xs text-slate-500">More charts (Wards, Maps) coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
