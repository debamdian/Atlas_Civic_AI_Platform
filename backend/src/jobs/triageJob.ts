import cron from 'node-cron';
import { db } from '../lib/db';
import { analyzeComplaint } from '../services/aiService';

// Removed: const db = admin.firestore();

export const startTriageJob = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('[Cron] Running Triage Job...');

        try {
            // Find complaints that are 'created' (not yet triaged)
            const snapshot = await db.collection('complaints')
                .where('status', '==', 'created')
                .limit(10) // Process in batches
                .get();

            if (snapshot.empty) {
                console.log('[Cron] No new complaints to triage.');
                return;
            }

            const batch = db.batch();
            let processedCount = 0;

            for (const doc of snapshot.docs) {
                const data = doc.data();
                const analysis = await analyzeComplaint(data.title, data.description);

                batch.update(doc.ref, {
                    ...analysis,
                    status: 'triaged',
                    aiProcessedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                processedCount++;
            }

            await batch.commit();
            console.log(`[Cron] Triaged ${processedCount} complaints.`);

        } catch (error) {
            console.error('[Cron] Triage Job Failed:', error);
        }
    });
};
