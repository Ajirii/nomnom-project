import express from "express";
import {
  fetchRecipe,
  fetchAllRecipes,
  fetchRecipeById,
} from "../controllers/recipes.controller";
import { authenticateJWT } from "../../middleware/jwt";
import { optionalAuth } from "../../middleware/optionalAuth";
const router = express.Router();

router.get("/", optionalAuth, fetchRecipe);
router.get("/all", authenticateJWT, fetchAllRecipes);
router.get("/:id", authenticateJWT, fetchRecipeById);

export default router;
