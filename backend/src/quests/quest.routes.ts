import express from "express";
import { getRandomQuests } from "./quest.controller";
const router = express.Router();

router.get("/", getRandomQuests);

export default router;
