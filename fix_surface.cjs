const fs = require('fs');
let code = fs.readFileSync('src/components/LivingSurface.tsx', 'utf8');

code = code.replace("import { HelpCircle, Check, Play, ShieldCheck, Loader2, User, AlertCircle, AlertTriangle } from 'lucide-react';", "import { HelpCircle, Check, Play, ShieldCheck, Loader2, User, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';");

code = code.replace("function NodeTree({ node, graph, onAction, level }: { node: RealityObject, graph: RealityGraph, onAction?: any, level: number }) {", "function NodeTree({ node, graph, onAction, level }: { key?: React.Key, node: RealityObject, graph: RealityGraph, onAction?: any, level: number }) {");

code = code.replace("case 'DOING':", "case 'EXECUTING':");

fs.writeFileSync('src/components/LivingSurface.tsx', code);
