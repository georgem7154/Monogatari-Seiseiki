import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { PORT } from "./config/env.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import "express-async-errors";
import apiRoute from "./routes/apiCoreRoute.js";
import errorHandlerMiddleware from "./middleware/errorhandlermiddleware.js";
import cookieParser from "cookie-parser";
const app = express();
connectDB();
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin); // Allow all origins
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", apiRoute);
app.use("/user", userRoutes);

app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(errorHandlerMiddleware);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(5000, "0.0.0.0", () => {
  // console.log(`Server is running on port ${PORT}`);
});
