import { Router } from 'express';
import { getDashboardStats, getHotspots, getPredictions } from '../controllers/analyticsController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/summary', authMiddleware, roleMiddleware(['admin', 'superadmin']), getDashboardStats);
router.get('/hotspots', authMiddleware, roleMiddleware(['admin', 'superadmin']), getHotspots);
router.get('/predictions', authMiddleware, roleMiddleware(['admin', 'superadmin']), getPredictions);

export default router;
