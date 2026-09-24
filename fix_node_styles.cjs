const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace getAttentionClass and baseClass
content = content.replace(
  /const getAttentionClass = \(\) => \{[\s\S]*?let baseClass = `w-full rounded-2xl flex flex-col gap-3 transition-all \$\{getAttentionClass\(\)\}`;/g,
  `const getAttentionClass = () => {
    if (activeContextId === node.id) return 'bg-white shadow-lg ring-1 ring-black/10 rounded-2xl p-4 my-2 z-20';
    if (node.state === 'UNKNOWN') return 'bg-transparent opacity-80 py-2';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'bg-transparent opacity-50 py-2';
    return 'hover:bg-white/60 transition-all duration-300 rounded-xl bg-transparent py-2 px-3';
  };

  let baseClass = \`w-full flex flex-col gap-2 transition-all \${getAttentionClass()}\`;`
);

// Replace isHollow block
content = content.replace(
  /if \(isHollow\) \{[\s\S]*?\} else \{[\s\S]*?\}/g,
  `if (isHollow) {
    baseClass += ' border-l-2 border-dashed border-gray-300/50 relative overflow-hidden reality-void pl-4 ml-1';
  }`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
