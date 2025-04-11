"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipes_controller_1 = require("./recipes.controller");
const router = express_1.default.Router();
router.get('/', recipes_controller_1.fetchRecipe);
exports.default = router;
