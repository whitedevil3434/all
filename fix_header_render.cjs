const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// The original header was:
/*
      <header className="py-6 px-8 flex justify-between items-center mb-8 relative z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="text-black font-black font-serif text-xl tracking-tighter">
            C-LINK
          </div>
          <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-bold tracking-widest text-emerald-600 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE REALITY
          </div>
        </div>
        
        <div className="flex items-center gap-4">
*/

content = content.replace(
  /<div className="flex items-center gap-3">[\s\S]*?<div className=\{`\$\{isCompact \? 'w-8 h-8' : 'w-10 h-10'\} rounded-full bg-gray-100\/50 flex items-center justify-center shrink-0`\}>/,
  `<div className="flex items-center gap-3">
          <div className="text-black font-black font-serif text-xl tracking-tighter">
            C-LINK
          </div>
          <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-bold tracking-widest text-emerald-600 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE REALITY
          </div>
        </div>
        <div className="flex items-center gap-4">`
);

// We need to put the NEXT badge back into NodeRenderer, not the header.
// It should go inside the NodeRenderer component's icon block.
content = content.replace(
  /<div className="flex items-center gap-3">\s*<div className=\{`\$\{isCompact \? 'w-8 h-8' : 'w-10 h-10'\} rounded-full bg-gray-100\/50 flex items-center justify-center shrink-0`\}>/g,
  `<div className="flex items-center gap-3 relative">
              {node.id === nextBlockerId && (
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-[10px] tracking-widest uppercase flex items-center gap-1 animate-pulse">
                  <span>✦ NEXT</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
              <div className={\`\${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gray-100/50 flex items-center justify-center shrink-0\`}>`
);

// Fix double declaration of nodes
content = content.replace(
  /const nodes = Object\.values\(graph\.nodes\);\s*const committedActors = nodes\.filter\(n => n\.type === 'ACTOR' && n\.state === 'COMMITTED'\);/,
  `const committedActors = nodes.filter(n => n.type === 'ACTOR' && n.state === 'COMMITTED');`
);


fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
