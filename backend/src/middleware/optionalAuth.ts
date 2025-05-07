import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { JwtUser, AuthenticatedRequest } from "../types/express";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = decoded as JwtUser;
    }
    next();
  });
};
