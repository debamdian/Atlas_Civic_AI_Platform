'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function WorkerDashboard() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks/my');
                setTasks(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const pending = tasks.filter(t => t.status === 'assigned').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">My Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-l-4 border-orange-500">
                    <h3 className="text-gray-500 font-bold uppercase text-xs">Pending Tasks</h3>
                    <p className="text-4xl font-bold text-black">{pending}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 font-bold uppercase text-xs">Completed Today</h3>
                    <p className="text-4xl font-bold text-black">{completed}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-black">Active Assignments</h3>
                    <Link href="/worker/tasks" className="text-blue-600 hover:underline">View All</Link>
                </div>
                {tasks.filter(t => t.status === 'assigned').length === 0 ? (
                    <p className="text-gray-500">No active tasks.</p>
                ) : (
                    <ul className="divide-y">
                        {tasks.filter(t => t.status === 'assigned').map(t => (
                            <li key={t.id} className="py-3">
                                <Link href={`/worker/tasks/${t.id}`} className="flex justify-between hover:bg-gray-50 p-2 rounded">
                                    <span className="font-medium text-black">Complaint #{t.complaintId}</span>
                                    <span className="text-sm text-gray-500">Assigned: {new Date(t.createdAt).toLocaleDateString()}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
