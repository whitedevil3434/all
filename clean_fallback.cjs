const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// We will remove fallbackSemanticAction entirely
// and replace its usage with a generic fallback response in the /api/c-link-compose endpoint.

const oldFunctionRegex = /function fallbackSemanticAction[\s\S]*?return \{\s*response: \`আমি আপনার বার্তা[\s\S]*?\} \/\/\s*C-Link AI Composer & Living Orchestrator endpoint/m;

const replacement = `// C-Link AI Composer & Living Orchestrator endpoint`;
content = content.replace(oldFunctionRegex, replacement);

content = content.replace(/const fallback = fallbackSemanticAction\(prompt\);\s*return res\.json\(fallback\);/, `return res.json({
      response: "API is currently unavailable. But C-Link recorded your semantic intent.",
      transientObservation: "✦ Intent recorded offline",
      semanticAction: { type: "UNKNOWN" }
    });`);

fs.writeFileSync('server.ts', content);
