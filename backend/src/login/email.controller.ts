import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const loginWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const googleUser = await prisma.user.findUnique({
        where: { googleId: email },
      });

      if (googleUser) {
        res.status(400).json({
          message:
            "This email is associated with a Google account. Please log in with Google.",
        });
        return;
      }

      res.status(401).json({ message: "No account found with this email." });
      return;
    }

    if (!user.password) {
      res.status(400).json({
        message:
          "This email is associated with a Google account. Please log in with Google.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        currency: 0,
        hunger: 100,
      },
    });

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
