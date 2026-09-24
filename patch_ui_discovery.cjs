const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add Import
content = content.replace(
  /import { Star, DollarSign, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Activity, Users, FileStack, LayoutDashboard, Search, MessageSquare, Play, X, UserX, Loader2 } from 'lucide-react';/,
  `import { Star, DollarSign, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Activity, Users, FileStack, LayoutDashboard, Search, MessageSquare, Play, X, UserX, Loader2, UserPlus } from 'lucide-react';\nimport { ActorDiscoveryDrawer } from './ActorDiscoveryDrawer';`
);

// 2. Add State to DynamicRealitySurface
content = content.replace(
  /const \[poppedNodeId, setPoppedNodeId\] = useState<string \| null>\(null\);/,
  `const [poppedNodeId, setPoppedNodeId] = useState<string | null>(null);\n  const [discoveryOpen, setDiscoveryOpen] = useState(false);\n  const [discoveryTargetId, setDiscoveryTargetId] = useState<string | null>(null);\n  const [discoveryTargetLabel, setDiscoveryTargetLabel] = useState("");`
);

// 3. Add Button to NodeRenderer
// Find where node.type === 'GAP' or UNKNOWN is rendered and add button
const buttonCode = `
          {(node.type === 'GAP' || node.state === 'UNKNOWN') && (
            <div className="mt-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Dispatch custom event to open drawer
                  window.dispatchEvent(new CustomEvent('OPEN_DISCOVERY', { detail: { id: node.id, label: node.label } }));
                }}
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold py-2 rounded-lg transition-colors border border-indigo-100/50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Find Actor
              </button>
            </div>
          )}
`;

content = content.replace(
  /\{\/\* Node Data & Semantics \*\/\}/,
  `{/* Node Data & Semantics */}\n${buttonCode}`
);

// 4. Add Event Listener to DynamicRealitySurface and render ActorDiscoveryDrawer
content = content.replace(
  /return \(/,
  `
  useEffect(() => {
    const handleOpenDiscovery = (e: any) => {
      setDiscoveryTargetId(e.detail.id);
      setDiscoveryTargetLabel(e.detail.label);
      setDiscoveryOpen(true);
    };
    window.addEventListener('OPEN_DISCOVERY', handleOpenDiscovery);
    return () => window.removeEventListener('OPEN_DISCOVERY', handleOpenDiscovery);
  }, []);

  return (`
);

content = content.replace(
  /<\/div>\n    <\/div>\n  \);\n}/,
  `
      <ActorDiscoveryDrawer 
        isOpen={discoveryOpen} 
        onClose={() => setDiscoveryOpen(false)} 
        targetNodeId={discoveryTargetId} 
        targetNodeLabel={discoveryTargetLabel} 
      />
    </div>
    </div>
  );
}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
