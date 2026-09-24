const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add FileCheck to lucide-react imports
content = content.replace(
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus } from 'lucide-react';`,
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck } from 'lucide-react';`
);

// 2. Add EVIDENCE to getIcon
content = content.replace(
  `case 'RESPONSIBILITY': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;`,
  `case 'RESPONSIBILITY': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;\n      case 'EVIDENCE': return <FileCheck className="w-5 h-5 text-blue-600" />;`
);

// 3. Update getAttentionClass
content = content.replace(
  `if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-90 scale-95';`,
  `if (node.state === 'EXECUTING') return 'ring-2 ring-amber-500/50 shadow-neo-up-xl scale-[1.02] border-amber-300';
    if (node.state === 'VERIFYING') return 'ring-2 ring-purple-500/50 shadow-neo-up-xl scale-[1.02] border-purple-300';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-90 scale-95';`
);

// 4. Update state badge styling
content = content.replace(
  `\${node.state === 'COMMITTED' ? 'bg-emerald-100 text-emerald-700' : ''}`,
  `\${node.state === 'COMMITTED' ? 'bg-emerald-100 text-emerald-700' : ''}
            \${node.state === 'EXECUTING' ? 'bg-amber-100 text-amber-700 animate-pulse' : ''}
            \${node.state === 'VERIFYING' ? 'bg-purple-100 text-purple-700' : ''}
            \${node.state === 'RESOLVED' ? 'bg-gray-800 text-white' : ''}`
);

// 5. Update COMMITTED action block to include "Begin Execution"
const committedBlockOld = `{node.state === 'COMMITTED' && node.type === 'ACTOR' && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
              className={\`text-[10px] font-bold py-1.5 px-3 rounded-md transition-colors \${activeContextId === node.id ? 'bg-indigo-600 text-white shadow-neo-down' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
            >
              {activeContextId === node.id ? 'Exit Actor Projection' : 'Enter Actor Projection'}
            </button>
          </div>
        )}`;

const committedBlockNew = `{node.state === 'COMMITTED' && node.type === 'ACTOR' && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
              className={\`text-[10px] font-bold py-1.5 px-3 rounded-md transition-colors \${activeContextId === node.id ? 'bg-indigo-600 text-white shadow-neo-down' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
            >
              {activeContextId === node.id ? 'Exit Actor Projection' : 'Enter Actor Projection'}
            </button>
            {activeContextId === node.id && (
              <button 
                onClick={() => {
                  causalAudio.playTick();
                  RealityEngine.updateNode(node.id, { state: 'EXECUTING' });
                }}
                className="text-[10px] font-bold py-1.5 px-3 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
              >
                Begin Execution
              </button>
            )}
          </div>
        )}`;
content = content.replace(committedBlockOld, committedBlockNew);

// 6. Add EXECUTING and VERIFYING blocks
const executionVerificationBlocks = `
        {node.state === 'EXECUTING' && node.type === 'ACTOR' && (
          <div className="mt-3 flex flex-col gap-2">
             <div className="text-xs text-amber-600 font-bold mb-1 animate-pulse">Executing Responsibility...</div>
             {(currentProjection === node.id || activeContextId === node.id) && (
               <button 
                 onClick={() => {
                   causalAudio.playSettleHarmony();
                   // Submit Evidence
                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: 'Proof of Work (Simulated)',
                     state: 'VERIFYING'
                   });
                   RealityEngine.addEdge(node.id, evidenceId, 'provides');
                   RealityEngine.updateNode(node.id, { state: 'VERIFYING' });
                   
                   // Find parent dependency and mark it VERIFYING
                   const edges = Object.values(RealityEngine.getGraph().edges);
                   const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                   if (parentEdge) {
                     RealityEngine.updateNode(parentEdge.sourceId, { state: 'VERIFYING' });
                   }
                 }}
                 className="text-xs font-bold py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors self-start shadow-neo-down"
               >
                 Submit Proof / Evidence
               </button>
             )}
          </div>
        )}

        {node.state === 'VERIFYING' && (node.type === 'ACTOR' || node.type === 'DEPENDENCY') && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="text-xs text-purple-600 font-bold mb-1">Awaiting Verification...</div>
            {/* If Owner or Parent Projection, can verify */}
            {(currentProjection === 'owner' || (currentProjection !== node.id && node.type === 'ACTOR')) && (
              <button 
                onClick={() => {
                  causalAudio.playCommitChord();
                  RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                  
                  // If verifying an Actor, also resolve its parent dependency
                  if (node.type === 'ACTOR') {
                    const edges = Object.values(RealityEngine.getGraph().edges);
                    const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                    if (parentEdge) {
                      RealityEngine.updateNode(parentEdge.sourceId, { state: 'RESOLVED' });
                    }
                  }
                }}
                className="text-xs font-bold py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors self-start shadow-neo-down flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify & Resolve
              </button>
            )}
          </div>
        )}
        
        {node.state === 'VERIFYING' && node.type === 'EVIDENCE' && (
          <div className="mt-1 flex gap-2">
            <button 
                onClick={() => {
                  causalAudio.playSettleHarmony();
                  RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                }}
                className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1 px-3 rounded hover:bg-gray-200 transition-colors"
            >
              View Document
            </button>
          </div>
        )}
`;

content = content.replace(
  `{node.state === 'UNKNOWN' && node.type === 'DEPENDENCY' && (`,
  `${executionVerificationBlocks}\n        {node.state === 'UNKNOWN' && node.type === 'DEPENDENCY' && (`
);

fs.writeFileSync(path, content);
console.log("Phase 7 (Execution & Evidence) implemented successfully.");
