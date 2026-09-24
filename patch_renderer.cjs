const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update hasSemantics
content = content.replace(
  /const hasSemantics = node\.data\?\.rationale \|\| \(node\.data\?\.unknowns && node\.data\.unknowns\.length > 0\) \|\| node\.data\?\.proposal \|\| node\.data\?\.summary;/,
  "const hasSemantics = node.data?.rationale || (node.data?.unknowns && node.data.unknowns.length > 0) || node.data?.proposal || node.data?.summary || node.data?.proofOfReality;"
);

// 2. Insert Proof of Reality block
const proofOfRealityBlock = `
                {node.data?.proposal && node.state !== 'FAILED' && node.state !== 'COMMITTED' && node.state !== 'EXECUTING' && node.state !== 'VERIFYING' && node.state !== 'RESOLVED' && (
                  <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl shadow-inner text-xs text-amber-800/80 leading-relaxed font-medium relative mb-2 break-words">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">Actor Proposal</span>
                    <div className={isExpanded ? '' : 'line-clamp-1'}>"{node.data.proposal}"</div>
                  </div>
                )}

                {node.type === 'ACTOR' && node.data?.proofOfReality && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl shadow-inner text-xs text-emerald-800/80 leading-relaxed font-medium mb-2">
                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-2">
                      <Lock className="w-3 h-3" /> Identity by Resolution
                    </span>
                    {isExpanded ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/60 p-2 rounded-lg border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider mb-0.5">Resolutions</span>
                          <span className="text-lg font-black text-emerald-700">{node.data.proofOfReality.totalResolutions}</span>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider mb-0.5">Gravity</span>
                          <span className="text-lg font-black text-emerald-700">{node.data.proofOfReality.gravityScore}</span>
                        </div>
                        <div className="col-span-2 bg-white/60 p-2 rounded-lg border border-emerald-100/50 flex flex-col items-start text-left mt-1">
                          <div className="w-full flex justify-between items-center mb-1">
                            <span className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider">Reliability Momentum</span>
                            <span className="text-[9px] font-mono text-emerald-600/80">{node.data.proofOfReality.reliabilityIndex}</span>
                          </div>
                          <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: node.data.proofOfReality.reliabilityIndex }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="line-clamp-1 text-[10px] font-mono flex gap-4 text-emerald-700">
                        <span>RES: {node.data.proofOfReality.totalResolutions}</span>
                        <span>GRV: {node.data.proofOfReality.gravityScore}</span>
                      </div>
                    )}
                  </div>
                )}
`;

content = content.replace(
  /                \{node\.data\?\.proposal && node\.state !== 'FAILED' && node\.state !== 'COMMITTED' && node\.state !== 'EXECUTING' && node\.state !== 'VERIFYING' && node\.state !== 'RESOLVED' && \(\n                  <div className="p-3 bg-amber-50\/50 border border-amber-100\/50 rounded-xl shadow-inner text-xs text-amber-800\/80 leading-relaxed font-medium relative mb-2 break-words">\n                    <span className="block text-\[9px\] font-bold uppercase tracking-widest text-amber-500 mb-1">Actor Proposal<\/span>\n                    <div className=\{isExpanded \? '' : 'line-clamp-1'\}>"\{node\.data\.proposal\}"<\/div>\n                  <\/div>\n                \)\}/,
  proofOfRealityBlock
);

fs.writeFileSync(path, content);
console.log("Patched actor proof of reality rendering.");
