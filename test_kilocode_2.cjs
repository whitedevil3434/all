const { OpenAI } = require("openai");

async function test() {
  const kilocodeProvidedKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwia2lsb1VzZXJJZCI6ImMxMzE3N2QwLTAxY2MtNGIyZC1hZmU0LThhNTJkYzZmZDJjMCIsImFwaVRva2VuUGVwcGVyIjpudWxsLCJ2ZXJzaW9uIjozLCJpYXQiOjE3NzUxMTA5MDYsImV4cCI6MTkzMjc5MDkwNn0.PkPIbuWl53_P7PbWbZSjQ0t31AOJ-A_VvPHJUX1LEaw";
  
  const openai = new OpenAI({
    apiKey: kilocodeProvidedKey,
    baseURL: "https://api.kilo.ai/api/gateway",
  });

  const modelsToTest = ["google/gemini-3.5-flash-lite", "z-ai/glm-5.2:free"];
  
  for (const m of modelsToTest) {
    console.log("Testing with " + m + "...");
    try {
      const completion = await openai.chat.completions.create({
        model: m,
        messages: [{ role: "user", content: "Hi" }],
      });
      console.log(`Success! Response: ${completion.choices[0].message.content}`);
    } catch (err) {
      console.error(`Error with ${m}:`, err.message);
    }
  }
}
test();
