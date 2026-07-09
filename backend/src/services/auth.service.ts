import { getPrismaClient } from '../utils/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { AppError } from '../utils/errors';
import { User, Teacher } from '@prisma/client';

const prisma = getPrismaClient();

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.active) {
      throw new AppError(403, 'User account is inactive');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role as any,
      },
    });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacher: {
          include: {
            teachingLoads: {
              include: {
                class: true,
                subject: true,
              },
            },
          },
        },
        preferences: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async updateUserProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
      },
    });

    return user;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Old password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

export const authService = new AuthService();
