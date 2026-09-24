const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const mainDiv = '<div className="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6">';
const replacement1 = "<div className=\"flex-1 w-full relative\">\n  <TransformWrapper\n    initialScale={1}\n    minScale={0.2}\n    maxScale={3}\n    centerOnInit={true}\n    wheel={{ step: 0.1 }}\n    limitToBounds={false}\n  >\n    <TransformComponent wrapperClass=\"!w-full !h-full !absolute !inset-0 cursor-grab active:cursor-grabbing\">\n      <div className=\"w-full min-w-[800px] flex flex-col items-center pb-32 pt-10 relative\">";

content = content.replace(mainDiv, replacement1);

const formContainer = '<div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">';
const replacement2 = "    </div>\n    </TransformComponent>\n    <div className=\"absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-neo-up-lg border border-black/5 pointer-events-none flex flex-col items-center gap-1 z-10\">\n       <span className=\"text-[9px] font-bold tracking-widest uppercase text-gray-500\">Causal Map</span>\n       <div className=\"w-16 h-16 border-2 border-dashed border-black/10 rounded-lg relative\">\n         <div className=\"absolute inset-2 bg-indigo-500/20 rounded animate-pulse\"></div>\n       </div>\n    </div>\n  </TransformWrapper>\n</div>\n<div className=\"fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4\">";

content = content.replace(formContainer, replacement2);

fs.writeFileSync(path, content);
console.log("Safely wrapped with TransformWrapper");
