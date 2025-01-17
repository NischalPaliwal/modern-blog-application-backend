import { Request } from 'express';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string;
        password: string;
        name: string;
        role: Role;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}