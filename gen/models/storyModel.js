import mongoose from "mongoose";

const sceneSchema = new mongoose.Schema({
  sceneKey: String,
  text: String,
  image: String,
  genre: String,
  tone: String,
  audience: String,
  styleTags: [String], // optional: ["digital painting", "anime"]
  createdAt: { type: Date, default: Date.now },
});

export default function getStoryModel(userId, storyId) {
  const collectionName = `story_${storyId}`;
  return mongoose.connection.useDb(userId).model(collectionName, sceneSchema);
}
