import express from 'express';
import { fetchQuest, fetchUserQuests, postUserQuest, fetchRandomQuests } from '../controller/quests.controller';
const router = express.Router();

router.post('/user-quest', postUserQuest);
router.get('/user-quest', fetchUserQuests);
router.get("/random", fetchRandomQuests);
router.get('/:id', fetchQuest);
export default router;