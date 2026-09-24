const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace header with clickable logo
content = content.replace(
  /<div className="text-black font-black font-serif text-xl tracking-tighter">[\s\S]*?C-LINK[\s\S]*?<\/div>/,
  `<button onClick={() => setIsChatOpen(!isChatOpen)} className="text-black font-black font-serif text-xl tracking-tighter flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-lg">C</div>
            <span className="hidden sm:inline">LINK</span>
          </button>`
);

// Replace Global input compose bar and Loading state with Chat Drawer + Floating Input
const chatDrawerJSX = `
      {/* Floating Chat Trigger / Minimal Input when Chat is closed */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
          >
             <button 
                onClick={() => setIsChatOpen(true)}
                className="shadow-2xl ring-1 ring-black/5 rounded-full bg-white px-6 py-4 flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors"
             >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">Talk to C-Link...</span>
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple-grade Fluid Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            layoutId="chat-drawer"
            initial={{ opacity: 0, x: -400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -400, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-full sm:w-[400px] bg-white/90 backdrop-blur-3xl shadow-[20px_0_60px_rgba(0,0,0,0.1)] border-r border-white/20 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
               <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-black text-white rounded-md flex items-center justify-center text-xs font-black font-serif">C</div>
                 <span className="font-bold text-sm tracking-tight">Causal Composer</span>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                 <X className="w-4 h-4 text-gray-600" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
               {messages.map(msg => (
                 <div key={msg.id} className={\`flex flex-col gap-2 \${msg.role === 'user' ? 'items-end' : 'items-start'}\`}>
                    <div className={\`px-4 py-3 rounded-2xl max-w-[85%] text-sm \${msg.role === 'user' ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}\`}>
                       {msg.text}
                    </div>
                    {/* Render newly created nodes inside the chat if they are in chatNodes */}
                    {msg.nodeIds && msg.nodeIds.length > 0 && (
                      <div className="flex flex-col gap-3 w-full mt-2">
                         {msg.nodeIds.map(id => {
                            if (!chatNodes.has(id)) return null;
                            const node = graph.nodes[id];
                            if (!node) return null;
                            return (
                              <div key={id} className="w-full relative group">
                                 <div className="absolute -top-3 right-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-sm">
                                   Hold to place on board
                                 </div>
                                 <NodeRenderer 
                                   node={node} 
                                   activeContextId={activeContextId} 
                                   setActiveContextId={setActiveContextId} 
                                   currentProjection={currentProjection} 
                                   onOpenProvenance={setProvenanceNodeId} 
                                   currentFrontierId={currentFrontierId}
                                   chatNodes={chatNodes}
                                   onLongPress={(dragId) => {
                                      causalAudio.playSettleHarmony();
                                      setChatNodes(prev => {
                                        const next = new Set(prev);
                                        next.delete(dragId);
                                        return next;
                                      });
                                   }}
                                 />
                              </div>
                            )
                         })}
                      </div>
                    )}
                 </div>
               ))}
               
               {isProcessing && (
                 <div className="flex items-start gap-2">
                    <div className="px-4 py-3 rounded-2xl bg-gray-50 text-gray-500 rounded-bl-sm text-xs font-medium flex items-center gap-2 border border-gray-100">
                       <Loader2 className="w-3 h-3 animate-spin" />
                       Computing reality...
                    </div>
                 </div>
               )}
               <div ref={chatMessagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <form onSubmit={handleInput} className="relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Ask C-Link..."
                  className="w-full bg-gray-100 rounded-full py-4 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium disabled:opacity-50 text-gray-700 placeholder:text-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isProcessing}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;

content = content.replace(
  /\{\/\* Loading state from universal compose \*\/\}[\s\S]*?<\/form>\s*<\/div>/,
  chatDrawerJSX
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
