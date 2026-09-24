const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace COMMITTED ACTOR block
const oldCommittedBlockRegex = /\{node\.state === 'COMMITTED' && node\.type === 'ACTOR' && \([\s\S]*?<\/button>\n            <\/div>\n          \)\}/;

const newCommittedBlock = `{node.state === 'COMMITTED' && node.type === 'ACTOR' && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">Payment Assurance Locked</div>
                    <div className="text-xs font-semibold">{node.data?.cost || 'Amount Reserved'}</div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium bg-emerald-100/50 px-2 py-1 rounded">
                  ESCROW
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    causalAudio.playPop();
                    RealityEngine.updateNode(node.id, { state: 'EXECUTING' });
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  Begin Execution
                </button>
                <button 
                  onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
                  className={\`\${activeContextId === node.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 text-[10px] font-bold py-2 px-3 rounded-lg transition-colors\`}
                >
                  {activeContextId === node.id ? <X className="w-4 h-4"/> : <Activity className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          )}
          
          {node.state === 'EXECUTING' && node.type === 'ACTOR' && (
            <div className="mt-3 flex flex-col gap-2">
               <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                 <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-3">
                   <span>Execution in Progress</span>
                   <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Live</span>
                 </div>
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     causalAudio.playSettleHarmony();
                     
                     // 1. Create Evidence Node
                     const evidenceId = RealityEngine.addNode({
                       type: 'EVIDENCE',
                       label: 'Delivery Confirmation Receipt',
                       state: 'VERIFYING',
                       data: { 
                         fileType: 'JPEG Image',
                         size: '2.4 MB',
                         timestamp: new Date().toLocaleTimeString()
                       }
                     });
                     RealityEngine.addEdge(node.id, evidenceId, 'provides');
                     
                     // 2. Move Actor to VERIFYING
                     RealityEngine.updateNode(node.id, { state: 'VERIFYING' });
                   }}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                   <FileCheck className="w-3.5 h-3.5" />
                   Submit Evidence (Simulate)
                 </button>
               </div>
            </div>
          )}
          
          {node.state === 'VERIFYING' && node.type === 'ACTOR' && (
            <div className="mt-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
               <div className="text-[10px] text-purple-700 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                 <FileCheck className="w-3.5 h-3.5" /> Evidence Review
               </div>
               <p className="text-xs text-purple-600 mb-3 font-medium">Review the attached evidence to release the escrow payment.</p>
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   causalAudio.playCommitChord();
                   
                   // Move actor to RESOLVED
                   RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                   
                   // Resolve child evidence
                   const edges = Object.values(RealityEngine.getGraph().edges);
                   const childEdges = edges.filter(ed => ed.sourceId === node.id);
                   childEdges.forEach(ed => {
                     const child = RealityEngine.getGraph().nodes[ed.targetId];
                     if (child && child.type === 'EVIDENCE') {
                       RealityEngine.updateNode(ed.targetId, { state: 'RESOLVED' });
                     }
                   });
                   // Resolve parent dependency
                   const parentEdge = edges.find(ed => ed.targetId === node.id);
                   if (parentEdge) {
                     RealityEngine.updateNode(parentEdge.sourceId, { state: 'RESOLVED' });
                   }
                 }}
                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
               >
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 Verify & Release Payment
               </button>
            </div>
          )}`;

content = content.replace(oldCommittedBlockRegex, newCommittedBlock);

// ensure Play is imported
if (!content.includes('Play,')) {
  content = content.replace(/import \{ Sparkles,/, 'import { Play, Sparkles,');
}

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
