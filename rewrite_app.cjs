const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, Heart, User, Hourglass, Check, ArrowRight, Package, Camera, Image as ImageIcon, Building, ReceiptText, X, ShoppingBag, ChevronLeft, ChevronRight, Truck, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Shared Components ---
const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent) => void }) => (
  <motion.div layout onClick={onClick} className={\`bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] \${className} \${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}\`}>
    {children}
  </motion.div>
);

const CircleIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
    <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.2} />
  </div>
);

const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={\`text-[11px] text-gray-500 tracking-[0.1em] uppercase font-medium \${className}\`}>
    {children}
  </span>
);

const VLine = ({ dotted, height = "h-8" }: { dotted?: boolean, height?: string }) => (
  <motion.div layout className={\`\${height} w-px \${dotted ? 'border-l-[1.5px] border-dotted border-gray-300' : 'bg-gray-200'} my-1\`}></motion.div>
);

const Layout = ({ 
  children, 
  statusText, 
  bottomInputPlaceholder = "Tell C-Link...",
  topRightContent = null
}: { 
  children: React.ReactNode, 
  statusText?: string, 
  bottomInputPlaceholder?: string,
  topRightContent?: React.ReactNode
}) => {
  return (
    <div className="h-[100dvh] w-full bg-[#FCFAF8] text-[#1A1A1A] font-sans flex flex-col relative overflow-hidden select-none bg-dot-grid">
      <header className="pt-12 pb-6 px-6 shrink-0 flex justify-center relative pointer-events-none z-10">
        <h1 className="tracking-[0.3em] text-sm font-medium text-gray-800">C-LINK</h1>
        {topRightContent && (
           <div className="absolute right-6 top-12 -translate-y-1/2 pointer-events-auto">
             {topRightContent}
           </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 flex flex-col items-center">
        {children}
      </main>

      <footer className="absolute bottom-0 w-full bg-gradient-to-t from-[#FCFAF8] via-[#FCFAF8] to-transparent pt-12 pb-8 px-6 flex flex-col items-center pointer-events-none z-30">
        <p className="text-gray-400 text-[13px] mb-4 text-center tracking-wide h-5 transition-all">{statusText}</p>
        <div className="w-full max-w-md bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-2 pl-6 flex items-center justify-between pointer-events-auto cursor-text">
          <span className="text-gray-400 text-[15px]">{bottomInputPlaceholder}</span>
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white cursor-pointer hover:bg-black transition-colors">
            <Mic className="w-4 h-4" />
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Phases ---

const PhaseDemand = ({ onNext }: { onNext: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onNext, 1500);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <Layout statusText="Creating Reality C-Link...">
      <div className="flex flex-col items-center w-full mt-24">
        <Card className="p-8 text-center max-w-[240px] w-full">
          <Label>WANT</Label>
          <h2 className="text-3xl font-light mt-2 text-gray-800">50kg Rice</h2>
          <p className="text-sm text-gray-500 mt-2">Office · Tomorrow 10 AM</p>
        </Card>
      </div>
    </Layout>
  );
};

const PhaseGap = ({ onNext }: { onNext: () => void }) => {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  
  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="30kg is committed. 20kg still needs a source.">
      <div 
        className="flex flex-col items-center w-full pb-8 surface-container mt-4"
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
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 border-t border-gray-100 pt-3 text-left overflow-hidden">
                     <p className="text-[13px] text-gray-600">Context: Monthly restock</p>
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
                </div>
              </div>
              
              <AnimatePresence>
                {focusedNode === 'gap' && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 pt-3 border-t border-gray-100 overflow-hidden">
                     <p className="text-[13px] text-gray-500 mb-4 text-center">Select action to resolve gap</p>
                     <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-black transition-colors">Find</button>
                        <button className="flex-1 bg-white hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium shadow-sm border border-gray-200 transition-colors text-gray-700">Ask</button>
                     </div>
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

const PhaseSupplierOptions = ({ onNext }: { onNext: () => void }) => {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  
  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Found 2 possible options. Tap one.">
      <div 
        className="flex flex-col items-center w-full mt-12 pb-10 scale-95 origin-top surface-container"
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
          <path d="M120 0 C120 24, 60 24, 60 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M120 0 C120 24, 180 24, 180 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        
        <div className="flex gap-4 w-full justify-center -mt-1 max-w-[340px]">
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'mina' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card 
              onClick={(e) => handleNodeClick('mina', e)}
              className={\`w-full transition-all duration-500 \${focusedNode === 'mina' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-xl' : 'p-5'}\`}
            >
              <motion.div layout>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium tracking-wide">MI</div>
                  <span className="text-[13px] font-medium tracking-[0.1em] text-gray-700">MINA</span>
                </div>
                <div className="w-8 h-px bg-gray-300 mb-3"></div>
                <Label className="tracking-[0.1em]">POSSIBLE</Label>
                <p className="text-xl mt-1 text-gray-600 font-medium">20kg</p>
                
                <AnimatePresence>
                  {focusedNode === 'mina' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 border-t border-gray-100 pt-3 overflow-hidden">
                       <p className="text-[12px] text-gray-500 mb-3">Available tomorrow 10 AM.</p>
                       <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="w-full bg-gray-900 text-white text-sm py-2 rounded-xl font-medium shadow-sm hover:bg-black transition-colors">
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
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 border-t border-gray-100 pt-3 overflow-hidden">
                       <p className="text-[12px] text-gray-500 mb-3">Available next week.</p>
                       <button className="w-full bg-white border border-gray-200 text-gray-400 text-sm py-2 rounded-xl font-medium cursor-not-allowed">
                         Too Late
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
};

const PhaseTransportBlocked = ({ onNext }: { onNext: () => void }) => {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  
  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Transport is now the critical frontier.">
      <div 
        className="flex flex-col items-center w-full transform scale-[0.80] origin-top mt-2 pb-10 surface-container"
        onClick={() => setFocusedNode(null)}
      >
        <div className="flex gap-4 w-full justify-center max-w-[320px]">
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'rahim' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card onClick={(e) => handleNodeClick('rahim', e)} className={\`text-center w-full transition-all duration-500 \${focusedNode === 'rahim' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}>
              <motion.div layout>
                <Label className="tracking-widest">RAHIM</Label>
                <h2 className="text-2xl mt-1 text-gray-800 font-medium">30kg</h2>
                <p className="text-[10px] font-medium mt-2 flex items-center justify-center gap-1 text-gray-700 tracking-wider">
                  <Check className="w-3 h-3" strokeWidth={3}/> COMMITTED
                </p>
              </motion.div>
            </Card>
          </div>
          <div className={\`node-wrapper flex flex-col items-center flex-1 \${focusedNode === 'mina' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card onClick={(e) => handleNodeClick('mina', e)} className={\`text-center w-full transition-all duration-500 \${focusedNode === 'mina' ? 'p-6 scale-[1.15] ring-1 ring-gray-200 shadow-lg' : 'p-5'}\`}>
              <motion.div layout>
                <Label className="tracking-widest">MINA</Label>
                <h2 className="text-2xl mt-1 text-gray-800 font-medium">20kg</h2>
                <p className="text-[10px] font-medium mt-2 flex items-center justify-center gap-1 text-gray-700 tracking-wider">
                  <Check className="w-3 h-3" strokeWidth={3}/> COMMITTED
                </p>
              </motion.div>
            </Card>
          </div>
        </div>

        <svg className="w-full max-w-[240px] h-12 overflow-visible" viewBox="0 0 240 48" fill="none">
          <path d="M50 0 C50 24, 120 24, 120 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M190 0 C190 24, 120 24, 120 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[180px] \${focusedNode === 'covered' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card onClick={(e) => handleNodeClick('covered', e)} className={\`text-center w-full transition-all duration-500 \${focusedNode === 'covered' ? 'p-5 scale-[1.15] ring-1 ring-gray-200 shadow-lg' : 'p-3'}\`}>
            <motion.div layout>
              <span className="text-[13px] font-medium tracking-widest text-gray-800 uppercase">50kg COVERED</span>
            </motion.div>
          </Card>
        </div>
        
        <VLine height="h-6" />
        
        <div className={\`node-wrapper flex flex-col items-center w-full max-w-[240px] \${focusedNode === 'transport' ? 'node-is-focused z-20' : 'z-10'}\`}>
          <Card onClick={(e) => handleNodeClick('transport', e)} className={\`text-center bg-[#FCF7F5] border border-orange-50 w-full shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-500 \${focusedNode === 'transport' ? 'p-6 scale-[1.1] ring-1 ring-orange-200 shadow-lg' : 'p-5'}\`}>
            <motion.div layout>
              <Label className="tracking-widest">TRANSPORT</Label>
              <h2 className="text-2xl font-bold tracking-tight mt-1 text-gray-800">BLOCKED</h2>
              <p className="text-[13px] text-gray-500 mt-1">no driver</p>
              
              <AnimatePresence>
                  {focusedNode === 'transport' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 border-t border-orange-100 pt-3 text-left overflow-hidden">
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
          <Card onClick={(e) => handleNodeClick('driver_gap', e)} className={\`text-center w-full reality-void border border-dashed border-gray-300 transition-all duration-500 \${focusedNode === 'driver_gap' ? 'p-5 scale-[1.1] bg-white border-solid ring-1 ring-gray-300 shadow-xl' : 'p-3'}\`}>
            <motion.div layout>
              <span className="text-[13px] font-medium tracking-widest text-gray-800 uppercase">DRIVER GAP</span>
              
              <AnimatePresence>
                  {focusedNode === 'driver_gap' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 pt-3 overflow-hidden">
                       <p className="text-[12px] text-gray-500 mb-4">3 drivers available in network.</p>
                       <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="w-full bg-gray-900 text-white text-sm py-2 rounded-xl font-medium shadow-sm hover:bg-black transition-colors">
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

const PhaseDriverFound = ({ onNext }: { onNext: () => void }) => {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  
  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Karim is available to drive tomorrow at 9:30 AM.">
      <div 
        className="flex flex-col items-center w-full mt-12 surface-container"
        onClick={() => setFocusedNode(null)}
      >
         <h3 className="tracking-[0.2em] text-[13px] text-gray-700 font-medium uppercase mb-4">TRANSPORT</h3>
         
         <div className={\`node-wrapper flex flex-col items-center w-full max-w-[280px] \${focusedNode === 'karim' ? 'node-is-focused z-20' : 'z-10'}\`}>
            <Card onClick={(e) => handleNodeClick('karim', e)} className={\`w-full transition-all duration-500 \${focusedNode === 'karim' ? 'p-8 scale-[1.05] ring-1 ring-gray-200 shadow-xl' : 'p-6'}\`}>
              <motion.div layout>
                <Label className="tracking-[0.2em]">DRIVER</Label>
                <h2 className="text-4xl font-light tracking-tight mt-1 text-gray-800">Karim</h2>
                <p className="text-[11px] font-medium text-green-600 tracking-[0.15em] mt-6 uppercase">AVAILABLE</p>
                <p className="text-gray-500 mt-2 flex items-center gap-2 text-[13px]">
                   <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span> 9:30 AM
                </p>
                
                <AnimatePresence>
                  {focusedNode === 'karim' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-6 border-t border-gray-100 pt-5 overflow-hidden">
                       <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="w-full bg-gray-900 text-white text-sm py-3 rounded-xl font-medium shadow-sm hover:bg-black transition-colors">
                         Assign Karim
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

const PhaseProof = ({ onNext }: { onNext: () => void }) => {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  
  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedNode(prev => prev === id ? null : id);
  };

  return (
    <Layout statusText="Delivery assigned. Awaiting proof.">
      <div 
        className="flex flex-col items-center w-full mt-10 surface-container pb-10"
        onClick={() => setFocusedNode(null)}
      >
         <div className={\`node-wrapper flex flex-col items-center w-full max-w-[300px] \${focusedNode === 'assigned' ? 'node-is-focused z-20' : 'z-10'}\`}>
           <Card onClick={(e) => handleNodeClick('assigned', e)} className={\`w-full flex items-center gap-4 transition-all duration-500 \${focusedNode === 'assigned' ? 'p-5 scale-[1.05] ring-1 ring-gray-200 shadow-md' : 'p-4'}\`}>
             <motion.div layout className="flex gap-4 w-full items-center">
               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                 <Truck className="w-5 h-5 text-gray-500" />
               </div>
               <div>
                 <h2 className="text-[15px] font-medium text-gray-800">Transport Assigned</h2>
                 <p className="text-[12px] text-gray-500 mt-0.5">Karim · 9:30 AM</p>
               </div>
             </motion.div>
           </Card>
         </div>
         
         <VLine height="h-10" />
         
         <div className={\`node-wrapper flex flex-col items-center w-full max-w-[300px] \${focusedNode === 'proof' ? 'node-is-focused z-20' : 'z-10'}\`}>
           <Card onClick={(e) => handleNodeClick('proof', e)} className={\`w-full bg-[#FCFAF8] border border-gray-200 transition-all duration-500 \${focusedNode === 'proof' ? 'p-6 scale-[1.05] shadow-xl' : 'p-5'}\`}>
             <motion.div layout className="flex flex-col items-center text-center">
               <Label className="tracking-widest mb-4">REQUIRED ACTION</Label>
               <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                 <Camera className="w-8 h-8 text-gray-400" />
               </div>
               <h2 className="text-xl font-medium text-gray-800">Submit Proof</h2>
               <p className="text-[13px] text-gray-500 mt-1">Photo + Weight required</p>
               
               <AnimatePresence>
                  {focusedNode === 'proof' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-6 w-full overflow-hidden">
                       <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="w-full bg-gray-900 text-white text-sm py-3 rounded-xl font-medium shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-2">
                         <Camera className="w-4 h-4" /> Upload Proof
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

const PhaseCompleted = ({ onReset }: { onReset: () => void }) => {
  return (
    <Layout statusText="Reality Settled." topRightContent={<button onClick={onReset} className="text-gray-400 text-xs font-medium hover:text-gray-800 tracking-wider">RESET</button>}>
      <div className="flex flex-col items-center w-full max-w-[300px] mx-auto mt-16 pb-8">
        <Card className="p-8 w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-800"></div>
          <Label className="flex items-center justify-center gap-2 text-gray-800">
             <Check className="w-3.5 h-3.5" strokeWidth={3}/> DONE
          </Label>
          <h2 className="text-[2.5rem] leading-tight font-serif text-gray-800 mt-4 tracking-tight">50kg Rice</h2>
          <p className="text-xl text-gray-500 mt-1 font-light">Delivered</p>
          
          <div className="w-full h-px bg-gray-100 mt-6 mb-6"></div>
          
          <div className="flex flex-col items-center gap-3 text-[13px] text-gray-500">
             <div className="flex items-center gap-2">
               <Building className="w-4 h-4 shrink-0" strokeWidth={1.5}/>
               <span>Main Office</span>
             </div>
             <div className="flex items-center gap-2">
               <ReceiptText className="w-4 h-4 shrink-0" strokeWidth={1.5}/>
               <span>Proof Accepted</span>
             </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export type Phase = 
  | 'DEMAND'
  | 'GAP'
  | 'SUPPLIER_OPTIONS'
  | 'TRANSPORT_BLOCKED'
  | 'DRIVER_FOUND'
  | 'PROOF'
  | 'COMPLETED';

export default function App() {
  const [phase, setPhase] = useState<Phase>('DEMAND');

  const renderContent = () => {
    switch (phase) {
      case 'DEMAND': return <PhaseDemand onNext={() => setPhase('GAP')} />;
      case 'GAP': return <PhaseGap onNext={() => setPhase('SUPPLIER_OPTIONS')} />;
      case 'SUPPLIER_OPTIONS': return <PhaseSupplierOptions onNext={() => setPhase('TRANSPORT_BLOCKED')} />;
      case 'TRANSPORT_BLOCKED': return <PhaseTransportBlocked onNext={() => setPhase('DRIVER_FOUND')} />;
      case 'DRIVER_FOUND': return <PhaseDriverFound onNext={() => setPhase('PROOF')} />;
      case 'PROOF': return <PhaseProof onNext={() => setPhase('COMPLETED')} />;
      case 'COMPLETED': return <PhaseCompleted onReset={() => setPhase('DEMAND')} />;
    }
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#FCFAF8]">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
`;
fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx replaced successfully.');
