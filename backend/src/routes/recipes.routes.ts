import express from "express";
import { fetchRecipe } from "../controllers/recipes.controller";
const router = express.Router();

router.get("/", fetchRecipe);

export default router;
