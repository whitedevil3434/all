const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Do not filter out FAILED nodes
content = content.replace(
  `const children = childEdges.map(e => graph.nodes[e.targetId]).filter(n => n && n.state !== 'FAILED');`,
  `const children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);`
);

// Add visual styles for FAILED
const getAttentionClassOld = `    if (node.state === 'EXECUTING') return 'ring-2 ring-amber-500/50 shadow-neo-up-xl scale-[1.02] border-amber-300';
    if (node.state === 'VERIFYING') return 'ring-2 ring-purple-500/50 shadow-neo-up-xl scale-[1.02] border-purple-300';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-90 scale-95';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl';
  };`;

const getAttentionClassNew = `    if (node.state === 'EXECUTING') return 'ring-2 ring-amber-500/50 shadow-neo-up-xl scale-[1.02] border-amber-300';
    if (node.state === 'VERIFYING') return 'ring-2 ring-purple-500/50 shadow-neo-up-xl scale-[1.02] border-purple-300';
    if (node.state === 'FAILED') return 'ring-2 ring-red-500/50 shadow-neo-up-lg scale-95 bg-red-50 opacity-60';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-90 scale-95';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl';
  };`;
content = content.replace(getAttentionClassOld, getAttentionClassNew);

// Add FAILED badge style
const badgeStyleOld = `\${node.state === 'RESOLVED' ? 'bg-gray-800 text-white' : ''}`;
const badgeStyleNew = `\${node.state === 'RESOLVED' ? 'bg-gray-800 text-white' : ''}\n            \${node.state === 'FAILED' ? 'bg-red-100 text-red-700' : ''}`;
content = content.replace(badgeStyleOld, badgeStyleNew);

fs.writeFileSync(path, content);
console.log("Updated to show FAILED nodes.");
