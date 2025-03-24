import axios from 'axios';
import OpenAI from 'openai'
import dotenv from 'dotenv';

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});


export const getRecipeByIngredients = async (recipeDetails: string) => {
  try {
      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
              {
                  role: "system",
                  content: "You are a professional AI chef that generates structured recipes based on user-provided ingredients and preferences. Respond only in JSON format, structured as follows: { \"title\": string, \"ingredients\": string[], \"instructions\": string[], \"cooking_time\": string, \"servings\": number, \"additional_notes\": string }."
              },
              {
                  role: "user",
                  content: `Generate a recipe using the following ingredients and preferences: ${recipeDetails}. Ensure the response is in the specified JSON format.`
              }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 700,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
          throw new Error("Received empty response.");
      }

      return JSON.parse(content);
  } catch (error) {
      console.error("Error fetching recipe:", error);
      return {
          title: "Error",
          ingredients: [],
          instructions: ["Failed to generate a recipe. Please try again."],
          cooking_time: "N/A",
          servings: 0,
          additional_notes: "Error occurred while fetching the recipe."
      };
  }
};


export const storeRecipe = (recipe: object) => {
/*
TODO: Add method to store each returned recipe.
*/
}