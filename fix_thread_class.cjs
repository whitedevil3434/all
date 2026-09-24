const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const getAttentionClass = \(\) => \{/,
  `const getThreadClass = (state: string) => {
    switch (state) {
      case 'UNKNOWN': return 'border-gray-200/50 border-dashed';
      case 'POSSIBLE': return 'border-blue-300';
      case 'ASKING': return 'border-amber-300 border-dashed animate-pulse';
      case 'OFFERED': return 'border-purple-300';
      case 'COMMITTED': return 'border-emerald-400 border-[1.5px]';
      case 'EXECUTING': return 'border-amber-400 border-[1.5px] border-dashed animate-pulse';
      case 'VERIFYING': return 'border-purple-400 border-[1.5px] border-dashed';
      case 'RESOLVED': return 'border-gray-800 border-[1.5px]';
      case 'FAILED': return 'border-red-300 border-dashed';
      default: return 'border-gray-200';
    }
  };

  const getAttentionClass = () => {`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
