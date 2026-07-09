import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;

      const result = await userService.getAllUsers(page, limit, role);
      sendPaginated(res, result.data, result.page, result.limit, result.total, 'Users retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccess(res, user, 'User retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await userService.searchUsers(query, limit);
      sendSuccess(res, users, 'Users found', 200);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      sendSuccess(res, user, 'User updated', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.params.id);
      sendSuccess(res, null, 'User deleted', 200);
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await userService.getUserStats();
      sendSuccess(res, stats, 'User statistics retrieved', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
