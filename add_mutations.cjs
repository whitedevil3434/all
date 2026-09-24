const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

const updatedUseEffect = `  useEffect(() => {
    if (hypothesis) {
      causalAudio.playSettleHarmony();
      
      let parentId = pendingContextId;

      // Process mutations first
      if (hypothesis.mutations && hypothesis.mutations.length > 0) {
        hypothesis.mutations.forEach(mut => {
          if (mut.type === 'UPDATE_STATE' && mut.nodeId) {
            if (RealityEngine.getGraph().nodes[mut.nodeId]) {
              RealityEngine.updateNode(mut.nodeId, { state: mut.state as any });
            }
          } else if (mut.type === 'ADD_NODE' && mut.nodeId) {
            const newNodeId = RealityEngine.addNode({
              type: mut.nodeType as any || 'DEPENDENCY',
              label: mut.label || 'New Requirement',
              state: 'UNKNOWN',
              data: { rationale: mut.rationale }
            });
            RealityEngine.addEdge(mut.nodeId, newNodeId, 'unresolved');
          }
        });
      }

      // Add proposed dependencies if provided
      if (hypothesis.proposedDependencies && hypothesis.proposedDependencies.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
        }
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
          if (parentId) RealityEngine.addEdge(parentId, depId, 'requires');
        });
      }

      // 3. Convert unknowns into GAPs
      if (hypothesis.unknowns && hypothesis.unknowns.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
        }
        hypothesis.unknowns.forEach(u => {
           const uId = RealityEngine.addNode({
             type: 'GAP',
             label: u,
             state: 'UNKNOWN',
             data: { isClarification: true }
           });
           if (parentId) RealityEngine.addEdge(parentId, uId, 'unresolved');
        });
      }

      // 4. Also add actionOptions if any as GAPs to show up for user
      if (hypothesis.actionOptions && hypothesis.actionOptions.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
        }
        hypothesis.actionOptions.forEach(opt => {
           const optId = RealityEngine.addNode({
             type: 'GAP',
             label: opt.label,
             state: 'UNKNOWN',
             data: { isActionOption: true, actionType: opt.actionType, payload: opt.payload, parentRationale: hypothesis.inferredMeaning }
           });
           if (parentId) RealityEngine.addEdge(parentId, optId, 'unresolved');
        });
      }
      
      clearHypothesis();
      setPendingContextId(null);
    }
  }, [hypothesis]);`;

content = content.replace(/useEffect\(\(\) => \{\s*if \(hypothesis\) \{[\s\S]*?clearHypothesis\(\);\s*setPendingContextId\(null\);\s*causalAudio\.playSettleHarmony\(\);\s*\}\s*\}, \[hypothesis\]\);/, updatedUseEffect);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
