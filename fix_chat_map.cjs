const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /\{msg\.nodeIds\.map\(id => \{[\s\S]*?if \(!chatNodes\.has\(id\)\) return null;[\s\S]*?const node = graph\.nodes\[id\];[\s\S]*?if \(!node\) return null;/,
  `{msg.nodeIds.map(id => {
                            if (!chatNodes.has(id)) return null;
                            const node = graph.nodes[id];
                            if (!node) return null;
                            
                            // Check if this node has a parent that is ALSO in this same msg.nodeIds array
                            const edges = Object.values(graph.edges);
                            const hasParentInMsg = edges.some(e => e.targetId === id && msg.nodeIds.includes(e.sourceId));
                            if (hasParentInMsg) return null; // Let the parent render it recursively
`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
