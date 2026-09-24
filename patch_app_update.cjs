const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldHandle = `} else if (data.semanticAction && data.semanticAction.type === 'IDENTIFY_GAP') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit
        }, text, 'CREATE_GAP', activeWorkId || undefined);
      } else {`;

const newHandle = `} else if (data.semanticAction && data.semanticAction.type === 'IDENTIFY_GAP') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit
        }, text, 'CREATE_GAP', activeWorkId || undefined);
      } else if (data.semanticAction && (data.semanticAction.type === 'ASK_ACTOR' || data.semanticAction.type === 'ACCEPT_COMMITMENT')) {
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

code = code.replace(oldHandle, newHandle);

const oldRender = `} else if (draft.mutationType === 'CREATE_GAP') {
                  type = 'GAP';
                  iconName = 'AlertTriangle';
                  statusText = 'PROPOSED GAP';
                  actionText = 'Confirm Gap';
                }`;

const newRender = `} else if (draft.mutationType === 'CREATE_GAP') {
                  type = 'GAP';
                  iconName = 'AlertTriangle';
                  statusText = 'PROPOSED GAP';
                  actionText = 'Confirm Gap';
                } else if (draft.mutationType === 'UPDATE_ACTOR') {
                  type = 'ACTOR';
                  iconName = 'User';
                  title = draft.interpretation.name;
                  statusText = \`PROPOSED STATUS: \${draft.interpretation.status}\`;
                  actionText = 'Confirm Status Change';
                }`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/App.tsx', code);
