import express from "express";
import {
  fetchQuest,
  fetchUserQuests,
  postUserQuest,
  fetchRandomQuests,
  completeQuest,
  acceptQuest,
} from "../controller/quests.controller";
const router = express.Router();

router.post("/user-quest", postUserQuest);
router.get("/user-quest", fetchUserQuests);
router.get("/random", fetchRandomQuests);
router.get("/:id", fetchQuest);
router.post("/complete", completeQuest);
router.post("/accept", acceptQuest);

export default router;
