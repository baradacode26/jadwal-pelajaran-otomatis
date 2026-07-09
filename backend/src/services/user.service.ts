import { getPrismaClient } from '../utils/database';
import { AppError } from '../utils/errors';

const prisma = getPrismaClient();

export class UserService {
  async getAllUsers(page: number = 1, limit: number = 10, role?: string) {
    const skip = (page - 1) * limit;

    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          active: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            teachingLoads: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async searchUsers(query: string, limit: number = 10) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return users;
  }

  async updateUser(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        active: data.active,
      },
    });

    return user;
  }

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }

  async getUserStats() {
    const [totalUsers, adminCount, teacherCount, studentCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'GURU' } }),
      prisma.user.count({ where: { role: 'VIEWER' } }),
    ]);

    return {
      total: totalUsers,
      admin: adminCount,
      teacher: teacherCount,
      student: studentCount,
    };
  }
}

export const userService = new UserService();
