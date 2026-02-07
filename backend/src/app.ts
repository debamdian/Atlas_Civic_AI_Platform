import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin (will use GOOGLE_APPLICATION_CREDENTIALS)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'demo-atlas-civic-ai'
        });
        console.log('Firebase Admin initialized');
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

import rateLimit from 'express-rate-limit';

const app = express();

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// Content Type check for file uploads (optional, but good practice)
// app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './routes/authRoutes';
import complaintRoutes from './routes/complaintRoutes';
import taskRoutes from './routes/taskRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

import { startTriageJob } from './jobs/triageJob';

// ... routes ...

// Start Background Jobs
startTriageJob();

// Error Handler (basic)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
