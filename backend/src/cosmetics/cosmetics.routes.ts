import { Router } from "express";
import { getAllCosmetics } from "./cosmetics.controller";

const router = Router();

router.get("/", getAllCosmetics);

export default router;
