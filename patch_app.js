const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace imports
code = code.replace(
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks } from './engine/firebase-engine';",
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntentToWork, DraftIntent } from './engine/firebase-engine';"
);

// We need to keep a list of draft intents in the state.
code = code.replace(
  "const [projectionRows, setProjectionRows] = useState<ProjectionRow[]>([]);",
  `const [projectionRows, setProjectionRows] = useState<ProjectionRow[]>([]);
  const [draftIntents, setDraftIntents] = useState<DraftIntent[]>([]);`
);

// We need to subscribe to draft intents.
code = code.replace(
  "useEffect(() => {",
  `useEffect(() => {
    if (user) {
      return subscribeToDraftIntents((drafts) => {
        setDraftIntents(drafts);
      });
    }
  }, [user]);

  useEffect(() => {`
);

// handleAction should create a Draft Intent instead of a Canonical Work/Intent.
const handleActionOld = `    try {
      const response = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, currentReality: { graph: { objects: projectionRows.flatMap(r => r.nodes) } } })
      });
      
      const data = await response.json();
      
      let currentWorkId = activeWorkId;
      if (!currentWorkId) {
        currentWorkId = await createWork();
        if (currentWorkId) setActiveWorkId(currentWorkId);
      }

      if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {
        const payload = data.semanticAction.payload || {};
        if (currentWorkId) {
          await addIntentToWork(currentWorkId, {
            title: payload.title || text,
            quantity: payload.quantity || 1,
            unit: payload.unit || 'unit',
            subtitle: payload.subtitle,
            deadline: payload.deadline,
            location: payload.location
          });
        }
      }
      
      // For now, if it returns an unknown action but we just want to project it as a new intent:
      if (data.semanticAction && data.semanticAction.type !== 'CREATE_WANT') {
         if (currentWorkId) {
            await addIntentToWork(currentWorkId, {
              title: data.transientObservation || text,
              subtitle: 'AI Inference',
            });
         }
      }
    } catch (error) {`;

const handleActionNew = `    try {
      const response = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, currentReality: { graph: { objects: projectionRows.flatMap(r => r.nodes) } } })
      });
      
      const data = await response.json();

      if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {
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
      }
    } catch (error) {`;

code = code.replace(handleActionOld, handleActionNew);

fs.writeFileSync('src/App.tsx', code);
