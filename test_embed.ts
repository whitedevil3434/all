import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: "hello world"
    });
    console.log("004 success:", !!res.embeddings);
  } catch(e) {
    console.log("004 error:", e.message);
  }
}
test();
