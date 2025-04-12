import express from "express";
import { googleLogin } from "./auth.controller";

const router = express.Router();
router.post("/google", googleLogin);

export default router;
