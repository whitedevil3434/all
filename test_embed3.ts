import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: "hello world"
    });
    console.log("gemini-embedding-2 success:", !!res.embeddings);
  } catch(e) {
    console.log("error:", e.message);
  }
}
test();
