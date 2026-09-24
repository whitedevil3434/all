const fs = require('fs');
const path = './src/engine/universal/ContextOrchestrator.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = `import { RealityEngine } from '../core/UniversalGraphStore';

export interface ContextSnapshot {
  actor: {
    id: string;
    name: string;
    role: string;
  };
  query: string;
  relevantNodes: any[];
  recentEvents: any[];
}

export function buildContextSnapshot(query: string): ContextSnapshot {
  const graph = RealityEngine.getGraph();
  
  // CAUSAL RETRIEVAL: Find nodes that might be related to the query
  // For now, we just pass active UNKNOWN or POSSIBLE dependencies to give AI context on what's missing
  const nodes = Object.values(graph.nodes);
  const relevantNodes = nodes.filter(n => 
    n.state === 'UNKNOWN' || n.state === 'POSSIBLE' || n.state === 'ASKING'
  );

  return {
    actor: {
      id: "user_1",
      name: "Current User",
      role: "Operations Manager"
    },
    query,
    relevantNodes,
    recentEvents: []
  };
}
`;

fs.writeFileSync(path, replacement);
console.log('Fixed ContextOrchestrator');
