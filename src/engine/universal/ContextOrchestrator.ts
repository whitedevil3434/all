import { RealityEngine } from '../core/UniversalGraphStore';
import { findClosestPersona } from '../../lib/vectorMemory';

export interface ContextSnapshot {
  intent: any;
  frontier: any[]; // The immediate blockers
  activeNodes: any[]; // Nodes currently in flight
  retrievedMemories?: any[];
}

export async function buildContextSnapshot(query: string): Promise<ContextSnapshot> {
  const graph = RealityEngine.getGraph();
  const nodes = Object.values(graph.nodes);

  // 1. Identify Intent
  const intent = nodes.find(n => n.type === 'WANT');

  // 2. Compute Current Frontier (Smallest sufficient context of what is blocking)
  const frontier = nodes.filter(n => 
    (n.state === 'UNKNOWN' || n.type === 'GAP') && 
    !['RESOLVED', 'COMMITTED', 'FAILED', 'EXECUTING'].includes(n.state)
  );

  // 3. Identify Active / In-flight reality
  const activeNodes = nodes.filter(n => 
    ['ASKING', 'POSSIBLE', 'OFFERED'].includes(n.state)
  );

  // --- SPATIAL MEMORY INJECTION ---
  const personaMemory = await findClosestPersona(query);
  // ---------------------------------

  return {
    intent,
    frontier: frontier.slice(0, 3), // Bounded Rationality: Give AI only the top blockers
    activeNodes,
    retrievedMemories: personaMemory ? [personaMemory] : []
  };
}
