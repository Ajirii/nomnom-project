import express from "express";
import { loginWithEmail, registerUser } from "./email.controller";

const router = express.Router();

router.post("/email", loginWithEmail);
router.post("/register", registerUser);

export default router;
