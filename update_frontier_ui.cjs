const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Change nextBlockerId to currentFrontierId
content = content.replace(
  /const nextBlockerId = nodes.find\(n => \(n.state === 'UNKNOWN' \|\| n.type === 'GAP'\) && n.state !== 'RESOLVED' && n.state !== 'COMMITTED' && n.state !== 'FAILED'\)\?\.id;/,
  `// Attention Engine: Find the next unresolved reality (Current Frontier)
  const currentFrontierId = nodes.find(n => (n.state === 'UNKNOWN' || n.type === 'GAP') && !['RESOLVED', 'COMMITTED', 'FAILED', 'EXECUTING'].includes(n.state))?.id;`
);

content = content.replace(/nextBlockerId/g, 'currentFrontierId');

// Emphasize the frontier visually
content = content.replace(
  /<span>✦ NEXT<\/span>/,
  `<span>✦ CURRENT FRONTIER</span>`
);

content = content.replace(
  /className="absolute -left-12 top-1\/2 -translate-y-1\/2 text-amber-500 font-bold text-\[10px\] tracking-widest uppercase flex items-center gap-1 animate-pulse"/,
  `className="absolute -left-48 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-[11px] tracking-widest uppercase flex items-center gap-2 animate-pulse bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm"`
);

// We want semantic zoom on the frontier if nothing else is clicked
content = content.replace(
  /const isExpanded = activeContextId === node\.id;/,
  `const isExpanded = activeContextId === node.id || (!activeContextId && node.id === currentFrontierId);`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
