/*TODO: LINE 95 AND 153, REMOVE SYSTEM AUTHENTICATION OVERRIDE FOR "createdBy" FIELD */

import { User } from "@prisma/client";
import OpenAI from "openai";
import { Recipe } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
import { DELETE_UNFAVORITED_RECIPES_AFTER } from "../../../config";
const prisma = new PrismaClient();

export const getRecipeByIngredients = async (
  ingredients: string,
  cuisine: string,
  strict: string,
  user?: User
) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  let strictMode: boolean = false;
  if (strict === "true") {
    strictMode = true;
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
                You are a professional and imaginative AI chef. Your goal is to create unique, delicious, and creative recipes using the ingredients provided by the user. You specialize in global cuisines, creative flavor combinations, and naming dishes in a way that is fun, enticing, or culturally inspired.
                
                Always respond ONLY in JSON format, structured as:
                {
                    "title": string,            // Use a real or realistic name from the selected cuisine — avoid fantasy names; use traditional or fusion-style names with culinary accuracy (e.g., "Shakshuka," "Pollo al Ajillo," "Paneer Tikka Biryani")
                    "ingredients": string[],    // List all ingredients used
                    "instructions": string[],   // Clear step-by-step, but allow creative techniques
                    "cookingMinutes": number,   // Total active + passive time
                    "servings": number,
                    "notes": string,             // Include tips, pairings, or fun facts
                    "cuisine": string,           // The cuisine of the recipe (Italian, Indian, Turkish, French, etc.)
                }
                
                Focus on originality, flavor, and a playful yet professional tone.
                ${
                  strictMode
                    ? `IMPORTANT RULE: You MUST NOT use any ingredients that are not listed by the user. 
                                Do not assume pantry items, spices, or common ingredients unless they are explicitly mentioned. 
                                Do not use salt, oil, water, or any ingredient unless it appears in the user's list.
                                `
                    : ""
                }
                `,
        },
        {
          role: "user",
          content: `Using the ingredients: ${ingredients}, generate a ${cuisine}-inspired recipe. Be imaginative with the flavor profile and give the dish a fun or culturally relevant name. Make sure it includes creative but approachable instructions and fits within the JSON structure.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 700,
    });

    const rawResponse: string | any = response.choices[0]?.message?.content;
    const content: Recipe = JSON.parse(rawResponse) as Recipe;

    if (user) {
      content.createdBy = user.userId;
    }

    if (!content) {
      throw new Error("Received empty response.");
    }
    if (user) {
      deleteUnfavoritedRecipes(user);
    }
    return await storeRecipe(content);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return {
      title: "Error",
      ingredients: [],
      instructions: ["Failed to generate a recipe. Please try again."],
      cookingMinutes: "N/A",
      servings: 0,
      notes: "Error occurred while fetching the recipe.",
    };
  }
};

async function storeRecipe(recipe: Recipe): Promise<Recipe | void> {
  try {
    if (!(await doesRecipeExist(recipe))) {
      if (recipe.createdBy && recipe.createdBy !== "system") {
        const userExists = await prisma.user.findUnique({
          where: { userId: recipe.createdBy },
        });

        if (!userExists) {
          throw new Error(`User with ID ${recipe.createdBy} does not exist.`);
        }
      } 
      else {
        recipe.createdBy = "system";
      }

      const newRecipe: Recipe = await prisma.recipe.create({
        data: {
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cookingMinutes: recipe.cookingMinutes,
          servings: recipe.servings,
          notes: recipe.notes,
          cuisine: recipe.cuisine,
          favorite: recipe.favorite,
          createdBy: recipe.createdBy,
          createdAt: recipe.createdAt,
        },
      });
      console.log("New user recipe:", newRecipe);
      return newRecipe;
    }
  } 
  catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  } 
  finally {
    await prisma.$disconnect();
  }
}

async function doesRecipeExist(recipe: Recipe) {
  try {
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        title: {
          equals: recipe.title,
          mode: "insensitive",
        },
      },
    });

    if (existingRecipe) {
      const normalizedExistingIngredients = existingRecipe.ingredients
        .map((ingredient: string) => ingredient.toLowerCase())
        .sort();
      const normalizedNewIngredients = recipe.ingredients
        .map((ingredient) => ingredient.toLowerCase())
        .sort();

      const normalizedExistingInstructions = existingRecipe.instructions
        .map((instruction: string) => instruction.toLowerCase())
        .join(" ");
      const normalizedNewInstructions = recipe.instructions
        .map((instruction) => instruction.toLowerCase())
        .join(" ");

      if (
        JSON.stringify(normalizedExistingIngredients) ===
          JSON.stringify(normalizedNewIngredients) &&
        normalizedExistingInstructions === normalizedNewInstructions
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking for duplicate recipe:", error);
    throw error;
  }
}

async function deleteUnfavoritedRecipes(user: User): Promise<void> {
  if (!user) {
    return;
  }

  try {
    const userRecipes: Array<Recipe> = await prisma.recipe.findMany({
      where: {
        createdBy: user.userId,
        favorite: false,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: DELETE_UNFAVORITED_RECIPES_AFTER,
    });

    if (userRecipes.length < 30) {
      return;
    }
    for (let i of userRecipes) {
      try {
        await prisma.recipe.delete({
          where: {
            recipeId: i.recipeId,
          },
        });
      } 
      catch (error) {
        console.error("Failed deletion of record: " + i.recipeId);
      }
    }
  } 
  catch (error) {
    console.error("Cannot delete unfavorited records: " + error);
  } 
  finally {
    await prisma.$disconnect();
  }
}


export const getRecipeById = async (id: string): Promise<Recipe> => {
  const recipe: Recipe = await prisma.recipe.findUnique(
    {
      where: {
        id
      }
    }
  );
  return recipe;
}