const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace getAttentionClass and baseClass
content = content.replace(
  /const getAttentionClass = \(\) => \{[\s\S]*?let baseClass = `w-full rounded-3xl flex flex-col gap-3 transition-all \$\{getAttentionClass\(\)\}`;/g,
  `const getAttentionClass = () => {
    if (activeContextId === node.id) return 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 ring-1 ring-black/5';
    if (node.state === 'UNKNOWN') return 'bg-transparent border-none';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'bg-white/40 opacity-60 border-none';
    return 'bg-white/70 hover:bg-white transition-all duration-300 border border-black/5';
  };

  let baseClass = \`w-full rounded-2xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;`
);

// Replace isHollow block
content = content.replace(
  /if \(isHollow\) \{[\s\S]*?\} else \{[\s\S]*?\}/g,
  `if (isHollow) {
    baseClass += ' p-4 border-l-2 border-dashed border-gray-300/50 bg-transparent relative overflow-hidden reality-void';
  } else {
    baseClass += \` \${isCompact ? 'p-3' : 'p-5'}\`;
  }`
);

// Replace the shadow styles for the icons
content = content.replace(
  /bg-white shadow-neo-down/g,
  'bg-gray-100/50'
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
