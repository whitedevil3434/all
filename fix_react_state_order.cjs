const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to move the state declarations to the top of the component.
const oldStateBlock = `  const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const [currentProjection, setCurrentProjection] = useState<string>('owner');
  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;`;

// Find where the hooks should go (just after `const nodes = Object.values(graph.nodes);`)
const targetPoint = `  const nodes = Object.values(graph.nodes);`;

content = content.replace(oldStateBlock, ``);
content = content.replace(targetPoint, `${oldStateBlock}\n\n  const nodes = Object.values(graph.nodes);`);

fs.writeFileSync(path, content);
console.log("Moved React hooks before they are used.");
