import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET!;

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400).json({ error: "Missing credential" });
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token");

    const { sub: googleId, email } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          email: email ?? "",
          currency: 0,
          hunger: 100,
        },
      });
      isNewUser = true;
    } else {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        });
      }
    }

    if (isNewUser) {
      await prisma.userCosmetic.create({
        data: {
          userId: user.userId,
          cosmeticId: "1", // Blush
          isUnlocked: true,
        },
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (err) {
    console.error("Login failed", err);
    res.status(500).json({ error: "Google login failed" });
  }
};
