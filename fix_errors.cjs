const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Pass currentProjection to NodeRenderer
content = content.replace(
  `function NodeRenderer({ node, activeContextId, setActiveContextId }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void }) {`,
  `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string }) {`
);

// 2. Update NodeRenderer calls in DynamicRealitySurface
content = content.replace(
  `<NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />`,
  `<NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} />`
);

// 3. Update recursive NodeRenderer calls
content = content.replace(
  `<NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />`,
  `<NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} />`
);

// 4. Ensure unique projectedRoots
const rootMapReplace = `    projectedRoots = parentDepIds.map(id => graph.nodes[id]).filter(Boolean);`;
const rootMapNew = `    projectedRoots = parentDepIds.map(id => graph.nodes[id]).filter(Boolean);
    // Ensure unique projected roots
    projectedRoots = Array.from(new Map(projectedRoots.map(n => [n.id, n])).values());`;
content = content.replace(rootMapReplace, rootMapNew);

// 5. Ensure unique children in NodeRenderer
const childMapReplace = `  const children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);`;
const childMapNew = `  let children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);
  // Ensure unique children
  children = Array.from(new Map(children.map(n => [n.id, n])).values());`;
content = content.replace(childMapReplace, childMapNew);

fs.writeFileSync(path, content);
console.log("Fixed errors in DynamicRealitySurface.");
