const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

const hookInsert = `
  useEffect(() => {
    if (hypothesis) {
      // 1. Create the Root Want or attach to pending context
      let parentId = pendingContextId;
      if (!parentId) {
        parentId = RealityEngine.addNode({
          type: 'WANT',
          label: hypothesis.inferredMeaning.substring(0, 50) + '...',
          state: 'UNKNOWN',
          data: { rationale: hypothesis.inferredMeaning }
        });
      }

      // 2. Add all proposed dependencies
      hypothesis.proposedDependencies.forEach(dep => {
        const depId = RealityEngine.addNode({
          type: 'DEPENDENCY',
          label: dep.label,
          state: 'UNKNOWN',
          data: { 
            rationale: dep.rationale,
            contextualDetails: dep.contextualDetails || '',
            unknowns: dep.clarificationQuestions || []
          }
        });
        RealityEngine.addEdge(parentId, depId, 'requires');
      });

      // 3. Convert unknowns into GAPs
      if (hypothesis.unknowns && hypothesis.unknowns.length > 0) {
        hypothesis.unknowns.forEach(u => {
           const uId = RealityEngine.addNode({
             type: 'GAP',
             label: u,
             state: 'UNKNOWN',
             data: { isClarification: true }
           });
           RealityEngine.addEdge(parentId, uId, 'unresolved');
        });
      }

      // 4. Also add actionOptions if any as GAPs to show up for user
      if (hypothesis.actionOptions && hypothesis.actionOptions.length > 0) {
        hypothesis.actionOptions.forEach(opt => {
           const optId = RealityEngine.addNode({
             type: 'GAP',
             label: opt.label,
             state: 'UNKNOWN',
             data: { isActionOption: true, actionType: opt.actionType, payload: opt.payload, parentRationale: hypothesis.inferredMeaning }
           });
           RealityEngine.addEdge(parentId, optId, 'unresolved');
        });
      }
      
      clearHypothesis();
      setPendingContextId(null);
      causalAudio.playSettleHarmony();
    }
  }, [hypothesis]);
`;

content = content.replace(/const activeNode = activeContextId \? graph.nodes\[activeContextId\] : null;/, hookInsert + '\n  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;');

// Remove the entire {hypothesis && (...)} block
const hypothesisStart = content.indexOf('{hypothesis && (');
if (hypothesisStart !== -1) {
  // Find the end of this block
  let depth = 0;
  let endIndex = -1;
  for (let i = hypothesisStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (endIndex !== -1) {
    content = content.substring(0, hypothesisStart) + content.substring(endIndex + 1);
  }
}

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
