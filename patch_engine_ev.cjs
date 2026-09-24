const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

code = code.replace(
  "mutationType: 'CREATE_WORK' | 'ADD_ACTOR' | 'CREATE_GAP' | 'UPDATE_ACTOR' | 'UNKNOWN';",
  "mutationType: 'CREATE_WORK' | 'ADD_ACTOR' | 'CREATE_GAP' | 'UPDATE_ACTOR' | 'ADD_EVIDENCE' | 'RESOLVE_WORK' | 'UNKNOWN';"
);

const oldPromote = `} else if (draftData.mutationType === 'CREATE_GAP') {`;
const newPromote = `} else if (draftData.mutationType === 'ADD_EVIDENCE') {
    const evRef = doc(collection(db, 'works', targetWorkId, 'evidences'));
    batch.set(evRef, {
      workId: targetWorkId,
      authorId: uid,
      ...draftData.interpretation,
      status: 'VERIFYING',
      provenance: { sourceDraftId: draftId, originalText: draftData.provenance.originalText },
      createdAt: serverTimestamp()
    });

    const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
    batch.set(eventRef, {
      workId: targetWorkId,
      type: 'evidence.provided',
      actorId: uid,
      payload: { promotedFromDraft: draftId, description: draftData.interpretation.description },
      timestamp: serverTimestamp()
    });
    
    // Optionally auto-update actor status to EXECUTING or VERIFYING if targetNodeId is provided
    if (draftData.targetNodeId) {
       const actorRef = doc(db, 'works', targetWorkId, 'actors', draftData.targetNodeId);
       batch.update(actorRef, { status: 'VERIFYING' });
    }
  } else if (draftData.mutationType === 'RESOLVE_WORK') {
    const workRef = doc(db, 'works', targetWorkId);
    batch.update(workRef, { status: 'RESOLVED' });
    
    const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
    batch.set(eventRef, {
      workId: targetWorkId,
      type: 'work.resolved',
      actorId: uid,
      payload: { promotedFromDraft: draftId },
      timestamp: serverTimestamp()
    });
  } else if (draftData.mutationType === 'CREATE_GAP') {`;

code = code.replace(oldPromote, newPromote);

const oldSub = `export function subscribeToWorkGaps(workId: string, callback: (gaps: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'gaps'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, \`works/\${workId}/gaps\`);
  });
}`;

const newSub = `export function subscribeToWorkGaps(workId: string, callback: (gaps: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'gaps'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, \`works/\${workId}/gaps\`);
  });
}

export function subscribeToWorkEvidences(workId: string, callback: (evidences: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'evidences'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, \`works/\${workId}/evidences\`);
  });
}`;

code = code.replace(oldSub, newSub);
fs.writeFileSync('src/engine/firebase-engine.ts', code);
