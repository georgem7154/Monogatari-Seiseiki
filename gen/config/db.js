import getStoryModel from "../models/storyModel.js";

export async function saveStoryToDB(userId, storyId, storyJson, imageMap, genre, tone, audience) {
  const Story = getStoryModel(userId, storyId);

  const entries = Object.entries(storyJson).map(([key, text]) => ({
    sceneKey: key,
    text,
    image: imageMap[key] || null,
    genre,
    tone,
    audience
  }));

  await Story.insertMany(entries);
}