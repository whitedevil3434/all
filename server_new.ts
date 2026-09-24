
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import { db } from "./src/lib/firebase";
import { collection, doc, writeBatch, serverTimestamp, getDoc } from "firebase/firestore";

dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json({ limit: "10mb" }));

// Lazy Google Gen AI helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
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


app.post("/api/embed", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Missing text" });
    return;
  }
  
  try {
    const ai = getGenAI();
    const result = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: text
    });
    // result.embeddings[0].values contains the vector array
    res.json({ embedding: result.embeddings[0].values });
  } catch (error: any) {
    console.error("Embed error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback semantic parser when external APIs are rate-limited or unavailable
function fallbackSemanticAction(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("50") || p.includes("চাল") || p.includes("rice") || p.includes("need") || p.includes("দরকার")) {
    return {
      response: "আপনার চাহিদা অনুযায়ী ৫০ কেজি চালের রিকোয়ারমেন্ট রিয়ালিটি সারফেসে যুক্ত করা হয়েছে।",
      transientObservation: "✦ Materializing requirement: 50kg Rice",
      semanticAction: {
        type: "CREATE_WANT",
        payload: { title: "50kg Rice", quantity: 50, unit: "kg" },
      },
    };
  }
  if (p.includes("rahim") || p.includes("30") || p.includes("রহিম")) {
    return {
      response: "রহিম ৩০ কেজি চাল সরবরাহ করতে পারবে - এই সক্ষমতা রিয়ালিটিতে যুক্ত করা হয়েছে।",
      transientObservation: "✦ Rahim capability discovered (30kg)",
      semanticAction: {
        type: "DISCOVER_ACTOR",
        targetActorName: "Rahim",
        payload: { quantity: 30, unit: "kg" },
      },
    };
  }
  if (p.includes("open") || p.includes("gap") || p.includes("20") || p.includes("ঘাটতি") || p.includes("বাকি")) {
    return {
      response: "চাহিদার বাকি ২০ কেজি এখনও খোলা রয়েছে - এটি একটি অমীমাংসিত ঘাটতি (GAP) হিসেবে চিহ্নিত করা হয়েছে।",
      transientObservation: "✦ Calculating gap: 20kg still open",
      semanticAction: {
        type: "IDENTIFY_GAP",
        payload: { title: "20kg still open", quantity: 20, unit: "kg" },
      },
    };
  }
  if (p.includes("karim") || p.includes("mina") || p.includes("candidate") || p.includes("find") || p.includes("করিম") || p.includes("মিনা") || p.includes("খোঁজ")) {
    return {
      response: "২০ কেজি ঘাটতি পূরণের জন্য করিম (২০ কেজি) ও মিনা (১৫ কেজি) কে সম্ভাব্য প্রার্থী হিসেবে সনাক্ত করা হয়েছে।",
      transientObservation: "✦ Found candidates: Karim (20kg) & Mina (15kg)",
      semanticAction: {
        type: "FIND_CANDIDATES",
        payload: {
          candidates: [
            { name: "Karim", quantity: 20, unit: "kg", state: "POSSIBLE", message: "Karim may cover 20kg" },
            { name: "Mina", quantity: 15, unit: "kg", state: "UNKNOWN", message: "Mina may cover 15kg" },
          ],
        },
      },
    };
  }
  if (p.includes("ask") || p.includes("জিজ্ঞেস") || p.includes("বল")) {
    return {
      response: "করিমকে ২০ কেজি চাল দেওয়ার জন্য অনুরোধ পাঠানো হয়েছে (Asking Karim...)।",
      transientObservation: "✦ Asking Karim for 20kg commitment",
      semanticAction: {
        type: "ASK_ACTOR",
        targetActorName: "Karim",
      },
    };
  }
  if (p.includes("accept") || p.includes("অ্যাকসেপ্ট") || p.includes("স্বীকার") || p.includes("agree")) {
    return {
      response: "করিমের ২০ কেজি সরবরাহ প্রস্তাব গ্রহণ করা হয়েছে এবং রিয়ালিটিতে কমিটমেন্ট লক করা হয়েছে। চাহিদা ১০০% কভার্ড।",
      transientObservation: "✓ Commitment secured: Karim covers 20kg",
      semanticAction: {
        type: "ACCEPT_COMMITMENT",
        targetActorName: "Karim",
      },
    };
  }
  if (p.includes("decline") || p.includes("বাতিল") || p.includes("বাদ") || p.includes("reject")) {
    return {
      response: "করিমের প্রস্তাব বাতিল করা হয়েছে। ২০ কেজি ঘাটতি পুনরায় উন্মুক্ত হয়েছে এবং বিকল্প সোর্সিং সক্রিয় করা হয়েছে।",
      transientObservation: "⚠️ Offer declined: 20kg gap reopened",
      semanticAction: {
        type: "DECLINE_COMMITMENT",
        targetActorName: "Karim",
      },
    };
  }
  if (p.includes("driver") || p.includes("ড্রাইভার") || p.includes("transport") || p.includes("তারিক") || p.includes("গাড়ি")) {
    return {
      response: "ড্রাইভার তারিক আল-আমিনকে পিকআপের জন্য শিডিউল করা হয়েছে (কাভার্ড ভ্যান, চার্জ ৳৮০০)। পরিবহন আনব্লক হয়েছে।",
      transientObservation: "✓ Driver Tariq assigned (৳800). Transport unblocked!",
      semanticAction: {
        type: "ASSIGN_DRIVER",
        payload: { driverName: "Tariq", cost: "৳ 800" },
      },
    };
  }
  if (p.includes("delivery") || p.includes("ডেলিভারি") || p.includes("পৌঁছে") || p.includes("office") || p.includes("রিসিভ")) {
    return {
      response: "৫০ কেজি চাল গুলশান অফিসে পৌঁছানো হয়েছে এবং সিকিউরিটি গেট ওয়েটব্রিজ স্লিপ ভেরিফাই করেছে। চাহিদা সম্পন্ন হয়েছে।",
      transientObservation: "🎉 Delivery verified! Requirement fully satisfied.",
      semanticAction: {
        type: "CONFIRM_DELIVERY",
      },
    };
  }
  if (p.includes("pay") || p.includes("পেমেন্ট") || p.includes("পরিশোধ") || p.includes("বিল") || p.includes("টাকা")) {
    return {
      response: "bKash Corporate গেটওয়ের মাধ্যমে ৳ ১২,৫০০ মোট বিল সরাসরি পরিশোধ সম্পন্ন করা হয়েছে। সমস্ত ডিপেন্ডেন্সি ক্লিয়ার।",
      transientObservation: "✓ Payment settled (৳12,500). All dependencies cleared.",
      semanticAction: {
        type: "PROCESS_PAYMENT",
      },
    };
  }
  if (p.includes("show") || p.includes("happen") || p.includes("next") || p.includes("দেখাও") || p.includes("কী হবে")) {
    return {
      response: "বর্তমানে সারফেসের ফোকাস বাকি অমীমাংসিত এক্সিকিউশন ও ট্র্যাকিংয়ের দিকে স্থানান্তরিত করা হয়েছে।",
      transientObservation: "✦ Focus shifted to unresolved execution",
      semanticAction: {
        type: "SHOW_NEXT",
      },
    };
  }
  return {
    response: `আমি আপনার বার্তা "${prompt}" গ্রহণ করেছি। আপনি কোনো চাহিদা জানাতে পারেন (যেমন: "আমার 50kg চাল দরকার"), অথবা কারো সরবরাহ ক্ষমতা জানাতে পারেন (যেমন: "Rahim 30kg দিতে পারবে")।`,
    transientObservation: `✦ Interpreted intent: ${prompt.slice(0, 30)}`,
    semanticAction: {
      type: "CREATE_WANT",
      payload: { title: prompt.slice(0, 35), quantity: 1, unit: "unit" },
    },
  };
}

// C-Link AI Composer & Living Orchestrator endpoint
app.post("/api/c-link-compose", async (req, res) => {
  const { prompt, currentReality } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }

  const systemInstruction = `You are the C-Link Composer, a semantic reality engine.
You do NOT generate UI, workflows, or cards. You translate user requests into conversational responses AND exact Semantic Actions.

The user provides a command or request in Bengali or English.
You MUST return a JSON object with:
1. "response": A conversational, natural language explanation in the user's language (Bengali or English) describing what you understand.
2. "transientObservation": A short punchy status with ✦ (e.g. "✦ Interpreting requirement: 50kg Rice").
3. "semanticAction": An object containing "type", "targetActorName" (optional), and "payload" (optional).

Valid Semantic Actions:
1. PROPOSE_NEED
   - Use when the user states a new requirement, intent, or need (e.g. "আমার 50kg চাল দরকার", "I need to plan a wedding").
   - This generates a Proposal of Intent, NOT a direct database mutation.
   - payload: { title: "Title", description: "Full description", quantity: 50, unit: "kg" }
2. PROPOSE_OFFER
   - Use when the user states someone can fulfill a need or provides a capability (e.g. "Rahim 50kg দিতে পারবে").
   - This generates a Proposal of Capability and Actor.
   - targetActorName: "Rahim"
   - payload: { actorName: "Rahim", capabilityDescription: "Supply 50kg rice", quantity: 50, unit: "kg" }
4. IDENTIFY_GAP
   - Use when a requirement is not fully covered (e.g. "20kg এখনও open").
   - payload: { title: "20kg still open", quantity: 20, unit: "kg" }
5. FIND_CANDIDATES
   - Use when searching for actors to fill a gap (e.g. "Find Karim and Mina").
   - payload: { candidates: [{name: "Karim", quantity: 20, unit: "kg", state: "POSSIBLE"}, {name: "Mina", quantity: 15, unit: "kg", state: "UNKNOWN"}] }
6. ASK_ACTOR
   - Use to ask an actor for commitment (e.g. "Karim কে জিজ্ঞেস করো").
   - targetActorName: "Karim"
7. ACCEPT_COMMITMENT
   - Use when accepting an offer (e.g. "Accept Karim").
   - targetActorName: "Karim"
8. PROVIDE_EVIDENCE
   - Use when someone provides proof of work (e.g. "Karim delivered it", "Here is the receipt").
   - targetActorName: "Karim" (if known)
   - payload: { description: "Receipt / Proof description" }
9. RESOLVE_WORK
   - Use when marking the work as completely done (e.g. "All done", "Finish this").
10. SHOW_NEXT
   - Use when asking what to do next.
11. CONVERSATION
    - Use when the user asks a general question, says 'Hi', or asks about progress/usage.

CRITICAL:
- Return ONLY JSON.
- Format: { "response": "...", "transientObservation": "...", "semanticAction": { "type": "...", "targetActorName": "...", "payload": { ... } } }`;

  const contents = `User request: "${prompt}"\n\nCurrent Reality Objects: ${JSON.stringify(currentReality?.graph?.objects || [])}`;

  // 1. Try Gemini with modern models: gemini-2.0-flash
  const geminiModels = ["gemini-2.0-flash"];
  for (const modelName of geminiModels) {
    try {
      const ai = getGenAI();
      const result = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const rawText = result.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed.response || parsed.semanticAction) {
          return res.json({
            response: parsed.response || "রিয়ালিটি আপডেট সম্পন্ন হয়েছে।",
            transientObservation: parsed.transientObservation || "✦ Reality updated",
            semanticAction: parsed.semanticAction,
          });
        }
      }
    } catch {
      // Gracefully try next model or fallback without throwing noisy console errors
    }
  }

  // 2. Try OpenAI Fallback ONLY if a valid real key is provided
  const kilocodeProvidedKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwia2lsb1VzZXJJZCI6ImMxMzE3N2QwLTAxY2MtNGIyZC1hZmU0LThhNTJkYzZmZDJjMCIsImFwaVRva2VuUGVwcGVyIjpudWxsLCJ2ZXJzaW9uIjozLCJpYXQiOjE3NzUxMTA5MDYsImV4cCI6MTkzMjc5MDkwNn0.PkPIbuWl53_P7PbWbZSjQ0t31AOJ-A_VvPHJUX1LEaw";
  const openaiKey = process.env.OPENAI_API_KEY || kilocodeProvidedKey;
  
  const isRealOpenAIKey =
    openaiKey &&
    !openaiKey.includes("YOUR_") &&
    openaiKey.trim().length > 20;

  if (isRealOpenAIKey) {
    try {
      // Determine correct base URL for Kilocode JWT vs standard OpenAI
      const defaultBaseUrl = openaiKey.startsWith("eyJ") ? "https://api.kilo.ai/api/gateway" : "https://api.openai.com/v1";
      const openai = new OpenAI({
        apiKey: openaiKey,
        baseURL: process.env.OPENAI_BASE_URL || defaultBaseUrl,
      });

      const completion = await openai.chat.completions.create({
        model: openaiKey.startsWith("eyJ") ? "openrouter/free" : "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: contents },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const content = completion.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.response || parsed.semanticAction) {
          return res.json({
            response: parsed.response || "রিয়ালিটি আপডেট সম্পন্ন হয়েছে।",
            transientObservation: parsed.transientObservation || "✦ Reality updated",
            semanticAction: parsed.semanticAction,
          });
        }
      }
    } catch {
      // Graceful fallback to deterministic engine
    }
  }

  // 3. Resilient semantic fallback: Always succeed with rich response and valid SemanticAction
  return res.json({
      response: "API is currently unavailable. But C-Link recorded your semantic intent.",
      transientObservation: "✦ Intent recorded offline",
      semanticAction: { type: "UNKNOWN" }
    });
});

