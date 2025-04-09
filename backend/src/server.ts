import express from "express";
import dotenv from "dotenv";

/* ROUTE IMPORT */
import recipeRoutes from "./routes/recipes.routes";
import googleRoutes from "./routes/google.routes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/recipes", recipeRoutes);
app.use("/api/google", googleRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
