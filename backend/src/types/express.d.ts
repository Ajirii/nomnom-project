import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface JwtUser {
  userId: string;
  email: string;
  googleId: string;
  name: string;
  currency: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      userId?: string;
    }
  }
}
