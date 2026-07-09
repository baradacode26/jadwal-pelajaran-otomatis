import { getPrismaClient } from '../../utils/database';
import { createCSP } from './csp';
import { createGA } from './genetic-algorithm';
import { createSA } from './simulated-annealing';
import logger from '../../utils/logger';
import { AppError } from '../../utils/errors';
import { SchedulingOptions } from '../../types';

const prisma = getPrismaClient();

export class SchedulingEngine {
  async generateSchedule(
    scheduleId: string,
    options: SchedulingOptions = { algorithm: 'HYBRID' },
  ) {
    try {
      const startTime = Date.now();
      logger.info(`Starting schedule generation for ${scheduleId} using ${options.algorithm} algorithm`);

      const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: {
          semester: {
            include: {
              timeSlots: true,
              holidays: true,
            },
          },
        },
      });

      if (!schedule) {
        throw new AppError(404, 'Schedule not found');
      }

      // Get all necessary data
      const [teachingLoads, rooms, classes] = await Promise.all([
        prisma.teachingLoad.findMany({
          include: { class: true, subject: true, teacher: true },
        }),
        prisma.room.findMany(),
        prisma.class.findMany(),
      ]);

      if (teachingLoads.length === 0) {
        throw new AppError(400, 'No teaching loads configured for this schedule');
      }

      // Run scheduling based on selected algorithm
      let scheduleItems = [];

      switch (options.algorithm) {
        case 'CSP':
          scheduleItems = await this.runCSP(scheduleId, teachingLoads, rooms, schedule.semester.timeSlots);
          break;
        case 'GA':
          scheduleItems = await this.runGA(scheduleId, teachingLoads, rooms, schedule.semester.timeSlots, options);
          break;
        case 'SA':
          scheduleItems = await this.runSA(scheduleId, teachingLoads, rooms, schedule.semester.timeSlots, options);
          break;
        case 'HYBRID':
          scheduleItems = await this.runHybrid(scheduleId, teachingLoads, rooms, schedule.semester.timeSlots, options);
          break;
        default:
          throw new AppError(400, 'Unknown algorithm');
      }

      // Save schedule items
      for (const item of scheduleItems) {
        await prisma.scheduleItem.create({
          data: item,
        });
      }

      // Detect conflicts
      const conflicts = await this.detectConflicts(scheduleId);

      // Update schedule status
      const qualityScore = 100 - (conflicts.length * 5);
      await prisma.schedule.update({
        where: { id: scheduleId },
        data: {
          status: 'Generated',
          generatedAt: new Date(),
          quality: Math.max(0, qualityScore),
          conflictCount: conflicts.length,
        },
      });

      const endTime = Date.now();
      logger.info(`Schedule generation completed in ${(endTime - startTime) / 1000}s with ${conflicts.length} conflicts`);

