'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import MapComponent from '@/components/MapComponent';

export default function AdminMapPage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints'); // Admin gets all
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const markers = complaints
        .filter(c => c.location && c.location.lat && c.location.lng)
        .map(c => ({
            lat: c.location.lat,
            lng: c.location.lng,
            title: c.title
        }));

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Complaint Heatmap / Markers</h1>

            {loading ? (
                <p>Loading map data...</p>
            ) : (
                <div className="bg-white p-4 rounded shadow">
                    <MapComponent markers={markers} />
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {markers.length} complaints on the map.
                    </div>
                </div>
            )}
        </div>
    );
}
