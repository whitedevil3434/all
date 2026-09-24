const fs = require('fs');

const code = `
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json({ limit: "10mb" }));

// Lazy Google Gen AI helper
let aiClient = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// C-Link AI Composer & Living Orchestrator endpoint
app.post("/api/c-link-compose", async (req, res) => {
  const { prompt, currentReality } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }

  const systemInstruction = \`You are the C-Link Composer, a semantic reality engine.
You do NOT generate UI, workflows, or cards. You ONLY generate Semantic Actions that mutate the Canonical Reality Graph.

The user provides a command or request.
You must return a JSON object containing EXACTLY ONE "semanticAction" that represents the next logical step in reality.

Valid Semantic Actions:
1. CREATE_WANT
   - Use when the user states a new requirement (e.g. "আমার 50kg চাল দরকার").
   - payload: { title: "50kg Rice", quantity: 50, unit: "kg" }
2. DISCOVER_ACTOR
   - Use when you find someone who can fulfill a requirement (e.g. "Rahim 30kg দিতে পারবে").
   - targetActorName: "Rahim"
   - payload: { quantity: 30, unit: "kg" }
3. IDENTIFY_GAP
   - Use when a requirement is not fully covered (e.g. "20kg এখনও open").
   - payload: { title: "20kg still open", quantity: 20, unit: "kg" }
4. FIND_CANDIDATES
   - Use when searching for actors to fill a gap (e.g. "Find Karim and Mina").
   - payload: { candidates: [{name: "Karim", quantity: 20, unit: "kg"}, {name: "Mina", quantity: 15, unit: "kg"}] }
5. SHOW_NEXT
   - Use when the user asks what to do next after things are settled (e.g. "Show me what needs to happen").

CRITICAL:
- Return ONLY JSON.
- Format: { "semanticAction": { "type": "...", "targetActorName": "...", "payload": { ... } } }
\`;

  const contents = \`User request: "\${prompt}"\\n\\nCurrent Reality Objects: \${JSON.stringify(currentReality?.graph?.objects || [])}\`;

  try {
    const ai = getGenAI();
    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = result.text();
    if (!text) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err) {
    console.error("Gemini API error:", err);
    
    // Fallback logic
    if (process.env.OPENAI_API_KEY) {
      console.log("Attempting OpenAI Fallback...");
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL,
        });

        const completion = await openai.chat.completions.create({
          model: "auto",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: contents }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");
        return res.json(parsed);
      } catch (fallbackErr) {
        console.error("OpenAI Fallback error:", fallbackErr);
        return res.status(500).json({ error: fallbackErr.message || "Both Gemini and Fallback failed." });
      }
    }

    return res.status(500).json({ error: err.message || "An error occurred during AI processing." });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`C-Link Full-Stack Server running on port \${PORT}\`);
  });
}

start();
`;
fs.writeFileSync('server.ts', code);
