const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Move the Launch button to the BOTTOM of the hypothesis list
const btnCode = `              {Object.keys(resolvedActors).length > 0 && Object.keys(resolvedActors).length === hypothesis.proposedDependencies.length && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-4">
                  <button 
                    onClick={() => {
                      causalAudio.playSettleHarmony();
                      setDynamicReality({
                        active: true,
                        nodes: hypothesis.proposedDependencies.map((d: any, i: number) => ({
                          ...d,
                          actor: resolvedActors[i]
                        }))
                      });
                      setActiveWant({
                        ...activeWant,
                        item: (hypothesis as any).inferredMeaning || activeWant.item
                      });
                      clearHypothesis();
                    }}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Launch New Reality</span>
                  </button>
                </motion.div>
              )}`;

content = content.replace(btnCode, ""); // Remove from top

// Find the end of the hypothesis mapping loop and insert the button there
const endOfLoop = `</AnimatePresence>`;
content = content.replace(endOfLoop, endOfLoop + "\n" + btnCode);


// 2. Fix the styling of the Pending Dependency cards to match Neumorphic system
const oldCardStyle = `className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-amber-200 flex flex-col relative overflow-hidden mt-2"`;
const newCardStyle = `className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex flex-col relative overflow-hidden mt-2"`;
content = content.replace(new RegExp(oldCardStyle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCardStyle);

const oldIconBox = `className="w-11 h-11 rounded-full border border-amber-200 bg-amber-50/70 flex items-center justify-center text-amber-800 shrink-0"`;
const newIconBox = `className="w-11 h-11 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-amber-600"`;
content = content.replace(new RegExp(oldIconBox.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newIconBox);

const oldDivider = `<div className="w-full h-px bg-neo-bg my-3" />`;
const newDivider = `<div className="w-full h-px shadow-neo-down my-3" />`;
content = content.replace(new RegExp(oldDivider.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newDivider);


fs.writeFileSync(path, content);
console.log('Fixed visual bugs and layout');
