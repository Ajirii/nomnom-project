import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
  
export interface JwtUser {
  userId: string;
  email: string;
  googleId: string;
  name: string;
  currency: number;
}
