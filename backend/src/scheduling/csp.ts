import { getPrismaClient } from '../../utils/database';
import logger from '../../utils/logger';
import { AppError } from '../../utils/errors';

const prisma = getPrismaClient();

interface ScheduleVariable {
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId?: string;
  timeSlotId?: string;
}

interface Constraint {
  name: string;
  validate: (assignment: Map<string, ScheduleVariable>) => boolean;
}

export class ConstraintSatisfactionProblem {
  private variables: ScheduleVariable[] = [];
  private hardConstraints: Constraint[] = [];
  private domain: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeConstraints();
  }

  private initializeConstraints() {
    // Hard Constraint: No teacher teaches 2 classes at same time
    this.hardConstraints.push({
      name: 'no_teacher_conflict',
      validate: (assignment: Map<string, ScheduleVariable>) => {
        const timeSlotTeacher = new Map<string, Set<string>>();

        for (const item of assignment.values()) {
          if (!item.timeSlotId || !item.teacherId) continue;

          const key = `${item.timeSlotId}:${item.teacherId}`;
          if (!timeSlotTeacher.has(key)) {
            timeSlotTeacher.set(key, new Set());
          }
          timeSlotTeacher.get(key)!.add(item.classId);
        }

        for (const classes of timeSlotTeacher.values()) {
          if (classes.size > 1) return false;
        }
        return true;
      },
    });

    // Hard Constraint: No room used by 2 classes at same time
    this.hardConstraints.push({
      name: 'no_room_conflict',
      validate: (assignment: Map<string, ScheduleVariable>) => {
        const timeSlotRoom = new Map<string, Set<string>>();

        for (const item of assignment.values()) {
          if (!item.timeSlotId || !item.roomId) continue;

          const key = `${item.timeSlotId}:${item.roomId}`;
          if (!timeSlotRoom.has(key)) {
            timeSlotRoom.set(key, new Set());
          }
          timeSlotRoom.get(key)!.add(item.classId);
        }

        for (const classes of timeSlotRoom.values()) {
          if (classes.size > 1) return false;
        }
        return true;
      },
    });

    // Hard Constraint: One class has max 1 subject per time slot
    this.hardConstraints.push({
      name: 'no_class_double_subject',
      validate: (assignment: Map<string, ScheduleVariable>) => {
        const classTimeSlot = new Map<string, Set<string>>();

        for (const item of assignment.values()) {
          if (!item.timeSlotId) continue;

          const key = `${item.classId}:${item.timeSlotId}`;
          if (!classTimeSlot.has(key)) {
            classTimeSlot.set(key, new Set());
          }
          classTimeSlot.get(key)!.add(item.subjectId);
        }

        for (const subjects of classTimeSlot.values()) {
          if (subjects.size > 1) return false;
        }
        return true;
      },
    });
  }

  async initialize(scheduleId: string) {
    try {
      const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: {
          semester: {
            include: {
              timeSlots: true,
            },
          },
        },
      });

      if (!schedule) {
        throw new AppError(404, 'Schedule not found');
      }

      // Get all teaching loads
      const teachingLoads = await prisma.teachingLoad.findMany({
        include: {
          class: true,
          subject: true,
          teacher: true,
        },
      });

      const rooms = await prisma.room.findMany();
      const timeSlots = schedule.semester.timeSlots;

      // Create variables for each class-subject-teacher combination
      this.variables = teachingLoads.map((load) => ({
        classId: load.classId,
        subjectId: load.subjectId,
        teacherId: load.teacherId,
      }));

      // Initialize domain for each variable
      for (const variable of this.variables) {
        const domainKey = `${variable.classId}-${variable.subjectId}-${variable.teacherId}`;
        const domain = new Set<string>();

        for (const room of rooms) {
          for (const slot of timeSlots) {
            domain.add(`${room.id}-${slot.id}`);
          }
        }

        this.domain.set(domainKey, domain);
      }

      logger.info(`CSP initialized with ${this.variables.length} variables`);
    } catch (error) {
      logger.error(`Error initializing CSP: ${error}`);
      throw error;
    }
  }

  isFeasible(assignment: Map<string, ScheduleVariable>): boolean {
    for (const constraint of this.hardConstraints) {
      if (!constraint.validate(assignment)) {
        logger.debug(`Constraint violated: ${constraint.name}`);
        return false;
      }
    }
    return true;
  }

  getConflictingConstraints(assignment: Map<string, ScheduleVariable>): string[] {
    const conflicts: string[] = [];
    for (const constraint of this.hardConstraints) {
      if (!constraint.validate(assignment)) {
        conflicts.push(constraint.name);
      }
    }
    return conflicts;
  }
}

export const createCSP = () => new ConstraintSatisfactionProblem();
