const fs = require('fs');
let content = fs.readFileSync('src/lib/vectorMemory.ts', 'utf-8');

const newSeedLogic = `
// Ensure memories are seeded with embeddings
export async function seedMemoriesIfEmpty(retries = 3) {
  try {
    const docRef = doc(db, 'system', 'seed_status');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Seeding Persona Memories to Firestore...");
      for (const mem of seedMemories) {
        // Get embedding from server
        const textToEmbed = \`\${mem.name} \${mem.historicalContext} Last transaction: \${mem.activeState.lastTransaction}. Due: \${mem.activeState.pendingDue}\`;
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
    console.error("Error seeding memories:", err);
    if (err.message && err.message.includes('the client is offline') && retries > 0) {
      console.log(\`Retrying seed in 2 seconds... (\${retries} retries left)\`);
      setTimeout(() => seedMemoriesIfEmpty(retries - 1), 2000);
    }
  }
}
`;

content = content.replace(/\/\/ Ensure memories are seeded with embeddings[\s\S]*?(?=\/\/ Find closest persona based on query)/, newSeedLogic);

fs.writeFileSync('src/lib/vectorMemory.ts', content);
