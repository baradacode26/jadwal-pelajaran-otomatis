import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'VIEWER').default('VIEWER'),
});

export const createTeacherSchema = Joi.object({
  userId: Joi.string().required(),
  nip: Joi.string(),
  specialization: Joi.string(),
  qualification: Joi.string(),
  status: Joi.string().default('Aktif'),
});

export const createSubjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  jpPerWeek: Joi.number().required(),
  jpPerSemester: Joi.number().required(),
  category: Joi.string().required(),
  requiresLab: Joi.boolean().default(false),
  requiresPC: Joi.boolean().default(false),
});

export const createClassSchema = Joi.object({
  rombelId: Joi.string().required(),
  name: Joi.string().required(),
  capacity: Joi.number().default(30),
});

export const createTeachingLoadSchema = Joi.object({
  teacherId: Joi.string().required(),
  classId: Joi.string().required(),
  subjectId: Joi.string().required(),
  jpPerWeek: Joi.number().required(),
});

export const createScheduleSchema = Joi.object({
  academicYearId: Joi.string().required(),
  semesterId: Joi.string().required(),
  name: Joi.string().required(),
});
