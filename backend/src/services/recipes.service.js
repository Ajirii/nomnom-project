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
exports.storeRecipe = exports.getRecipeByIngredients = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const getRecipeByIngredients = (recipeDetails) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield openai.chat.completions.create({
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
        const content = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!content) {
            throw new Error("Received empty response.");
        }
        return JSON.parse(content);
    }
    catch (error) {
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
});
exports.getRecipeByIngredients = getRecipeByIngredients;
const storeRecipe = (recipe) => {
    /*
    TODO: Add method to store each returned recipe.
    */
};
exports.storeRecipe = storeRecipe;
