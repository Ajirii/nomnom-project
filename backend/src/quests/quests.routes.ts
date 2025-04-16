import express from "express";
import { getRandomQuests } from "./quests.controller";
const router = express.Router();

router.get("/", getRandomQuests);

export default router;
