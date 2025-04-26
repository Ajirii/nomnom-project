import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const allowedOrigins = [
  "https://nomnom-project.vercel.app",
  "http://localhost:5173",
];

/* ROUTE IMPORT */
import recipeRoutes from "./recipes/routes/recipes.routes";
import googleRoutes from "./login/auth.routes";
import questRoutes from "./quests/routes/quests.routes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json());
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow cross-origin resources
app.use(morgan("common"));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/recipes", recipeRoutes);
app.use("/api/login", googleRoutes);
app.use("/api/quest", questRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3001;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

/* SHUTDOWN */
process.on("SIGINT", async () => {
  console.log("SIGINT received: closing HTTP server and Prisma...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received: closing HTTP server and Prisma...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
