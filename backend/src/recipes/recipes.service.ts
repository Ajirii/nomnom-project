import OpenAI from "openai";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getRecipeByIngredients = async (
  ingredients: string,
  cuisine: string,
  strict: string
) => {
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
                    "title": string,            // Give it a catchy, fun, or culturally inspired name — avoid generic names like "Chicken Dish"
                    "ingredients": string[],    // List all ingredients used
                    "instructions": string[],   // Clear step-by-step, but allow creative techniques
                    "cookingMinutes": number,   // Total active + passive time
                    "servings": number,
                    "notes": string             // Include tips, pairings, or fun facts
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
    const content: {
      title: string;
      ingredients: string[];
      instructions: string[];
      cookingMinutes: number;
      servings: number;
      notes: string;
    } = JSON.parse(rawResponse);

    if (!content) {
      throw new Error("Received empty response.");
    }

    storeRecipe(content, cuisine);
    return content;
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

async function storeRecipe(
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    cookingMinutes: number;
    servings: number;
    notes: string;
  },
  cuisine: string
) {
  try {
    if (!(await doesRecipeExist(recipe))) {
      const newRecipe = await prisma.recipe.create({
        data: {
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cookingMinutes: recipe.cookingMinutes,
          servings: recipe.servings,
          cuisine: cuisine,
          notes: recipe.notes,
          favorite: false,
        },
      });
      console.log("New user recipe:", newRecipe);
      return newRecipe;
    }
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function doesRecipeExist(recipe: {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingMinutes: number;
  servings: number;
  notes: string;
}) {
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
