const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add currentProjection state and update the nodes rendering
content = content.replace(
  `  const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;`,
  `  const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const [currentProjection, setCurrentProjection] = useState<string>('owner');
  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;`
);

const oldWants = `  const wants = nodes.filter(n => n.type === 'WANT');`;
const newWants = `  const committedActors = nodes.filter(n => n.type === 'ACTOR' && n.state === 'COMMITTED');
  
  let projectedRoots = [];
  if (currentProjection === 'owner') {
    projectedRoots = nodes.filter(n => n.type === 'WANT');
  } else {
    // If viewing as an Actor, their root is the DEPENDENCY they are committed to
    const actorEdges = Object.values(graph.edges).filter(e => e.targetId === currentProjection);
    const parentDepIds = actorEdges.map(e => e.sourceId);
    projectedRoots = parentDepIds.map(id => graph.nodes[id]).filter(Boolean);
  }`;
content = content.replace(oldWants, newWants);

// 2. Inject the Perspective Switcher UI in the header
const oldHeader = `      <header className="w-full max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-xl font-bold tracking-widest uppercase text-gray-800">Living Causal Surface</h1>
        <p className="text-xs text-gray-500 mt-2">Any Intent. Any Actor. True Reality.</p>
      </header>`;
      
const newHeader = `      <header className="w-full max-w-2xl mx-auto mb-8 flex flex-col items-center">
        <h1 className="text-xl font-bold tracking-widest uppercase text-gray-800 text-center">Living Causal Surface</h1>
        <p className="text-xs text-gray-500 mt-2 text-center">Any Intent. Any Actor. True Reality.</p>
        
        {/* PHASE 6: CANONICAL MULTI-ACTOR PROJECTION */}
        {committedActors.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 p-2 bg-white/50 backdrop-blur-md rounded-2xl shadow-neo-down border border-black/5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 ml-2">Viewing As:</span>
            <button 
              onClick={() => { setCurrentProjection('owner'); setActiveContextId(null); }}
              className={\`text-xs font-bold py-1.5 px-3 rounded-xl transition-all \${currentProjection === 'owner' ? 'bg-indigo-600 text-white shadow-neo-down' : 'hover:bg-gray-100 text-gray-600'}\`}
            >
              Owner
            </button>
            {committedActors.map(actor => (
              <button 
                key={actor.id}
                onClick={() => { setCurrentProjection(actor.id); setActiveContextId(null); }}
                className={\`text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 \${currentProjection === actor.id ? 'bg-emerald-600 text-white shadow-neo-down' : 'hover:bg-gray-100 text-gray-600'}\`}
              >
                <User className="w-3.5 h-3.5" />
                {actor.label}
              </button>
            ))}
          </div>
        )}
      </header>`;
content = content.replace(oldHeader, newHeader);

// 3. Update the recursive map from wants to projectedRoots
content = content.replace(
  `          {wants.map(want => (
            <NodeRenderer key={want.id} node={want} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />
          ))}`,
  `          {projectedRoots.map(root => (
            <NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />
          ))}`
);

// 4. Also automatically set active context if in Actor projection and no context is set
const handleInputOld = `    try {
      setPendingContextId(activeContextId);
      await submitIntent(inputText, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }`;
const handleInputNew = `    try {
      // If we are in actor projection, default context to the actor itself to attach children
      const effectiveContextId = activeContextId || (currentProjection !== 'owner' ? currentProjection : null);
      setPendingContextId(effectiveContextId);
      await submitIntent(inputText, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }`;
content = content.replace(handleInputOld, handleInputNew);

// 5. Update input placeholder for actor projection
const placeholderOld = `placeholder={activeNode ? \`What does \${activeNode.label} need to fulfill this?\` : "Tell C-Link what needs to happen..."}`;
const placeholderNew = `placeholder={activeNode ? \`What does \${activeNode.label} need to fulfill this?\` : (currentProjection !== 'owner' ? \`What do you need to fulfill this responsibility?\` : "Tell C-Link what needs to happen...")}`;
content = content.replace(placeholderOld, placeholderNew);

// Write to file
fs.writeFileSync(path, content);
console.log("Phase 6 multi-actor projection implemented.");
