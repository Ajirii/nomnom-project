import express from "express";
import { fetchRecipe } from "../controllers/recipes.controller";
import { fetchAllRecipes } from "../controllers/recipesAll.controller";
import { authenticateJWT } from "../../middleware/jwt";
const router = express.Router();

router.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.get("/", fetchRecipe);
router.get("/all", authenticateJWT, fetchAllRecipes);

export default router;
