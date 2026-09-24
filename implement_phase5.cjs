const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add activeContextId & pendingContextId state
content = content.replace(
  `const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();`,
  `const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;`
);

// 2. Update handleInput to set pendingContextId
content = content.replace(
  `    try {
      await submitIntent(inputText, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }`,
  `    try {
      setPendingContextId(activeContextId);
      await submitIntent(inputText, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }`
);

// 3. Update Materialize Reality button logic
const oldMaterialize = `const wantId = RealityEngine.addNode({
                      type: 'WANT',
                      label: hypothesis.inferredMeaning,
                      state: 'COMMITTED',
                      attention: 50
                    });
                    
                    hypothesis.proposedDependencies.forEach(dep => {
                      const depId = RealityEngine.addNode({
                        type: 'DEPENDENCY',
                        label: dep.label,
                        state: 'UNKNOWN',
                        attention: 80
                      });
                      RealityEngine.addEdge(wantId, depId, 'requires');
                    });`;

const newMaterialize = `if (pendingContextId) {
                      hypothesis.proposedDependencies.forEach(dep => {
                        const depId = RealityEngine.addNode({
                          type: 'DEPENDENCY',
                          label: dep.label,
                          state: 'UNKNOWN',
                          attention: 80
                        });
                        RealityEngine.addEdge(pendingContextId, depId, 'requires');
                      });
                    } else {
                      const wantId = RealityEngine.addNode({
                        type: 'WANT',
                        label: hypothesis.inferredMeaning,
                        state: 'COMMITTED',
                        attention: 50
                      });
                      
                      hypothesis.proposedDependencies.forEach(dep => {
                        const depId = RealityEngine.addNode({
                          type: 'DEPENDENCY',
                          label: dep.label,
                          state: 'UNKNOWN',
                          attention: 80
                        });
                        RealityEngine.addEdge(wantId, depId, 'requires');
                      });
                    }`;
content = content.replace(oldMaterialize, newMaterialize);

// Also reset pendingContextId on clear
content = content.replace(
  `clearHypothesis();
                    causalAudio.playSettleHarmony();`,
  `clearHypothesis();
                    setPendingContextId(null);
                    causalAudio.playSettleHarmony();`
);
content = content.replace(
  `onClick={() => {
                    clearHypothesis();
                  }}`,
  `onClick={() => {
                    clearHypothesis();
                    setPendingContextId(null);
                  }}`
);

// 4. Update NodeRenderer calls in DynamicRealitySurface
content = content.replace(
  `<NodeRenderer key={want.id} node={want} />`,
  `<NodeRenderer key={want.id} node={want} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />`
);

// 5. Update input placeholder
content = content.replace(
  `placeholder="Tell C-Link what needs to happen..."`,
  `placeholder={activeNode ? \`What does \${activeNode.label} need to fulfill this?\` : "Tell C-Link what needs to happen..."}`
);

// 6. Update NodeRenderer signature & children rendering
content = content.replace(
  `function NodeRenderer({ node }: { node: GraphNode }) {`,
  `function NodeRenderer({ node, activeContextId, setActiveContextId }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void }) {`
);
content = content.replace(
  `<NodeRenderer key={child.id} node={child} />`,
  `<NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />`
);

// 7. Update getAttentionClass
const oldAttention = `  const getAttentionClass = () => {
    if (node.attention && node.attention > 80) return 'ring-2 ring-indigo-500/50 shadow-neo-up-xl scale-[1.02]';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-80 scale-95';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl';
  };`;
const newAttention = `  const getAttentionClass = () => {
    if (activeContextId === node.id) return 'ring-2 ring-indigo-500 shadow-neo-up-xl scale-[1.02] bg-indigo-50/30';
    if (node.attention && node.attention > 80) return 'ring-2 ring-indigo-500/50 shadow-neo-up-xl scale-[1.02]';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-90 scale-95';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl';
  };`;
content = content.replace(oldAttention, newAttention);

// 8. Add "Enter Actor Projection" button to COMMITTED actors
const actorButton = `
        {node.state === 'COMMITTED' && node.type === 'ACTOR' && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
              className={\`text-[10px] font-bold py-1.5 px-3 rounded-md transition-colors \${activeContextId === node.id ? 'bg-indigo-600 text-white shadow-neo-down' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
            >
              {activeContextId === node.id ? 'Exit Actor Projection' : 'Enter Actor Projection'}
            </button>
          </div>
        )}`;

// Insert it right after the FAILED button block for Decline
content = content.replace(
  `Decline
            </button>
          </div>
        )}`,
  `Decline
            </button>
          </div>
        )}
        ${actorButton}`
);

fs.writeFileSync(path, content);
console.log('Successfully implemented Phase 5 (Recursive Work)');
