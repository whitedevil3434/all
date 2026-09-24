const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// I need to find where I broke it.
// The file has:
/*
      <header className="py-6 px-8 flex justify-between items-center mb-8 relative z-10 sticky top-0">
        <div className="flex items-center gap-3">
          ...
        </div>
        <div className="flex items-center gap-4">
                {getIcon()}
*/
// I will replace from `        <div className="flex items-center gap-4">` down to `{getIcon()}`

const fixContent = `
        </div>
      </header>

      {/* The main tree rendering */}
      <div className="px-8 mt-4 flex flex-col gap-6">
        <AnimatePresence>
          {projectedRoots.map(root => (
            <NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={setProvenanceNodeId} nextBlockerId={nextBlockerId} />
          ))}
        </AnimatePresence>
      </div>

      {/* Loading state from universal compose */}
      {isComposing && (
        <div className="mt-8 flex justify-center w-full">
           <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4 flex flex-col gap-3 items-center w-full max-w-xs mx-auto">
             <span className="animate-pulse">✦ UNDERSTANDING</span>
             <span className="text-gray-200">↓</span>
             <span className="animate-pulse" style={{animationDelay: '0.2s'}}>✦ FINDING WHAT IS REQUIRED</span>
             <span className="text-gray-200">↓</span>
             <span className="animate-pulse" style={{animationDelay: '0.4s'}}>✦ CHECKING CAPABILITY</span>
             <span className="text-gray-200">↓</span>
             <span className="animate-pulse" style={{animationDelay: '0.6s'}}>✦ BUILDING THE CAUSAL PATH</span>
           </div>
        </div>
      )}

      {/* Global input compose bar */}
      <div className="fixed bottom-0 left-0 w-full px-8 pb-8 pt-12 bg-gradient-to-t from-[#F4F4F5] via-[#F4F4F5] to-transparent z-50 pointer-events-none">
        <form onSubmit={handleInput} className="relative pointer-events-auto max-w-4xl mx-auto shadow-xl ring-1 ring-black/5 rounded-full bg-white">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder={activeContextId ? "Type instructions for selected context..." : "What do you want to build or run?"}
            className="w-full bg-transparent rounded-full py-4 pl-6 pr-12 focus:outline-none transition-all text-sm font-medium disabled:opacity-50 text-gray-700 placeholder:text-gray-400"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {provenanceNodeId && (
        <ProvenanceLedger 
          nodeId={provenanceNodeId} 
          onClose={() => setProvenanceNodeId(null)} 
        />
      )}
    </div>
  );
}

function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, nextBlockerId }: { 
  node: GraphNode; 
  activeContextId: string | null; 
  setActiveContextId: (id: string | null) => void;
  currentProjection: string;
  onOpenProvenance: (id: string) => void;
  nextBlockerId?: string;
}) {
  const isExpanded = activeContextId === node.id;
  const [evidenceInput, setEvidenceInput] = useState('');
  const hasSemantics = !!(node.data?.rationale || node.data?.contextualDetails || node.data?.proposal || node.data?.proofOfReality || node.data?.summary || node.data?.unknowns);

  const getIcon = () => {
    switch (node.type) {
      case 'WANT': return <Target className="w-5 h-5 text-gray-700" />;
      case 'DEPENDENCY': return <Package className="w-4 h-4 text-amber-600" />;
      case 'ACTOR': return <User className="w-4 h-4 text-emerald-600" />;
      case 'EVIDENCE': return <FileCheck className="w-4 h-4 text-purple-600" />;
      default: return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  const isCompact = node.type !== 'WANT' && node.type !== 'ACTOR';
  const isHollow = node.state === 'UNKNOWN';

  const getAttentionClass = () => {
    if (activeContextId === node.id) return 'bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-4 my-2 z-20';
    if (node.id === nextBlockerId) return 'bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20 rounded-xl py-3 px-4 my-2 z-10';
    if (node.state === 'UNKNOWN') return 'bg-transparent opacity-70 py-1';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'bg-transparent opacity-40 py-1';
    return 'hover:bg-white/40 transition-all duration-300 rounded-lg bg-transparent py-1 px-2 opacity-80';
  };

  let baseClass = \`w-full flex flex-col gap-2 transition-all \${getAttentionClass()}\`;
  const morphProps = node.type === 'WANT' ? { layoutId: "morph-intent-card" } : {};

  if (isHollow) {
    baseClass += ' border-l-2 border-dashed border-gray-300/50 relative overflow-hidden reality-void pl-4 ml-1';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className="w-full flex flex-col"
    >
      <div className={\`node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}>
        <div className={baseClass + ' cursor-pointer'} onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 relative">
              {node.id === nextBlockerId && (
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-[10px] tracking-widest uppercase flex items-center gap-1 animate-pulse">
                  <span>✦ NEXT</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
              <div className={\`\${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gray-100/50 flex items-center justify-center shrink-0\`}>
                {getIcon()}`;

const regex = /<div className="flex items-center gap-4">[\s\S]*?\{getIcon\(\)\}/;

content = content.replace(regex, fixContent);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
