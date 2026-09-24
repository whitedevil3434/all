const fs = require('fs');
const path = './server.ts';
let content = fs.readFileSync(path, 'utf8');

const oldRules = `Rules:
1. "proposedDependencies" are your hypothesis of what is needed (e.g., Materials, Assembly, Testing).
2. "unknowns" are things that need clarification (e.g., "Who will do the assembly?", "What is the exact budget?").
3. Do NOT invent specific Actors unless they are provided in the context Snapshot.
4. If the intent is simple, the dependencies might just be ["Execution", "Proof"].
5. Always return strictly valid JSON matching the schema.\`;`;

const newRules = `Rules:
1. "proposedDependencies" are your hypothesis of what is needed (e.g., Materials, Assembly, Testing).
2. For EACH dependency, provide "contextualDetails" (a rich paragraph explaining to the user what this specific block will do and why it is critical) and "clarificationQuestions" (specific questions for the user regarding THIS specific block).
3. "unknowns" (global array) are things that need clarification about the ENTIRE project (e.g., "What is the exact budget?").
4. Do NOT invent specific Actors unless they are provided in the context Snapshot.
5. If the intent is simple, the dependencies might just be ["Execution", "Proof"].
6. Always return strictly valid JSON matching the schema.\`;`;

content = content.replace(oldRules, newRules);
fs.writeFileSync(path, content);
console.log("Server Rules Patched.");
