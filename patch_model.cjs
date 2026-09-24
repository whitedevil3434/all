const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Replace specific model with "auto" for the unified API
code = code.replace(/model: "gpt-4o-mini", \/\/ Fallback model or whatever the compatible endpoint supports/, 'model: "auto", // Automatically handled by unified proxy');

fs.writeFileSync('server.ts', code);
console.log('Model updated to auto');
