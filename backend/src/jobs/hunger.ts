import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateUserHunger = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      hunger: true,
      lastHungerUpdate: true,
    },
  });

  if (!user || user.hunger <= 0) return;

  const now = new Date();
  const lastUpdate = user.lastHungerUpdate || new Date();
  const hoursPassed = Math.floor(
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
  );
  const decrements = Math.floor(hoursPassed / 6);

  if (decrements > 0) {
    const newHunger = Math.max(user.hunger - 10 * decrements, 0);
    await prisma.user.update({
      where: { userId },
      data: {
        hunger: newHunger,
        lastHungerUpdate: new Date(
          lastUpdate.getTime() + decrements * 6 * 60 * 60 * 1000
        ),
      },
    });
  }
};
