const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Update imports
code = code.replace(
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntentToWork, DraftIntent } from './engine/firebase-engine';",
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntent, DraftIntent, subscribeToWorkActors, subscribeToWorkGaps } from './engine/firebase-engine';"
);

// We need to keep a list of actors and gaps in the state.
code = code.replace(
  "const [draftIntents, setDraftIntents] = useState<DraftIntent[]>([]);",
  `const [draftIntents, setDraftIntents] = useState<DraftIntent[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);`
);

// We need to subscribe to actors and gaps.
code = code.replace(
  "// Auto scroll to bottom",
  `
  useEffect(() => {
    if (activeWorkId) {
      const unsubActors = subscribeToWorkActors(activeWorkId, setActors);
      const unsubGaps = subscribeToWorkGaps(activeWorkId, setGaps);
      return () => { unsubActors(); unsubGaps(); };
    }
  }, [activeWorkId]);

  // Auto scroll to bottom`
);

// Update projection logic to include Actors and Gaps
const oldProjection = `      return subscribeToWorkIntents(activeWorkId, (intents) => {
        // Project Canonical Intents onto the minimal surface
        const rows = intents.map((intent, index) => {
          const node: RealityNode = {
            id: intent.id,
            type: 'WANT',
            iconName: 'Heart',
            title: intent.title,
            subtitle: intent.subtitle || \`\${intent.quantity || ''} \${intent.unit || ''}\`.trim(),
            details: intent.deadline ? [\`Deadline: \${intent.deadline}\`, \`Location: \${intent.location || 'Unknown'}\`] : undefined
          };
          return {
            id: \`row-\${intent.id}\`,
            type: 'single' as const,
            nodes: [node]
          };
        });
        setProjectionRows(rows);
      });`;

const newProjection = `      return subscribeToWorkIntents(activeWorkId, (intents) => {
        // Project Canonical Intents onto the minimal surface
        const rows: any[] = intents.map((intent, index) => {
          const node: RealityNode = {
            id: intent.id,
            type: 'WANT',
            iconName: 'Heart',
            title: intent.title,
            subtitle: intent.subtitle || \`\${intent.quantity || ''} \${intent.unit || ''}\`.trim(),
            details: intent.deadline ? [\`Deadline: \${intent.deadline}\`, \`Location: \${intent.location || 'Unknown'}\`] : undefined
          };
          return {
            id: \`row-\${intent.id}\`,
            type: 'single' as const,
            nodes: [node]
          };
        });
        
        // Let's project Gaps and Actors as connected rows if we have them
        if (gaps.length > 0 || actors.length > 0) {
           const combinedNodes: RealityNode[] = [];
           
           actors.forEach(actor => {
             combinedNodes.push({
               id: actor.id,
               type: 'ACTOR',
               iconName: 'User',
               title: actor.name || actor.title || 'Unknown Actor',
               subtitle: actor.role || actor.subtitle || actor.quantity + ' ' + actor.unit,
               statusText: actor.status
             });
           });
           
           gaps.forEach(gap => {
             combinedNodes.push({
               id: gap.id,
               type: 'GAP',
               iconName: 'AlertTriangle',
               title: gap.title || 'Gap',
               subtitle: gap.quantity ? gap.quantity + ' ' + gap.unit : undefined,
               statusText: gap.status
             });
           });
           
           if (combinedNodes.length > 0) {
             rows.push({
               id: 'row-actors-gaps',
               type: 'branch',
               nodes: combinedNodes
             });
           }
        }
        
        setProjectionRows(rows);
      });`;

code = code.replace(oldProjection, newProjection);

// Re-patch useEffect dependencies to recalculate when actors/gaps change
code = code.replace(
  "  }, [activeWorkId]);",
  "  }, [activeWorkId, actors, gaps]);"
);


// Update handleAction to handle DISCOVER_ACTOR and IDENTIFY_GAP
const oldHandleActionNew = `      if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit,
            subtitle: payload.subtitle,
            deadline: payload.deadline,
            location: payload.location
        }, text);
      } else {
        // Fallback for unknown intent
        await createDraftIntent({
          title: data.transientObservation || text,
          subtitle: 'AI Inference',
        }, text);
      }`;

const newHandleActionNew = `      if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit,
            subtitle: payload.subtitle,
            deadline: payload.deadline,
            location: payload.location
        }, text, 'CREATE_WORK');
      } else if (data.semanticAction && data.semanticAction.type === 'DISCOVER_ACTOR') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            name: data.semanticAction.targetActorName || payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit,
            role: payload.role || 'Supplier'
        }, text, 'ADD_ACTOR', activeWorkId || undefined);
      } else if (data.semanticAction && data.semanticAction.type === 'IDENTIFY_GAP') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit
        }, text, 'CREATE_GAP', activeWorkId || undefined);
      } else {
        // Fallback for unknown intent
        await createDraftIntent({
          title: data.transientObservation || text,
          subtitle: 'AI Inference',
        }, text, 'UNKNOWN', activeWorkId || undefined);
      }`;

code = code.replace(oldHandleActionNew, newHandleActionNew);

// In the render method, promoteDraftIntentToWork -> promoteDraftIntent
code = code.replace(/promoteDraftIntentToWork/g, "promoteDraftIntent");

// Add correct status and label based on mutationType
const oldDraftRender = `              {draftIntents.map((draft, idx) => {
                const draftNode = {
                  id: draft.id,
                  type: 'WANT' as const,
                  iconName: 'Sparkles',
                  title: draft.interpretation.title,
                  subtitle: draft.interpretation.subtitle || \`\${draft.interpretation.quantity || ''} \${draft.interpretation.unit || ''}\`.trim(),
                  details: draft.interpretation.deadline ? [\`Deadline: \${draft.interpretation.deadline}\`, \`Location: \${draft.interpretation.location || 'Unknown'}\`] : undefined,
                  statusText: 'AI INTERPRETATION'
                };
                
                return (`;
                
const newDraftRender = `              {draftIntents.map((draft, idx) => {
                let type: any = 'WANT';
                let iconName = 'Sparkles';
                let title = draft.interpretation.title;
                let subtitle = draft.interpretation.subtitle || \`\${draft.interpretation.quantity || ''} \${draft.interpretation.unit || ''}\`.trim();
                let statusText = 'AI INTERPRETATION';
                let actionText = 'Make this a Work';
                
                if (draft.mutationType === 'ADD_ACTOR') {
                  type = 'ACTOR';
                  iconName = 'User';
                  title = draft.interpretation.name;
                  subtitle = draft.interpretation.role || subtitle;
                  statusText = 'PROPOSED ACTOR';
                  actionText = 'Assign Actor';
                } else if (draft.mutationType === 'CREATE_GAP') {
                  type = 'GAP';
                  iconName = 'AlertTriangle';
                  statusText = 'PROPOSED GAP';
                  actionText = 'Confirm Gap';
                }

                const draftNode = {
                  id: draft.id,
                  type,
                  iconName,
                  title,
                  subtitle,
                  details: draft.interpretation.deadline ? [\`Deadline: \${draft.interpretation.deadline}\`, \`Location: \${draft.interpretation.location || 'Unknown'}\`] : undefined,
                  statusText
                };
                
                return (`;

code = code.replace(oldDraftRender, newDraftRender);

const oldDraftBtn = `Make this a Work
                       </button>`;
const newDraftBtn = `{actionText}
                       </button>`;
code = code.replace(oldDraftBtn, newDraftBtn);


fs.writeFileSync('src/App.tsx', code);
