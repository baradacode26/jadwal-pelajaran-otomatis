import { getPrismaClient } from '../utils/database';
import { AppError } from '../utils/errors';

const prisma = getPrismaClient();

export class MasterDataService {
  // ============ ACADEMIC YEAR ============
  async createAcademicYear(data: any) {
    const academicYear = await prisma.academicYear.create({
      data: {
        year: data.year,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        description: data.description,
      },
    });

    return academicYear;
  }

  async getAcademicYears() {
    return prisma.academicYear.findMany({
      include: {
        semesters: true,
      },
      orderBy: { year: 'desc' },
    });
  }

  // ============ SEMESTER ============
  async createSemester(data: any) {
    const semester = await prisma.semester.create({
      data: {
        academicYearId: data.academicYearId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        effectiveDays: data.effectiveDays,
      },
    });

    return semester;
  }

  async getSemesters(academicYearId: string) {
    return prisma.semester.findMany({
      where: { academicYearId },
      include: {
        timeSlots: true,
      },
    });
  }

  // ============ TIME SLOT ============
  async createTimeSlot(data: any) {
    const timeSlot = await prisma.timeSlot.create({
      data: {
        semesterId: data.semesterId,
        day: data.day,
        dayNumber: data.dayNumber,
        slotNumber: data.slotNumber,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        isBreak: data.isBreak || false,
      },
    });

    return timeSlot;
  }

  async getTimeSlots(semesterId: string) {
    return prisma.timeSlot.findMany({
      where: { semesterId },
      orderBy: [{ dayNumber: 'asc' }, { slotNumber: 'asc' }],
    });
  }

  // ============ SUBJECT ============
  async createSubject(data: any) {
    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        code: data.code,
        jpPerWeek: data.jpPerWeek,
        jpPerSemester: data.jpPerSemester,
        category: data.category,
        requiresLab: data.requiresLab || false,
        requiresPC: data.requiresPC || false,
      },
    });

    return subject;
  }

  async getSubjects() {
    return prisma.subject.findMany();
  }

  // ============ TEACHER ============
  async getTeachers() {
    return prisma.teacher.findMany({
      include: {
        user: true,
        teachingLoads: {
          include: {
            class: true,
            subject: true,
          },
        },
      },
    });
  }

  async getTeacherById(id: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        teachingLoads: {
          include: {
            class: true,
            subject: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new AppError(404, 'Teacher not found');
    }

    return teacher;
  }

  // ============ CLASS ============
  async getClasses() {
    return prisma.class.findMany({
      include: {
        rombel: {
          include: {
            grade: true,
            major: true,
          },
        },
        advisor: true,
      },
    });
  }

  async getClassById(id: string) {
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        rombel: {
          include: {
            grade: true,
            major: true,
          },
        },
      },
    });

    if (!classData) {
      throw new AppError(404, 'Class not found');
    }

    return classData;
  }

  // ============ ROOM ============
  async getRooms() {
    return prisma.room.findMany({
      include: {
        roomType: true,
      },
    });
  }

  async getRoomById(id: string) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        roomType: true,
      },
    });

    if (!room) {
      throw new AppError(404, 'Room not found');
    }

    return room;
  }

  // ============ TEACHING LOAD ============
  async createTeachingLoad(data: any) {
    const existingLoad = await prisma.teachingLoad.findUnique({
      where: {
        teacherId_classId_subjectId: {
          teacherId: data.teacherId,
          classId: data.classId,
          subjectId: data.subjectId,
        },
      },
    });

    if (existingLoad) {
      throw new AppError(409, 'Teaching load already exists');
    }

    const teachingLoad = await prisma.teachingLoad.create({
      data: {
        teacherId: data.teacherId,
        classId: data.classId,
        subjectId: data.subjectId,
        jpPerWeek: data.jpPerWeek,
      },
    });

    return teachingLoad;
  }

  async getTeachingLoads() {
    return prisma.teachingLoad.findMany({
      include: {
        teacher: {
          include: { user: true },
        },
        class: true,
        subject: true,
      },
    });
  }
}

export const masterDataService = new MasterDataService();
