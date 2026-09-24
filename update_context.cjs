const fs = require('fs');
let content = fs.readFileSync('src/engine/universal/ContextOrchestrator.ts', 'utf-8');

// The original only included UNKNOWN | POSSIBLE | ASKING, we should include everything that's not RESOLVED maybe? Or the whole graph? 
// Let's include the whole graph's nodes for maximum context for mutation.
content = content.replace(
  /const relevantNodes = nodes.filter\(n =>\s*n.state === 'UNKNOWN' \|\| n.state === 'POSSIBLE' \|\| n.state === 'ASKING'\s*\);/,
  `const relevantNodes = nodes; // Provide all nodes for potential mutation target`
);

fs.writeFileSync('src/engine/universal/ContextOrchestrator.ts', content);
