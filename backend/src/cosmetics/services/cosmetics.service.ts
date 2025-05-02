import { Prisma } from "@prisma/client";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const getCosmeticsByUser =  async (id: string) => {
    try{
        const cosmetics = await prisma.userCosmetic.findMany({
            where: {
                userId : id
            },
            include: {
                cosmetic: true
            }
        });
        return cosmetics;
    }
    catch (error){
        console.error("Error Occured: ", error);
        throw error;
    }   
}

export const getCosmeticById = async (id: string) => {
    try{
        const cosmetic = await prisma.cosmetic.findUnique({
            where: { cosmeticId: id }
        });
        return cosmetic;
    }
    catch (error){
        console.error("An error has occured: ", error);
        throw error;
    }
}

export const handlePurchase = async (userId: string, cosmeticId: string) => {
    try {
      const [user, cosmetic] = await Promise.all([
        prisma.user.findUnique({ where: { userId: userId } }),
        prisma.cosmetic.findUnique({ where: { cosmeticId: cosmeticId } }),
      ]);
  
      if (!user) throw new Error("User not found.");
      if (!cosmetic) throw new Error("Cosmetic not found.");
      if (user.currency < cosmetic.price) throw new Error("Not enough currency.");
  
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const newUserCosmetic = await tx.userCosmetic.create({
          data: {
            userId,
            cosmeticId,
          },
        });
  
        await tx.user.update({
          where: { userId: userId },
          data: {
            currency: {
              decrement: cosmetic.price,
            },
          },
        });
  
        return newUserCosmetic;
      });
  
      return result;
    } 
    catch (error) {
      console.error("Purchase failed:", error);
      throw new Error("Purchase could not be completed.");
    }
  };
  