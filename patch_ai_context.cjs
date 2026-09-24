const fs = require('fs');

// 1. Update CausalProposal.ts
const proposalPath = './src/engine/universal/CausalProposal.ts';
let proposalContent = fs.readFileSync(proposalPath, 'utf8');
proposalContent = proposalContent.replace(
  'rationale: string; // Why the AI thinks this is needed',
  'rationale: string; // Why the AI thinks this is needed\n  contextualDetails?: string;\n  clarificationQuestions?: string[];'
);
fs.writeFileSync(proposalPath, proposalContent);

// 2. Update server.ts
const serverPath = './server.ts';
let serverContent = fs.readFileSync(serverPath, 'utf8');
serverContent = serverContent.replace(
  /\{ "label": "string", "rationale": "string", "confidence": number \}/g,
  '{ "label": "string", "rationale": "string", "contextualDetails": "string (rich explanation of this block)", "clarificationQuestions": ["specific question for this node"], "confidence": number }'
);
// Fallback update
serverContent = serverContent.replace(
  /proposedDependencies: \[\s*\{\s*label: "Review Intent", rationale: "We need to understand the intent better.", confidence: 0.9\s*\},\s*\{\s*label: "Find Capabilities", rationale: "We need to find who can do this.", confidence: 0.8\s*\}\s*\]/m,
  `proposedDependencies: [
      { label: "Review Intent", rationale: "We need to understand the intent better.", contextualDetails: "This is a placeholder for detailed AI context.", clarificationQuestions: ["What exactly are you trying to build?"], confidence: 0.9 },
      { label: "Find Capabilities", rationale: "We need to find who can do this.", contextualDetails: "This is a placeholder.", clarificationQuestions: [], confidence: 0.8 }
    ]`
);
fs.writeFileSync(serverPath, serverContent);

console.log("Types and server patched.");
