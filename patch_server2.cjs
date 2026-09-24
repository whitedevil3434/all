const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// The backticks inside the template string caused an error in server.ts
code = code.replace("EXACTLY ONE \\`semanticAction\\` that represents", "EXACTLY ONE semanticAction that represents");
fs.writeFileSync('server.ts', code);
