import * as admin from 'firebase-admin';

// In-Memory Storage for Mock Mode
const store: any = {
    users: [],
    complaints: [],
    tasks: [],
    notifications: [],
    policies: [],
    logs: []
};

// Helper to simulate Firestore API
class MockCollection {
    name: string;
    constructor(name: string) { this.name = name; }

    doc(id: string) { return new MockDoc(this.name, id); }

    async add(data: any) {
        const id = 'mock_' + Math.random().toString(36).substr(2, 9);
        const doc = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        store[this.name].push(doc);
        return { id, get: async () => ({ data: () => doc, exists: true }) };
    }

    where(field: string, op: string, value: any) {
        return new MockQuery(this.name, field, op, value);
    }

    orderBy(field: string, direction: string) {
        return new MockQuery(this.name, null, null, null).orderBy(field, direction);
    }

    async get() {
        return {
            empty: store[this.name].length === 0,
            docs: store[this.name].map((d: any) => ({ id: d.id, data: () => d }))
        };
    }
}

class MockDoc {
    name: string; id: string;
    constructor(name: string, id: string) { this.name = name; this.id = id; }

    async get() {
        const doc = store[this.name].find((d: any) => d.id === this.id);
        return { exists: !!doc, data: () => doc };
    }

    async set(data: any) {
        const idx = store[this.name].findIndex((d: any) => d.id === this.id);
        if (idx >= 0) store[this.name][idx] = { ...store[this.name][idx], ...data };
        else store[this.name].push({ id: this.id, ...data });
    }

    async update(data: any) {
        const idx = store[this.name].findIndex((d: any) => d.id === this.id);
        if (idx >= 0) store[this.name][idx] = { ...store[this.name][idx], ...data };
    }
}

class MockQuery {
    name: string; filters: any[] = [];
    constructor(name: string, field: string | null, op: string | null, value: any | null) {
        this.name = name;
        if (field) this.filters.push({ field, op, value });
    }

    where(field: string, op: string, value: any) {
        this.filters.push({ field, op, value });
        return this;
    }

    orderBy(field: string, direction: string) {
        // approximate sort
        return this;
    }

    limit(n: number) { return this; }

    async get() {
        let res = store[this.name] || [];
        for (const f of this.filters) {
            res = res.filter((d: any) => {
                if (f.op === '==') return d[f.field] === f.value;
                return true;
            });
        }
        return {
            empty: res.length === 0,
            docs: res.map((d: any) => ({ id: d.id, data: () => d }))
        };
    }
}

const mockDb = {
    collection: (name: string) => new MockCollection(name),
    batch: () => ({
        update: (ref: any, data: any) => ref.update(data),
        commit: async () => console.log('Mock Batch Commit')
    })
};

// Check if we have credentials
export const getDb = () => {
    // Return mock DB if no credentials provided (for demo)
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !admin.apps.length) {
        console.warn('WARN: Using In-Memory Mock Database (Start with CREDENTIALS for Real DB)');
        return mockDb as any;
    }
    try {
        if (!admin.apps.length) admin.initializeApp();
        // Test connection?
        return admin.firestore();
    } catch (e) {
        console.warn('WARN: Firebase Init Failed, using Mock DB', e);
        return mockDb as any;
    }
};

export const db = getDb();
