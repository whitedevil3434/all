const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Filter board nodes in main render
content = content.replace(
  /const projectedRoots = \[\];[\s\S]*?projectedRoots = Array\.from\(new Map\(projectedRoots\.map\(n => \[n\.id, n\]\)\)\)\.values\(\);\s*\}/,
  `let projectedRoots = [];
  if (currentProjection === 'owner') {
    projectedRoots = nodes.filter(n => n.type === 'WANT');
  } else {
    const actorEdges = Object.values(graph.edges).filter(e => e.targetId === currentProjection);
    const parentDepIds = actorEdges.map(e => e.sourceId);
    projectedRoots = parentDepIds.map(id => graph.nodes[id]).filter(Boolean);
    projectedRoots = Array.from(new Map(projectedRoots.map(n => [n.id, n])).values());
  }
  const boardRoots = projectedRoots.filter(r => !chatNodes.has(r.id));`
);

content = content.replace(
  /\{projectedRoots\.map\(root => \(/,
  `{boardRoots.map(root => (`
);

// Add chatNodes to NodeRenderer props
content = content.replace(
  /function NodeRenderer\(\{ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, currentFrontierId \}: \{/,
  `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, currentFrontierId, chatNodes, onLongPress }: {
  chatNodes?: Set<string>;
  onLongPress?: (id: string) => void;`
);

// Use it inside NodeRenderer to filter children
content = content.replace(
  /children = Array\.from\(new Map\(children\.map\(n => \[n\.id, n\]\)\)\)\.values\(\);/,
  `children = Array.from(new Map(children.map(n => [n.id, n])).values());
  if (chatNodes) {
    children = children.filter(c => !chatNodes.has(c.id));
  }`
);

// Pass it down recursively
content = content.replace(
  /<NodeRenderer key=\{child\.id\} node=\{child\} activeContextId=\{activeContextId\} setActiveContextId=\{setActiveContextId\} currentProjection=\{currentProjection\} onOpenProvenance=\{onOpenProvenance\} currentFrontierId=\{currentFrontierId\} \/>/g,
  `<NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} currentFrontierId={currentFrontierId} chatNodes={chatNodes} onLongPress={onLongPress} />`
);

// Update root NodeRenderer calls
content = content.replace(
  /<NodeRenderer key=\{root\.id\} node=\{root\} activeContextId=\{activeContextId\} setActiveContextId=\{setActiveContextId\} currentProjection=\{currentProjection\} onOpenProvenance=\{setProvenanceNodeId\} currentFrontierId=\{currentFrontierId\} \/>/g,
  `<NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={setProvenanceNodeId} currentFrontierId={currentFrontierId} chatNodes={chatNodes} />`
);

// Add layoutId to NodeRenderer wrapper and add pointer down logic
content = content.replace(
  /<div className=\{\`node-wrapper relative \$\{isExpanded \|\| activeContextId === node\.id \|\| node\.state === 'ASKING' \|\| node\.state === 'EXECUTING' \? 'node-is-focused z-10' : 'z-0'\}\`\}>/,
  `<motion.div 
      layoutId={\`node-\${node.id}\`}
      className={\`node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}
      onPointerDown={() => {
        if (onLongPress) {
          const t = setTimeout(() => onLongPress(node.id), 500);
          window.addEventListener('pointerup', () => clearTimeout(t), { once: true });
        }
      }}
    >`
);
content = content.replace(
  /<\/div>\s*\{\/\* Children rendering \*\/\}/,
  `</motion.div>\n\n        {/* Children rendering */}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
