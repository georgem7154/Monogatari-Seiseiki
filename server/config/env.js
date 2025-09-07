import { config } from "dotenv";
config({ path: ".env" });
export const {
  PORT,
  MONGO_URL,
  POLYGON1,
  POLYGON2,
  ALPACA_SECRET,
  ALPACA,
  JWT_SECRET,
  expiresIn,
  NODE_ENV
} = process.env;
