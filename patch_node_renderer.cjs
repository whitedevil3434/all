const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /function NodeRenderer\(\{ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, currentFrontierId, chatNodes, onLongPress \}: \{[\s\S]*?\}\) \{/,
  `function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, currentFrontierId, chatNodes, onLongPress, poppedNodeId, setPoppedNodeId }: {
  chatNodes?: Set<string>;
  onLongPress?: (id: string) => void; 
  node: GraphNode; 
  activeContextId: string | null; 
  setActiveContextId: (id: string | null) => void;
  currentProjection: string;
  onOpenProvenance: (id: string) => void;
  currentFrontierId?: string;
  poppedNodeId?: string | null;
  setPoppedNodeId?: (id: string | null) => void;
}) {`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
