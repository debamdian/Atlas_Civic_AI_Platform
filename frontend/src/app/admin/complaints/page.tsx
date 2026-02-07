'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/complaints');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = filter === 'all'
        ? complaints
        : complaints.filter(c => c.status === filter);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Complaint Management</h2>
                <div className="flex gap-2">
                    <select
                        className="border p-2 rounded text-black"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="created">Created</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Title / ID
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Submitted
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">{c.title}</p>
                                            <p className="text-gray-600 whitespace-no-wrap text-xs">{c.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap capitalize">{c.category}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight`}>
                                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full 
                                            ${c.status === 'created' ? 'bg-blue-200' :
                                                c.status === 'in_progress' ? 'bg-yellow-200' : 'bg-green-200'}`}></span>
                                        <span className="relative">{c.status}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{c.priorityScore || 0}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link href={`/admin/complaints/${c.id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
