const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update imports
const importTarget = `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText } from 'lucide-react';`;
const importReplacement = `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp } from 'lucide-react';`;
content = content.replace(importTarget, importReplacement);

// 2. Add State to NodeRenderer
const rendererTarget = `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string, onOpenProvenance: (id: string) => void }) {
  const graph = useRealityGraph();`;

const rendererReplacement = `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string, onOpenProvenance: (id: string) => void }) {
  const graph = useRealityGraph();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasSemantics = node.data?.rationale || (node.data?.unknowns && node.data.unknowns.length > 0) || node.data?.proposal || node.data?.summary;
  
  const getThreadClass = (state: string) => {
    switch (state) {
      case 'UNKNOWN': return 'bg-gray-300 shadow-none';
      case 'POSSIBLE': return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]';
      case 'ASKING': 
      case 'EXECUTING': return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
      case 'VERIFYING': return 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]';
      case 'COMMITTED':
      case 'RESOLVED': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'FAILED': return 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]';
      default: return 'bg-gray-300 shadow-none';
    }
  };
`;
content = content.replace(rendererTarget, rendererReplacement);

// 3. Replace Semantic Bodies
const semanticTarget = `        {/* Deep Semantic Bodies (The "Bla Bla") */}
        {node.data?.rationale && (
          <div className="mt-3 p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-gray-600 leading-relaxed font-medium">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Causal Requirement</span>
            {node.data.rationale}
          </div>
        )}
        
        {node.data?.unknowns && node.data.unknowns.length > 0 && (
          <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl shadow-inner text-xs text-indigo-700/80 leading-relaxed font-medium">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Open Clarifications</span>
            <ul className="list-disc pl-4 space-y-1">
              {node.data.unknowns.map((u: string, idx: number) => <li key={idx}>{u}</li>)}
            </ul>
          </div>
        )}

        {node.data?.proposal && node.state !== 'FAILED' && node.state !== 'COMMITTED' && node.state !== 'EXECUTING' && node.state !== 'VERIFYING' && node.state !== 'RESOLVED' && (
          <div className="mt-3 p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl shadow-inner text-xs text-amber-800/80 leading-relaxed font-medium relative">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">Actor Proposal</span>
            "{node.data.proposal}"
          </div>
        )}

        {node.data?.summary && (node.state === 'VERIFYING' || node.state === 'RESOLVED') && (
          <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl shadow-inner text-xs text-blue-800/80 leading-relaxed font-medium">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-500 mb-1">Work Summary</span>
            {node.data.summary}
            <div className="mt-2 text-[9px] font-mono text-blue-400/80 bg-blue-100/50 px-2 py-1 rounded inline-block">
              Hash: {node.data.hash}
            </div>
          </div>
        )}`;

const semanticReplacement = `        {/* Deep Semantic Bodies (The "Bla Bla") with Apple-like Expand/Collapse Hierarchy */}
        {hasSemantics && (
          <div className="mt-3 flex flex-col gap-2">
            <div className={\`transition-all duration-500 overflow-hidden \${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-[42px] opacity-80'}\`}>
              
              {node.data?.rationale && (
                <div className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-gray-600 leading-relaxed font-medium mb-2 break-words">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Causal Requirement</span>
                  <div className={isExpanded ? '' : 'line-clamp-1'}>{node.data.rationale}</div>
                </div>
              )}
              
              {node.data?.unknowns && node.data.unknowns.length > 0 && (
                <div className="p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl shadow-inner text-xs text-indigo-700/80 leading-relaxed font-medium mb-2">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Open Clarifications</span>
                  {isExpanded ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {node.data.unknowns.map((u: string, idx: number) => <li key={idx} className="break-words">{u}</li>)}
                    </ul>
                  ) : (
                    <div className="line-clamp-1 text-[11px] opacity-80">{node.data.unknowns.join(' • ')}</div>
                  )}
                </div>
              )}

              {node.data?.proposal && node.state !== 'FAILED' && node.state !== 'COMMITTED' && node.state !== 'EXECUTING' && node.state !== 'VERIFYING' && node.state !== 'RESOLVED' && (
                <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl shadow-inner text-xs text-amber-800/80 leading-relaxed font-medium relative mb-2 break-words">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">Actor Proposal</span>
                  <div className={isExpanded ? '' : 'line-clamp-1'}>"{node.data.proposal}"</div>
                </div>
              )}

              {node.data?.summary && (node.state === 'VERIFYING' || node.state === 'RESOLVED') && (
                <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl shadow-inner text-xs text-blue-800/80 leading-relaxed font-medium mb-2 break-words">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-500 mb-1">Work Summary</span>
                  <div className={isExpanded ? '' : 'line-clamp-1'}>{node.data.summary}</div>
                  {isExpanded && (
                    <div className="mt-2 text-[9px] font-mono text-blue-400/80 bg-blue-100/50 px-2 py-1 rounded inline-block break-all">
                      Hash: {node.data.hash}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subtle Apple-style Toggle */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center justify-center gap-1 py-1 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors w-full"
            >
              {isExpanded ? 'Collapse Data' : 'Expand Data'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        )}`;
content = content.replace(semanticTarget, semanticReplacement);


// 4. Update Recursion for Causal Threads
const recurseTarget = `      {/* Render children recursively (Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">
          {/* Main vertical stem */}
          <div className="absolute left-[15px] top-[-10px] bottom-[30px] w-[1.5px] bg-gradient-to-b from-gray-300 via-gray-200 to-transparent rounded-full" />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch */}
                <div className="absolute left-[-17px] top-[24px] w-[17px] h-[1.5px] bg-gray-300 rounded-full" />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}`;

const recurseReplacement = `      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">
          {/* Main vertical stem inheriting parent state opacity */}
          <div className={\`absolute left-[15px] top-[-10px] bottom-[30px] w-[2px] bg-gradient-to-b from-gray-300 via-gray-200/50 to-transparent rounded-full\`} />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch reflecting the CHILD's precise state */}
                <div className={\`absolute left-[-17px] top-[24px] w-[17px] h-[2px] rounded-full transition-all duration-500 \${getThreadClass(child.state)}\`} />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}`;

content = content.replace(recurseTarget, recurseReplacement);

fs.writeFileSync(path, content);
console.log("Upgraded Card Text Hierarchy, Collapsible State, and Semantic Causal Threads.");
