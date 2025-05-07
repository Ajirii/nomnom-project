import { Request, Response } from "express";
import {
  getAllCosmetics,
  getCosmeticsByUser,
  getCosmeticById,
  handlePurchase,
  updateEquippedCosmetic,
} from "../services/cosmetics.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchAllCosmetics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cosmetics = await getAllCosmetics();
    res.status(200).json(cosmetics);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to fetch all cosmetics." });
    }
  }
};

export const fetchCostmeticsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await getCosmeticsByUser(id);

    if (!data || !data.cosmetics || !data.user) {
      res.status(404).json({ error: "Cosmetics or user not found." });
      return;
    }

    const equippedCosmetic = data.user.equippedCosmeticId
      ? await prisma.cosmetic.findUnique({
          where: { cosmeticId: data.user.equippedCosmeticId },
          select: { iconUrl: true, name: true, description: true },
        })
      : null;

    res.status(200).json({
      cosmetics: data.cosmetics.map((entry: any) => ({
        cosmeticId: entry.cosmetic.cosmeticId,
        isUnlocked: entry.isUnlocked,
      })),
      currency: data.user.currency,
      hunger: data.user.hunger,
      equippedCosmeticId: data.user.equippedCosmeticId,
      equippedCosmetic: equippedCosmetic,
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const fetchCosmeticById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ error: "User ID is required." });
      return;
    }

    const cosmetic = await getCosmeticById(id, userId);

    if (!cosmetic) {
      res.status(403).json({ error: "Cosmetic is locked or not found" });
      return;
    }

    res.status(200).json(cosmetic);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const buyCosmetic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, cosmeticId } = req.body;

    if (!userId || !cosmeticId) {
      res.status(400).json({ error: "User ID and Cosmetic ID are required." });
      return;
    }

    const userCosmetic = await handlePurchase(userId, cosmeticId);

    if (!userCosmetic) {
      res.status(404).json({ error: "Failed to add user cosmetic." });
      return;
    }

    res.status(200).json(userCosmetic);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const equipCosmetic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, cosmeticId } = req.body;

    if (!userId || !cosmeticId) {
      res.status(400).json({ error: "User ID and Cosmetic ID are required." });
      return;
    }

    const updatedUser = await updateEquippedCosmetic(userId, cosmeticId);

    const equippedCosmetic = await prisma.cosmetic.findUnique({
      where: { cosmeticId },
    });

    if (!equippedCosmetic) {
      res.status(404).json({ error: "Cosmetic not found." });
      return;
    }

    res.status(200).json({
      message: "Cosmetic equipped.",
      equippedCosmeticId: updatedUser.equippedCosmeticId,
      equippedCosmetic: equippedCosmetic,
    });
  } catch (error) {
    console.error("Error in equipCosmetic:", error);
    res.status(500).json({ error: "Failed to equip cosmetic." });
  }
};
