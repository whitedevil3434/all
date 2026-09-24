const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  'model: openaiKey.startsWith("eyJ") ? "auto" : "gpt-4o-mini",',
  'model: openaiKey.startsWith("eyJ") ? "openrouter/free" : "gpt-4o-mini",'
);

fs.writeFileSync('server.ts', code);
