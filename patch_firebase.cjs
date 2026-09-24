const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

const newInterfaces = `export interface DraftIntent {
  id: string;
  authorId: string;
  status: 'PROPOSED' | 'PROMOTED';
  mutationType: 'CREATE_WORK' | 'ADD_ACTOR' | 'CREATE_GAP' | 'UNKNOWN';
  targetWorkId?: string;
  interpretation: any;
  provenance: {
    originalText: string;
    sourceEventId: string;
    aiModel: string;
  };
  createdAt: any;
}`;

code = code.replace(/export interface DraftIntent \{[\s\S]*?createdAt: any;\n\}/, newInterfaces);

const oldCreate = `export async function createDraftIntent(interpretation: any, originalText: string) {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const uid = auth.currentUser.uid;
  const draftRef = doc(collection(db, 'users', uid, 'draft_intents'));
  
  const draftData = {
    authorId: uid,
    status: 'PROPOSED',
    interpretation,
    provenance: {
      originalText,
      sourceEventId: \`evt_\${Date.now()}\`,
      aiModel: 'gemini-3.1-pro',
    },
    createdAt: serverTimestamp()
  };`;

const newCreate = `export async function createDraftIntent(interpretation: any, originalText: string, mutationType: string = 'CREATE_WORK', targetWorkId?: string) {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const uid = auth.currentUser.uid;
  const draftRef = doc(collection(db, 'users', uid, 'draft_intents'));
  
  const draftData: any = {
    authorId: uid,
    status: 'PROPOSED',
    mutationType,
    interpretation,
    provenance: {
      originalText,
      sourceEventId: \`evt_\${Date.now()}\`,
      aiModel: 'gemini-3.1-pro',
    },
    createdAt: serverTimestamp()
  };
  
  if (targetWorkId) {
    draftData.targetWorkId = targetWorkId;
  }`;

code = code.replace(oldCreate, newCreate);

const oldPromote = `export async function promoteDraftIntentToWork(draftId: string, draftData: DraftIntent) {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const uid = auth.currentUser.uid;

  const batch = writeBatch(db);

  // 1. Mark Draft as PROMOTED
  const draftRef = doc(db, 'users', uid, 'draft_intents', draftId);
  batch.update(draftRef, { status: 'PROMOTED' });

  // 2. Create Canonical Work
  const workRef = doc(collection(db, 'works'));
  batch.set(workRef, {
    authorId: uid,
    status: 'OPEN',
    createdAt: serverTimestamp(),
    originDraftId: draftId
  });

  // 3. Create Canonical Intent
  const intentRef = doc(collection(db, 'works', workRef.id, 'intents'));
  batch.set(intentRef, {
    workId: workRef.id,
    authorId: uid,
    ...draftData.interpretation,
    provenance: {
      sourceDraftId: draftId,
      originalText: draftData.provenance.originalText
    },
    createdAt: serverTimestamp()
  });

  // 4. Create Canonical Event
  const eventRef = doc(collection(db, 'works', workRef.id, 'events'));
  batch.set(eventRef, {
    workId: workRef.id,
    type: 'work.created',
    actorId: uid,
    payload: {
      promotedFromDraft: draftId,
      intentTitle: draftData.interpretation.title
    },
    timestamp: serverTimestamp()
  });

  try {
    await batch.commit();
    return workRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, \`batch_promote_\${draftId}\`);
  }
}`;

const newPromote = `export async function promoteDraftIntent(draftId: string, draftData: DraftIntent) {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const uid = auth.currentUser.uid;

  const batch = writeBatch(db);

  // 1. Mark Draft as PROMOTED
  const draftRef = doc(db, 'users', uid, 'draft_intents', draftId);
  batch.update(draftRef, { status: 'PROMOTED' });

  let targetWorkId = draftData.targetWorkId;

  if (!targetWorkId || draftData.mutationType === 'CREATE_WORK') {
    // 2. Create Canonical Work
    const workRef = doc(collection(db, 'works'));
    targetWorkId = workRef.id;
    batch.set(workRef, {
      authorId: uid,
      status: 'OPEN',
      createdAt: serverTimestamp(),
      originDraftId: draftId
    });

    // 3. Create Canonical Intent
    const intentRef = doc(collection(db, 'works', targetWorkId, 'intents'));
    batch.set(intentRef, {
      workId: targetWorkId,
      authorId: uid,
      ...draftData.interpretation,
      provenance: {
        sourceDraftId: draftId,
        originalText: draftData.provenance.originalText
      },
      createdAt: serverTimestamp()
    });

    // 4. Create Canonical Event
    const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
    batch.set(eventRef, {
      workId: targetWorkId,
      type: 'work.created',
      actorId: uid,
      payload: { promotedFromDraft: draftId, intentTitle: draftData.interpretation.title },
      timestamp: serverTimestamp()
    });
  } else if (draftData.mutationType === 'ADD_ACTOR') {
    // Add Actor to Work
    const actorRef = doc(collection(db, 'works', targetWorkId, 'actors'));
    batch.set(actorRef, {
      workId: targetWorkId,
      authorId: uid,
      ...draftData.interpretation,
      status: 'ASKING',
      provenance: { sourceDraftId: draftId, originalText: draftData.provenance.originalText },
      createdAt: serverTimestamp()
    });

    // 4. Create Canonical Event
    const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
    batch.set(eventRef, {
      workId: targetWorkId,
      type: 'actor.proposed',
      actorId: uid,
      payload: { promotedFromDraft: draftId, actorName: draftData.interpretation.name },
      timestamp: serverTimestamp()
    });
  } else if (draftData.mutationType === 'CREATE_GAP') {
    // Add Gap to Work
    const gapRef = doc(collection(db, 'works', targetWorkId, 'gaps'));
    batch.set(gapRef, {
      workId: targetWorkId,
      authorId: uid,
      ...draftData.interpretation,
      status: 'OPEN',
      provenance: { sourceDraftId: draftId, originalText: draftData.provenance.originalText },
      createdAt: serverTimestamp()
    });

    // 4. Create Canonical Event
    const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
    batch.set(eventRef, {
      workId: targetWorkId,
      type: 'gap.created',
      actorId: uid,
      payload: { promotedFromDraft: draftId, title: draftData.interpretation.title },
      timestamp: serverTimestamp()
    });
  } else {
    // Fallback/Unknown
    const eventRef = doc(collection(db, 'works', targetWorkId, 'events'));
    batch.set(eventRef, {
      workId: targetWorkId,
      type: 'intent.unknown',
      actorId: uid,
      payload: { promotedFromDraft: draftId, interpretation: draftData.interpretation },
      timestamp: serverTimestamp()
    });
  }

  try {
    await batch.commit();
    return targetWorkId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, \`batch_promote_\${draftId}\`);
  }
}`;

code = code.replace(oldPromote, newPromote);

// Add subscriptions for actors and gaps
const newSubscriptions = `
export function subscribeToWorkActors(workId: string, callback: (actors: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'actors'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, \`works/\${workId}/actors\`);
  });
}

export function subscribeToWorkGaps(workId: string, callback: (gaps: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'gaps'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, \`works/\${workId}/gaps\`);
  });
}
`;

code += newSubscriptions;

fs.writeFileSync('src/engine/firebase-engine.ts', code);
