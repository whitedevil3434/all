const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add Archive to lucide-react imports
if (!content.includes('Archive,')) {
  content = content.replace(
    /import \{ Sparkles, CheckCircle2, User, Package, AlertTriangle, HelpCircle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X, Link, Edit2, Trash2 \} from 'lucide-react';/,
    `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, HelpCircle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X, Link, Edit2, Trash2, Archive } from 'lucide-react';`
  );
}

// 2. Define settledNodes before return
content = content.replace(
  /const boardRoots = projectedRoots\.filter\(r => !chatNodes\.has\(r\.id\)\);/,
  `const boardRoots = projectedRoots.filter(r => !chatNodes.has(r.id));
  const settledNodes = nodes.filter(n => (n.state === 'COMMITTED' || n.state === 'RESOLVED') && !chatNodes.has(n.id));`
);

// 3. Inject the History Vault right after the header, before main tree rendering
const historyVaultHTML = `
      {/* History Vault (Provenance Stack) */}
      {settledNodes.length > 0 && (
        <div className="px-8 mb-8 z-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-xl p-3 rounded-2xl border border-gray-200/60 shadow-sm"
          >
            <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-gray-100/50 px-3 py-1.5 rounded-full border border-gray-200/50 shrink-0">
              <Archive className="w-3.5 h-3.5" />
              <span>Resolved Reality</span>
            </div>
            
            <div className="flex flex-wrap items-center -space-x-3 pr-2" style={{ direction: "rtl" }}>
              <AnimatePresence>
                {settledNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    layoutId={\`node-\${node.id}\`}
                    className="w-10 h-10 rounded-full bg-white shadow-sm ring-[3px] ring-white flex items-center justify-center relative group cursor-pointer"
                    style={{ zIndex: settledNodes.length - i, direction: "ltr" }}
                    onClick={() => setProvenanceNodeId(node.id)}
                    whileHover={{ y: -6, zIndex: 100, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span className="scale-[0.8] opacity-80 group-hover:opacity-100 transition-opacity">
                      {node.type === 'WANT' ? <Target className="w-5 h-5 text-gray-700" /> : 
                       node.type === 'GAP' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                       node.type === 'ACTOR' ? <User className="w-5 h-5 text-emerald-600" /> :
                       node.type === 'DEPENDENCY' ? <Package className="w-5 h-5 text-amber-600" /> :
                       <FileCheck className="w-5 h-5 text-purple-600" />}
                    </span>
                    <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-opacity shadow-lg">
                      {node.type} Settled
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
`;

content = content.replace(
  /\{\/\* The main tree rendering \*\/\}/,
  `${historyVaultHTML}\n\n      {/* The main tree rendering */}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
