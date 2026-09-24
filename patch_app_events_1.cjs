const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntent, DraftIntent, subscribeToWorkActors, subscribeToWorkGaps, subscribeToWorkEvidences } from './engine/firebase-engine';",
  "import { createWork, addIntentToWork, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntent, DraftIntent, subscribeToWorkActors, subscribeToWorkGaps, subscribeToWorkEvidences, subscribeToWorkEvents } from './engine/firebase-engine';"
);

code = code.replace(
  "const [evidences, setEvidences] = useState<any[]>([]);",
  "const [evidences, setEvidences] = useState<any[]>([]);\n  const [events, setEvents] = useState<any[]>([]);\n  const [showAuditTrail, setShowAuditTrail] = useState(false);"
);

code = code.replace(
  "const unsubEvidences = subscribeToWorkEvidences(activeWorkId, setEvidences);",
  "const unsubEvidences = subscribeToWorkEvidences(activeWorkId, setEvidences);\n      const unsubEvents = subscribeToWorkEvents(activeWorkId, setEvents);"
);

code = code.replace(
  "return () => { unsubActors(); unsubGaps(); unsubEvidences(); };",
  "return () => { unsubActors(); unsubGaps(); unsubEvidences(); unsubEvents(); };"
);

fs.writeFileSync('src/App.tsx', code);
