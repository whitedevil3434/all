const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const currentFrontierId = nodes\.find\(n => \(n\.state === 'UNKNOWN' \|\| n\.type === 'GAP'\) && !\['RESOLVED', 'COMMITTED', 'FAILED', 'EXECUTING'\]\.includes\(n\.state\)\)\?\.id;/,
  `// Attention Engine: Find the next unresolved reality (Current Frontier)
  const currentFrontierId = nodes.find(n => 
    (n.state === 'UNKNOWN' || n.type === 'GAP' || n.state === 'ASKING' || n.state === 'OFFERED' || n.state === 'POSSIBLE') && 
    !['RESOLVED', 'COMMITTED', 'FAILED', 'EXECUTING'].includes(n.state)
  )?.id;`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
