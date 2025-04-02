import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod schema to validate incoming recipe data
const recipeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  ingredients: z.array(z.string()).min(1),
  instructions: z.string().min(5),
});

// Create a new recipe
export const createRecipe = async (req: Request, res: Response) => {
  const validation = recipeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }

  const { title, description, ingredients, instructions } = validation.data;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions,
        user: { connect: { id: req.user.id } }, // req.user injected by auth middleware
      },
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Could not create recipe' });
  }
};

// Get all recipes (public)
export const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { user: true },
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
};

// Update a recipe
export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validation = recipeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }

  try {
    const existing = await prisma.recipe.findUnique({ where: { id: Number(id) } });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized or recipe not found' });
    }

    const recipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: validation.data,
    });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

// Delete a recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.recipe.findUnique({ where: { id: Number(id) } });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized or recipe not found' });
    }

    await prisma.recipe.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
