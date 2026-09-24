const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

code = code.replace(
  "mutationType: 'CREATE_WORK' | 'ADD_ACTOR' | 'CREATE_GAP' | 'UNKNOWN';",
  "mutationType: 'CREATE_WORK' | 'ADD_ACTOR' | 'CREATE_GAP' | 'UPDATE_ACTOR' | 'UNKNOWN';"
);

// We need to add the target id for updates
code = code.replace(
  "targetWorkId?: string;",
  "targetWorkId?: string;\n  targetNodeId?: string;"
);

// update promoteDraftIntent
const oldPromote = `} else if (draftData.mutationType === 'CREATE_GAP') {`;
const newPromote = `} else if (draftData.mutationType === 'UPDATE_ACTOR') {
    if (draftData.targetNodeId) {
      const actorRef = doc(db, 'works', targetWorkId, 'actors', draftData.targetNodeId);
      batch.update(actorRef, {
        status: draftData.interpretation.status,
      });

      const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
      batch.set(eventRef, {
        workId: targetWorkId,
        type: 'actor.updated',
        actorId: uid,
        payload: { promotedFromDraft: draftId, status: draftData.interpretation.status, actorId: draftData.targetNodeId },
        timestamp: serverTimestamp()
      });
    }
  } else if (draftData.mutationType === 'CREATE_GAP') {`;

code = code.replace(oldPromote, newPromote);

const oldCreate = `if (targetWorkId) {
    draftData.targetWorkId = targetWorkId;
  }`;

const newCreate = `if (targetWorkId) {
    draftData.targetWorkId = targetWorkId;
  }
  if (arguments[4]) { // targetNodeId
    draftData.targetNodeId = arguments[4];
  }`;

code = code.replace(oldCreate, newCreate);
// I should just make the function signature:
// export async function createDraftIntent(interpretation: any, originalText: string, mutationType: string = 'CREATE_WORK', targetWorkId?: string, targetNodeId?: string)

const createSigOld = `export async function createDraftIntent(interpretation: any, originalText: string, mutationType: string = 'CREATE_WORK', targetWorkId?: string) {`;
const createSigNew = `export async function createDraftIntent(interpretation: any, originalText: string, mutationType: string = 'CREATE_WORK', targetWorkId?: string, targetNodeId?: string) {`;

code = code.replace(createSigOld, createSigNew);

fs.writeFileSync('src/engine/firebase-engine.ts', code);
