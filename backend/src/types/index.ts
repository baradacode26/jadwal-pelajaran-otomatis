export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'KEPALA_SEKOLAH' | 'GURU' | 'VIEWER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SchedulingOptions {
  algorithm: 'CSP' | 'GA' | 'SA' | 'HYBRID';
  timeout?: number;
  populationSize?: number;
  generations?: number;
  temperature?: number;
  coolingRate?: number;
}

export interface ConflictDetectionResult {
  hasConflicts: boolean;
  conflicts: ScheduleConflictDetail[];
  quality: number;
}

export interface ScheduleConflictDetail {
  type: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  affectedItems: string[];
  suggestion?: string;
}
