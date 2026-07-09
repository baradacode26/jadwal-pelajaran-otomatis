import { getPrismaClient } from '../utils/database';
import { AppError } from '../utils/errors';
import { SchedulingOptions, ConflictDetectionResult } from '../types';

const prisma = getPrismaClient();

export class ScheduleService {
  async createSchedule(data: {
    academicYearId: string;
    semesterId: string;
    name: string;
  }) {
    const schedule = await prisma.schedule.create({
      data: {
        academicYearId: data.academicYearId,
        semesterId: data.semesterId,
        name: data.name,
        status: 'Draft',
      },
    });

    return schedule;
  }

  async getSchedule(id: string) {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            class: true,
            teacher: true,
            subject: true,
            room: true,
            timeSlot: true,
          },
        },
        conflicts: true,
      },
    });

    if (!schedule) {
      throw new AppError(404, 'Schedule not found');
    }

    return schedule;
  }

  async getAllSchedules(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [schedules, total] = await Promise.all([
      prisma.schedule.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { items: true, conflicts: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.schedule.count(),
    ]);

    return {
      data: schedules,
      total,
      page,
      limit,
    };
  }

  async updateSchedule(id: string, data: any) {
    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        name: data.name,
        notes: data.notes,
      },
    });

    return schedule;
  }

  async deleteSchedule(id: string) {
    await prisma.schedule.delete({
      where: { id },
    });
  }

  async addScheduleItem(scheduleId: string, data: any) {
    // Check for conflicts before adding
    await this.checkConflicts(scheduleId, data);

    const item = await prisma.scheduleItem.create({
      data: {
        scheduleId,
        classId: data.classId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
        roomId: data.roomId,
        timeSlotId: data.timeSlotId,
      },
      include: {
        class: true,
        teacher: true,
        subject: true,
        room: true,
        timeSlot: true,
      },
    });

    return item;
  }

  async updateScheduleItem(itemId: string, data: any) {
    const item = await prisma.scheduleItem.update({
      where: { id: itemId },
      data: {
        roomId: data.roomId,
        timeSlotId: data.timeSlotId,
        locked: data.locked,
      },
      include: {
        class: true,
        teacher: true,
        subject: true,
        room: true,
        timeSlot: true,
      },
    });

    return item;
  }

  async deleteScheduleItem(itemId: string) {
    await prisma.scheduleItem.delete({
      where: { id: itemId },
    });
  }

  async checkConflicts(scheduleId: string, newItem: any): Promise<ConflictDetectionResult> {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        items: {
          include: {
            teacher: true,
            room: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new AppError(404, 'Schedule not found');
    }

    const conflicts: any[] = [];

    // Check teacher conflict (same time, different class)
    const teacherConflict = schedule.items.find(
      (item) => item.teacherId === newItem.teacherId && item.timeSlotId === newItem.timeSlotId
    );
    if (teacherConflict) {
      conflicts.push({
        type: 'teacher_double_class',
        description: `Teacher already assigned to another class at this time`,
        severity: 'High',
        affectedItems: [teacherConflict.id],
      });
    }

    // Check room conflict (same time, different class)
    const roomConflict = schedule.items.find(
      (item) => item.roomId === newItem.roomId && item.timeSlotId === newItem.timeSlotId
    );
    if (roomConflict) {
      conflicts.push({
        type: 'room_conflict',
        description: `Room already in use at this time`,
        severity: 'High',
        affectedItems: [roomConflict.id],
      });
    }

    // Check class conflict (same time, different subject)
    const classConflict = schedule.items.find(
      (item) => item.classId === newItem.classId && item.timeSlotId === newItem.timeSlotId
    );
    if (classConflict) {
      conflicts.push({
        type: 'class_double_subject',
        description: `Class already has a subject scheduled at this time`,
        severity: 'High',
        affectedItems: [classConflict.id],
      });
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      quality: 100 - conflicts.length * 10,
    };
  }

  async getScheduleConflicts(scheduleId: string) {
    const conflicts = await prisma.scheduleConflict.findMany({
      where: { scheduleId },
      include: {
        scheduleItem1: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            room: true,
          },
        },
      },
    });

    return conflicts;
  }

  async resolveConflict(conflictId: string) {
    const conflict = await prisma.scheduleConflict.update({
      where: { id: conflictId },
      data: { resolved: true },
    });

    return conflict;
  }

  async lockScheduleItem(itemId: string) {
    const item = await prisma.scheduleItem.update({
      where: { id: itemId },
      data: { locked: true },
    });

    return item;
  }

  async unlockScheduleItem(itemId: string) {
    const item = await prisma.scheduleItem.update({
      where: { id: itemId },
      data: { locked: false },
    });

    return item;
  }
}

export const scheduleService = new ScheduleService();
