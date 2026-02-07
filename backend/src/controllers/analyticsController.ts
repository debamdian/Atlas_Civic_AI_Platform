import { Request, Response } from 'express';
import { db } from '../lib/db';

// Removed: const db = admin.firestore();

// Helper to get aggregated data
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const complaintsSnaps = await db.collection('complaints').get();
        const complaints = complaintsSnaps.docs.map((doc: any) => doc.data());

        const total = complaints.length;
        const byStatus: any = {};
        const bySeverity: any = {};
        const wardStats: any = {};

        complaints.forEach((c: any) => {
            byStatus[c.status] = (byStatus[c.status] || 0) + 1;
            bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1;

            const wardId = c.location?.wardId || 'unknown';
            wardStats[wardId] = (wardStats[wardId] || 0) + 1;
        });

        res.status(200).json({
            total,
            byStatus,
            bySeverity,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Analytics Info Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getHotspots = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('complaints').get();
        const wardCategoryMap: any = {};

        snapshot.forEach((doc: any) => {
            const data = doc.data();
            const ward = data.location?.wardId || 'unknown';
            const cat = data.category || 'other';
            const key = `${ward}:${cat}`;
            wardCategoryMap[key] = (wardCategoryMap[key] || 0) + 1;
        });

        const hotspots = Object.entries(wardCategoryMap).map(([key, count]) => {
            const [wardId, category] = key.split(':');
            return { wardId, category, count };
        }).sort((a: any, b: any) => b.count - a.count).slice(0, 10);

        res.status(200).json(hotspots);
    } catch (error) {
        console.error('Get Hotspots Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getPredictions = async (req: Request, res: Response) => {
    // Simple heuristic: define high-risk wards based on complaint volume
    try {
        const snapshot = await db.collection('complaints').get();
        const wardCount: any = {};

        snapshot.forEach((doc: any) => {
            const data = doc.data();
            const ward = data.location?.wardId || 'unknown';
            wardCount[ward] = (wardCount[ward] || 0) + 1;
        });

        const highRiskWards = Object.entries(wardCount)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 5)
            .map(([wardId, count]) => ({
                wardId,
                riskLevel: 'high',
                reason: 'High complaint volume',
                projectedIncrease: '10%' // Mock prediction
            }));

        res.status(200).json({ highRiskWards });
    } catch (error) {
        console.error('Get Predictions Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Deprecated or alias:
export const getWardStats = async (req: Request, res: Response) => {
    return getPredictions(req, res);
};
