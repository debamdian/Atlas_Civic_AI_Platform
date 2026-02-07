import { db } from '../lib/db';
import { Log } from '../models/logModel';

export const logAction = async (
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata: any = {},
    level: 'info' | 'warn' | 'error' = 'info'
) => {
    try {
        const logEntry: Omit<Log, 'id'> = {
            actorId,
            action,
            entityType,
            entityId,
            metadata,
            level,
            createdAt: new Date().toISOString()
        };

        // Fire and forget (don't await if you don't want to block request)
        // ensure db exposes 'logs' collection support if using mock
        await db.collection('logs').add(logEntry);

        console.log(`[AUDIT] ${level.toUpperCase()}: ${action} by ${actorId} on ${entityType}:${entityId}`);
    } catch (error) {
        console.error('Failed to write audit log:', error);
    }
};
