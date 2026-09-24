const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

const loaderReplacement = `<div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4 flex flex-col gap-3 items-center w-full max-w-xs mx-auto">
    <span className="animate-pulse">✦ UNDERSTANDING</span>
    <span className="text-gray-200">↓</span>
    <span className="animate-pulse" style={{animationDelay: '0.2s'}}>✦ FINDING WHAT IS REQUIRED</span>
    <span className="text-gray-200">↓</span>
    <span className="animate-pulse" style={{animationDelay: '0.4s'}}>✦ CHECKING CAPABILITY</span>
    <span className="text-gray-200">↓</span>
    <span className="animate-pulse" style={{animationDelay: '0.6s'}}>✦ BUILDING THE CAUSAL PATH</span>
  </div>`;

content = content.replace(
  /<p className="text-xs font-bold uppercase tracking-widest text-gray-500 animate-pulse mt-2 flex flex-col gap-1 items-center">[\s\S]*?<\/p>/,
  loaderReplacement
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
