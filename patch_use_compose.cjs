const fs = require('fs');
const path = './src/engine/universal/useUniversalCompose.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace synchronous call with await
content = content.replace(
  'const contextSnapshot = buildContextSnapshot(prompt);',
  'const contextSnapshot = await buildContextSnapshot(prompt);'
);

fs.writeFileSync(path, content);
console.log("useUniversalCompose patched.");
