const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

// We'll write a cleaner function for objects.
const cleanerLogic = `
function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, cleanUndefined(v)])
    );
  }
  return obj;
}
`;

// Insert the helper function right before createDraftIntent
code = code.replace(
  "export async function createDraftIntent(",
  cleanerLogic + "\nexport async function createDraftIntent("
);

// Clean interpretation before assigning
code = code.replace(
  "    interpretation,\n    provenance: {",
  "    interpretation: cleanUndefined(interpretation),\n    provenance: {"
);

fs.writeFileSync('src/engine/firebase-engine.ts', code);
