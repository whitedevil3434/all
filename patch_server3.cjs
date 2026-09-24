const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/EXACTLY ONE \`semanticAction\`/g, 'EXACTLY ONE "semanticAction"');
fs.writeFileSync('server.ts', code);
