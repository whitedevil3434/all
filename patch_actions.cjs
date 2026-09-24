const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "details: intent.deadline ? [`Deadline: ${intent.deadline}`, `Location: ${intent.location || 'Unknown'}`] : undefined\n          };",
  "details: intent.deadline ? [`Deadline: ${intent.deadline}`, `Location: ${intent.location || 'Unknown'}`] : undefined,\n            actions: ['Find who can do this']\n          };"
);

fs.writeFileSync('src/App.tsx', code);
