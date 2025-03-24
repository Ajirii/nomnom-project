import { Request, Response } from "express";
import { getRecipeByIngredients } from "../services/recipes.service"

export const fetchRecipe = async (req: Request, res: Response): Promise<void> => {
    try{
        const ingredients = req.query.ingredients as string;
        
        if (!ingredients) {
            res.status(400).json({error: "No ingredients provided."});
        } 

        const recipe = await getRecipeByIngredients(ingredients);
        res.json(recipe);
    }
    catch (err){
        if (!res.headersSent) { // ✅ Prevent duplicate response
            res.status(500).json({ error: "Internal server error" });
        }
    }
}