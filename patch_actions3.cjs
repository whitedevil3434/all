const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "statusText: gap.status\n             });",
  "statusText: gap.status,\n               actions: ['Find candidates for this gap']\n             });"
);

fs.writeFileSync('src/App.tsx', code);
