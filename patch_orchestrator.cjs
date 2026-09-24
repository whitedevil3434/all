const fs = require('fs');
const path = './src/engine/universal/ContextOrchestrator.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace status with type for CausalTimelineEvent
content = content.replace(/status: string }\[\];/g, "type: string }[];");
content = content.replace(/status: evt.status/g, "type: evt.type");

fs.writeFileSync(path, content);
console.log('Fixed ContextOrchestrator TS errors');
