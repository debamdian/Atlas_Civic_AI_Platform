import { Router } from 'express';
import multer from 'multer';
import { assignTask, updateTaskStatus, getMyTasks, completeTask } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/assign', authMiddleware, roleMiddleware(['admin', 'superadmin']), assignTask);
router.get('/my', authMiddleware, roleMiddleware(['worker']), getMyTasks);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'worker']), updateTaskStatus);
router.post('/:id/complete', authMiddleware, roleMiddleware(['worker']), upload.array('evidence', 5), completeTask);

export default router;
