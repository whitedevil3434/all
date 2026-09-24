const fs = require('fs');
const path = './server.ts';
let content = fs.readFileSync(path, 'utf8');

const embedRoute = `
app.post("/api/embed", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Missing text" });
    return;
  }
  
  try {
    const ai = getGenAI();
    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text
    });
    // result.embeddings[0].values contains the vector array
    res.json({ embedding: result.embeddings[0].values });
  } catch (error: any) {
    console.error("Embed error:", error);
    res.status(500).json({ error: error.message });
  }
});
`;

if (!content.includes('/api/embed')) {
  content = content.replace('// Fallback semantic parser', embedRoute + '\n// Fallback semantic parser');
  fs.writeFileSync(path, content);
  console.log("Embed route added.");
} else {
  console.log("Already present.");
}
