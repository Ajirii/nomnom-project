import express from "express";
import { authenticateJWT } from "../../middleware/jwt";
import {
  fetchAllCosmetics,
  buyCosmetic,
  fetchCosmeticById,
  fetchCostmeticsByUser,
} from "../controllers/cosmetics.controller";

const router = express.Router();

router.get("/", fetchAllCosmetics);
router.post("/user/buy/", buyCosmetic);
router.get("/user/:id", fetchCostmeticsByUser);
router.get("/:id", fetchCosmeticById);
export default router;
