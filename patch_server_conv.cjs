const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "9. SHOW_NEXT\n   - Use when asking what to do next.",
  "9. SHOW_NEXT\n   - Use when asking what to do next.\n10. CONVERSATION\n    - Use when the user asks a general question, says 'Hi', or asks about progress/usage (e.g. 'how do I use this?'). No reality mutation occurs."
);

fs.writeFileSync('server.ts', code);
