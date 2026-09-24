const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

code = code.replace(
  "    authInfo: {\n      userId: auth.currentUser?.uid,\n      email: auth.currentUser?.email,\n    },",
  "    authInfo: {\n      userId: GUEST_UID,\n      email: 'guest@example.com',\n    },"
);

fs.writeFileSync('src/engine/firebase-engine.ts', code);
