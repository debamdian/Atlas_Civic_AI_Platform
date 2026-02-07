import { Request, Response } from 'express';
import * as admin from 'firebase-admin'; // Keep for storage/types
import { Complaint } from '../models/complaintModel';
import { db } from '../lib/db';

// Removed: const db = admin.firestore();
const storage = admin.storage();

export const createComplaint = async (req: Request, res: Response) => {
    try {
        const { title, description, category, latitude, longitude, address } = req.body;
        const files = req.files as Express.Multer.File[];
        const userId = req.user.uid;

        if (!title || !description || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const media = [];

        // Upload files to Firebase Storage
        if (files && files.length > 0) {
            const bucket = storage.bucket();

            for (const file of files) {
                const filename = `complaints/${userId}/${Date.now()}_${file.originalname}`;
                const fileUpload = bucket.file(filename);

                await fileUpload.save(file.buffer, {
                    metadata: { contentType: file.mimetype },
                    public: true // For hackathon/demo simplicity
                });

                // Get public URL
                // Note: For production, use signed URLs or make bucket public via rules
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                media.push({
                    url: publicUrl,
                    type: 'before' as const,
                    createdAt: new Date().toISOString()
                });
            }
        }

        const newComplaint: Omit<Complaint, 'id'> = {
            citizenId: userId,
            title,
            description,
            category: category || 'other',
            status: 'created',
            severity: 'medium', // Initial default, AI will update
            priorityScore: 0,
            location: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
                address: address || '',
                wardId: 'default-ward' // Geofencing logic could go here
            },
            media: media,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await db.collection('complaints').add(newComplaint);

        // Trigger AI Job (Mock for now)
        console.log(`[AI-JOB] Triggered analysis for complaint ${docRef.id}`);

        res.status(201).json({ id: docRef.id, ...newComplaint });
    } catch (error) {
        console.error('Create Complaint Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMyComplaints = async (req: Request, res: Response) => {
    try {
        const userId = req.user.uid;
        const snapshot = await db.collection('complaints')
            .where('citizenId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const complaints = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Get My Complaints Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getComplaint = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('complaints').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const data = doc.data() as Complaint; // Partial check

        // Access control: only owner or admin/worker
        if (data.citizenId !== req.user.uid && req.user.role === 'citizen') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Get Complaint Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllComplaints = async (req: Request, res: Response) => {
    try {
        const { status, category, priority } = req.query;
        let query: FirebaseFirestore.Query = db.collection('complaints');

        if (status) query = query.where('status', '==', status);
        if (category) query = query.where('category', '==', category);
        // Note: Firestore requires composite indexes for multiple fields + ordering.
        // For now, we'll sort by createdAt descending.
        query = query.orderBy('createdAt', 'desc');

        const snapshot = await query.get();
        const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(complaints);
    } catch (error) {
        console.error('Get All Complaints Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

import { sendNotification } from '../services/notificationService';

export const updateComplaintStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['created', 'triaged', 'assigned', 'in_progress', 'resolved', 'verified', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const complaintRef = db.collection('complaints').doc(id);
        const doc = await complaintRef.get();
        if (!doc.exists) return res.status(404).json({ error: 'Complaint not found' });

        const data = doc.data();

        await complaintRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        // Notify Citizen
        if (data?.citizenId) {
            await sendNotification(
                data.citizenId,
                `Complaint Update: ${status}`,
                `Your complaint status has been updated to ${status}.`
            );
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
