const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `                  onClick={() => {
                    if (hypothesis) {
                      // 1. Create the Root Want or attach to pending context
                      let parentId = pendingContextId;
                      if (!parentId) {
                        parentId = RealityEngine.addNode({
                          type: 'WANT',
                          label: hypothesis.inferredMeaning.substring(0, 50) + '...', // Shortened for label
                          state: 'UNKNOWN',
                          data: { rationale: hypothesis.inferredMeaning }
                        });
                      }

                      // 2. Add all proposed dependencies
                      hypothesis.proposedDependencies.forEach(dep => {
                        const depId = RealityEngine.addNode({
                          type: 'DEPENDENCY',
                          label: dep.label,
                          state: 'UNKNOWN',
                          data: { 
                            rationale: dep.rationale,
                            unknowns: hypothesis.unknowns
                          }
                        });
                        RealityEngine.addEdge(parentId, depId, 'requires');
                      });
                    }
                    
                    clearHypothesis();
                    setPendingContextId(null);
                    causalAudio.playSettleHarmony();
                  }}`;

content = content.replace(/                  onClick=\{\(\) => \{\n                    clearHypothesis\(\);\n                    setPendingContextId\(null\);\n                    causalAudio\.playSettleHarmony\(\);\n                  \}\}/, replacement);

fs.writeFileSync(path, content);
console.log("Materialize logic injected.");
