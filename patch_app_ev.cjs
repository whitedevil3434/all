const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Update imports
code = code.replace(
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntent, DraftIntent, subscribeToWorkActors, subscribeToWorkGaps } from './engine/firebase-engine';",
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntent, DraftIntent, subscribeToWorkActors, subscribeToWorkGaps, subscribeToWorkEvidences } from './engine/firebase-engine';"
);

// Add evidences state
code = code.replace(
  "const [gaps, setGaps] = useState<any[]>([]);",
  `const [gaps, setGaps] = useState<any[]>([]);
  const [evidences, setEvidences] = useState<any[]>([]);`
);

// Add subscription
code = code.replace(
  "const unsubGaps = subscribeToWorkGaps(activeWorkId, setGaps);",
  `const unsubGaps = subscribeToWorkGaps(activeWorkId, setGaps);
      const unsubEvidences = subscribeToWorkEvidences(activeWorkId, setEvidences);`
);
code = code.replace(
  "return () => { unsubActors(); unsubGaps(); };",
  "return () => { unsubActors(); unsubGaps(); unsubEvidences(); };"
);

// Add to dependencies
code = code.replace(
  "  }, [activeWorkId, actors, gaps]);",
  "  }, [activeWorkId, actors, gaps, evidences]);"
);

// Update projection to include Evidences
const projOld = `           if (combinedNodes.length > 0) {
             rows.push({
               id: 'row-actors-gaps',
               type: 'branch',
               nodes: combinedNodes
             });
           }
        }`;
        
const projNew = `           if (combinedNodes.length > 0) {
             rows.push({
               id: 'row-actors-gaps',
               type: 'branch',
               nodes: combinedNodes
             });
           }
        }
        
        if (evidences.length > 0) {
           const evNodes: RealityNode[] = evidences.map(ev => ({
              id: ev.id,
              type: 'EVIDENCE',
              iconName: 'ReceiptText',
              title: ev.description || 'Evidence Provided',
              subtitle: ev.actorName || 'System',
              statusText: ev.status
           }));
           
           rows.push({
             id: 'row-evidences',
             type: 'single', // or branch if multiple
             nodes: evNodes
           });
        }`;
code = code.replace(projOld, projNew);


// Handle Action
const handleOld = `} else if (data.semanticAction && (data.semanticAction.type === 'ASK_ACTOR' || data.semanticAction.type === 'ACCEPT_COMMITMENT')) {
        const actorName = data.semanticAction.targetActorName;
        const targetActor = actors.find(a => a.name === actorName || a.title === actorName);
        if (targetActor) {
           const newStatus = data.semanticAction.type === 'ASK_ACTOR' ? 'ASKING' : 'COMMITTED';
           await createDraftIntent({
              status: newStatus,
              name: actorName
           }, text, 'UPDATE_ACTOR', activeWorkId || undefined, targetActor.id);
        } else {
           await createDraftIntent({
              title: data.transientObservation || text,
              subtitle: 'Actor not found for status update'
           }, text, 'UNKNOWN', activeWorkId || undefined);
        }
      } else {`;
      
const handleNew = `} else if (data.semanticAction && (data.semanticAction.type === 'ASK_ACTOR' || data.semanticAction.type === 'ACCEPT_COMMITMENT')) {
        const actorName = data.semanticAction.targetActorName;
        const targetActor = actors.find(a => a.name === actorName || a.title === actorName);
        if (targetActor) {
           const newStatus = data.semanticAction.type === 'ASK_ACTOR' ? 'ASKING' : 'COMMITTED';
           await createDraftIntent({
              status: newStatus,
              name: actorName
           }, text, 'UPDATE_ACTOR', activeWorkId || undefined, targetActor.id);
        } else {
           await createDraftIntent({
              title: data.transientObservation || text,
              subtitle: 'Actor not found for status update'
           }, text, 'UNKNOWN', activeWorkId || undefined);
        }
      } else if (data.semanticAction && data.semanticAction.type === 'PROVIDE_EVIDENCE') {
        const payload = data.semanticAction.payload || {};
        const actorName = data.semanticAction.targetActorName;
        const targetActor = actorName ? actors.find(a => a.name === actorName || a.title === actorName) : undefined;
        await createDraftIntent({
            description: payload.description || text,
            actorName: targetActor ? targetActor.name : undefined
        }, text, 'ADD_EVIDENCE', activeWorkId || undefined, targetActor ? targetActor.id : undefined);
      } else if (data.semanticAction && data.semanticAction.type === 'RESOLVE_WORK') {
        await createDraftIntent({
            title: "Mark Work as Resolved",
            subtitle: "All requirements met"
        }, text, 'RESOLVE_WORK', activeWorkId || undefined);
      } else {`;
code = code.replace(handleOld, handleNew);


// Handle Render Drafts
const renderOld = `} else if (draft.mutationType === 'UPDATE_ACTOR') {
                  type = 'ACTOR';
                  iconName = 'User';
                  title = draft.interpretation.name;
                  statusText = \`PROPOSED STATUS: \${draft.interpretation.status}\`;
                  actionText = 'Confirm Status Change';
                }`;

const renderNew = `} else if (draft.mutationType === 'UPDATE_ACTOR') {
                  type = 'ACTOR';
                  iconName = 'User';
                  title = draft.interpretation.name;
                  statusText = \`PROPOSED STATUS: \${draft.interpretation.status}\`;
                  actionText = 'Confirm Status Change';
                } else if (draft.mutationType === 'ADD_EVIDENCE') {
                  type = 'EVIDENCE';
                  iconName = 'ReceiptText';
                  title = draft.interpretation.description || 'Evidence';
                  subtitle = draft.interpretation.actorName || subtitle;
                  statusText = 'PROPOSED EVIDENCE';
                  actionText = 'Accept Evidence';
                } else if (draft.mutationType === 'RESOLVE_WORK') {
                  type = 'WANT';
                  iconName = 'CheckCircle2';
                  title = draft.interpretation.title;
                  subtitle = draft.interpretation.subtitle;
                  statusText = 'PROPOSED RESOLUTION';
                  actionText = 'Resolve Work';
                }`;
                
code = code.replace(renderOld, renderNew);

fs.writeFileSync('src/App.tsx', code);
