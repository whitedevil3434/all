const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix Dependency Node Creation mapping
const oldCreation = `hypothesis.proposedDependencies.forEach(dep => {
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
                      });`;

const newCreation = `hypothesis.proposedDependencies.forEach(dep => {
                        const depId = RealityEngine.addNode({
                          type: 'DEPENDENCY',
                          label: dep.label,
                          state: 'UNKNOWN',
                          data: { 
                            rationale: dep.rationale,
                            contextualDetails: dep.contextualDetails || '',
                            unknowns: dep.clarificationQuestions || []
                          }
                        });
                        RealityEngine.addEdge(parentId, depId, 'requires');
                      });`;
content = content.replace(oldCreation, newCreation);

// 2. Add Contextual Insights rendering inside NodeRenderer
const targetRender = `{node.data?.unknowns && node.data.unknowns.length > 0 && (`;
const newRender = `{node.data?.contextualDetails && (
                  <div className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-indigo-700/80 leading-relaxed font-medium mb-2">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-1">AI Contextual Insights</span>
                    <div className={isExpanded ? '' : 'line-clamp-2'}>{node.data.contextualDetails}</div>
                  </div>
                )}
                
                {node.data?.unknowns && node.data.unknowns.length > 0 && (`

content = content.replace(targetRender, newRender);

fs.writeFileSync(path, content);
console.log("Surface Context Patched.");
