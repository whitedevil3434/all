const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Add PROPOSED to getting threads
content = content.replace(
  /case 'OFFERED': return 'border-purple-300';/,
  `case 'PROPOSED': return 'border-indigo-300 border-dashed';\n      case 'OFFERED': return 'border-purple-300';`
);

// Add PROPOSED to attention class handling
content = content.replace(
  /if \(node\.state === 'UNKNOWN'\) return 'bg-transparent opacity-70 py-1';/,
  `if (node.state === 'UNKNOWN') return 'bg-transparent opacity-70 py-1';
    if (node.state === 'PROPOSED') return 'bg-indigo-50/50 shadow-sm ring-1 ring-indigo-300/40 rounded-xl py-3 px-4 border border-dashed border-indigo-200 opacity-90 my-2';`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
