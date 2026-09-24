import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.embedContent({
      model: "embedding-001",
      contents: "hello world"
    });
    console.log("001 success:", !!res.embeddings);
  } catch(e) {
    console.log("001 error:", e.message);
  }
}
test();
