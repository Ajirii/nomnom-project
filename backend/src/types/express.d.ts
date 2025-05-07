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
  lastHungerUpdate: Date;
  equippedCosmeticId: string?;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      userId?: string;
    }
  }
}
