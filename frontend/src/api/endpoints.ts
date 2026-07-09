import apiClient from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (data: { email: string; password: string; name: string; role: string }) =>
    apiClient.post('/auth/register', data),

  getProfile: () => apiClient.get('/auth/profile'),

  updateProfile: (data: any) => apiClient.put('/auth/profile', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};

export const userApi = {
  getAllUsers: (page: number, limit: number, role?: string) =>
    apiClient.get('/users', { params: { page, limit, role } }),

  searchUsers: (query: string, limit?: number) =>
    apiClient.get('/users/search', { params: { q: query, limit } }),

  getUserStats: () => apiClient.get('/users/stats'),

  getUserById: (id: string) => apiClient.get(`/users/${id}`),

  updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data),

  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
};

export const scheduleApi = {
  createSchedule: (data: any) => apiClient.post('/schedules', data),

  getAllSchedules: (page: number, limit: number) =>
    apiClient.get('/schedules', { params: { page, limit } }),

  getScheduleById: (id: string) => apiClient.get(`/schedules/${id}`),

  updateSchedule: (id: string, data: any) => apiClient.put(`/schedules/${id}`, data),

  deleteSchedule: (id: string) => apiClient.delete(`/schedules/${id}`),

  generateSchedule: (id: string, options: any) =>
    apiClient.post(`/schedules/${id}/generate`, options),

  addScheduleItem: (scheduleId: string, data: any) =>
    apiClient.post(`/schedules/${scheduleId}/items`, data),

  updateScheduleItem: (scheduleId: string, itemId: string, data: any) =>
    apiClient.put(`/schedules/${scheduleId}/items/${itemId}`, data),

  deleteScheduleItem: (scheduleId: string, itemId: string) =>
    apiClient.delete(`/schedules/${scheduleId}/items/${itemId}`),

  checkConflicts: (scheduleId: string, data: any) =>
    apiClient.post(`/schedules/${scheduleId}/check-conflicts`, data),

  getConflicts: (scheduleId: string) =>
    apiClient.get(`/schedules/${scheduleId}/conflicts`),

  resolveConflict: (scheduleId: string, conflictId: string) =>
    apiClient.post(`/schedules/${scheduleId}/conflicts/${conflictId}/resolve`),

  lockScheduleItem: (scheduleId: string, itemId: string) =>
    apiClient.post(`/schedules/${scheduleId}/items/${itemId}/lock`),

  unlockScheduleItem: (scheduleId: string, itemId: string) =>
    apiClient.post(`/schedules/${scheduleId}/items/${itemId}/unlock`),
};

export const masterDataApi = {
  // Academic Year
  createAcademicYear: (data: any) => apiClient.post('/master-data/academic-years', data),
  getAcademicYears: () => apiClient.get('/master-data/academic-years'),

  // Semester
  createSemester: (data: any) => apiClient.post('/master-data/semesters', data),
  getSemesters: (academicYearId: string) =>
    apiClient.get(`/master-data/semesters/${academicYearId}`),

  // Time Slot
  createTimeSlot: (data: any) => apiClient.post('/master-data/time-slots', data),
  getTimeSlots: (semesterId: string) =>
    apiClient.get(`/master-data/time-slots/${semesterId}`),

  // Subject
  createSubject: (data: any) => apiClient.post('/master-data/subjects', data),
  getSubjects: () => apiClient.get('/master-data/subjects'),

  // Teacher
  getTeachers: () => apiClient.get('/master-data/teachers'),
  getTeacherById: (id: string) => apiClient.get(`/master-data/teachers/${id}`),

  // Class
  getClasses: () => apiClient.get('/master-data/classes'),
  getClassById: (id: string) => apiClient.get(`/master-data/classes/${id}`),

  // Room
  getRooms: () => apiClient.get('/master-data/rooms'),
  getRoomById: (id: string) => apiClient.get(`/master-data/rooms/${id}`),

  // Teaching Load
  createTeachingLoad: (data: any) => apiClient.post('/master-data/teaching-loads', data),
  getTeachingLoads: () => apiClient.get('/master-data/teaching-loads'),
};
