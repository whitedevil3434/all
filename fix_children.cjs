const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const hasSemantics = !!\(node\.data\?\.rationale \|\| node\.data\?\.contextualDetails \|\| node\.data\?\.proposal \|\| node\.data\?\.proofOfReality \|\| node\.data\?\.summary \|\| node\.data\?\.unknowns\);/,
  `const hasSemantics = !!(node.data?.rationale || node.data?.contextualDetails || node.data?.proposal || node.data?.proofOfReality || node.data?.summary || node.data?.unknowns);

  const graph = RealityEngine.getGraph();
  const childEdges = Object.values(graph.edges).filter(e => e.sourceId === node.id);
  let children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);
  children = Array.from(new Map(children.map(n => [n.id, n])).values());`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
