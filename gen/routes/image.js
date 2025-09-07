import express from "express";
import { isCleanPrompt } from "../utils/moderation.js";
import { generateImage } from "./imageGen.js";
import { saveStoryToDB } from "../config/db.js";

const imageRouter = express.Router();

imageRouter.post("/genimg", async (req, res) => {
  const { userId, storyId, genre, tone, audience, story } = req.body;
  const errors = [];

  // 🔍 Validate basic fields
  if (!userId || typeof userId !== "string") errors.push("Missing or invalid userId.");
  if (!storyId || typeof storyId !== "string") errors.push("Missing or invalid storyId.");
  if (!genre || typeof genre !== "string") errors.push("Missing or invalid genre.");
  if (!tone || typeof tone !== "string") errors.push("Missing or invalid tone.");
  if (!audience || typeof audience !== "string") errors.push("Missing or invalid audience.");

  // 🔍 Validate story object
  if (!story || typeof story !== "object") {
    errors.push("Missing or invalid story object.");
  } else {
    if (!story.title || typeof story.title !== "string" || !story.title.trim()) {
      errors.push("Missing or invalid story title.");
    }

    const sceneKeys = Object.keys(story).filter((key) => key.startsWith("scene"));
    if (sceneKeys.length === 0) {
      errors.push("No scenes found in story.");
    } else {
      sceneKeys.forEach((key) => {
        const text = story[key];
        if (!text || typeof text !== "string" || text.trim().length < 10) {
          errors.push(`Scene "${key}" is too short or missing.`);
        }
      });
    }
  }

  // 🚫 Return if any validation errors
  if (errors.length > 0) {
    console.warn("⚠️ Validation errors:", errors);
    return res.status(400).json({ error: errors.join(" ") });
  }

  // 🧪 Combine story text for moderation
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

  // 🎨 Generate cover image
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

  // 🎨 Generate scene images
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

  // 💾 Save to DB
  await saveStoryToDB(userId, storyId, story, imageMap, genre, tone, audience);

  // 📦 Final response
  const response = {
    title: story.title,
    cover: { image: imageMap["cover"] },
  };

  for (const sceneKey of Object.keys(story)) {
    if (!sceneKey.startsWith("scene")) continue;
    response[sceneKey] = {
      text: story[sceneKey],
      image: imageMap[sceneKey],
    };
  }

  res.json(response);
});

export default imageRouter;