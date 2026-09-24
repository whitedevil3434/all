const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The try block starts at line 49.
// "try {" -> "const systemInstruction = ... try {"

// Let's replace the whole try catch structure
// Actually, it's easier to just move `try {` down.
// Wait, `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });` is also inside.

code = code.replace("  try {", "  let systemInstruction = '';\n  let contents = '';\n  try {");
code = code.replace("const systemInstruction =", "systemInstruction =");
code = code.replace("const contents =", "contents =");

fs.writeFileSync('server.ts', code);
console.log("Scope fixed");
