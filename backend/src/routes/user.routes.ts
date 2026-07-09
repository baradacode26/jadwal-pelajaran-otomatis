import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => userController.getAllUsers(req, res, next));
router.get('/search', authMiddleware, (req, res, next) => userController.searchUsers(req, res, next));
router.get('/stats', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => userController.getUserStats(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => userController.getUserById(req, res, next));
router.put('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => userController.updateUser(req, res, next));
router.delete('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN']), (req, res, next) => userController.deleteUser(req, res, next));

export default router;
