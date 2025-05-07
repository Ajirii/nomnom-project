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

    return result;
  } catch (error) {
    console.error("Purchase failed:", error);
    throw new Error("Purchase could not be completed.");
  }
};
