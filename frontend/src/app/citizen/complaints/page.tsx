'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Complaint {
    id: string;
    title: string;
    status: string;
    category: string;
    createdAt: string;
}

export default function MyComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints/my');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">My Complaints</h2>
            <div className="grid gap-4">
                {complaints.length === 0 ? (
                    <p className="text-gray-500">No complaints found.</p>
                ) : (
                    complaints.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded shadow border-l-4 border-teal-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-black">{c.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(c.createdAt).toLocaleDateString()} • <span className="uppercase">{c.category}</span>
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                                     ${c.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {c.status}
                                </span>
                            </div>
                            <div className="mt-2 text-right">
                                <Link href={`/citizen/complaints/${c.id}`} className="text-blue-600 text-sm hover:underline">
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
