const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Screen1 with focus mode
const screen1New = `const Screen1 = () => {
  const [focusedNode, setFocusedNode] = React.useState<string | null>(null);

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="30kg is committed. 20kg still needs a source.">
      <div 
        className="flex flex-col items-center w-full pb-8 surface-container"
        onClick={() => setFocusedNode(null)}
      >
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[280px] \${focusedNode === 'want' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('want', e)}
            className={\`w-full transition-all duration-500 \${focusedNode === 'want' ? 'p-6 scale-[1.1] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}
          >
            <motion.div layout>
              <div className="flex gap-4 items-center">
                <CircleIcon icon={Heart} />
                <div>
                  <Label>WANT</Label>
                  <h2 className="text-xl font-medium mt-0.5 text-gray-800">50kg Rice</h2>
                  <p className="text-gray-500 text-[13px] mt-0.5">Office · Tomorrow 10 AM</p>
                </div>
              </div>
              
              <AnimatePresence>
                {focusedNode === 'want' && (
                  <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    exit={{opacity:0, height:0}} 
                    className="mt-4 border-t border-gray-100 pt-3 text-left overflow-hidden"
                  >
                     <p className="text-[13px] text-gray-600">Context: Monthly restock</p>
                     <p className="text-[13px] text-gray-600 mt-1">Requested by: HR Dept</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
        
        <VLine dotted height="h-6" />
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[280px] \${focusedNode === 'rahim' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('rahim', e)}
            className={\`w-full transition-all duration-500 \${focusedNode === 'rahim' ? 'p-6 scale-[1.1] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}
          >
            <motion.div layout>
              <div className="flex gap-4 items-center">
                <CircleIcon icon={User} />
                <div>
                  <Label>WHO</Label>
                  <h2 className="text-xl font-medium mt-0.5 text-gray-800">Rahim</h2>
                  <p className="text-[15px] mt-0.5 text-gray-800">30kg</p>
                  <p className="text-green-700 text-[13px] mt-0.5 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} /> agreed
                  </p>
                </div>
              </div>
              
              <AnimatePresence>
                {focusedNode === 'rahim' && (
                  <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    exit={{opacity:0, height:0}} 
                    className="mt-4 border-t border-gray-100 pt-3 text-left overflow-hidden"
                  >
                     <p className="text-[13px] text-gray-600">Inventory confirmed</p>
                     <p className="text-[13px] text-gray-600 mt-1">Pickup location: Warehouse A</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
        
        <VLine dotted height="h-6" />
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[280px] \${focusedNode === 'gap' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('gap', e)}
            className={\`w-full reality-void border border-dashed border-gray-300 transition-all duration-500 \${focusedNode === 'gap' ? 'p-6 scale-[1.1] ring-1 ring-gray-300 bg-white border-solid shadow-xl' : 'p-5'}\`}
          >
            <motion.div layout>
              <div className="flex gap-4 items-center">
                <CircleIcon icon={Hourglass} />
                <div>
                  <Label>GAP</Label>
                  <h2 className="text-xl font-medium mt-0.5 text-gray-800">20kg</h2>
                  <Label className="mt-1 block">OPEN</Label>
                  <p className="mt-1 font-medium text-[15px] text-gray-800">Find</p>
                </div>
              </div>
              
              <AnimatePresence>
                {focusedNode === 'gap' && (
                  <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    exit={{opacity:0, height:0}} 
                    className="mt-4 pt-3 overflow-hidden"
                  >
                     <p className="text-[13px] text-gray-500 mb-4">Click to search network for 20kg</p>
                     <button onClick={(e) => { e.stopPropagation(); alert('Finding Supplier...')}} className="w-full bg-gray-900 text-white text-sm py-2 rounded-xl font-medium shadow-sm hover:bg-black transition-colors">
                       Find Supplier
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
};`;

// Replace Screen3 with focus mode
const screen3New = `const Screen3 = () => {
  const [focusedNode, setFocusedNode] = React.useState<string | null>(null);

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Looking for actors who can cover the remaining 20kg.">
      <div 
        className="flex flex-col items-center w-full mt-2 pb-8 surface-container"
        onClick={() => setFocusedNode(null)}
      >
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[320px] \${focusedNode === 'gap' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card 
            onClick={(e) => handleNodeClick('gap', e)}
            className={\`w-full transition-all duration-500 \${focusedNode === 'gap' ? 'p-10 scale-[1.05] ring-1 ring-gray-200 shadow-xl' : 'p-8'}\`}
          >
            <motion.div layout>
              <h2 className="text-3xl font-bold tracking-tight text-gray-800">GAP</h2>
              <h3 className="text-xl mt-1 mb-6 text-gray-600 font-medium">20kg OPEN</h3>
              
              <div className="flex flex-col gap-2.5 text-sm border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Need:</span>
                  <span className="text-gray-800 font-medium">50kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Covered:</span>
                  <span className="text-gray-800 font-medium">30kg</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-orange-600 font-medium tracking-wide">Missing:</span>
                  <span className="text-[#C84A31] font-medium">20kg</span>
                </div>
              </div>

              <AnimatePresence>
                {focusedNode === 'gap' && (
                  <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    exit={{opacity:0, height:0}} 
                    className="mt-6 overflow-hidden"
                  >
                     <p className="text-[13px] text-gray-500 mb-4 text-center">Select an action to resolve this gap.</p>
                     <div className="flex gap-2">
                        <button className="flex-1 bg-white hover:bg-gray-50 py-3 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 transition-colors text-gray-700">Find</button>
                        <button className="flex-1 bg-white hover:bg-gray-50 py-3 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 transition-colors text-gray-700">Ask</button>
                        <button className="flex-1 bg-white hover:bg-gray-50 py-3 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 transition-colors text-gray-700">Trace</button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!focusedNode && (
                 <div className="flex gap-2 mt-6">
                    <button className="flex-1 bg-white hover:bg-gray-50 py-3 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 transition-colors text-gray-700">Find</button>
                    <button className="flex-1 bg-white hover:bg-gray-50 py-3 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 transition-colors text-gray-700">Ask</button>
                    <button className="flex-1 bg-white hover:bg-gray-50 py-3 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 transition-colors text-gray-700">Trace</button>
                 </div>
              )}
            </motion.div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};`;

// Apply the replacements
const screen1Regex = /const Screen1 = \(\) => \([\s\S]*?<\/Layout>\s*\);/g;
code = code.replace(screen1Regex, screen1New);

const screen3Regex = /const Screen3 = \(\) => \([\s\S]*?<\/Layout>\s*\);/g;
code = code.replace(screen3Regex, screen3New);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully for Screen1 and Screen3.');
