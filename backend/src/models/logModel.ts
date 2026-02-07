export interface Log {
    id: string;
    actorId: string;      // User ID who performed action
    action: string;       // e.g., 'CREATE_COMPLAINT', 'UPDATE_STATUS'
    entityType: string;   // 'complaint', 'task', 'user'
    entityId: string;
    metadata?: any;       // Start with flexible map
    ipAddress?: string;
    level: 'info' | 'warn' | 'error';
    createdAt: string;
}