      return {
        success: true,
        scheduleId,
        itemCount: scheduleItems.length,
        conflictCount: conflicts.length,
        quality: qualityScore,
        generationTime: (endTime - startTime) / 1000,
      };
    } catch (error) {
      logger.error(`Error generating schedule: ${error}`);
      throw error;
    }
  }

  private async runCSP(scheduleId: string, teachingLoads: any[], rooms: any[], timeSlots: any[]) {
    const csp = createCSP();
    await csp.initialize(scheduleId);

    // Simple backtracking approach
    const assignments: any[] = [];
    const usedSlots = new Set<string>();

    for (const load of teachingLoads) {
      let assigned = false;
      for (const room of rooms) {
        for (const slot of timeSlots) {
          const key = `${slot.id}-${room.id}`;
          if (!usedSlots.has(key)) {
            assignments.push({
              scheduleId,
              classId: load.classId,
              teacherId: load.teacherId,
              subjectId: load.subjectId,
              roomId: room.id,
              timeSlotId: slot.id,
            });
            usedSlots.add(key);
            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }
    }

    return assignments;
  }

  private async runGA(scheduleId: string, teachingLoads: any[], rooms: any[], timeSlots: any[], options: SchedulingOptions) {
    const ga = createGA({
      populationSize: options.populationSize || 100,
      generations: options.generations || 1000,
    });

    // Create gene pool
    const genePool = [];
    for (const load of teachingLoads) {
      for (const room of rooms) {
        for (const slot of timeSlots) {
          genePool.push(`${load.classId}-${load.teacherId}-${load.subjectId}-${room.id}-${slot.id}`);
        }
      }
    }

    ga.initializePopulation(genePool.slice(0, teachingLoads.length));

    const fitnessFunc = (genes: string[]) => {
      // Calculate fitness based on constraint satisfaction
      let fitness = 100;
      const used = new Set<string>();

      for (const gene of genes) {
        const parts = gene.split('-');
        const key = `${parts[3]}-${parts[4]}`; // room-slot
        if (used.has(key)) fitness -= 10;
        used.add(key);
      }

      return fitness;
    };

    ga.evolve(fitnessFunc);

    const best = ga.getBestSolution();
    const assignments = best?.genes.map((gene) => {
      const parts = gene.split('-');
      return {
        scheduleId,
        classId: parts[0],
        teacherId: parts[1],
        subjectId: parts[2],
        roomId: parts[3],
        timeSlotId: parts[4],
      };
    }) || [];

    return assignments;
  }

  private async runSA(scheduleId: string, teachingLoads: any[], rooms: any[], timeSlots: any[], options: SchedulingOptions) {
    const sa = createSA({
      initialTemperature: options.temperature || 100,
      coolingRate: options.coolingRate || 0.99,
    });

    // Create initial solution
    const initialSolution = teachingLoads.map((load, idx) => {
      const room = rooms[idx % rooms.length];
      const slot = timeSlots[idx % timeSlots.length];
      return `${load.classId}-${load.teacherId}-${load.subjectId}-${room.id}-${slot.id}`;
    });

    const fitnessFunc = (solution: string[]) => {
      let fitness = 100;
      const used = new Set<string>();

      for (const gene of solution) {
        const parts = gene.split('-');
        const key = `${parts[3]}-${parts[4]}` + `-${parts[1]}`; // room-slot-teacher
        if (used.has(key)) fitness -= 15;
        used.add(key);
      }

      return fitness;
    };

    const bestSolution = sa.optimize(initialSolution, fitnessFunc);

    const assignments = bestSolution.map((gene) => {
      const parts = gene.split('-');
      return {
        scheduleId,
        classId: parts[0],
        teacherId: parts[1],
        subjectId: parts[2],
        roomId: parts[3],
        timeSlotId: parts[4],
      };
    });

    return assignments;
  }

  private async runHybrid(scheduleId: string, teachingLoads: any[], rooms: any[], timeSlots: any[], options: SchedulingOptions) {
    // Start with CSP for feasibility
    let assignments = await this.runCSP(scheduleId, teachingLoads, rooms, timeSlots);

    // Then optimize with GA
    const gaResult = await this.runGA(scheduleId, teachingLoads, rooms, timeSlots, options);
    if (gaResult.length > assignments.length) {
      assignments = gaResult;
    }

    return assignments;
  }

  private async detectConflicts(scheduleId: string) {
    const items = await prisma.scheduleItem.findMany({
      where: { scheduleId },
      include: {
        teacher: true,
        room: true,
        class: true,
        timeSlot: true,
      },
    });

    const conflicts = [];

    // Check teacher conflicts
    const teacherTimeSlots = new Map<string, string[]>();
    for (const item of items) {
      const key = `${item.teacherId}-${item.timeSlotId}`;
      if (!teacherTimeSlots.has(key)) {
        teacherTimeSlots.set(key, []);
      }
      teacherTimeSlots.get(key)!.push(item.classId);
    }

    for (const [key, classes] of teacherTimeSlots) {
      if (classes.length > 1) {
        conflicts.push({
          type: 'teacher_conflict',
          description: `Teacher has multiple classes at same time`,
        });
      }
    }

    // Check room conflicts
    const roomTimeSlots = new Map<string, string[]>();
    for (const item of items) {
      const key = `${item.roomId}-${item.timeSlotId}`;
      if (!roomTimeSlots.has(key)) {
        roomTimeSlots.set(key, []);
      }
      roomTimeSlots.get(key)!.push(item.classId);
    }

    for (const [key, classes] of roomTimeSlots) {
      if (classes.length > 1) {
        conflicts.push({
          type: 'room_conflict',
          description: `Room is used by multiple classes at same time`,
        });
      }
    }

    return conflicts;
  }
}

export const schedulingEngine = new SchedulingEngine();
