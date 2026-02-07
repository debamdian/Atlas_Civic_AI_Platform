'use client';

import { useState } from 'react';
import api from '@/lib/api';
import MapComponent from '@/components/MapComponent';
import { useRouter } from 'next/navigation';

export default function NewComplaintPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'other',
        address: '',
        latitude: '',
        longitude: ''
    });
    const [files, setFiles] = useState<FileList | null>(null);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString()
                }));
            }, (error) => {
                alert('Error getting location: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('latitude', formData.latitude || '0'); // Fallback if not set
            data.append('longitude', formData.longitude || '0');
            data.append('address', formData.address);

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    data.append('images', files[i]);
                }
            }

            await api.post('/complaints', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            router.push('/citizen/dashboard');
        } catch (error: any) {
            console.error(error);
            alert('Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Report a New Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Title</label>
                    <input type="text" className="w-full border p-2 rounded text-black"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea className="w-full border p-2 rounded h-32 text-black"
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-gray-700">Category</label>
                    <select className="w-full border p-2 rounded text-black"
                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option value="road">Road</option>
                        <option value="waste">Waste</option>
                        <option value="water">Water</option>
                        <option value="lighting">Lighting</option>
                        <option value="safety">Safety</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="border p-4 rounded bg-gray-50">
                    <h3 className="font-semibold mb-2 text-black">Location</h3>

                    <div className="mb-4">
                        <MapComponent
                            lat={parseFloat(formData.latitude) || undefined}
                            lng={parseFloat(formData.longitude) || undefined}
                            onLocationSelect={(lat: number, lng: number) => setFormData({
                                ...formData,
                                latitude: lat.toString(),
                                longitude: lng.toString()
                            })}
                        />
                    </div>

                    <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Lat" value={formData.latitude} readOnly className="w-1/3 border p-1 rounded bg-gray-200 text-black" />
                        <input type="text" placeholder="Lng" value={formData.longitude} readOnly className="w-1/3 border p-1 rounded bg-gray-200 text-black" />
                        <button type="button" onClick={getCurrentLocation} className="bg-blue-500 text-white px-3 py-1 rounded">
                            Get My Location
                        </button>
                    </div>
                    <input type="text" placeholder="Address / Landmark" className="w-full border p-2 rounded text-black"
                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>

                <div>
                    <label className="block text-gray-700">Images</label>
                    <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} className="w-full text-black" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white p-3 rounded font-bold hover:bg-teal-700 disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
}
