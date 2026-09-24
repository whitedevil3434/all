import { db } from './firebase';
import { collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';

export interface PersonaMemory {
  personaId: string;
  type: string;
  name: string;
  rating: number;
  historicalContext: string;
  activeState: {
    lastTransaction: string;
    pendingDue: string;
  };
  embedding?: number[]; // Vector embedding
}

const seedMemories: PersonaMemory[] = [
  {
    personaId: "actor_korim_99x",
    type: "Clone Profile",
    name: "Korim (Supplier)",
    rating: 4.8,
    historicalContext: "Has been supplying raw materials for 3 months. Usually delivers in 400kg batches.",
    activeState: {
      lastTransaction: "400 kg supplied",
      pendingDue: "5000 tk"
    }
  },
  {
    personaId: "actor_rahim_builder",
    type: "Clone Profile",
    name: "Rahim (Contractor)",
    rating: 4.5,
    historicalContext: "Constructs the main framework.",
    activeState: {
      lastTransaction: "Initial deposit 20000 tk",
      pendingDue: "0 tk"
    }
  },
  {
    personaId: "actor_mina_design",
    type: "Clone Profile",
    name: "Mina (UI/UX Architect)",
    rating: 4.9,
    historicalContext: "Expert in minimalist interfaces and design systems. Completed 12 projects.",
    activeState: {
      lastTransaction: "Web App UI Design",
      pendingDue: "0 tk"
    }
  },
  {
    personaId: "actor_tariq_logistics",
    type: "Clone Profile",
    name: "Tariq (Logistics & Transport)",
    rating: 4.7,
    historicalContext: "Owns a fleet of covered vans. Fast and reliable delivery within Dhaka.",
    activeState: {
      lastTransaction: "Delivery to Gulshan",
      pendingDue: "2500 tk"
    }
  },
  {
    personaId: "actor_faruq_dev",
    type: "Clone Profile",
    name: "Faruq (Senior Developer)",
    rating: 4.6,
    historicalContext: "Full-stack React and Node.js developer. Specializes in scalable architectures.",
    activeState: {
      lastTransaction: "API Integration",
      pendingDue: "15000 tk"
    }
  },
  {
    personaId: "actor_nipa_qa",
    type: "Clone Profile",
    name: "Nipa (QA Engineer)",
    rating: 4.8,
    historicalContext: "Detail-oriented tester for both manual and automated test suites.",
    activeState: {
      lastTransaction: "Regression Testing",
      pendingDue: "0 tk"
    }
  }

];

// Helper to compute cosine similarity
function cosineSimilarity(A: number[], B: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}


// Ensure memories are seeded with embeddings
export async function seedMemoriesIfEmpty(retries = 10) {
  try {
    const docRef = doc(db, 'system', 'seed_status_v2');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Seeding Persona Memories to Firestore...");
      for (const mem of seedMemories) {
        // Get embedding from server
        const textToEmbed = `${mem.name} ${mem.historicalContext} Last transaction: ${mem.activeState.lastTransaction}. Due: ${mem.activeState.pendingDue}`;
        const res = await fetch('/api/embed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToEmbed })
        });
        const data = await res.json();
        const embedding = data.embedding;
        
        await setDoc(doc(db, 'personas', mem.personaId), {
          ...mem,
          embedding
        });
      }
      await setDoc(docRef, { seeded: true });
      console.log("Seeding complete.");
    }
  } catch (err: any) {
    if (retries > 0) {
      console.log(`Retrying seed in 2 seconds... (${retries} retries left)`);
      setTimeout(() => seedMemoriesIfEmpty(retries - 1), 2000);
    } else {
      if (err?.message?.includes('offline')) {
        console.warn("Skipped seeding memories: client offline.");
      } else {
        console.error("Error seeding memories:", err);
      }
    }
  }
}
// Find closest persona based on query
export async function findClosestPersona(query: string): Promise<PersonaMemory | null> {
  try {
    // 1. Embed the query
    const res = await fetch('/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: query })
    });
    const data = await res.json();
    const queryVector = data.embedding;
    if (!queryVector) return null;

    // 2. Fetch all personas from Firestore
    const personasSnapshot = await getDocs(collection(db, 'personas'));
    let bestMatch: PersonaMemory | null = null;
    let highestSim = -1;

    personasSnapshot.forEach((doc) => {
      const data = doc.data() as PersonaMemory;
      if (data.embedding && data.embedding.length > 0) {
        const sim = cosineSimilarity(queryVector, data.embedding);
        if (sim > highestSim) {
          highestSim = sim;
          bestMatch = data;
        }
      }
    });

    // 3. Return if threshold met (e.g. > 0.78) to prevent hallucination
    if (highestSim > 0.78) {
      console.log(`Found memory with similarity ${highestSim.toFixed(2)}: ${bestMatch?.name}`);
      // Remove embedding before returning so we don't blow up context
      if (bestMatch) {
        const { embedding, ...rest } = bestMatch as any;
        return rest as PersonaMemory;
      }
    }
    
    return null;
  } catch (err) {
    console.error("Error finding closest persona:", err);
    return null;
  }
}
