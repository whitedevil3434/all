const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// The original UI might still have "Find Actor" buttons that hardcode marketplace behaviour. Let's make sure everything relies on the composer.
content = content.replace(
  /<button\s+onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*causalAudio\.playClick\(\);\s*const actors = getContextualActors\(node\.label\);\s*actors\.forEach\(a => \{\s*const actorId = RealityEngine\.addNode\(\{\s*type: 'ACTOR',\s*label: a\.label,\s*state: 'UNKNOWN',\s*data: a\.data\s*\}\);\s*RealityEngine\.addEdge\(node\.id, actorId, 'candidate'\);\s*\}\);\s*\}\}\s*className="text-\[11px\] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-800 transition-colors"\s*>\s*<Search className="w-3 h-3" \/>\s*FIND ACTOR\s*<\/button>/,
  `<button 
        onClick={(e) => { 
          e.stopPropagation(); 
          setPendingContextId(node.id);
          submitIntent(\`Explore options and capability for \${node.label}\`);
        }}
        className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-800 transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        EXPLORE REALITY
      </button>`
);

content = content.replace(
  /FIND ACTOR/g,
  'EXPLORE OPTIONS'
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
