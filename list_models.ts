import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = await ai.models.list();
  for await (const m of models) {
    if (m.name.includes('embed')) console.log(m.name, m.supportedGenerationMethods);
  }
}
test();
