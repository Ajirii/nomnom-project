import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtUser } from "../types/express";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded as JwtUser;
    next();
  });
};
