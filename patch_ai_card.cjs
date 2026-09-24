const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchStr = `{hypothesis ? (
                <>
    
              <AnimatePresence>`;

const replacementStr = `{hypothesis ? (
                <>
                
                {/* AI REASONING / SEMANTIC ENVELOPE CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex flex-col relative overflow-hidden mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-indigo-500">
                      <Sparkles className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                        AI SEMANTIC INTERPRETATION
                      </span>
                      <span className="text-base font-black text-gray-900 leading-tight">
                        Causal Hypothesis
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 px-1">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {hypothesis.inferredMeaning}
                    </p>
                  </div>
                  
                  {hypothesis.unknowns && hypothesis.unknowns.length > 0 && (
                    <div className="mt-4 p-3 bg-neo-bg shadow-neo-down rounded-xl border border-transparent">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Missing Dependencies / Unknowns
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {hypothesis.unknowns.map((u: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-indigo-400 mt-0.5">•</span>
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Atmospheric Connector */}
                <div className="flex flex-col items-center my-0.5">
                  <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                  <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                </div>
    
              <AnimatePresence>`;

content = content.replace(searchStr, replacementStr);
fs.writeFileSync(path, content);
console.log('Patched LivingCausalSurface.tsx with AI Reasoner card');
