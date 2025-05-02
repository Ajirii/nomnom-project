import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllCosmetics = async (req: Request, res: Response) => {
  try {
    const cosmetics = await prisma.cosmetic.findMany();
    res.json(cosmetics);
  } catch (error) {
    console.error("Error fetching cosmetics:", error);
    res.status(500).json({ message: "Server error" });
  }
};
