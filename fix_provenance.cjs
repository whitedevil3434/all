const fs = require('fs');
const path = './src/components/ProvenanceLedger.tsx';
let content = fs.readFileSync(path, 'utf8');

// The issue is rootNode is undefined, making the text "Root Want: "undefined" formed"
// Let's add a fallback or check why rootNode is undefined.
// `const rootNode = graph.nodes[nodeId];`
// If nodeId is not correct, we should use a generic fallback.

content = content.replace(
  `      desc: \`Root Want: "\${rootNode?.label}" formed\`,`,
  `      desc: \`Root Want: "\${rootNode?.label || 'Project Goal'}" formed\`,`
);

fs.writeFileSync(path, content);
console.log("Updated ProvenanceLedger to handle undefined root label.");
