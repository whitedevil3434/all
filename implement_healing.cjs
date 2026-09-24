const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Decline Offer (Auto Healing)
const declineStart = `            <button 
              onClick={() => {
                RealityEngine.updateNode(node.id, { state: 'FAILED' });
              }}
              className="text-xs font-bold text-gray-500 bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Decline
            </button>`;

const declineHeal = `            <button 
              onClick={() => {
                RealityEngine.updateNode(node.id, { state: 'FAILED' });
                
                // PHASE 11: AUTO-HEALING REALITY
                const edges = Object.values(RealityEngine.getGraph().edges);
                const parentEdge = edges.find(e => e.targetId === node.id && e.relation === 'candidate');
                if (parentEdge) {
                  const parentId = parentEdge.sourceId;
                  setTimeout(() => {
                    causalAudio.playTick();
                    RealityEngine.updateNode(parentId, { state: 'ASKING' });
                    
                    setTimeout(() => {
                      const newActorId = RealityEngine.addNode({
                        type: 'ACTOR',
                        label: 'Alternative Candidate',
                        state: 'POSSIBLE',
                        attention: 100
                      });
                      RealityEngine.addEdge(parentId, newActorId, 'candidate');
                      RealityEngine.updateNode(parentId, { state: 'POSSIBLE' });
                      causalAudio.playSettleHarmony();
                    }, 2000);
                  }, 800);
                }
              }}
              className="text-xs font-bold text-gray-500 bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              Decline
            </button>`;

content = content.replace(declineStart, declineHeal);

// 2. Reject Verification (Auto Healing)
const verifyStart = `            {(currentProjection === 'owner' || (currentProjection !== node.id && node.type === 'ACTOR')) && (
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
            )}`;

const verifyHeal = `            {(currentProjection === 'owner' || (currentProjection !== node.id && node.type === 'ACTOR')) && (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    causalAudio.playCommitChord();
                    RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                    
                    if (node.type === 'ACTOR') {
                      const edges = Object.values(RealityEngine.getGraph().edges);
                      const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                      if (parentEdge) {
                        RealityEngine.updateNode(parentEdge.sourceId, { state: 'RESOLVED' });
                      }
                    }
                  }}
                  className="text-xs font-bold py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-neo-down flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Verify & Resolve
                </button>
                
                {/* PHASE 11: REJECT AND AUTO-HEAL */}
                <button 
                  onClick={() => {
                    RealityEngine.updateNode(node.id, { state: 'FAILED' });
                    
                    if (node.type === 'ACTOR') {
                      const edges = Object.values(RealityEngine.getGraph().edges);
                      const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                      if (parentEdge) {
                        const parentId = parentEdge.sourceId;
                        setTimeout(() => {
                          causalAudio.playTick();
                          RealityEngine.updateNode(parentId, { state: 'ASKING' });
                          setTimeout(() => {
                            const newActorId = RealityEngine.addNode({
                              type: 'ACTOR',
                              label: 'Replacement Candidate',
                              state: 'POSSIBLE',
                              attention: 100
                            });
                            RealityEngine.addEdge(parentId, newActorId, 'candidate');
                            RealityEngine.updateNode(parentId, { state: 'POSSIBLE' });
                            causalAudio.playSettleHarmony();
                          }, 2500);
                        }, 1000);
                      }
                    }
                  }}
                  className="text-xs font-bold py-2 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-neo-down flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}`;

content = content.replace(verifyStart, verifyHeal);

fs.writeFileSync(path, content);
console.log("Phase 11 (Auto-Healing Reality) implemented.");
