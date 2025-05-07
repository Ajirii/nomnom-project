import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  getQuestById,
  setUserQuest,
  getUserQuests,
  getRandomQuests,
  acceptUserQuest,
} from "../services/quests.service";

export const fetchQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "No Quest ID provided." });
      return;
    }

    const quest = await getQuestById(id).catch((err) => {
      res.status(500).json({ error: "Quest retrieval error." });
      return;
    });
    res.status(200).json(quest);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchUserQuests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "No user ID provided." });
      return;
    }

    let quests = await getUserQuests(userId);

    if (!quests || quests.length === 0) {
      quests = await getRandomQuests(userId);
    }

    const [user, achievement] = await Promise.all([
      prisma.user.findUnique({
        where: { userId },
        select: { currency: true },
      }),
      prisma.achievement.findUnique({
        where: { userId },
        select: { completedQuests: true },
      }),
    ]);

    const questsWithUserData = quests.map((quest) => ({
      ...quest,
      userCurrency: user?.currency || 0,
    }));

    res.status(200).json({
      quests: questsWithUserData,
      completedQuests: achievement?.completedQuests || 0,
      currency: user?.currency || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postUserQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, questId } = req.body;

    if (!userId || !questId) {
      res.status(400).json({ error: "No user or quest ID provided." });
      return;
    }

    const newUserQuest = await setUserQuest(userId, questId).catch((err) => {
      if (err.message === "User not found")
        res.status(400).json({ error: "User Doesn't Exist" });
      else if (err.message === "Quest not found")
        res.status(400).json({ error: "Quest Doesn't Exist" });
    });
    res.status(200).json(newUserQuest);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const fetchRandomQuests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "Missing userId." });
      return;
    }

    const quests = await getRandomQuests(userId);
    if (!quests || quests.length === 0) {
      res.status(404).json({ error: "No quest found." });
      return;
    }

    res.status(200).json(quests);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

import { completeUserQuest } from "../services/quests.service";

export const completeQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, questId } = req.body;

    if (!userId || !questId) {
      res.status(400).json({ error: "Missing userId or questId." });
      return;
    }

    const quest = await getQuestById(questId);
    if (!quest) {
      res.status(404).json({ error: "Quest not found." });
      return;
    }

    const result = await completeUserQuest(
      userId,
      questId,
      quest.rewardCurrency
    );

    res.status(200).json({
      currency: result.currency,
      completedQuests: result.completedQuests,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete quest." });
  }
};

export const acceptQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, questId } = req.body;

  if (!userId || !questId) {
    res.status(400).json({ error: "Missing userId or questId." });
    return;
  }

  try {
    const result = await acceptUserQuest(userId, questId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to accept quest." });
  }
};
