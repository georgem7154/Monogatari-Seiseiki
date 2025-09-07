import express from "express";
import { isCleanPrompt } from "../utils/moderation.js";
import { generateImage } from "./imageGen.js";
import { saveStoryToDB } from "../config/db.js";

const imageRouter = express.Router();
imageRouter.post("/genimg", async (req, res) => {
  const { userId, storyId, genre, tone, audience, story } = req.body;

  if (!story || typeof story !== "object") {
    return res.status(400).json({ error: "Missing or invalid story object." });
  }

  const combinedText = Object.values(story).join(" ");
  console.log("🧪 Combined story text for moderation:", combinedText);

  if (!isCleanPrompt(combinedText)) {
    return res.status(400).json({
      error: "Story contains harmful or inappropriate content.",
    });
  }

  const imageMap = {};

  // ✅ Generate cover image first
  const coverPrompt = `
    Create a cinematic cover illustration for a ${genre} story.
    Tone: ${tone}. Audience: ${audience}.
    Title: ${storyId.replace(/-/g, " ")}
    Summary: ${combinedText.slice(0, 300)}...
  `.trim();

  imageMap["cover"] = await generateImage(coverPrompt, {
    userId,
    storyId,
    sceneKey: "cover",
  });

  // ✅ Generate scene images
  for (const [sceneKey, sceneText] of Object.entries(story)) {
    const enrichedPrompt = `
      Create an illustration for the following scene in a ${genre} story.
      Tone: ${tone}. Audience: ${audience}.
      Scene: ${sceneText}
    `.trim();

    imageMap[sceneKey] = await generateImage(enrichedPrompt, {
      userId,
      storyId,
      sceneKey,
    });
  }

  await saveStoryToDB(userId, storyId, story, imageMap, genre, tone, audience);

  // ✅ Final response including cover
  const response = {
    cover: {
      image: imageMap["cover"]
    }
  };

  for (const sceneKey of Object.keys(story)) {
    response[sceneKey] = {
      text: story[sceneKey],
      image: imageMap[sceneKey]
    };
  }

  res.json(response);
});

export default imageRouter;