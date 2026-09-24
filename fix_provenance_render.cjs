const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `<ProvenanceLedger 
        isOpen={!!provenanceNodeId} 
        onClose={() => setProvenanceNodeId(null)} 
        targetNodeId={provenanceNodeId} 
      />`,
  `{provenanceNodeId && (
        <ProvenanceLedger 
          nodeId={provenanceNodeId} 
          onClose={() => setProvenanceNodeId(null)} 
        />
      )}`
);

fs.writeFileSync(path, content);
console.log("Fixed ProvenanceLedger rendering.");
