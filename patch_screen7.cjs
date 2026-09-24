const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Card
code = code.replace(
  /const Card = \(\{ children, className = "" \}: \{ children: React\.ReactNode, className\?: string \}\) => \(\s*<div className=\{`bg-white rounded-\[24px\] shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] \$\{className\}`\}>\s*\{children\}\s*<\/div>\s*\);/,
  `const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent) => void }) => (
  <motion.div layout onClick={onClick} className={\`bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] \${className} \${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}\`}>
    {children}
  </motion.div>
);`
);

// Replace VLine (add motion.div)
code = code.replace(
  /const VLine = \(\{ dotted, height = "h-8" \}: \{ dotted\?: boolean, height\?: string \}\) => \(\s*<div className=\{`\$\{height\} w-px \$\{dotted \? 'border-l-\[1\.5px\] border-dotted border-gray-300' : 'bg-gray-200'\} my-1`\}><\/div>\s*\);/,
  `const VLine = ({ dotted, height = "h-8" }: { dotted?: boolean, height?: string }) => (
  <motion.div layout className={\`\${height} w-px \${dotted ? 'border-l-[1.5px] border-dotted border-gray-300' : 'bg-gray-200'} my-1\`}></motion.div>
);`
);

// We need to carefully replace Screen7.
// Find the exact boundaries of Screen7.
const screen7Start = code.indexOf('const Screen7 = () => (');
if (screen7Start !== -1) {
  const screen8Start = code.indexOf('const Screen8 = () => (');
  
  const screen7New = `const Screen7 = () => {
  const [focusedNode, setFocusedNode] = React.useState<string | null>(null);

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Transport is now the critical frontier." bottomInputPlaceholder="Tell C-Link what should happen...">
      <div 
        className="flex flex-col items-center w-full transform scale-[0.80] origin-top mt-0 pb-10 surface-container"
        onClick={() => setFocusedNode(null)}
      >
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[200px] \${focusedNode === 'want' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('want', e)}
            className={\`text-center w-full transition-all duration-500 \${focusedNode === 'want' ? 'p-6 scale-[1.1] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}
          >
            <motion.div layout>
              <Label>WANT</Label>
              <h2 className="text-xl font-medium mt-1 text-gray-800">50kg Rice</h2>
              <p className="text-[12px] text-gray-500 mt-1">Office · Tomorrow 10 AM</p>
              
              <AnimatePresence>
                {focusedNode === 'want' && (
                  <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    exit={{opacity:0, height:0}} 
                    className="mt-4 border-t border-gray-100 pt-3 text-left overflow-hidden"
                  >
                     <p className="text-[13px] text-gray-600">Created by: Admin</p>
                     <p className="text-[13px] text-gray-600 mt-1">Priority: High</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
        
        <svg className="w-full max-w-[240px] h-12 overflow-visible" viewBox="0 0 240 48" fill="none">
          <path d="M120 0 C120 24, 50 24, 50 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M120 0 C120 24, 190 24, 190 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        
        <div className="flex gap-4 w-full justify-center max-w-[320px]">
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'rahim' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card 
              onClick={(e) => handleNodeClick('rahim', e)}
              className={\`text-center w-full transition-all duration-500 \${focusedNode === 'rahim' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}
            >
              <motion.div layout>
                <Label className="tracking-widest">RAHIM</Label>
                <h2 className="text-2xl mt-1 text-gray-800 font-medium">30kg</h2>
                <p className="text-[10px] font-medium mt-2 flex items-center justify-center gap-1 text-gray-700 tracking-wider">
                  <Check className="w-3 h-3" strokeWidth={3}/> COMMITTED
                </p>
                <AnimatePresence>
                  {focusedNode === 'rahim' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-4 border-t border-gray-100 pt-3 text-left overflow-hidden"
                    >
                       <p className="text-[13px] text-gray-600">Contact: 017-XXXX-XXXX</p>
                       <p className="text-[13px] text-gray-600 mt-1">Ready at: 9:00 AM</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>
          </div>
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'karim' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card 
              onClick={(e) => handleNodeClick('karim', e)}
              className={\`text-center w-full transition-all duration-500 \${focusedNode === 'karim' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}
            >
              <motion.div layout>
                <Label className="tracking-widest">KARIM</Label>
                <h2 className="text-2xl mt-1 text-gray-800 font-medium">20kg</h2>
                <p className="text-[10px] font-medium mt-2 flex items-center justify-center gap-1 text-gray-500 tracking-wider">
                  <Hourglass className="w-3 h-3"/> OFFERED
                </p>
                <AnimatePresence>
                  {focusedNode === 'karim' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-4 border-t border-gray-100 pt-3 text-left overflow-hidden"
                    >
                       <p className="text-[13px] text-gray-600">Contact: Pending</p>
                       <p className="text-[13px] text-gray-600 mt-1">Offered for: 10:00 AM</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>
          </div>
        </div>

        <svg className="w-full max-w-[240px] h-12 overflow-visible" viewBox="0 0 240 48" fill="none">
          <path d="M50 0 C50 24, 120 24, 120 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M190 0 C190 24, 120 24, 120 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[180px] \${focusedNode === 'covered' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('covered', e)}
            className={\`text-center w-full transition-all duration-500 \${focusedNode === 'covered' ? 'p-5 scale-[1.15] ring-1 ring-gray-200 shadow-lg' : 'p-3'}\`}
          >
            <motion.div layout>
              <span className="text-[13px] font-medium tracking-widest text-gray-800 uppercase">50kg COVERED</span>
              <AnimatePresence>
                  {focusedNode === 'covered' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-3 border-t border-gray-100 pt-3 text-center overflow-hidden"
                    >
                       <p className="text-[13px] text-gray-600">Total matched: 50kg / 50kg</p>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
        
        <VLine height="h-6" />
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[240px] \${focusedNode === 'transport' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('transport', e)}
            className={\`text-center bg-[#FCF7F5] border border-orange-50 w-full shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-500 \${focusedNode === 'transport' ? 'p-6 scale-[1.1] ring-1 ring-orange-200 shadow-lg' : 'p-5'}\`}
          >
            <motion.div layout>
              <Label className="tracking-widest">TRANSPORT</Label>
              <h2 className="text-2xl font-bold tracking-tight mt-1 text-gray-800">BLOCKED</h2>
              <p className="text-[13px] text-gray-500 mt-1">no driver</p>
              
              <AnimatePresence>
                  {focusedNode === 'transport' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-4 border-t border-orange-100 pt-3 text-left overflow-hidden"
                    >
                       <p className="text-[13px] text-gray-800 font-medium">Requires Covered Van</p>
                       <p className="text-[13px] text-gray-600 mt-1">From: Central Warehouse</p>
                       <p className="text-[13px] text-gray-600 mt-1">To: Main Office</p>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
        
        <VLine dotted height="h-6" />
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[180px] \${focusedNode === 'driver_gap' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('driver_gap', e)}
            className={\`text-center w-full reality-void border border-dashed border-gray-300 transition-all duration-500 \${focusedNode === 'driver_gap' ? 'p-5 scale-[1.1] bg-white border-solid ring-1 ring-gray-300 shadow-xl' : 'p-3'}\`}
          >
            <motion.div layout>
              <span className="text-[13px] font-medium tracking-widest text-gray-800 uppercase">DRIVER GAP</span>
              
              <AnimatePresence>
                  {focusedNode === 'driver_gap' && (
                    <motion.div 
                      initial={{opacity:0, height:0}} 
                      animate={{opacity:1, height:'auto'}} 
                      exit={{opacity:0, height:0}} 
                      className="mt-4 pt-3 overflow-hidden"
                    >
                       <p className="text-[12px] text-gray-500 mb-4">3 drivers available in the network.</p>
                       <button onClick={(e) => { e.stopPropagation(); alert('Finding Driver...')}} className="w-full bg-gray-900 text-white text-sm py-2 rounded-xl font-medium shadow-sm hover:bg-black transition-colors">
                         Find Driver
                       </button>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
`
  
  code = code.substring(0, screen7Start) + screen7New + code.substring(screen8Start);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx patched successfully for Screen7.');
} else {
  console.error('Could not find Screen7');
}
