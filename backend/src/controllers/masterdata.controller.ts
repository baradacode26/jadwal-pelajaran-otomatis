import { Request, Response, NextFunction } from 'express';
import { masterDataService } from '../services/masterdata.service';
import { sendSuccess } from '../utils/response';

export class MasterDataController {
  // ============ ACADEMIC YEAR ============
  async createAcademicYear(req: Request, res: Response, next: NextFunction) {
    try {
      const academicYear = await masterDataService.createAcademicYear(req.body);
      sendSuccess(res, academicYear, 'Academic year created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAcademicYears(req: Request, res: Response, next: NextFunction) {
    try {
      const academicYears = await masterDataService.getAcademicYears();
      sendSuccess(res, academicYears, 'Academic years retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ SEMESTER ============
  async createSemester(req: Request, res: Response, next: NextFunction) {
    try {
      const semester = await masterDataService.createSemester(req.body);
      sendSuccess(res, semester, 'Semester created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSemesters(req: Request, res: Response, next: NextFunction) {
    try {
      const semesters = await masterDataService.getSemesters(req.params.academicYearId);
      sendSuccess(res, semesters, 'Semesters retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ TIME SLOT ============
  async createTimeSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const timeSlot = await masterDataService.createTimeSlot(req.body);
      sendSuccess(res, timeSlot, 'Time slot created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTimeSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const timeSlots = await masterDataService.getTimeSlots(req.params.semesterId);
      sendSuccess(res, timeSlots, 'Time slots retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ SUBJECT ============
  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await masterDataService.createSubject(req.body);
      sendSuccess(res, subject, 'Subject created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await masterDataService.getSubjects();
      sendSuccess(res, subjects, 'Subjects retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ TEACHER ============
  async getTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const teachers = await masterDataService.getTeachers();
      sendSuccess(res, teachers, 'Teachers retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  async getTeacherById(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await masterDataService.getTeacherById(req.params.id);
      sendSuccess(res, teacher, 'Teacher retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ CLASS ============
  async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await masterDataService.getClasses();
      sendSuccess(res, classes, 'Classes retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const classData = await masterDataService.getClassById(req.params.id);
      sendSuccess(res, classData, 'Class retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ ROOM ============
  async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await masterDataService.getRooms();
      sendSuccess(res, rooms, 'Rooms retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  async getRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await masterDataService.getRoomById(req.params.id);
      sendSuccess(res, room, 'Room retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  // ============ TEACHING LOAD ============
  async createTeachingLoad(req: Request, res: Response, next: NextFunction) {
    try {
      const teachingLoad = await masterDataService.createTeachingLoad(req.body);
      sendSuccess(res, teachingLoad, 'Teaching load created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTeachingLoads(req: Request, res: Response, next: NextFunction) {
    try {
      const teachingLoads = await masterDataService.getTeachingLoads();
      sendSuccess(res, teachingLoads, 'Teaching loads retrieved', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const masterDataController = new MasterDataController();