// Phase 1 + 2: Universal Context + Outcome Discovery Engine Endpoint
app.post("/api/universal-compose", async (req, res) => {
  const { prompt, contextSnapshot } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }

  const systemInstruction = `You are the C-Link Outcome Reasoner, a core component of the Universal Reality Coordination Surface.
Your job is to output a "Causal Proposal" (OutcomeHypothesis) based on the Actor's intent.

The user provides a command or request in Bengali or English.
You are given a Context Snapshot representing the current state of the C-Link reality graph (nodes like WANT, DEPENDENCY, GAP, ACTOR).

You MUST return a JSON object with the following schema:
{
  "intentId": "auto_generated",
  "inferredMeaning": "A conversational explanation of what you understood.",
  "mutations": [
    { "type": "UPDATE_STATE", "nodeId": "string (MUST MATCH AN ID FROM CONTEXT)", "state": "POSSIBLE | ASKING | OFFERED | PROPOSED | EXECUTING | VERIFYING | RESOLVED | FAILED", "rationale": "Reason for update" },
    { "type": "ADD_NODE", "nodeId": "parent_node_id", "nodeType": "DEPENDENCY | GAP | ACTOR", "label": "string", "rationale": "string" }
  ],
  "proposedDependencies": [
    { "label": "string", "rationale": "string", "contextualDetails": "string", "clarificationQuestions": ["question"], "confidence": number }
  ],
  "unknowns": ["string"],
  "actionOptions": [
    { "label": "string", "actionType": "string", "payload": {} }
  ]
}

CRITICAL RULES FOR "mutations":
1. If the user is responding to an existing GAP, DEPENDENCY, or ACTOR (e.g. saying "Ask him", "I agree", "It's done", "He can do 20kg"), you MUST use the "mutations" array to update the state of the relevant node from the Context Snapshot.
2. For example, if the context has an ACTOR node for "Rahim" in state "POSSIBLE" (nodeId: 123), and the user says "Ask Rahim", output a mutation: { "type": "UPDATE_STATE", "nodeId": "123", "state": "ASKING" }.
3. If the user says "Rahim agreed to 20kg", output { "type": "UPDATE_STATE", "nodeId": "123", "state": "OFFERED" } (The Reality Firewall will intercept and process it to COMMITTED if authorized).
4. Only output new "proposedDependencies" if the user is stating a completely new WANT or a new complex requirement that isn't in the graph yet.
5. If you output "mutations", you may leave "proposedDependencies" and "unknowns" empty.

Other Rules:
- "proposedDependencies" are short, scannable tags (e.g. "[ ৳5,000 Due ]" or "[ 50kg Rice ]").
- "unknowns" are global questions.
- Always return strictly valid JSON matching the schema.
`;

  const contents = `User Request: "${prompt}"
Context Snapshot:
${JSON.stringify(contextSnapshot || { error: "No context provided" }, null, 2)}`;

  // Try to use User's Proxy API First (if it's accessible via environment variable or localhost port forwarding)
  try {
    const proxyUrl = "https://api.kilo.ai/api/gateway/v1/chat/completions";
    console.log(`Calling proxy API for C-Link Universal Compose at ${proxyUrl}...`);
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwia2lsb1VzZXJJZCI6ImMxMzE3N2QwLTAxY2MtNGIyZC1hZmU0LThhNTJkYzZmZDJjMCIsImFwaVRva2VuUGVwcGVyIjpudWxsLCJ2ZXJzaW9uIjozLCJpYXQiOjE3NzUxMTA5MDYsImV4cCI6MTkzMjc5MDkwNn0.PkPIbuWl53_P7PbWbZSjQ0t31AOJ-A_VvPHJUX1LEa"
      },
      body: JSON.stringify({
        model: "kilo-auto/free",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: contents }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (rawContent) {
        return res.json(JSON.parse(rawContent));
      }
    } else {
      console.warn("Local proxy API failed, falling back to Gemini...");
    }
  } catch (proxyError: any) {
    console.error("Local proxy API error (Likely because localhost is not accessible from the cloud):", proxyError.message);
  }

  // Fallback to Gemini if Proxy fails
  console.log("Falling back to Gemini API...");
  const geminiModels = ["gemini-2.0-flash"];
  for (const modelName of geminiModels) {
    try {
      const ai = getGenAI();
      const result = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const rawText = result.text;
      if (rawText) {
        return res.json(JSON.parse(rawText));
      }
    } catch (e: any) {
      console.warn(`Gemini model ${modelName} failed:`, e.message);
    }
  }

  // Fallback dummy proposal if API fails
  res.json({
    intentId: "fallback_" + Date.now(),
    inferredMeaning: "API limit reached. Falling back to simple heuristic proposal.",
    proposedDependencies: [
      { label: "Review Intent", rationale: "We need to understand the intent better.", contextualDetails: "This is a placeholder for detailed AI context.", clarificationQuestions: ["What exactly are you trying to build?"], confidence: 0.9 },
      { label: "Find Capabilities", rationale: "We need to find who can do this.", contextualDetails: "This is a placeholder.", clarificationQuestions: [], confidence: 0.8 }
    ],
    unknowns: ["The exact timeline", "The budget"],
    recommendedAction: {
      type: "CLARIFY_INTENT",
      targetLabel: "Intent details"
    }
  });
});

app.post("/api/commands", require("./server-commands.ts").handleCommand);

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
    console.log(`C-Link Full-Stack Server running on port ${PORT}`);
  });
}

start();
