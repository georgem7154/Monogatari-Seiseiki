import express from "express";
import mongoose from "mongoose";
import publicStorySchema from "../models/publicStorySchema.js";

const router = express.Router();

router.post("/publishstory/:userId/:storyId", async (req, res) => {
  const { userId, storyId } = req.params;

  try {
    // 🔹 Connect to user's DB and fetch story
    const userDb = mongoose.connection.useDb(userId);
    const StoryModel = userDb.model(`story_${storyId}`, new mongoose.Schema({}, { strict: false }));
    const scenes = await StoryModel.find();

    if (!scenes || scenes.length === 0) {
      return res.status(404).json({ error: "Story not found or empty" });
    }

    // 🔹 Connect to public DB and check for duplicates
    const publicDb = mongoose.connection.useDb("public");
    const PublicModel = publicDb.model("public_stories", publicStorySchema);

    const existing = await PublicModel.findOne({ storyId });
    if (existing) {
      return res.status(409).json({ error: "Story already published" });
    }

    // 🔹 Publish to public DB
    await PublicModel.create({
      storyId,
      userId,
      publishedAt: new Date(),
      scenes,
    });

    res.json({ message: "✅ Story published successfully" });
  } catch (err) {
    console.error("❌ Error publishing story:", err);
    res.status(500).json({ error: "Failed to publish story" });
  }
});

export default router;