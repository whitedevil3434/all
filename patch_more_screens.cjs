const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Screen4
const screen4New = `const Screen4 = () => {
  const [focusedNode, setFocusedNode] = React.useState<string | null>(null);

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Found 2 possible options. Tap one.">
      <div 
        className="flex flex-col items-center w-full mt-12 pb-10 scale-90 origin-top surface-container"
        onClick={() => setFocusedNode(null)}
      >
        <div className={\`node-wrapper flex flex-col items-center \${focusedNode === 'gap' ? 'node-is-focused z-20' : 'z-10'}\`}>
           <div 
             onClick={(e) => handleNodeClick('gap', e)}
             className="text-center cursor-pointer transition-transform duration-500 hover:scale-[1.05]"
           >
              <h2 className="text-[4rem] leading-none text-gray-300 font-serif tracking-tight">GAP</h2>
              <h1 className="text-[7rem] leading-none text-gray-300 font-serif -mt-4 mb-2">20kg</h1>
           </div>
        </div>
        
        <svg className="w-full max-w-[240px] h-12 overflow-visible" viewBox="0 0 240 48" fill="none">
          <path d="M120 0 C120 24, 50 24, 50 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M120 0 C120 24, 190 24, 190 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        
        <div className="flex gap-4 w-full justify-center -mt-1 max-w-[320px]">
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'mina' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card 
              onClick={(e) => handleNodeClick('mina', e)}
              className={\`w-full transition-all duration-500 \${focusedNode === 'mina' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-xl' : 'p-5'}\`}
            >
              <motion.div layout>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium tracking-wide">MA</div>
                  <span className="text-[13px] font-medium tracking-[0.1em] text-gray-700">MINA</span>
                </div>
                <div className="w-8 h-px bg-gray-300 mb-3"></div>
                <Label className="tracking-[0.1em]">POSSIBLE</Label>
                <p className="text-xl mt-1 text-gray-600 font-medium">20kg</p>
                
                <AnimatePresence>
                  {focusedNode === 'mina' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-4 border-t border-gray-100 pt-3 overflow-hidden"
                    >
                       <p className="text-[12px] text-gray-500 mb-3">Offer available for tomorrow 10 AM.</p>
                       <button onClick={(e) => { e.stopPropagation(); alert('Accepting Mina...')}} className="w-full bg-gray-900 text-white text-sm py-2 rounded-xl font-medium shadow-sm hover:bg-black transition-colors">
                         Accept Offer
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>
          </div>
          
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'hasan' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card 
              onClick={(e) => handleNodeClick('hasan', e)}
              className={\`w-full transition-all duration-500 \${focusedNode === 'hasan' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-xl' : 'p-5'}\`}
            >
              <motion.div layout>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium tracking-wide">HA</div>
                  <span className="text-[13px] font-medium tracking-[0.1em] text-gray-700">HASAN</span>
                </div>
                <div className="w-8 h-px bg-gray-300 mb-3"></div>
                <Label className="tracking-[0.1em]">POSSIBLE</Label>
                <p className="text-xl mt-1 text-gray-600 font-medium">20kg</p>
                
                <AnimatePresence>
                  {focusedNode === 'hasan' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-4 border-t border-gray-100 pt-3 overflow-hidden"
                    >
                       <p className="text-[12px] text-gray-500 mb-3">Offer available for next week.</p>
                       <button onClick={(e) => { e.stopPropagation(); alert('Accepting Hasan...')}} className="w-full bg-white border border-gray-200 text-gray-700 text-sm py-2 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-colors">
                         Accept Offer
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};`;

const screen4Regex = /const Screen4 = \(\) => \([\s\S]*?<\/Layout>\s*\);/g;
code = code.replace(screen4Regex, screen4New);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully for Screen4.');
