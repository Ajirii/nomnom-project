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

export const getCosmeticById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cosmetic = await prisma.cosmetic.findUnique({
      where: { cosmeticId: id },
    });

    if (cosmetic) {
      res.json(cosmetic);
    } else {
      res.status(404).json({ message: "Cosmetic not found" });
    }
  } catch (error) {
    console.error("Error fetching cosmetic:", error);
    res.status(500).json({ message: "Server error" });
  }
};
