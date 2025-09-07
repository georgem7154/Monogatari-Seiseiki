import express from "express";
import { isCleanPrompt } from "../utils/moderation.js";
import { generateImage } from "./imageGen.js";
import { saveStoryToDB } from "../config/db.js";

const imageRouter = express.Router();

imageRouter.post("/genimg", async (req, res) => {
  const { userId, storyId, genre, tone, audience, story } = req.body;

  if (
    !story ||
    typeof story !== "object" ||
    !story.title ||
    !Object.keys(story).some((key) => key.startsWith("scene"))
  ) {
    return res.status(400).json({ error: "Missing or invalid story structure." });
  }

  const combinedText = Object.values(story)
    .filter((v) => typeof v === "string")
    .join(" ");
  console.log("🧪 Combined story text for moderation:", combinedText);

  if (!isCleanPrompt(combinedText)) {
    return res.status(400).json({
      error: "Story contains harmful or inappropriate content.",
    });
  }

  const imageMap = {};

  // ✅ Generate cover image using title and summary
  const coverPrompt = `
    Create a cinematic cover illustration for a ${genre} story.
    Tone: ${tone}. Audience: ${audience}.
    Title: ${story.title}
    Summary: ${combinedText.slice(0, 300)}...
  `.trim();

  imageMap["cover"] = await generateImage(coverPrompt, {
    userId,
    storyId,
    sceneKey: "cover",
  });

  // ✅ Generate scene images
  for (const [sceneKey, sceneText] of Object.entries(story)) {
    if (!sceneKey.startsWith("scene")) continue;

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

  // ✅ Save to DB with title and cover in meta doc
  await saveStoryToDB(userId, storyId, story, imageMap, genre, tone, audience);

  // ✅ Final response
  const response = {
    title: story.title,
    cover: {
      image: imageMap["cover"]
    }
  };

  for (const sceneKey of Object.keys(story)) {
    if (!sceneKey.startsWith("scene")) continue;

    response[sceneKey] = {
      text: story[sceneKey],
      image: imageMap[sceneKey]
    };
  }

  res.json(response);
});

export default imageRouter;