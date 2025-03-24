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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRecipe = void 0;
const recipes_service_1 = require("../services/recipes.service");
const fetchRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredients = req.query.ingredients;
        if (!ingredients) {
            res.status(400).json({ error: "No ingredients provided." });
        }
        const recipe = yield (0, recipes_service_1.getRecipeByIngredients)(ingredients);
        res.json(recipe);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchRecipe = fetchRecipe;
