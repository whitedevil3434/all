const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /className="w-full max-w-4xl mx-auto px-6 py-4 bg-white\/50 backdrop-blur-xl border-t border-black\/5 flex items-end gap-3"/,
  `className="w-full max-w-4xl mx-auto px-4 py-4 bg-transparent flex items-end gap-3"`
);

content = content.replace(
  /className="flex-1 bg-neo-bg rounded-2xl p-4 shadow-neo-down focus:shadow-neo-down-md focus:outline-none transition-all text-sm resize-none border-none text-gray-700 min-h-\[60px\] max-h-\[200px\]"/,
  `className="flex-1 bg-white/70 backdrop-blur-lg rounded-2xl p-4 border border-black/5 focus:border-black/10 focus:outline-none transition-all text-sm resize-none text-gray-800 min-h-[60px] max-h-[200px] shadow-sm"`
);

content = content.replace(
  /className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-neo-up hover:shadow-neo-down shrink-0"/,
  `className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md shrink-0"`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
