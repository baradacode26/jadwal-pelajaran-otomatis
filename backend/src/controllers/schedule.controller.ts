import { Request, Response, NextFunction } from 'express';
import { scheduleService } from '../services/schedule.service';
import { schedulingEngine } from '../scheduling/engine';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { SchedulingOptions } from '../types';

export class ScheduleController {
  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
      sendSuccess(res, schedule, 'Schedule created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.getSchedule(req.params.id);
      sendSuccess(res, schedule, 'Schedule retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  async getAllSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await scheduleService.getAllSchedules(page, limit);
      sendPaginated(res, result.data, result.page, result.limit, result.total, 'Schedules retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
      sendSuccess(res, schedule, 'Schedule updated', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      await scheduleService.deleteSchedule(req.params.id);
      sendSuccess(res, null, 'Schedule deleted', 200);
    } catch (error) {
      next(error);
    }
  }

  async generateSchedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { algorithm = 'HYBRID', timeout, populationSize, generations } = req.body;

      const options: SchedulingOptions = {
        algorithm,
        timeout,
        populationSize,
        generations,
      };

      const result = await schedulingEngine.generateSchedule(req.params.id, options);
      sendSuccess(res, result, 'Schedule generated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async addScheduleItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await scheduleService.addScheduleItem(req.params.id, req.body);
      sendSuccess(res, item, 'Schedule item added', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateScheduleItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await scheduleService.updateScheduleItem(req.params.itemId, req.body);
      sendSuccess(res, item, 'Schedule item updated', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteScheduleItem(req: Request, res: Response, next: NextFunction) {
    try {
      await scheduleService.deleteScheduleItem(req.params.itemId);
      sendSuccess(res, null, 'Schedule item deleted', 200);
    } catch (error) {
      next(error);
    }
  }

  async checkConflicts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scheduleService.checkConflicts(req.params.id, req.body);
      sendSuccess(res, result, 'Conflicts checked', 200);
    } catch (error) {
      next(error);
    }
  }

  async getConflicts(req: Request, res: Response, next: NextFunction) {
    try {
      const conflicts = await scheduleService.getScheduleConflicts(req.params.id);
      sendSuccess(res, conflicts, 'Conflicts retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  async resolveConflict(req: Request, res: Response, next: NextFunction) {
    try {
      const conflict = await scheduleService.resolveConflict(req.params.conflictId);
      sendSuccess(res, conflict, 'Conflict resolved', 200);
    } catch (error) {
      next(error);
    }
  }

  async lockScheduleItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await scheduleService.lockScheduleItem(req.params.itemId);
      sendSuccess(res, item, 'Schedule item locked', 200);
    } catch (error) {
      next(error);
    }
  }

  async unlockScheduleItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await scheduleService.unlockScheduleItem(req.params.itemId);
      sendSuccess(res, item, 'Schedule item unlocked', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const scheduleController = new ScheduleController();
