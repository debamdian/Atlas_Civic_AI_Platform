import { Router } from 'express';
import multer from 'multer';
import { createComplaint, getMyComplaints, getComplaint, getAllComplaints, updateComplaintStatus } from '../controllers/complaintController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory to upload to Firebase

router.post('/', authMiddleware, upload.array('images', 5), createComplaint);
router.get('/my', authMiddleware, getMyComplaints);
router.get('/:id', authMiddleware, getComplaint);

// Admin / Worker Routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'worker', 'superadmin']), getAllComplaints);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'worker', 'superadmin']), updateComplaintStatus);

export default router;
