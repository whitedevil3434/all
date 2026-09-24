const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Insert clarification input in the hypothesis panel
const unknownsBlock = `
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
              
              {hypothesis.unknowns && hypothesis.unknowns.length > 0 && (
                <div className="mt-6 bg-indigo-50/80 p-4 rounded-xl border border-indigo-100/50 shadow-inner">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-3">Open Clarifications</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-indigo-700 mb-4 font-medium">
                    {hypothesis.unknowns.map((u, idx) => <li key={idx}>{u}</li>)}
                  </ul>
                  <div className="relative">
                    <input 
                      type="text"
                      id="clarification-input"
                      disabled={isProcessing}
                      placeholder="Answer in natural language to refine..."
                      className="w-full bg-white rounded-lg py-2.5 pl-4 pr-10 text-sm border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val) {
                            const refinementPrompt = \`Original Intent: \${hypothesis.inferredMeaning}\nPending Unknowns: \${hypothesis.unknowns.join(', ')}\n\nUser Clarification: \${val}\n\nPlease refine the proposal, resolve the unknowns, and generate a new structure.\`;
                            submitIntent(refinementPrompt);
                          }
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
`;

content = content.replace(/              <div className="flex flex-col gap-3">\n                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Proposed Dependencies<\/h4>\n                \{hypothesis\.proposedDependencies\.map\(\(dep, idx\) => \(\n                  <div key=\{idx\} className="bg-white p-3 rounded-xl shadow-2xs border border-black\/5 flex items-start gap-3">\n                    <Package className="w-4 h-4 text-amber-500 mt-0\.5 shrink-0" \/>\n                    <div>\n                      <p className="font-bold text-sm text-gray-800">\{dep\.label\}<\/p>\n                      <p className="text-xs text-gray-500">\{dep\.rationale\}<\/p>\n                    <\/div>\n                  <\/div>\n                \)\)\}\n              <\/div>/, unknownsBlock);

fs.writeFileSync(path, content);
console.log("Patched hypothesis rendering.");
