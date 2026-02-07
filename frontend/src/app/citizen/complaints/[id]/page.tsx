'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';

export default function ComplaintDetailPage() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await api.get(`/complaints/${id}`);
                setComplaint(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchComplaint();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!complaint) return <div>Complaint not found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-black">{complaint.title}</h1>
                            <p className="text-sm text-gray-500">Reported on {new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-semibold uppercase text-gray-700">
                            {complaint.status}
                        </span>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 mb-4">{complaint.description}</p>

                        <h3 className="font-bold text-gray-700 mb-2">Location</h3>
                        <p className="text-gray-600 mb-1">{complaint.location.address}</p>
                        <p className="text-xs text-gray-400">Lat: {complaint.location.lat}, Lng: {complaint.location.lng}</p>

                        <h3 className="font-bold text-gray-700 mt-4 mb-2">Category</h3>
                        <p className="text-gray-600 capitalize">{complaint.category}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Photos</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {complaint.media && complaint.media.map((m: any, idx: number) => (
                                <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                                    {/* Use standard img for now, next/image requires config for external domains */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={m.url} alt="Complaint" className="object-cover w-full h-full" />
                                    <span className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1">
                                        {m.type}
                                    </span>
                                </div>
                            ))}
                            {(!complaint.media || complaint.media.length === 0) && (
                                <p className="text-gray-400 text-sm">No photos uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timeline Placeholder */}
                <div className="bg-gray-50 p-6 border-t">
                    <h3 className="font-bold text-gray-700 mb-4">Status Timeline</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Complaint Created</span>
                            <span className="text-xs text-gray-400 ml-auto">{new Date(complaint.createdAt).toLocaleString()}</span>
                        </div>
                        {/* More timeline items based on status history if added later */}
                    </div>
                </div>
            </div>
        </div>
    );
}
