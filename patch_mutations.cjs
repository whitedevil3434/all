const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Don't push UPDATE_STATE nodes to newlyCreatedNodeIds
content = content.replace(
  /RealityEngine\.updateNode\(mut\.nodeId, \{ state: mut\.state as any \}\);\s*newlyCreatedNodeIds\.push\(mut\.nodeId\); \/\/ Add to chat/g,
  `RealityEngine.updateNode(mut.nodeId, { state: mut.state as any });
              // DO NOT add to newlyCreatedNodeIds to avoid pulling existing nodes off the board`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
