import { Router } from 'express';
import { masterDataController } from '../controllers/masterdata.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// Academic Year
router.post('/academic-years', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => masterDataController.createAcademicYear(req, res, next));
router.get('/academic-years', authMiddleware, (req, res, next) => masterDataController.getAcademicYears(req, res, next));

// Semester
router.post('/semesters', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => masterDataController.createSemester(req, res, next));
router.get('/semesters/:academicYearId', authMiddleware, (req, res, next) => masterDataController.getSemesters(req, res, next));

// Time Slot
router.post('/time-slots', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => masterDataController.createTimeSlot(req, res, next));
router.get('/time-slots/:semesterId', authMiddleware, (req, res, next) => masterDataController.getTimeSlots(req, res, next));

// Subject
router.post('/subjects', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => masterDataController.createSubject(req, res, next));
router.get('/subjects', authMiddleware, (req, res, next) => masterDataController.getSubjects(req, res, next));

// Teacher
router.get('/teachers', authMiddleware, (req, res, next) => masterDataController.getTeachers(req, res, next));
router.get('/teachers/:id', authMiddleware, (req, res, next) => masterDataController.getTeacherById(req, res, next));

// Class
router.get('/classes', authMiddleware, (req, res, next) => masterDataController.getClasses(req, res, next));
router.get('/classes/:id', authMiddleware, (req, res, next) => masterDataController.getClassById(req, res, next));

// Room
router.get('/rooms', authMiddleware, (req, res, next) => masterDataController.getRooms(req, res, next));
router.get('/rooms/:id', authMiddleware, (req, res, next) => masterDataController.getRoomById(req, res, next));

// Teaching Load
router.post('/teaching-loads', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), (req, res, next) => masterDataController.createTeachingLoad(req, res, next));
router.get('/teaching-loads', authMiddleware, (req, res, next) => masterDataController.getTeachingLoads(req, res, next));

export default router;
