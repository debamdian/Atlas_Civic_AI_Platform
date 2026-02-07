import * as admin from 'firebase-admin';
import { db } from '../lib/db';

// Removed: const db = admin.firestore();

export const sendNotification = async (userId: string, title: string, body: string, metadata: any = {}) => {
    try {
        console.log(`[NOTIFICATION] To: ${userId} | Title: ${title} | Body: ${body}`);

        // Store in Firestore for potential frontend polling
        await db.collection('notifications').add({
            userId,
            title,
            body,
            metadata,
            read: false,
            createdAt: new Date().toISOString()
        });

        // In a real app, here we would call admin.messaging().send(...)

    } catch (error) {
        console.error('Send Notification Error:', error);
        // Don't throw, notifications shouldn't block main flow
    }
};
