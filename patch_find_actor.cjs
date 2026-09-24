const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add the states at the beginning of the component
if (!content.includes('findingActorForIdx')) {
  const hookInjectionPoint = "const [isListening, setIsListening] = useState(false);";
  const stateHooks = `const [isListening, setIsListening] = useState(false);
  const [findingActorForIdx, setFindingActorForIdx] = useState<number | null>(null);
  const [resolvedActors, setResolvedActors] = useState<Record<number, any>>({});
  
  const handleFindActor = (idx: number, dep: any) => {
    setFindingActorForIdx(idx);
    causalAudio.playAttention();
    setTimeout(() => {
      causalAudio.playSuccess();
      setResolvedActors(prev => ({
        ...prev,
        [idx]: {
          name: dep.label === "Hardware Specification Definition" || dep.label.includes("Hardware") ? "System Expert" : 
                (dep.label.includes("Vendor") || dep.label.includes("Supplier") ? "StarTech (Verified Vendor)" : "Operations Manager"),
          status: "COMMITTED"
        }
      }));
      setFindingActorForIdx(null);
    }, 2500);
  };`;
  content = content.replace(hookInjectionPoint, stateHooks);
}

// Find the render block for proposedDependencies and patch the button
const btnOld = `<button className="w-full py-2.5 bg-[#e0e5ec] text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_12px_#bec3c9,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Find Actor &rarr;</span>
                        </button>`;
const btnNew = `{resolvedActors[idx] ? (
                          <div className="w-full py-3 px-4 bg-[#e0e5ec] rounded-xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] border-l-2 border-emerald-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-bold text-gray-800">{resolvedActors[idx].name}</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{resolvedActors[idx].status}</span>
                          </div>
                        ) : findingActorForIdx === idx ? (
                          <div className="w-full py-2.5 bg-[#e0e5ec] rounded-xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center gap-2 text-amber-600 font-bold text-xs">
                            <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <span>Scanning Causal Network...</span>
                          </div>
                        ) : (
                          <button onClick={() => handleFindActor(idx, dep)} className="w-full py-2.5 bg-[#e0e5ec] text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_12px_#bec3c9,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Find Actor &rarr;</span>
                          </button>
                        )}`;
content = content.replace(btnOld, btnNew);

fs.writeFileSync(path, content);
console.log('Patched LivingCausalSurface for Find Actor logic');
