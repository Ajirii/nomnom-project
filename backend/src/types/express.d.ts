import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface JwtUser {
  userId: string;
  email: string;
  password: string?;
  googleId: string;
  currency: number;
  hunger: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      userId?: string;
    }
  }
}
