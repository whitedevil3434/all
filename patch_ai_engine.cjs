const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, Heart, User, Hourglass, Check, AlertTriangle, Truck, Camera, Building, ReceiptText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type NodeType = 'WANT' | 'ACTOR' | 'GAP' | 'BLOCKER' | 'SYSTEM' | 'ACTION';

interface RealityNode {
  id: string;
  type: NodeType;
  title: string;
  value?: string;
  subtitle?: string;
  statusText?: string;
  icon?: any;
  details?: string[];
  actions?: string[];
  isVoid?: boolean;
  isProcessing?: boolean;
  isWarning?: boolean;
  isSuccess?: boolean;
  isDimmed?: boolean;
}

interface Turn {
  id: string;
  type: 'single' | 'branch' | 'merge-to-single';
  nodes: RealityNode[];
}

// --- Shared Components ---
const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={\`text-[11px] text-gray-500 tracking-[0.1em] uppercase font-medium \${className}\`}>
    {children}
  </span>
);

const VLine = ({ dotted, height = "h-8" }: { dotted?: boolean, height?: string }) => (
  <motion.div layout initial={{height:0}} animate={{height:'auto'}} className={\`\${height} w-px \${dotted ? 'border-l-[1.5px] border-dotted border-gray-300' : 'bg-gray-200'} my-2\`}></motion.div>
);

const BranchSVG = () => (
  <motion.svg initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-[240px] h-12 overflow-visible shrink-0 my-1" viewBox="0 0 240 48" fill="none">
    <path d="M120 0 C120 24, 60 24, 60 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    <path d="M120 0 C120 24, 180 24, 180 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
  </motion.svg>
);

const MergeSVG = () => (
  <motion.svg initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-[240px] h-12 overflow-visible shrink-0 my-1" viewBox="0 0 240 48" fill="none">
    <path d="M60 0 C60 24, 120 24, 120 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    <path d="M180 0 C180 24, 120 24, 120 48" stroke="#E5E7EB" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
  </motion.svg>
);

// --- Reality Node Component ---
const NodeCard = ({ node, focusedNode, onClick, onAction }: { node: RealityNode, focusedNode: string | null, onClick: (id: string) => void, onAction: (action: string) => void }) => {
  const isFocused = focusedNode === node.id;
  
  return (
    <div className={\`node-wrapper flex flex-col items-center w-full max-w-[260px] \${isFocused ? 'node-is-focused z-20' : 'z-10'}\`}>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
        className={\`relative w-full transition-all duration-500 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          \${isFocused ? 'p-6 scale-[1.1] ring-1 ring-gray-200 shadow-xl' : 'p-5'}
          \${node.isVoid ? 'reality-void border border-dashed border-gray-300 bg-white/50' : 'bg-white'}
          \${node.isWarning ? 'bg-[#FCF7F5] border border-orange-100' : ''}
          \${node.isVoid && isFocused ? 'bg-white border-solid' : ''}
          \${node.isDimmed && !isFocused ? 'opacity-40 grayscale' : ''}
          cursor-pointer hover:shadow-md
        \`}
      >
        {node.isProcessing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-[24px]">
            <Sparkles className="w-6 h-6 text-gray-800 animate-pulse mb-2" />
            <span className="text-[10px] font-medium tracking-widest uppercase text-gray-800 animate-pulse">AI Orchestrating</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 relative z-10">
          {node.icon && (
            <div className={\`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 
              \${node.isWarning ? 'bg-orange-50 border-orange-200 text-orange-600' : 
                node.isSuccess ? 'bg-green-50 border-green-200 text-green-600' : 'border-gray-200 text-gray-600'}\`}>
              <node.icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
          )}
          <div>
            <Label>{node.type}</Label>
            <h2 className={\`\${isFocused ? 'text-2xl' : 'text-xl'} font-medium mt-0.5 text-gray-800 tracking-tight transition-all\`}>{node.title}</h2>
            {node.value && <p className="text-[15px] font-medium text-gray-800 mt-0.5">{node.value}</p>}
            {node.subtitle && <p className="text-[13px] text-gray-500 mt-0.5">{node.subtitle}</p>}
            {node.statusText && (
              <p className={\`text-[11px] tracking-widest mt-1 font-medium uppercase
                \${node.isSuccess ? 'text-green-600' : node.isWarning ? 'text-orange-600' : 'text-gray-500'}\`}>
                {node.statusText}
              </p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isFocused && (node.details || node.actions) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border-t border-gray-100 pt-4 overflow-hidden relative z-10"
            >
              {node.details && node.details.map((detail, idx) => (
                <p key={idx} className="text-[13px] text-gray-600 mb-1">{detail}</p>
              ))}
              
              {node.actions && node.actions.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  {node.actions.map((action, idx) => (
                    <button 
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); onAction(action); }}
                      className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-xl font-medium shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [inputText, setInputText] = useState('');
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [turns]);

  const updateNode = (id: string, changes: Partial<RealityNode>) => {
    setTurns(prev => prev.map(turn => ({
      ...turn,
      nodes: turn.nodes.map(n => n.id === id ? { ...n, ...changes } : n)
    })));
  };

  // --- Semantic Parser Engine (The "AI") ---
  const handleAction = (text: string) => {
    const lower = text.toLowerCase();
    setFocusedNode(null);

    if (lower.includes('rice') || lower.includes('50') || lower.includes('want')) {
      // 1. Initial Demand
      setTurns([
        {
          id: 't1', type: 'single', nodes: [
            { id: 'n1', type: 'WANT', icon: Heart, title: '50kg Rice', subtitle: 'Office · Tomorrow 10 AM', details: ['Context: Monthly restock', 'Requested by: HR'] }
          ]
        }
      ]);
      
      // Simulate AI Orchestration
      setTimeout(() => {
        setTurns(prev => [...prev, {
          id: 't2', type: 'branch', nodes: [
            { id: 'n2', type: 'ACTOR', icon: User, title: 'Rahim', value: '30kg', statusText: 'COMMITTED', isSuccess: true, details: ['Inventory confirmed.'] },
            { id: 'n3', type: 'GAP', icon: Hourglass, title: '20kg', statusText: 'OPEN', isVoid: true, details: ['Select action to resolve gap'], actions: ['Find Supplier'] }
          ]
        }]);
      }, 1500);
    }
    else if (lower.includes('find') && (lower.includes('supplier') || lower.includes('gap'))) {
      // 2. Finding Supplier
      updateNode('n3', { isProcessing: true });
      setTimeout(() => {
        updateNode('n3', { isProcessing: false });
        setTurns(prev => [...prev, {
          id: 't3', type: 'branch', nodes: [
            { id: 'n4', type: 'ACTOR', icon: User, title: 'Mina', value: '20kg', statusText: 'POSSIBLE', details: ['Available tomorrow 10 AM.'], actions: ['Accept Mina'] },
            { id: 'n5', type: 'ACTOR', icon: User, title: 'Hasan', value: '20kg', statusText: 'POSSIBLE', details: ['Available next week.'] }
          ]
        }]);
      }, 2000);
    }
    else if (lower.includes('accept mina') || lower.includes('mina')) {
      // 3. Accept Offer & Generate Blocker
      updateNode('n4', { isProcessing: true });
      setTimeout(() => {
        updateNode('n4', { isProcessing: false, statusText: 'COMMITTED', isSuccess: true, actions: [] });
        updateNode('n5', { isDimmed: true });
        
        setTurns(prev => [...prev, {
          id: 't4', type: 'merge-to-single', nodes: [
            { id: 'n6', type: 'BLOCKER', icon: AlertTriangle, title: 'TRANSPORT', value: 'BLOCKED', statusText: 'no driver', isWarning: true, details: ['Requires Covered Van', 'From: Central Warehouse', 'To: Main Office'] }
          ]
        }]);
        
        setTimeout(() => {
          setTurns(prev => [...prev, {
            id: 't5', type: 'single', nodes: [
              { id: 'n7', type: 'GAP', icon: User, title: 'DRIVER GAP', statusText: 'OPEN', isVoid: true, details: ['3 drivers available in network.'], actions: ['Find Driver'] }
            ]
          }]);
        }, 1200);
      }, 1500);
    }
    else if (lower.includes('find driver') || lower.includes('driver')) {
      // 4. Find Driver
      updateNode('n7', { isProcessing: true });
      setTimeout(() => {
        updateNode('n7', { isProcessing: false });
        setTurns(prev => [...prev, {
          id: 't6', type: 'single', nodes: [
            { id: 'n8', type: 'ACTOR', icon: Truck, title: 'Karim', value: 'Available', statusText: '9:30 AM', details: ['Vehicle: Covered Van 100kg', 'Rating: 4.8/5'], actions: ['Assign Karim'] }
          ]
        }]);
      }, 2000);
    }
    else if (lower.includes('assign karim') || lower.includes('assign')) {
      // 5. Assign Driver & Request Proof
      updateNode('n8', { isProcessing: true });
      setTimeout(() => {
        updateNode('n8', { isProcessing: false, isSuccess: true, statusText: 'ASSIGNED', actions: [] });
        setTurns(prev => [...prev, {
          id: 't7', type: 'single', nodes: [
            { id: 'n9', type: 'ACTION', icon: Camera, title: 'Submit Proof', value: 'REQUIRED', details: ['Photo + Weight required'], actions: ['Upload Proof'] }
          ]
        }]);
      }, 1500);
    }
    else if (lower.includes('upload proof') || lower.includes('proof')) {
      // 6. Complete Reality
      updateNode('n9', { isProcessing: true });
      setTimeout(() => {
        updateNode('n9', { isProcessing: false, isSuccess: true, value: 'UPLOADED', actions: [] });
        setTurns(prev => [...prev, {
          id: 't8', type: 'single', nodes: [
            { id: 'n10', type: 'SYSTEM', icon: Check, title: '50kg Rice', value: 'Delivered', isSuccess: true, details: ['Reality Settled.', 'Main Office', 'Proof Accepted'] }
          ]
        }]);
      }, 2000);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FCFAF8] text-[#1A1A1A] font-sans flex flex-col relative overflow-hidden select-none bg-dot-grid">
      <header className="pt-12 pb-6 px-6 shrink-0 flex justify-center relative pointer-events-none z-30 bg-gradient-to-b from-[#FCFAF8] to-transparent">
        <h1 className="tracking-[0.3em] text-[10px] font-bold text-gray-400 uppercase">C-Link Reality Canvas</h1>
      </header>

      <main 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto no-scrollbar pb-40 px-4 flex flex-col items-center surface-container"
        onClick={() => setFocusedNode(null)}
      >
        {turns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <Sparkles className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-sm font-medium tracking-widest uppercase text-gray-500">Awaiting Intent</p>
            <p className="text-xs text-gray-400 mt-2">Try: "I need 50kg rice"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mt-4">
            <AnimatePresence>
              {turns.map((turn, index) => (
                <motion.div 
                  key={turn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Connectors */}
                  {index > 0 && turn.type === 'single' && <VLine height="h-10" />}
                  {index > 0 && turn.type === 'branch' && <BranchSVG />}
                  {index > 0 && turn.type === 'merge-to-single' && <MergeSVG />}

                  {/* Nodes */}
                  <div className={\`flex \${turn.nodes.length > 1 ? 'gap-6' : ''} w-full justify-center\`}>
                    {turn.nodes.map(node => (
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
        )}
      </main>

      {/* Semantic Composer Layer */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#FCFAF8] via-[#FCFAF8] to-transparent pt-12 pb-8 px-6 flex flex-col items-center z-40">
        <form 
          onSubmit={(e) => { e.preventDefault(); if(inputText.trim()) { handleAction(inputText); setInputText(''); } }}
          className="w-full max-w-md bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-2 pl-6 flex items-center justify-between"
        >
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Express intent to C-Link..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-800 placeholder:text-gray-300 font-medium"
          />
          <button 
            type="submit"
            className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 mt-4 tracking-widest uppercase font-medium">Semantic Processing Active</p>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/App.tsx', code);
console.log('Causal Graph Engine implemented successfully.');
