import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../../types/express";

const prisma = new PrismaClient();

export const fetchAllRecipes = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        createdBy: req.user.userId,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching all recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
