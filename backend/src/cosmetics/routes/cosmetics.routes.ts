import express from "express";
import { authenticateJWT } from "../../middleware/jwt";
import {
  fetchAllCosmetics,
  buyCosmetic,
  fetchCosmeticById,
  fetchCostmeticsByUser,
  equipCosmetic,
} from "../controllers/cosmetics.controller";

const router = express.Router();

router.get("/", fetchAllCosmetics);
router.post("/user/buy/", buyCosmetic);
router.get("/user/:id", fetchCostmeticsByUser);
router.get("/:id", fetchCosmeticById);
router.post("/use/equip", authenticateJWT, equipCosmetic);

export default router;
