const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const hasParentInMsg = edges\.some\(e => e\.targetId === id && msg\.nodeIds\.includes\(e\.sourceId\)\);/,
  `const hasParentInMsg = edges.some(e => e.targetId === id && msg.nodeIds.includes(e.sourceId) && chatNodes.has(e.sourceId));`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
