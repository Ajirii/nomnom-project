import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getQuestById(questId: string) {
  try {
    const quest = await prisma.quest.findUnique({
      where: {
        questId,
      },
    });
    return quest;
  } catch (error) {
    console.error("Error getting quest: " + error);
    throw error;
  }
}

export async function getUserQuests(userId: string) {
  const [userQuestRows, user] = await Promise.all([
    prisma.userQuest.findMany({
      where: { userId },
      include: {
        quest: true,
      },
    }),
    prisma.user.findUnique({
      where: { userId },
      select: {
        currency: true,
      },
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  return userQuestRows.map((uq) => ({
    ...uq.quest,
    status: uq.status,
    rewardCurrency: uq.quest?.rewardCurrency,
    rewardHunger: uq.quest?.rewardHunger,
    userCurrency: user.currency,
  }));
}

export async function setUserQuest(userId: string, questId: string) {
  try {
    if (!(await prisma.user.findUnique({ where: { userId } }))) {
      throw Error("User not found");
    }
    if (!(await prisma.quest.findUnique({ where: { questId } }))) {
      throw Error("Quest not found");
    }
    const newUserQuest = await prisma.userQuest.create({
      data: {
        userId: userId,
        questId: questId,
      },
    });
    return newUserQuest;
  } catch (error) {
    console.error("Error assigning quest: " + error);
    throw error;
  }
}

export const getRandomQuests = async (userId: string) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const startOfDayClone = new Date(today);

  const existingUserQuests = await prisma.userQuest.findMany({
    where: {
      userId,
      assignedDate: {
        gte: startOfDayClone,
        lt: endOfDay,
      },
    },
    include: { quest: true },
  });

  if (existingUserQuests.length > 0) {
    return existingUserQuests.map((uq) => ({
      ...uq.quest,
      status: uq.status,
    }));
  }

  const allQuests = await prisma.quest.findMany();
  const shuffled = allQuests.sort(() => Math.random() - 0.5);
  const selectedQuests = shuffled.slice(0, 4);

  await prisma.userQuest.createMany({
    data: selectedQuests.map((quest) => ({
      userId,
      questId: quest.questId,
      assignedDate: startOfDay,
      status: "AVAILABLE",
    })),
  });

  return selectedQuests.map((q) => ({ ...q, status: "AVAILABLE" }));
};

export const completeUserQuest = async (
  userId: string,
  questId: string,
  rewardCurrency: number = 10
) => {
  const userQuest = await prisma.userQuest.findUnique({
    where: {
      userId_questId: { userId, questId },
    },
  });

  if (!userQuest || userQuest.status !== "ACCEPTED") {
    throw new Error("Quest not accepted or already completed");
  }

  await prisma.userQuest.update({
    where: {
      userId_questId: { userId, questId },
    },
    data: {
      status: "COMPLETED",
    },
  });

  const updatedUser = await prisma.user.update({
    where: { userId },
    data: {
      currency: {
        increment: rewardCurrency,
      },
    },
    select: {
      currency: true,
    },
  });

  const achievement = await prisma.achievement.upsert({
    where: { userId },
    update: { completedQuests: { increment: 1 } },
    create: { userId, completedQuests: 1 },
  });

  return {
    currency: updatedUser.currency,
    completedQuests: achievement.completedQuests,
  };
};

export const acceptUserQuest = async (userId: string, questId: string) => {
  const userQuest = await prisma.userQuest.update({
    where: {
      userId_questId: { userId, questId },
    },
    data: {
      status: "ACCEPTED",
    },
  });

  return userQuest;
};
