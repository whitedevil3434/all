const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*causalAudio\.playTick\(\);\s*RealityEngine\.updateNode\(node\.id, \{ state: 'FAILED' \}\);\s*const edges = Object\.values\(RealityEngine\.getGraph\(\)\.edges\);\s*const parentEdge = edges\.find\(e => e\.targetId === node\.id\);\s*if \(parentEdge\) \{\s*RealityEngine\.updateNode\(parentEdge\.sourceId, \{ state: 'EXECUTING' \}\);\s*\}\s*\}\}\s*className="text-\[10px\] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors bg-transparent border border-red-200\/50 rounded-full px-3 py-1"\s*>\s*<AlertTriangle className="w-3 h-3" \/>\s*Reject & Revise\s*<\/button>/,
  `<button 
        onClick={(e) => { e.stopPropagation(); 
          causalAudio.playTick();
          RealityEngine.updateNode(node.id, { state: 'FAILED' });
          const edges = Object.values(RealityEngine.getGraph().edges);
          const parentEdge = edges.find(e => e.targetId === node.id);
          if (parentEdge) {
            RealityEngine.updateNode(parentEdge.sourceId, { state: 'UNKNOWN' });
          }
        }}
        className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors bg-transparent border border-red-200/50 rounded-full px-3 py-1"
    >
      <AlertTriangle className="w-3 h-3" />
      Reject & Revise
    </button>`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
