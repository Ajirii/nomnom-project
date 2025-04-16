import { Request, Response } from "express";
import { getRecipeByIngredients } from "../services/recipes.service"
import { JwtUser } from "../../types/express";
export const fetchRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const ingredients = req.query.ingredients as string;
        const cuisine = req.query.cuisine as string ?? "any";
        const strict = req.query.strict as string ?? "false";
        const user = req.user;
        if (!ingredients) {
            res.status(400).json({error: "No ingredients provided."});
        } 

        const recipe = await getRecipeByIngredients(ingredients, cuisine, strict, user as JwtUser);
        res.status(200).json(recipe);
    }
    catch (err){
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}