const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes("import { sendCommand }")) {
   code = code.replace("import { subscribeToWorkNeeds", "import { sendCommand } from './lib/api';\nimport { subscribeToWorkNeeds");
}

code = code.replace(/const res = await fetch\('\/api\/commands', \{ method: 'POST', headers: \{ 'Content-Type': 'application\/json' \}, body: JSON.stringify\(\{ command: (\{[^}]+\}) \}\) \}\);/g, "const res = await sendCommand($1);");

// Multi-line fetch replacement:
//       await fetch('/api/commands', {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/json' },
//          body: JSON.stringify({
//             command: { ... }
//          })
//       });
code = code.replace(/await fetch\('\/api\/commands',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(\{\s*command:\s*(\{[\s\S]*?\})\s*\}\)\s*\}\);/g, "await sendCommand($1);");

// Wait, the inner object inside `JSON.stringify({ command: { type: 'REQUEST_COMMITMENT', ... } })` could be multiline.
// A regex to match balanced brackets is hard. I'll just use a safer regex for the multiline cases.

fs.writeFileSync('src/App.tsx', code);
