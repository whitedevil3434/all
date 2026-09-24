const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "statusText: actor.status\n             });",
  "statusText: actor.status,\n               actions: actor.status === 'ASKING' ? ['Accept commitment', 'Reject'] : (actor.status === 'COMMITTED' ? ['Provide evidence'] : ['Ask for commitment'])\n             });"
);

fs.writeFileSync('src/App.tsx', code);
