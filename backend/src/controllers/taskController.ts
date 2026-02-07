import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../lib/db';

// Removed: const db = admin.firestore();

import { sendNotification } from '../services/notificationService';

export const assignTask = async (req: Request, res: Response) => {
    try {
        const { complaintId, workerId, instructions } = req.body;

        if (!complaintId || !workerId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify complaint exists
        const complaintRef = db.collection('complaints').doc(complaintId);
        const complaintDoc = await complaintRef.get();
        if (!complaintDoc.exists) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const newTask = {
            complaintId,
            workerId,
            assignedBy: req.user.uid,
            status: 'assigned',
            instructions: instructions || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const taskRef = await db.collection('tasks').add(newTask);

        // Update complaint status
        await complaintRef.update({
            status: 'assigned',
            assignedTo: workerId, // Optional denormalization
            updatedAt: new Date().toISOString()
        });

        // Notify Worker
        await sendNotification(
            workerId,
            'New Task Assigned',
            `You have been assigned a new task for complaint #${complaintId}. Instructions: ${instructions || 'None'}`
        );

        res.status(201).json({ id: taskRef.id, ...newTask });
    } catch (error) {
        console.error('Assign Task Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // status: assigned -> in_progress -> completed (needs review) -> closed

        await db.collection('tasks').doc(id).update({
            status,
            updatedAt: new Date().toISOString()
        });

        // Optionally update parent complaint status here or strictly separate concerns
        // For MVP, if task is completed, we might mark complaint as resolved or 'check_needed'

        res.status(200).json({ message: 'Task status updated' });
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMyTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user.uid;
        // Tasks assigned TO the worker
        const snapshot = await db.collection('tasks')
            .where('workerId', '==', userId)
            // .orderBy('createdAt', 'desc') // Requires index
            .get();

        const tasks = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Get My Tasks Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const completeTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notes } = req.body; // Instructions/Notes from worker
        const files = req.files as Express.Multer.File[];

        // 1. Fetch Task
        const taskRef = db.collection('tasks').doc(id);
        const taskDoc = await taskRef.get();
        if (!taskDoc.exists) return res.status(404).json({ error: 'Task not found' });

        const taskData = taskDoc.data();
        if (taskData?.workerId !== req.user.uid) return res.status(403).json({ error: 'Unauthorized' });

        const evidence = [];
        const storage = admin.storage();

        // 2. Upload Evidence
        if (files && files.length > 0) {
            const bucket = storage.bucket();
            for (const file of files) {
                const filename = `tasks/${id}/evidence/${Date.now()}_${file.originalname}`;
                const fileUpload = bucket.file(filename);

                await fileUpload.save(file.buffer, {
                    metadata: { contentType: file.mimetype },
                    public: true
                });

                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                evidence.push({
                    url: publicUrl,
                    type: 'after',
                    createdAt: new Date().toISOString()
                });
            }
        }

        // 3. Update Task
        await taskRef.update({
            status: 'completed',
            completionNotes: notes || '',
            evidence,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 4. Update underlying Complaint (Simple logic: Task Done -> Complaint Resolved/Verified)
        if (taskData?.complaintId) {
            const complaintRef = db.collection('complaints').doc(taskData.complaintId);
            await complaintRef.update({
                status: 'resolved', // Or 'verification_pending'
                resolvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            // Notify Citizen
            const compDoc = await complaintRef.get();
            const compData = compDoc.data();
            if (compData?.citizenId) {
                await sendNotification(
                    compData.citizenId,
                    'Complaint Resolved',
                    `Your complaint #${taskData.complaintId} has been resolved by the field worker.`
                );
            }
        }

        res.status(200).json({ message: 'Task completed successfully' });
    } catch (error) {
        console.error('Complete Task Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
