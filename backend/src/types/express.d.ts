import { UserRole } from '../entities/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: UserRole;
    };
  }
}

export {};
