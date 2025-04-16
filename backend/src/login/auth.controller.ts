import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    console.log("Payload:", payload);

    if (!payload) throw new Error("Invalid token");

    const { sub: googleId, email, name } = payload;

    let user = await prisma.user.findUnique({ where: { googleId } });
    console.log("User found:", user);

    try {
      if (!user) {
        user = await prisma.user.create({
          data: {
            googleId,
            email: email ?? "",
            name: name ?? "Unknown",
          },
        });
        console.log("New user created:", user);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }

    res.json({ user });
  } catch (err) {
    console.error("Login failed", err);
    res.status(500).json({ error: "Google login failed" });
  }
};
