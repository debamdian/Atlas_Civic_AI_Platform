import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { db } from '../lib/db';

// Removed: const db = admin.firestore();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const signup = async (req: Request, res: Response) => {
    const { name, email, password, role = 'citizen', phone, wardId } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if user exists
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user object (password not stored in user doc, maybe in a separate auth collection or just field? 
        // Ideally use Firebase Auth, but for hackathon custom auth with Firestore is requested in prompt 1.2 "Authentication: JWT-based auth (email/password for hackathon)")
        // storing hashed password in a separate collection or same doc for simplicity in hackathon.
        // Let's store in the same doc for now but strictly filter it out in responses.

        const newUser: User = {
            id: '', // to be set
            name,
            email,
            phone,
            role,
            wardId,
            reputationScore: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await db.collection('users').add({
            ...newUser,
            password: hashedPassword // BE CAREFUL: Exclude this when returning user
        });

        newUser.id = docRef.id;

        // Generate JWT
        const token = jwt.sign({ uid: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();

        if (userSnapshot.empty) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user: User = {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            wardId: userData.wardId,
            reputationScore: userData.reputationScore,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        };

        const token = jwt.sign({ uid: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
