'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'citizen'
    });
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/api/v1/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            login(data.token, data.user);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text" name="name"
                            value={formData.name} onChange={handleChange}
                            className="w-full border rounded p-2 text-black" required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email" name="email"
                            value={formData.email} onChange={handleChange}
                            className="w-full border rounded p-2 text-black" required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password" name="password"
                            value={formData.password} onChange={handleChange}
                            className="w-full border rounded p-2 text-black" required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text" name="phone"
                            value={formData.phone} onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role} onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        >
                            <option value="citizen">Citizen</option>
                            <option value="worker">Worker</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link href="/auth/login" className="text-blue-600">Login</Link>
                </p>
            </div>
        </div>
    );
}
