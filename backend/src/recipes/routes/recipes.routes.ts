import express from "express";
import { fetchRecipe, fetchAllRecipes, fetchRecipeById } from "../controllers/recipes.controller";
import { authenticateJWT } from "../../middleware/jwt";
const router = express.Router();

router.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.get("/", authenticateJWT, fetchRecipe);
router.get("/all", authenticateJWT, fetchAllRecipes);
router.get("/:id", authenticateJWT, fetchRecipeById)
export default router;
