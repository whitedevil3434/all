const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const getAttentionClass = \(\) => \{[\s\S]*?return 'hover:bg-white\/60 transition-all duration-300 rounded-xl bg-transparent py-2 px-3 opacity-90';\n  \};/,
  `const getAttentionClass = () => {
    if (activeContextId === node.id) return 'bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-4 my-2 z-20';
    if (node.id === nextBlockerId) return 'bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20 rounded-xl py-3 px-4 my-2 z-10';
    if (node.state === 'UNKNOWN') return 'bg-transparent opacity-70 py-1';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'bg-transparent opacity-40 py-1';
    return 'hover:bg-white/40 transition-all duration-300 rounded-lg bg-transparent py-1 px-2 opacity-80';
  };`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
