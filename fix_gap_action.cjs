const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-indigo-50 text-indigo-700 shadow-sm hover: transition-all"/g,
  'className="w-full text-[11px] font-bold py-1 text-indigo-600 bg-transparent flex items-center gap-2 hover:text-indigo-800 transition-all text-left uppercase tracking-widest"'
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
