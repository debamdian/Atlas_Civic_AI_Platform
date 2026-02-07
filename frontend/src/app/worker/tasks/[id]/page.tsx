'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function TaskDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<FileList | null>(null);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get('/tasks/my'); // Since we don't have getTaskById yet, filter
                const found = res.data.find((t: any) => t.id === id);
                setTask(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTask();
    }, [id]);

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('notes', notes);
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    data.append('evidence', files[i]);
                }
            }

            await api.post(`/tasks/${id}/complete`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            router.push('/worker/tasks');
        } catch (err) {
            console.error(err);
            alert('Failed to complete task');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!task) return <div>Task not found</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-black">← Back</button>

            <div className="bg-white rounded shadow p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2 text-black">Task Details</h1>
                <p className="text-gray-600 mb-4">Complaint ID: {task.complaintId}</p>

                <div className="bg-gray-50 p-4 rounded border mb-4">
                    <h3 className="font-bold text-gray-700">Instructions</h3>
                    <p className="text-gray-600">{task.instructions}</p>
                </div>

                <p><span className="font-bold">Status:</span> {task.status}</p>
            </div>

            {task.status === 'assigned' && (
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-bold mb-4 text-black">Complete Task</h2>
                    <form onSubmit={handleComplete}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Completion Notes</label>
                            <textarea
                                className="w-full border p-2 rounded text-black"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Evidence (After Photos)</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={e => setFiles(e.target.files)}
                                className="w-full text-black"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Mark as Complete'}
                        </button>
                    </form>
                </div>
            )}

            {task.status === 'completed' && (
                <div className="bg-green-100 text-green-800 p-4 rounded text-center font-bold">
                    This task has been completed.
                </div>
            )}
        </div>
    );
}
