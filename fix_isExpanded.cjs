const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// I manually replaced the entire NodeRenderer return block using a regex that accidentally stripped out the local state 'isExpanded' logic which was placed right above the return block.

// Let's inject `const [isExpanded, setIsExpanded] = useState(false);` back into the top of the NodeRenderer function if it's missing.

const searchString = `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string, onOpenProvenance: (id: string) => void }) {
  const graph = useRealityGraph();`;

const replacementString = `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string, onOpenProvenance: (id: string) => void }) {
  const graph = useRealityGraph();
  const [isExpanded, setIsExpanded] = useState(false);`;

if (content.includes(searchString)) {
  content = content.replace(searchString, replacementString);
  fs.writeFileSync(path, content);
  console.log("Restored isExpanded state.");
} else if (content.includes('const [isExpanded, setIsExpanded] = useState(false);')) {
  console.log("isExpanded state already exists, there might be a scope issue.");
  
  // Wait, let's check if the return block I replaced had the variables inside or outside.
  // The error says "isExpanded is not defined", which means it's missing from the component scope.
  
  // Let's make sure it's there.
  
} else {
    // Force inject it after useRealityGraph
    content = content.replace(/const graph = useRealityGraph\(\);/, `const graph = useRealityGraph();\n  const [isExpanded, setIsExpanded] = useState(false);`);
    fs.writeFileSync(path, content);
    console.log("Forcibly restored isExpanded state.");
}

