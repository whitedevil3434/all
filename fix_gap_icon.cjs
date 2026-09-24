const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /import \{ Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X \} from 'lucide-react';/,
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, HelpCircle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X } from 'lucide-react';`
);

content = content.replace(
  /case 'GAP' as any: return <AlertTriangle className="w-4 h-4 text-rose-500" \/>;/,
  `case 'GAP' as any: return node.data?.isClarification ? <HelpCircle className="w-4 h-4 text-indigo-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />;`
);

// We need to render the action options on the frontier node.
// To do this, we should pass action options to the Node, or just use semantic contextual buttons on the Node.
// The user says "Action-এর home chat drawer হওয়া উচিত নয়।" 

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
