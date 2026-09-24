const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  /"state": "POSSIBLE \| ASKING \| OFFERED \| COMMITTED \| EXECUTING \| VERIFYING \| RESOLVED \| FAILED"/g,
  `"state": "POSSIBLE | ASKING | OFFERED | PROPOSED | EXECUTING | VERIFYING | RESOLVED | FAILED"`
);

content = content.replace(
  /3\. If the user says "Rahim agreed to 20kg", output \{ "type": "UPDATE_STATE", "nodeId": "123", "state": "COMMITTED" \}\./,
  `3. If the user says "Rahim agreed to 20kg", output { "type": "UPDATE_STATE", "nodeId": "123", "state": "OFFERED" } (The Reality Firewall will intercept and process it to COMMITTED if authorized).`
);

fs.writeFileSync('server.ts', content);
