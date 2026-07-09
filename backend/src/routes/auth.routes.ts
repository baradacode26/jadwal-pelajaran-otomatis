import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { loginSchema, registerSchema } from '../validators/schemas';

const router = Router();

router.post('/login', validateRequest(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/register', validateRequest(registerSchema), (req, res, next) => authController.register(req, res, next));
router.get('/profile', authMiddleware, (req, res, next) => authController.getProfile(req as any, res, next));
router.put('/profile', authMiddleware, (req, res, next) => authController.updateProfile(req as any, res, next));
router.post('/change-password', authMiddleware, (req, res, next) => authController.changePassword(req as any, res, next));

export default router;
