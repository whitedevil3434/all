const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// There is a slight logic issue here. The AI responds and mutates a node, we should ALSO append the mutated node ID to the msg.nodeIds so it shows up in the chat!
content = content.replace(
  /if \(mut\.type === 'UPDATE_STATE' && mut\.nodeId\) \{[\s\S]*?if \(RealityEngine\.getGraph\(\)\.nodes\[mut\.nodeId\]\) \{[\s\S]*?RealityEngine\.updateNode\(mut\.nodeId, \{ state: mut\.state as any \}\);[\s\S]*?\}[\s\S]*?\} else if \(mut\.type === 'ADD_NODE' && mut\.nodeId\) \{/,
  `if (mut.type === 'UPDATE_STATE' && mut.nodeId) {
            if (RealityEngine.getGraph().nodes[mut.nodeId]) {
              RealityEngine.updateNode(mut.nodeId, { state: mut.state as any });
              newlyCreatedNodeIds.push(mut.nodeId); // Add to chat
            }
          } else if (mut.type === 'ADD_NODE' && mut.nodeId) {`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
