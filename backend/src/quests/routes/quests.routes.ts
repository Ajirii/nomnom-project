import express from 'express';
import { fetchQuest, fetchUserQuests, postUserQuest } from '../controller/quests.controller';
const router = express.Router();

router.post('/user-quest', postUserQuest);
router.get('/user-quest', fetchUserQuests);
router.get('/:id', fetchQuest);
export default router;