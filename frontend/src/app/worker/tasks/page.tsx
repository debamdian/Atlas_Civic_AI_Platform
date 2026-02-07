'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function WorkerTasksPage() {
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">My Tasks</h2>
            <div className="space-y-4">
                {tasks.map(t => (
                    <div key={t.id} className="bg-white p-4 rounded shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-black">Task for Complaint #{t.complaintId}</h3>
                                <p className="text-gray-600 text-sm">{t.instructions}</p>
                                <p className="text-xs text-gray-400 mt-1">Assigned: {new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                                 ${t.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                {t.status}
                            </span>
                        </div>
                        <div className="mt-4 text-right">
                            <Link href={`/worker/tasks/${t.id}`} className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm font-medium">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
