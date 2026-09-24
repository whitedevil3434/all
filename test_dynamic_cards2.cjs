const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `{/* CARD 2: COMMITTED SUPPLIER (Rahim) */}`;
const injection = `
              {dynamicReality.active ? (
                <>
                  {dynamicReality.nodes.map((node, idx) => (
                    <React.Fragment key={'dynamic-'+idx}>
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex items-center gap-4 mt-2"
                      >
                        <div className="w-12 h-12 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-[#1C1C1A]">
                          <User className="w-5 h-5 text-emerald-600 stroke-[1.5]" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {node.label}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              COMMITTED
                            </span>
                          </div>
                          <span className="text-base sm:text-[17px] font-bold text-[#1C1C1A] leading-snug">
                            {node.actor.name}
                          </span>
                          <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{node.rationale}</p>
                        </div>
                      </motion.div>
                      {idx < dynamicReality.nodes.length - 1 && (
                        <div className="flex flex-col items-center my-0.5">
                          <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                          <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Delivery Node for Dynamic Reality */}
                  <div className="flex flex-col items-center my-0.5">
                    <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                    <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                  </div>
                  <motion.div className="w-full bg-neo-bg rounded-full px-5 py-3 shadow-neo-up border border-white/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 block leading-tight">All Operations Verified</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Awaiting Execution</span>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* CARD 2: COMMITTED SUPPLIER (Rahim) */}`;

content = content.replace(target, injection);

// Let's close the `) : (` block properly. We opened an extra conditional branch.
// We need to close it where the original hardcoded flow ends.
const endTarget = `{/* ========================================================= */}
              {/* STAGE D: PROOF OF REALITY (The Escrow & Settlement step) */}`;

const closeInjection = `
                </>
              )}
              {/* ========================================================= */}
              {/* STAGE D: PROOF OF REALITY (The Escrow & Settlement step) */}`;

content = content.replace(endTarget, closeInjection);

fs.writeFileSync(path, content);
console.log('Dynamic rendering enabled');
