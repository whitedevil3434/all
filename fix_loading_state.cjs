const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace static "Materializing Logic..."
content = content.replace(
  /<p className="text-sm font-bold uppercase tracking-widest animate-pulse">Materializing Logic\.\.\.<\/p>/,
  `<p className="text-xs font-bold uppercase tracking-widest text-gray-500 animate-pulse mt-2 flex flex-col gap-1 items-center">
    <span>✦ UNDERSTANDING INTENT</span>
    <span>✦ BUILDING CAUSAL PATH</span>
  </p>`
);

content = content.replace(
  /<Loader2 className="w-8 h-8 animate-spin mb-4" \/>/,
  `<Loader2 className="w-6 h-6 animate-spin mb-2 text-gray-400" />`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
