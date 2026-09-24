const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const snapshot = buildContextSnapshot(causal.state);\n    submitIntent(raw, snapshot);',
  '// buildContextSnapshot is now internal to submitIntent\n    submitIntent(raw);'
);
// Also remove the import of buildContextSnapshot just in case
content = content.replace(
  'import { buildContextSnapshot } from "../engine/universal/ContextOrchestrator";',
  ''
);

fs.writeFileSync(path, content);
console.log("LivingCausalSurface patched.");
