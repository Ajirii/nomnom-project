import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const getRandomQuests = async (res: Response): Promise<void> => {
  try {
    const quests = await prisma.quest.findMany();
    const shuffled = shuffleArray(quests);
    res.json(shuffled);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quests" });
  }
};
