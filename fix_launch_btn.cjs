const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const btnCodeStr = `              {Object.keys(resolvedActors).length > 0 && Object.keys(resolvedActors).length === hypothesis.proposedDependencies.length && (
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

content = content.replace(btnCodeStr, "");

const correctInsertPoint = `                </AnimatePresence>
              </>
              ) : realityStage === 'universal_reasoning' ? (`;

const newCode = `                </AnimatePresence>
${btnCodeStr}
              </>
              ) : realityStage === 'universal_reasoning' ? (`;

content = content.replace(correctInsertPoint, newCode);

fs.writeFileSync(path, content);
console.log('Fixed launch button location');
