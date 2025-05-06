import { Request, Response } from "express";
import { getQuestById, setUserQuest, getUserQuests, getRandomQuests } from "../services/quests.service"

export const fetchQuest = async (req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;
        
        if (!id) {
            res.status(400).json({error: "No Quest ID provided."});
            return;
        } 

        const quest = await getQuestById(id).catch(err => {
            res.status(500).json({error: "Quest retrieval error."});
            return;
        });
        res.status(200).json(quest);
    }
    catch (err){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const fetchUserQuests = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId as string;

        if (!userId){
            res.status(400).json({error: "No user ID provided."});
            return;
        }
        
        const quests = await getUserQuests(userId);
        console.log("QUEST:", quests);
        if (!quests || quests.length === 0){
            res.status(404).json({error: "No quest found."});
            return;
        }
        res.status(200).json(quests);
    }
    catch (err){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const postUserQuest = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId, questId} = req.body;

        if (!userId || !questId){
            res.status(400).json({error: "No user or quest ID provided."});
            return;
        }

        const newUserQuest = await setUserQuest(userId, questId).catch(err => 
            {if (err.message === "User not found") 
                res.status(400).json({error: "User Doesn't Exist"})
            else if (err.message === "Quest not found")
                res.status(400).json({error: "Quest Doesn't Exist"})
        });
        res.status(200).json(newUserQuest);
    }
    catch (err){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const fetchRandomQuests = async (req: Request, res: Response): Promise<void> => {
   try {
        const quests = await getRandomQuests();
        if (!quests || quests.length === 0){
            res.status(404).json({error: "No quest found."});
            return;
        }
        res.status(200).json(quests);
    }
    catch (err){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
   }
}