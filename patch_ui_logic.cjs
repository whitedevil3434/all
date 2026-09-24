const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Analyze Options (Auto-Delegate)
const oldAnalyze = `{node.state === 'POSSIBLE' && node.type === 'DEPENDENCY' && (
            <button 
              onClick={() => {
                causalAudio.playTick();
                // We don't auto-resolve here, user must click Ask
              }}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg mt-2 hover:bg-indigo-100 transition-colors self-start"
            >
              Analyze Options
            </button>
          )}`;

const newAnalyze = `{node.state === 'POSSIBLE' && node.type === 'DEPENDENCY' && (
            <button 
              onClick={() => {
                causalAudio.playTick();
                const candidates = Object.values(RealityEngine.getGraph().edges)
                  .filter(e => e.sourceId === node.id && e.relation === 'candidate')
                  .map(e => RealityEngine.getGraph().nodes[e.targetId])
                  .filter(Boolean);
                
                if (candidates.length > 0) {
                  const bestActor = candidates[0];
                  RealityEngine.updateNode(bestActor.id, { state: 'COMMITTED' });
                  candidates.forEach(cand => {
                    if (cand.id !== bestActor.id) RealityEngine.updateNode(cand.id, { state: 'FAILED' });
                  });
                  RealityEngine.updateNode(node.id, { state: 'COMMITTED' });
                  causalAudio.playCommitChord();
                }
              }}
              className="text-xs font-bold text-indigo-600 bg-neo-bg shadow-neo-up py-2 px-4 rounded-lg mt-2 hover:shadow-neo-down transition-all self-start flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Auto-Delegate (Pick Best)
            </button>
          )}`;

// 2. WANT node (Complete/Abort)
const oldWant = `{node.type === 'WANT' && (
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => onOpenProvenance(node.id)}
                className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1.5 px-3 rounded hover:bg-gray-200 transition-colors flex items-center gap-1.5"
              >
                <Activity className="w-3 h-3" />
                Ledger
              </button>
            </div>
          )}`;

const newWant = `{node.type === 'WANT' && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => onOpenProvenance(node.id)}
                className="text-[10px] font-bold text-gray-500 bg-neo-bg shadow-neo-up-sm py-1.5 px-3 rounded hover:shadow-neo-down-sm transition-all flex items-center gap-1.5"
              >
                <Activity className="w-3 h-3" />
                Ledger
              </button>
              
              {node.state !== 'RESOLVED' && node.state !== 'FAILED' && (
                <>
                  <button 
                    onClick={() => {
                      causalAudio.playCommitChord();
                      RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                    }}
                    className="text-[10px] font-bold text-emerald-600 bg-neo-bg shadow-neo-up-sm py-1.5 px-3 rounded hover:shadow-neo-down-sm transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Complete Reality
                  </button>
                  <button 
                    onClick={() => {
                      causalAudio.playTick();
                      RealityEngine.updateNode(node.id, { state: 'FAILED' });
                    }}
                    className="text-[10px] font-bold text-red-500 bg-neo-bg shadow-neo-up-sm py-1.5 px-3 rounded hover:shadow-neo-down-sm transition-all flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Abort Reality
                  </button>
                </>
              )}
            </div>
          )}`;

// 3. Reject Evidence
const oldEvidence = `{node.state === 'VERIFYING' && node.type === 'EVIDENCE' && (
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
          )}`;

const newEvidence = `{node.state === 'VERIFYING' && node.type === 'EVIDENCE' && (
            <div className="mt-2 flex gap-2">
              <button 
                  onClick={() => {
                    causalAudio.playSettleHarmony();
                    RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                  }}
                  className="text-[10px] font-bold text-emerald-600 bg-neo-bg shadow-neo-up-sm py-1.5 px-3 rounded hover:shadow-neo-down-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3" />
                Accept Evidence
              </button>
              <button 
                  onClick={() => {
                    causalAudio.playTick();
                    RealityEngine.updateNode(node.id, { state: 'FAILED' });
                    const edges = Object.values(RealityEngine.getGraph().edges);
                    const parentEdge = edges.find(e => e.targetId === node.id);
                    if (parentEdge) {
                      RealityEngine.updateNode(parentEdge.sourceId, { state: 'EXECUTING' });
                    }
                  }}
                  className="text-[10px] font-bold text-red-500 bg-neo-bg shadow-neo-up-sm py-1.5 px-3 rounded hover:shadow-neo-down-sm transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3 h-3" />
                Reject & Revise
              </button>
            </div>
          )}`;

content = content.replace(oldAnalyze, newAnalyze);
content = content.replace(oldWant, newWant);
content = content.replace(oldEvidence, newEvidence);

fs.writeFileSync(path, content);
console.log("UI Logic applied.");
