const fs = require('fs');
const path = './src/engine/universal/ContextOrchestrator.ts';
let content = fs.readFileSync(path, 'utf8');

const newContent = `import { RealityEngine } from '../core/UniversalGraphStore';
import { findClosestPersona } from '../../lib/vectorMemory';

export interface ContextSnapshot {
  actor: {
    id: string;
    name: string;
    role: string;
  };
  query: string;
  relevantNodes: any[];
  recentEvents: any[];
  retrievedMemories?: any[];
}

export async function buildContextSnapshot(query: string): Promise<ContextSnapshot> {
  const graph = RealityEngine.getGraph();
  
  const nodes = Object.values(graph.nodes);
  const relevantNodes = nodes.filter(n => 
    n.state === 'UNKNOWN' || n.state === 'POSSIBLE' || n.state === 'ASKING'
  );

  // --- SPATIAL MEMORY INJECTION (REAL VECTOR SEARCH) ---
  const personaMemory = await findClosestPersona(query);
  // ---------------------------------

  return {
    actor: {
      id: "user_1",
      name: "Current User",
      role: "Owner"
    },
    query,
    relevantNodes,
    recentEvents: [],
    retrievedMemories: personaMemory ? [personaMemory] : []
  };
}
`;

fs.writeFileSync(path, newContent);
console.log("ContextOrchestrator patched to be async and use vector memory.");
