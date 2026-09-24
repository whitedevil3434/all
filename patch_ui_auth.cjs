const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /RealityEngine\.updateNode\(node\.id, \{ state: 'COMMITTED' \}\);/g,
  `RealityEngine.updateNode(node.id, { state: 'COMMITTED' }, true);`
);

content = content.replace(
  /RealityEngine\.updateNode\(parentEdge\.sourceId, \{ state: 'COMMITTED' \}\);/g,
  `RealityEngine.updateNode(parentEdge.sourceId, { state: 'COMMITTED' }, true);`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
