const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to inject useUniversalCompose
const importCode = `import { useUniversalCompose } from '../engine/universal/useUniversalCompose';`;
content = content.replace("import { CausalSemanticParser } from '../engine/causalSemanticParser';", importCode);

// Add the hook inside the component
const hookCode = `  const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();`;
content = content.replace("  const wants = nodes.filter(n => n.type === 'WANT');", `  const wants = nodes.filter(n => n.type === 'WANT');\n${hookCode}`);

// Update handleInput
const handleInputOld = `    setTimeout(() => {
      // Very basic Mock Semantic Action based on user's prompt
      // We will wire this to useUniversalCompose next.
      const wantId = RealityEngine.addNode({
        type: 'WANT',
        label: inputText,
        state: 'UNKNOWN',
        attention: 100
      });
      
      causalAudio.playCommitChord();
      setInputText('');
      setIsProcessing(false);
    }, 1500);`;

const handleInputNew = `    try {
      await submitIntent(inputText, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }`;

content = content.replace(handleInputOld, handleInputNew);

// Also we need to render the hypothesis
const rendererOld = `          {wants.map(want => (
            <NodeRenderer key={want.id} node={want} />
          ))}
        </AnimatePresence>
      </div>`;

const rendererNew = `          {wants.map(want => (
            <NodeRenderer key={want.id} node={want} />
          ))}
          
          {isComposing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center p-8 mt-10 text-indigo-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Materializing Logic...</p>
            </motion.div>
          )}

          {hypothesis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 shadow-neo-up-lg mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-indigo-900 text-lg">Causal Hypothesis</h3>
              </div>
              
              <p className="text-gray-700 text-sm mb-6 leading-relaxed">{hypothesis.inferredMeaning}</p>
              
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Proposed Dependencies</h4>
                {hypothesis.proposedDependencies.map((dep, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl shadow-2xs border border-black/5 flex items-start gap-3">
                    <Package className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-gray-800">{dep.label}</p>
                      <p className="text-xs text-gray-500">{dep.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => {
                    clearHypothesis();
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-gray-500 hover:bg-black/5 transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={() => {
                    const wantId = RealityEngine.addNode({
                      type: 'WANT',
                      label: hypothesis.inferredMeaning,
                      state: 'COMMITTED',
                      attention: 50
                    });
                    
                    hypothesis.proposedDependencies.forEach(dep => {
                      const depId = RealityEngine.addNode({
                        type: 'DEPENDENCY',
                        label: dep.label,
                        state: 'UNKNOWN',
                        attention: 80
                      });
                      RealityEngine.addEdge(wantId, depId, 'requires');
                    });
                    
                    clearHypothesis();
                    causalAudio.playSettleHarmony();
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-neo-down transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Materialize Reality
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>`;

content = content.replace(rendererOld, rendererNew);

fs.writeFileSync(path, content);
console.log('Fixed DynamicRealitySurface');
