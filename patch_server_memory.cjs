const fs = require('fs');
const path = './server.ts';
let content = fs.readFileSync(path, 'utf8');

const oldRules = `Rules:
1. "proposedDependencies" are your hypothesis of what is needed (e.g., Materials, Assembly, Testing).
2. For EACH dependency, provide "contextualDetails" (a rich paragraph explaining to the user what this specific block will do and why it is critical) and "clarificationQuestions" (specific questions for the user regarding THIS specific block).
3. "unknowns" (global array) are things that need clarification about the ENTIRE project (e.g., "What is the exact budget?").
4. Do NOT invent specific Actors unless they are provided in the context Snapshot.
5. If the intent is simple, the dependencies might just be ["Execution", "Proof"].
6. Always return strictly valid JSON matching the schema.\`;`;

const newRules = `Rules:
1. "proposedDependencies" are your hypothesis of what is needed.
2. For EACH dependency, provide "contextualDetails" (a rich explanation) and "clarificationQuestions".
3. "unknowns" (global array) are things that need clarification about the ENTIRE project.
4. **MEMORY INTEGRATION (CRITICAL):** If the Context Snapshot contains \`retrievedMemories\` (Persona Clones), you MUST use this data! For example, if a memory shows Korim has a 5000 tk due, your proposed dependency should explicitly be "Clear 5000 tk Due for Korim".
5. Do NOT invent specific Actors unless they are provided in the context Snapshot.
6. Always return strictly valid JSON matching the schema.\`;`;

content = content.replace(oldRules, newRules);

fs.writeFileSync(path, content);
console.log("Server Memory Patched.");
