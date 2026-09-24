const fs = require('fs');
const path = './src/engine/universal/ContextOrchestrator.ts';
let content = fs.readFileSync(path, 'utf8');

const oldReturn = `return {
    actor: {
      id: "user_1",
      name: "Current User",
      role: "Operations Manager"
    },
    query,
    relevantNodes,
    recentEvents: []
  };`;

const newReturn = `
  // --- SPATIAL MEMORY INJECTION ---
  // We simulate a Vector Database lookup based on the user's query semantic keywords.
  // In a real production system, this would query Pinecone/Weaviate.
  let personaMemory = null;
  if (query.toLowerCase().includes('korim') || query.toLowerCase().includes('due') || query.toLowerCase().includes('tk') || query.toLowerCase().includes('kg')) {
    personaMemory = {
      personaId: "actor_korim_99x",
      type: "Clone Profile",
      name: "Korim (Supplier)",
      rating: 4.8,
      historicalContext: "Has been supplying raw materials for 3 months.",
      activeState: {
        lastTransaction: "400 kg supplied",
        pendingDue: "5000 tk"
      }
    };
  }
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
  };`;

content = content.replace(oldReturn, newReturn);
fs.writeFileSync(path, content);
console.log("Context Orchestrator Patched.");
