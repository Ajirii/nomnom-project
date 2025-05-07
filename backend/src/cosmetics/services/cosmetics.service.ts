import { Prisma } from "@prisma/client";
import { updateUserHunger } from "../../jobs/hunger";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const getAllCosmetics = async () => {
  try {
    return await prisma.cosmetic.findMany();
  } catch (error) {
    console.error("Failed to fetch all cosmetics:", error);
    throw error;
  }
};

export const getCosmeticsByUser = async (id: string) => {
  try {
    await updateUserHunger(id);
    const [cosmetics, user] = await Promise.all([
      prisma.userCosmetic.findMany({
        where: { userId: id },
        include: { cosmetic: true },
      }),
      prisma.user.findUnique({
        where: { userId: id },
        select: {
          currency: true,
          hunger: true,
          equippedCosmeticId: true,
        },
      }),
    ]);

    return { cosmetics, user };
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const getCosmeticById = async (id: string, userId: string) => {
  try {
    const userCosmetic = await prisma.userCosmetic.findUnique({
      where: {
        userId_cosmeticId: {
          userId,
          cosmeticId: id,
        },
      },
      include: {
        cosmetic: true,
      },
    });

    return userCosmetic?.cosmetic || null;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const handlePurchase = async (userId: string, cosmeticId: string) => {
  try {
    const [user, cosmetic] = await Promise.all([
      prisma.user.findUnique({ where: { userId } }),
      prisma.cosmetic.findUnique({ where: { cosmeticId } }),
    ]);

    if (!user) throw new Error("User not found.");
    if (!cosmetic) throw new Error("Cosmetic not found.");
    if (user.currency < cosmetic.price) throw new Error("Not enough currency.");

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newUserCosmetic = await tx.userCosmetic.upsert({
          where: { userId_cosmeticId: { userId, cosmeticId } },
          update: { isUnlocked: true },
          create: {
            userId,
            cosmeticId,
            isUnlocked: true,
          },
        });

        await tx.user.update({
          where: { userId },
          data: {
            currency: {
              decrement: cosmetic.price,
            },
          },
        });

        return newUserCosmetic;
      }
    );

    // refetch with cosmetic info included
    const fullResult = await prisma.userCosmetic.findUnique({
      where: { userId_cosmeticId: { userId, cosmeticId } },
      include: { cosmetic: true },
    });

    return fullResult;
  } catch (error) {
    console.error("Purchase failed:", error);
    throw new Error("Purchase could not be completed.");
  }
};

export const updateEquippedCosmetic = async (
  userId: string,
  cosmeticId: string
) => {
  try {
    console.log(
      `Attempting to equip cosmetic ${cosmeticId} for user ${userId}`
    );

    const userCosmetic = await prisma.userCosmetic.findUnique({
      where: { userId_cosmeticId: { userId, cosmeticId } },
    });

    if (!userCosmetic || !userCosmetic.isUnlocked) {
      throw new Error("Cosmetic not unlocked.");
    }

    console.log(`User ${userId} has unlocked cosmetic ${cosmeticId}`);

    // Update the User table with the equipped cosmetic
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { equippedCosmeticId: cosmeticId },
    });

    console.log(`User ${userId} equipped cosmetic with ID: ${cosmeticId}`);
    return updatedUser;
  } catch (error) {
    console.error("Failed to equip cosmetic:", error);
    throw error;
  }
};
