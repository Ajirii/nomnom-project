"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipes_routes_1 = __importDefault(require("./routes/recipes.routes"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/recipes', recipes_routes_1.default);
app.get('/', (req, res) => {
    res.send({ 'res': 'Hello World!' });
});
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
