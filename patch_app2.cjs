const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the rendering block in App.tsx
const oldRender = `{projectionRows.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <Sparkles className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-sm font-medium tracking-widest uppercase text-gray-500">Awaiting Intent</p>
            <p className="text-xs text-gray-400 mt-2">Try: "I need 50kg rice"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mt-4">
            <AnimatePresence>
              {projectionRows.map((row, index) => (
                <motion.div 
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Connectors */}
                  {index > 0 && row.type === 'single' && <VLine height="h-10" />}
                  {index > 0 && row.type === 'branch' && <BranchSVG />}
                  {index > 0 && row.type === 'merge-to-single' && <MergeSVG />}

                  {/* Nodes */}
                  <div className={\`flex \${row.nodes.length > 1 ? 'gap-3 sm:gap-6 w-full justify-center' : 'justify-center w-full'}\`}>
                    {row.nodes.map(node => (
                      <NodeCard 
                        key={node.id}
                        node={node}
                        focusedNode={focusedNode}
                        onClick={setFocusedNode}
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}`;

const newRender = `{projectionRows.length === 0 && draftIntents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <Sparkles className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-sm font-medium tracking-widest uppercase text-gray-500">Awaiting Intent</p>
            <p className="text-xs text-gray-400 mt-2">Try: "I need 50kg rice"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mt-4">
            <AnimatePresence>
              {/* Canonical Projection */}
              {projectionRows.map((row, index) => (
                <motion.div 
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Connectors */}
                  {index > 0 && row.type === 'single' && <VLine height="h-10" />}
                  {index > 0 && row.type === 'branch' && <BranchSVG />}
                  {index > 0 && row.type === 'merge-to-single' && <MergeSVG />}

                  {/* Nodes */}
                  <div className={\`flex \${row.nodes.length > 1 ? 'gap-3 sm:gap-6 w-full justify-center' : 'justify-center w-full'}\`}>
                    {row.nodes.map(node => (
                      <NodeCard 
                        key={node.id}
                        node={node}
                        focusedNode={focusedNode}
                        onClick={setFocusedNode}
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Firewall / Draft Projection */}
              {draftIntents.map((draft, idx) => {
                const draftNode = {
                  id: draft.id,
                  type: 'WANT' as const,
                  iconName: 'Sparkles',
                  title: draft.interpretation.title,
                  subtitle: draft.interpretation.subtitle || \`\${draft.interpretation.quantity || ''} \${draft.interpretation.unit || ''}\`.trim(),
                  details: draft.interpretation.deadline ? [\`Deadline: \${draft.interpretation.deadline}\`, \`Location: \${draft.interpretation.location || 'Unknown'}\`] : undefined,
                  statusText: 'AI INTERPRETATION'
                };
                
                return (
                  <motion.div 
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center w-full mt-8"
                  >
                    <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-200 pb-2 w-full max-w-sm text-center">
                      Reality Firewall (Provisional)
                    </div>
                    
                    <NodeCard 
                      node={draftNode}
                      focusedNode={focusedNode}
                      onClick={setFocusedNode}
                      onAction={handleAction}
                    />

                    <div className="mt-4 flex gap-3">
                       <button
                         onClick={async () => {
                           const newWorkId = await promoteDraftIntentToWork(draft.id, draft);
                           if (newWorkId) setActiveWorkId(newWorkId);
                         }}
                         className="px-4 py-2 bg-gray-900 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-md hover:bg-black transition-colors flex items-center gap-2"
                       >
                         <Check className="w-4 h-4" />
                         Make this a Work
                       </button>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg text-[10px] text-gray-500 max-w-xs break-words">
                       <strong>Provenance:</strong> "{draft.provenance.originalText}"
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}`;

code = code.replace(oldRender, newRender);

// Make sure Check icon is imported from lucide-react
if (!code.includes('Check,')) {
  code = code.replace('Mic, User, CheckCircle2, ChevronRight, AlertTriangle, HelpCircle, Clock, Truck, Camera, Search, Sparkles', 'Mic, User, CheckCircle2, ChevronRight, AlertTriangle, HelpCircle, Clock, Truck, Camera, Search, Sparkles, Check');
}

fs.writeFileSync('src/App.tsx', code);
