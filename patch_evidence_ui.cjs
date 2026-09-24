const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state for evidence inputs
if (!content.includes('const [evidenceInputs, setEvidenceInputs]')) {
  content = content.replace(
    /const \[isProcessing, setIsProcessing\] = useState\(false\);/,
    'const [isProcessing, setIsProcessing] = useState(false);\n  const [evidenceInputs, setEvidenceInputs] = useState<Record<string, string>>({});'
  );
}

// 2. Replace the EXECUTING ACTOR UI
const oldExecutingUI = `
               <div className="text-xs text-amber-600 font-bold mb-1 animate-pulse">Executing Responsibility...</div>
               {(currentProjection === node.id || activeContextId === node.id) && (
                 <button 
                   onClick={() => {
                     causalAudio.playSettleHarmony();
                     const generatedEvidence = getContextualEvidence(node.data?.role || '');
                     const evidenceId = RealityEngine.addNode({
                       type: 'EVIDENCE',
                       label: generatedEvidence.label,
                       state: 'VERIFYING',
                       data: {
                         fileType: generatedEvidence.fileType,
                         size: generatedEvidence.size,
                         summary: generatedEvidence.summary,
                         hash: generatedEvidence.hash,
                         timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                       }
                     });
                     RealityEngine.addEdge(node.id, evidenceId, 'provides');
                     RealityEngine.updateNode(node.id, { state: 'VERIFYING' });
                     
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
               )}`;

const newExecutingUI = `
               <div className="text-xs text-amber-600 font-bold mb-3 animate-pulse">Executing Responsibility...</div>
               {(currentProjection === node.id || activeContextId === node.id) && (
                 <div className="flex flex-col gap-2">
                   <textarea
                     placeholder="Paste proof of work (e.g. Github PR, Figma Link) or describe the outcome..."
                     value={evidenceInputs[node.id] || ''}
                     onChange={(e) => setEvidenceInputs(prev => ({ ...prev, [node.id]: e.target.value }))}
                     className="w-full bg-neo-bg rounded-lg p-3 text-xs border-none shadow-neo-down focus:shadow-neo-down-md focus:outline-none transition-all text-gray-700 min-h-[60px] resize-none"
                   />
                   <button 
                     disabled={!(evidenceInputs[node.id]?.trim())}
                     onClick={() => {
                       causalAudio.playSettleHarmony();
                       const userProof = evidenceInputs[node.id]?.trim();
                       const evidenceId = RealityEngine.addNode({
                         type: 'EVIDENCE',
                         label: 'Work Submitted',
                         state: 'VERIFYING',
                         data: {
                           fileType: 'User Submission',
                           size: userProof.length + ' bytes',
                           summary: userProof,
                           hash: '0x' + Math.random().toString(16).slice(2, 10).toUpperCase(),
                           timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                         }
                       });
                       RealityEngine.addEdge(node.id, evidenceId, 'provides');
                       RealityEngine.updateNode(node.id, { state: 'VERIFYING' });
                       
                       const edges = Object.values(RealityEngine.getGraph().edges);
                       const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                       if (parentEdge) {
                         RealityEngine.updateNode(parentEdge.sourceId, { state: 'VERIFYING' });
                       }
                     }}
                     className="text-xs font-bold py-2 px-4 rounded-lg bg-neo-bg shadow-neo-up text-amber-600 hover:shadow-neo-down transition-all self-start disabled:opacity-50"
                   >
                     Submit Proof / Evidence
                   </button>
                 </div>
               )}`;

content = content.replace(oldExecutingUI, newExecutingUI);

fs.writeFileSync(path, content);
console.log("Evidence UI Patched.");
