const fs = require('fs');
let content = fs.readFileSync('src/lib/vectorMemory.ts', 'utf-8');

const additionalActors = `
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
`;

content = content.replace(
  /historicalContext: "Constructs the main framework\.",\n    activeState: \{\n      lastTransaction: "Initial deposit 20000 tk",\n      pendingDue: "0 tk"\n    \}\n  \}/,
  `historicalContext: "Constructs the main framework.",
    activeState: {
      lastTransaction: "Initial deposit 20000 tk",
      pendingDue: "0 tk"
    }
  },${additionalActors}`
);

fs.writeFileSync('src/lib/vectorMemory.ts', content);
