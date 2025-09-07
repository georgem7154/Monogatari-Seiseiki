import express from "express";
import getStoryModel from "../models/storyModel.js";

const getstoryRouter = express.Router();

getstoryRouter.get("/getstory/:userId/:storyId", async (req, res) => {
  const { userId, storyId } = req.params;

  try {
    const Story = getStoryModel(userId, storyId);
    const scenes = await Story.find({}).sort({ sceneKey: 1 });

    if (!scenes || scenes.length === 0) {
      return res.status(404).json({ error: "No scenes found for this story." });
    }

    const response = {};
    for (const scene of scenes) {
      response[scene.sceneKey] = {
        text: scene.text,
        image: scene.image
      };
    }

    res.json(response);
  } catch (err) {
    console.error("❌ Error retrieving story:", err);
    res.status(500).json({ error: "Failed to retrieve story." });
  }
});

export default getstoryRouter;