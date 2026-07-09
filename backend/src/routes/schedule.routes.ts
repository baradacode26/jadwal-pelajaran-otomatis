import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.createSchedule(req, res, next));
router.get('/', authMiddleware, (req, res, next) => scheduleController.getAllSchedules(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => scheduleController.getSchedule(req, res, next));
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.updateSchedule(req, res, next));
router.delete('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN']), (req, res, next) => scheduleController.deleteSchedule(req, res, next));

// Schedule generation
router.post('/:id/generate', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.generateSchedule(req as any, res, next));

// Schedule items
router.post('/:id/items', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.addScheduleItem(req, res, next));
router.put('/:id/items/:itemId', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.updateScheduleItem(req, res, next));
router.delete('/:id/items/:itemId', authMiddleware, roleMiddleware(['SUPER_ADMIN']), (req, res, next) => scheduleController.deleteScheduleItem(req, res, next));
router.post('/:id/items/:itemId/lock', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.lockScheduleItem(req, res, next));
router.post('/:id/items/:itemId/unlock', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.unlockScheduleItem(req, res, next));

// Conflict management
router.post('/:id/check-conflicts', authMiddleware, (req, res, next) => scheduleController.checkConflicts(req, res, next));
router.get('/:id/conflicts', authMiddleware, (req, res, next) => scheduleController.getConflicts(req, res, next));
router.post('/:id/conflicts/:conflictId/resolve', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => scheduleController.resolveConflict(req, res, next));

export default router;
