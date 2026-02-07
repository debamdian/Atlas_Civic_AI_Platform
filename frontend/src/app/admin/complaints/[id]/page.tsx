'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function AdminComplaintDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await api.get(`/complaints/${id}`);
                setComplaint(res.data);
                setStatus(res.data.status);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchComplaint();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            await api.patch(`/complaints/${id}/status`, { status });
            alert('Status updated!');
            setComplaint({ ...complaint, status });
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!complaint) return <div>Complaint not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => router.back()} className="text-gray-600 hover:text-black">
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-black">Complaint #{id}</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-gray-700 mb-2">Details</h3>
                    <p className="mb-4 text-black"><span className="font-semibold">Title:</span> {complaint.title}</p>
                    <p className="mb-4 text-black"><span className="font-semibold">Description:</span> {complaint.description}</p>
                    <p className="mb-4 text-black"><span className="font-semibold">Category:</span> {complaint.category}</p>
                    <p className="mb-4 text-black"><span className="font-semibold">Location:</span> {complaint.location.address}</p>
                    <p className="mb-4 text-black"><span className="font-semibold">Severity:</span> {complaint.severity}</p>
                    <p className="mb-4 text-black"><span className="font-semibold">Priority Score:</span> {complaint.priorityScore}</p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-700 mb-2">Management</h3>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex gap-2">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border p-2 rounded w-full text-black"
                            >
                                <option value="created">Created</option>
                                <option value="triaged">Triaged</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <button
                                onClick={handleStatusUpdate}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-bold text-gray-700 mb-2">Assign Task</h4>
                        <p className="text-sm text-gray-500 mb-2">Worker assignment functionality to be implemented.</p>
                        <button disabled className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed">
                            Assign to Worker
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-gray-700 mb-4">Evidence</h3>
                <div className="grid grid-cols-3 gap-4">
                    {complaint.media && complaint.media.map((m: any, idx: number) => (
                        <div key={idx} className="relative aspect-video bg-gray-200 rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={m.url} alt="Evidence" className="object-cover w-full h-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
