import express from 'express';
import { fetchRecipe } from './recipes.controller';
const router = express.Router();

router.get('/', fetchRecipe);

export default router;