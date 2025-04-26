import { Router } from "express";
import { getAllCosmetics, getCosmeticById } from "./cosmetics.controller";

const router = Router();

router.get("/", getAllCosmetics);
router.get("/:id", getCosmeticById);

export default router;
