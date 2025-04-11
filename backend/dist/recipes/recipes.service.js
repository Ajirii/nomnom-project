"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipeByIngredients = void 0;
const openai_1 = __importDefault(require("openai"));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const getRecipeByIngredients = (ingredients, cuisine, strict) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let strictMode = false;
    if (strict === "true") {
        strictMode = true;
    }
    try {
        const response = yield openai.chat.completions.create({
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
                ${strictMode ? `IMPORTANT RULE: You MUST NOT use any ingredients that are not listed by the user. 
                                Do not assume pantry items, spices, or common ingredients unless they are explicitly mentioned. 
                                Do not use salt, oil, water, or any ingredient unless it appears in the user's list.
                                ` : ""}
                `
                },
                {
                    role: "user",
                    content: `Using the ingredients: ${ingredients}, generate a ${cuisine}-inspired recipe. Be imaginative with the flavor profile and give the dish a fun or culturally relevant name. Make sure it includes creative but approachable instructions and fits within the JSON structure.`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 700,
        });
        const rawResponse = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        const content = JSON.parse(rawResponse);
        if (!content) {
            throw new Error("Received empty response.");
        }
        storeRecipe(content);
        return content;
    }
    catch (error) {
        console.error("Error fetching recipe:", error);
        return {
            title: "Error",
            ingredients: [],
            instructions: ["Failed to generate a recipe. Please try again."],
            cookingMinutes: "N/A",
            servings: 0,
            notes: "Error occurred while fetching the recipe."
        };
    }
});
exports.getRecipeByIngredients = getRecipeByIngredients;
function storeRecipe(recipe) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield doesRecipeExist(recipe))) {
                const newRecipe = yield prisma.recipe.create({
                    data: {
                        title: recipe.title,
                        ingredients: recipe.ingredients,
                        instructions: recipe.instructions,
                        cookingMinutes: recipe.cookingMinutes,
                        servings: recipe.servings,
                        notes: recipe.notes
                    },
                });
                console.log('New user recipe:', newRecipe);
                return newRecipe;
            }
        }
        catch (error) {
            console.error('Error creating recipe:', error);
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
function doesRecipeExist(recipe) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingRecipe = yield prisma.recipe.findFirst({
                where: {
                    title: {
                        equals: recipe.title,
                        mode: 'insensitive',
                    },
                },
            });
            if (existingRecipe) {
                const normalizedExistingIngredients = existingRecipe.ingredients
                    .map((ingredient) => ingredient.toLowerCase())
                    .sort();
                const normalizedNewIngredients = recipe.ingredients
                    .map((ingredient) => ingredient.toLowerCase())
                    .sort();
                const normalizedExistingInstructions = existingRecipe.instructions.map((instruction) => instruction.toLowerCase()).join(" ");
                const normalizedNewInstructions = recipe.instructions.map((instruction) => instruction.toLowerCase()).join(" ");
                if (JSON.stringify(normalizedExistingIngredients) === JSON.stringify(normalizedNewIngredients) && normalizedExistingInstructions === normalizedNewInstructions) {
                    return true;
                }
            }
            return false;
        }
        catch (error) {
            console.error('Error checking for duplicate recipe:', error);
            throw error;
        }
    });
}
