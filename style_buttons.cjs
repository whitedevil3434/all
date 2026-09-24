const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace standard button classes with minimalist semantic links
content = content.replace(
  /className="text-xs font-bold text-white bg-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-700\s*transition-colors flex items-center gap-1"/g,
  'className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-700 transition-colors bg-transparent border border-emerald-200/50 rounded-full px-3 py-1"'
);

content = content.replace(
  /className="text-xs font-bold text-gray-500 bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"/g,
  'className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-gray-600 transition-colors bg-transparent border border-gray-200/50 rounded-full px-3 py-1"'
);

content = content.replace(
  /className="text-xs font-bold py-2 px-4 rounded-lg bg-amber-500 text-white hover:bg-amber-600\s*transition-colors"/g,
  'className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1 hover:text-amber-700 transition-colors bg-transparent border border-amber-200/50 rounded-full px-3 py-1 mt-2"'
);

// Accept Evidence button (already somewhat minimal, let's make it a pill)
content = content.replace(
  /className="text-\[10px\] font-bold text-emerald-600 bg-transparent shadow-sm-sm py-1\.5 px-3 rounded hover:\s*transition-all flex items-center gap-1\.5"/g,
  'className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-700 transition-colors bg-transparent border border-emerald-200/50 rounded-full px-3 py-1"'
);
content = content.replace(
  /className="text-\[10px\] font-bold text-red-500 bg-transparent shadow-sm-sm py-1\.5 px-3 rounded hover:\s*transition-all flex items-center gap-1\.5"/g,
  'className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors bg-transparent border border-red-200/50 rounded-full px-3 py-1"'
);

// Ask Actor button
content = content.replace(
  /className="text-xs font-bold text-white bg-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-700\s*transition-colors"/g,
  'className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-700 transition-colors bg-transparent border border-indigo-200/50 rounded-full px-3 py-1 mt-2"'
);

// Find Actor button
content = content.replace(
  /className="text-xs font-bold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg mt-2 hover:bg-indigo-100 transition-colors self-start shadow-sm"/g,
  'className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-700 transition-colors bg-transparent border border-indigo-200/50 rounded-full px-3 py-1 mt-2 self-start"'
);

// GAP action button
content = content.replace(
  /className="text-xs font-bold text-gray-700 bg-white py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-left w-full"/g,
  'className="text-[11px] font-bold text-gray-600 flex items-center gap-2 hover:text-gray-900 transition-colors bg-transparent text-left w-full py-1"'
);

// Ask Dependency button
content = content.replace(
  /className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1.5 px-3 rounded-md hover:bg-gray-200 transition-colors self-start"/g,
  'className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-gray-600 transition-colors bg-transparent border border-gray-200/50 rounded-full px-3 py-1 mt-2 self-start"'
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
