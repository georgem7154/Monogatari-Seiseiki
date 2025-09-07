import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import storyRouter from "./routes/story.js";
import { MONGO_URI } from "./config/env.js";
import imageRouter from "./routes/image.js";
import getstoryRouter from "./routes/getstory.js";
import cors from "cors";

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use("/api", storyRouter);
app.use("/api", imageRouter);
app.use("/api", getstoryRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
