import { Request, Response } from "express";
import { getRecipeByIngredients, getRecipeById } from "../services/recipes.service"
import { JwtUser } from "../../types/express";
import { AuthenticatedRequest } from "../../types/express";
import { PrismaClient } from "@prisma/client";
import { Recipe } from "@prisma/client";

const prisma = new PrismaClient();

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

export const fetchAllRecipes = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
  
      const recipes = await prisma.recipe.findMany({
        where: {
          createdBy: req.user.userId,
        },
        orderBy: { createdAt: "desc" },
      });
  
      res.status(200).json(recipes);
    } 
    catch (err) {
      console.error("Error fetching all recipes:", err);
      res.status(500).json({ error: "Internal server error" });
    } 
    finally {
      await prisma.$disconnect();
    }
  };

export const fetchRecipeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const recipe: Recipe | null = await getRecipeById(id);
        if (!recipe){
            res.status(404).json({error: "Recipe not found."});
            return;
        }

        res.status(200).json(recipe);
    }
    catch (error){
        res.status(500).json({error: "Internal server error."})
    }
}