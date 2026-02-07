'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'citizen' | 'worker' | 'admin' | 'superadmin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);

        // Redirect based on role
        if (newUser.role === 'admin') router.push('/admin/dashboard');
        else if (newUser.role === 'worker') router.push('/worker/dashboard');
        else router.push('/citizen/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
