const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const \[currentProjection, setCurrentProjection\] = useState<string>\('owner'\);/,
  `const [currentProjection, setCurrentProjection] = useState<string>('owner');
  
  // Attention Engine: Find the next unresolved reality
  const nodes = Object.values(graph.nodes);
  const nextBlockerId = nodes.find(n => (n.state === 'UNKNOWN' || n.type === 'GAP') && n.state !== 'RESOLVED' && n.state !== 'COMMITTED' && n.state !== 'FAILED')?.id;`
);

content = content.replace(
  /function NodeRenderer\(\{ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance \}: \{[\s\S]*?\}\) \{/,
  `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, nextBlockerId }: { 
  node: CausalNode; 
  activeContextId: string | null; 
  setActiveContextId: (id: string | null) => void;
  currentProjection: string;
  onOpenProvenance: (id: string) => void;
  nextBlockerId?: string;
}) {`
);

content = content.replace(
  /<NodeRenderer node=\{child\} activeContextId=\{activeContextId\} setActiveContextId=\{setActiveContextId\} currentProjection=\{currentProjection\} onOpenProvenance=\{onOpenProvenance\} \/>/g,
  `<NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} nextBlockerId={nextBlockerId} />`
);

content = content.replace(
  /<NodeRenderer key=\{root\.id\} node=\{root\} activeContextId=\{activeContextId\} setActiveContextId=\{setActiveContextId\} currentProjection=\{currentProjection\} onOpenProvenance=\{setProvenanceNodeId\} \/>/g,
  `<NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={setProvenanceNodeId} nextBlockerId={nextBlockerId} />`
);

// Update getAttentionClass to use nextBlockerId
content = content.replace(
  /const getAttentionClass = \(\) => \{[\s\S]*?return 'hover:bg-white\/60 transition-all duration-300 rounded-xl bg-transparent py-2 px-3';\n  \};/,
  `const getAttentionClass = () => {
    if (activeContextId === node.id) return 'bg-white shadow-lg ring-1 ring-black/10 rounded-2xl p-4 my-2 z-20';
    if (node.id === nextBlockerId) return 'bg-white/80 shadow-md ring-1 ring-amber-500/30 rounded-xl py-3 px-4 my-2 z-10'; // Emphasize next blocker
    if (node.state === 'UNKNOWN') return 'bg-transparent opacity-60 py-2';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'bg-transparent opacity-50 py-2';
    return 'hover:bg-white/60 transition-all duration-300 rounded-xl bg-transparent py-2 px-3 opacity-90';
  };`
);

// Add the ✦ NEXT indicator
content = content.replace(
  /<div className="flex items-center gap-3">[\s\S]*?<div className=\{`\$\{isCompact \? 'w-8 h-8' : 'w-10 h-10'\} rounded-full bg-gray-100\/50 flex items-center justify-center shrink-0`\}>/,
  `<div className="flex items-center gap-3">
              {node.id === nextBlockerId && (
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-[10px] tracking-widest uppercase flex items-center gap-1 animate-pulse">
                  <span>✦ NEXT</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
              <div className={\`\${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gray-100/50 flex items-center justify-center shrink-0\`}>`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
