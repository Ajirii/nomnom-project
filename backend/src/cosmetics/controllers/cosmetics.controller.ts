import { Request, Response } from "express";
import { getCosmeticsByUser, getCosmeticById, handlePurchase } from "../services/cosmetics.service";

export const fetchCostmeticsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const cosmetics = await getCosmeticsByUser(id);
        if (!cosmetics){
            res.status(404).json({error: "cosmetics not found."});
            return;
        }
        res.status(200).json(cosmetics);
    }
    catch (error){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
        
    }
}

export const fetchCosmeticById = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const cosmetic = await getCosmeticById(id);

        if (!cosmetic){
            res.status(404).json({error: "Cosmetic not found"});
            return;
        }

        res.status(200).json(cosmetic);
    }
    catch (error){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const buyCosmetic = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, cosmeticId } = req.body;
        const userCosmetic = await handlePurchase(userId, cosmeticId);
        if (!userCosmetic){
            res.status(404).json({error: "failed to add user cosmetic."});
            return;
        }
        res.status(200).json(userCosmetic);
    }
    catch(error){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}   