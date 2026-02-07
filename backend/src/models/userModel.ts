export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'citizen' | 'worker' | 'admin' | 'superadmin';
    wardId?: string;
    reputationScore: number;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}
