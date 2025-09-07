import express from "express";
import mongoose from "mongoose";
import publicStorySchema from "../models/publicStorySchema.js";

const router = express.Router();

router.get("/publicstories", async (req, res) => {
  try {
    const publicDb = mongoose.connection.useDb("public");
    const PublicModel = publicDb.model("public_stories", publicStorySchema);

    const stories = await PublicModel.find().sort({ publishedAt: -1 });
    res.json(stories);
  } catch (err) {
    console.error("❌ Error fetching public stories:", err);
    res.status(500).json({ error: "Failed to load public stories" });
  }
});

export default router;