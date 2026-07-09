import crypto from 'crypto';

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const hashString = (str: string): string => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"']/g, '')
    .substring(0, 1000);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-()\s]{10,}$/;
  return phoneRegex.test(phone);
};
