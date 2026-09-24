const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find where hypothesis state is declared
// Add dynamicCards state
const stateHookTarget = "const [findingActorForIdx, setFindingActorForIdx] = useState<number | null>(null);";
const stateHookNew = `const [findingActorForIdx, setFindingActorForIdx] = useState<number | null>(null);
  const [dynamicReality, setDynamicReality] = useState<{ active: boolean, nodes: any[] }>({ active: false, nodes: [] });`;
content = content.replace(stateHookTarget, stateHookNew);

// In handleFindActor, we populate resolvedActors. 
// When all are resolved, we show a Launch button.

const findActorTarget = `<AnimatePresence>
                  {hypothesis.proposedDependencies.map((dep: any, idx: number) => (`
const findActorNew = `
              {Object.keys(resolvedActors).length > 0 && Object.keys(resolvedActors).length === hypothesis.proposedDependencies.length && (
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
              )}
              <AnimatePresence>
                  {hypothesis.proposedDependencies.map((dep: any, idx: number) => (`

content = content.replace(findActorTarget, findActorNew);
fs.writeFileSync(path, content);
