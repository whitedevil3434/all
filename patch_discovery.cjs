const fs = require('fs');
let code = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf8');

if (!code.includes("import { ActorDiscoveryDrawer }")) {
  code = code.replace("import { ProvenanceLedger } from './ProvenanceLedger';", "import { ProvenanceLedger } from './ProvenanceLedger';\nimport { ActorDiscoveryDrawer } from './ActorDiscoveryDrawer';");
}

const target = `      {provenanceNodeId && (
        <ProvenanceLedger 
          nodeId={provenanceNodeId} 
          onClose={() => setProvenanceNodeId(null)} 
        />
      )}
    </div>`;

const replacement = `      {provenanceNodeId && (
        <ProvenanceLedger 
          nodeId={provenanceNodeId} 
          onClose={() => setProvenanceNodeId(null)} 
        />
      )}

      <ActorDiscoveryDrawer 
        isOpen={discoveryOpen} 
        onClose={() => setDiscoveryOpen(false)} 
        targetNodeId={discoveryTargetId} 
        targetNodeLabel={discoveryTargetLabel} 
      />
    </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/DynamicRealitySurface.tsx', code);
  console.log('Added ActorDiscoveryDrawer to DynamicRealitySurface');
} else {
  console.log('Target not found for ActorDiscoveryDrawer');
}
