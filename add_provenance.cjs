const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const importsAdd = `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity } from 'lucide-react';
import { ProvenanceLedger } from './ProvenanceLedger';`;

content = content.replace(
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins } from 'lucide-react';`,
  importsAdd
);

// Add state for modal
const stateAdd = `  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [provenanceNodeId, setProvenanceNodeId] = useState<string | null>(null);`;
content = content.replace(`  const [activeContextId, setActiveContextId] = useState<string | null>(null);`, stateAdd);

// Render modal at the end of the root
const modalRender = `      {/* Voice/Text Input bar - decoupled from specific domains */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <form onSubmit={handleInput} className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder={activeNode ? \`What does \${activeNode.label} need to fulfill this?\` : (currentProjection !== 'owner' ? \`What do you need to fulfill this responsibility?\` : "Tell C-Link what needs to happen...")}
            className="w-full bg-white/80 backdrop-blur-md border border-black/10 rounded-full py-4 pl-6 pr-12 shadow-neo-down focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium disabled:opacity-50"
          />
          <button type="submit" disabled={isProcessing || !inputText.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {provenanceNodeId && (
          <ProvenanceLedger 
            nodeId={provenanceNodeId} 
            onClose={() => setProvenanceNodeId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}`;

content = content.replace(
  /\{\/\* Voice\/Text Input bar - decoupled from specific domains \*\/\}[\s\S]*?<\/form>\s*<\/div>\s*<\/div>\s*\);\s*\}/m,
  modalRender
);

// Also we need to pass setProvenanceNodeId down to NodeRenderer
const rootMapStart = `{projectedRoots.map(root => (
            <NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} />
          ))}`;
const rootMapEnd = `{projectedRoots.map(root => (
            <NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={setProvenanceNodeId} />
          ))}`;
content = content.replace(rootMapStart, rootMapEnd);

const childMapStart = `{children.map(child => (
              <NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} />
            ))}`;
const childMapEnd = `{children.map(child => (
              <NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
            ))}`;
content = content.replace(childMapStart, childMapEnd);

const propDefStart = `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string }) {`;
const propDefEnd = `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string, onOpenProvenance: (id: string) => void }) {`;
content = content.replace(propDefStart, propDefEnd);

// Add button to WANT nodes
const actionState = `{/* Actions based on state */}`;
const provenanceAction = `{/* Actions based on state */}
        {node.type === 'WANT' && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => onOpenProvenance(node.id)}
              className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1.5 px-3 rounded hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <History className="w-3 h-3" />
              View Provenance Ledger
            </button>
          </div>
        )}
`;
content = content.replace(actionState, provenanceAction);

fs.writeFileSync(path, content);
console.log("Injected Provenance hooks into DynamicRealitySurface.tsx");
