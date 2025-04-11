import express from "express";
import { googleCallback } from "./google.controller";

const router = express.Router();

router.get("/", googleCallback);

export default router;
