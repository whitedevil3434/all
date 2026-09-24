const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add new icons to import
content = content.replace(
  /import \{ Sparkles, CheckCircle2, User, Package, AlertTriangle, HelpCircle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X \} from 'lucide-react';/,
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, HelpCircle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X, Link, Edit2, Trash2 } from 'lucide-react';`
);

// 2. Inject context menu HTML
const contextMenuHTML = `

          {/* Haptic Context Menu */}
          {isPopped && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
              className="absolute top-full left-0 mt-3 w-52 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-1.5 z-[100] flex flex-col gap-0.5 overflow-hidden"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
              >
                <Link className="w-4 h-4 text-gray-500" />
                Copy Reality Link
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenProvenance(node.id); setPoppedNodeId?.(null); }}
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
              >
                <History className="w-4 h-4 text-gray-500" />
                View Provenance
              </button>
              
              <div className="h-px bg-gray-200/60 my-1 mx-2" />

              {node.type === 'ACTOR' && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    Message Actor
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left w-full"
                  >
                    <X className="w-4 h-4 text-rose-500" />
                    Revoke Offer
                  </button>
                </>
              )}
              
              {(node.type === 'DEPENDENCY' || node.type === 'GAP') && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                    Edit Requirement
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left w-full"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    Archive
                  </button>
                </>
              )}
            </motion.div>
          )}

          </div>`;

content = content.replace(
  /<\/div>\s*<\/motion\.div>\s*\{\/\* Render children recursively/,
  `${contextMenuHTML}\n      </motion.div>\n         \n      {/* Render children recursively`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
