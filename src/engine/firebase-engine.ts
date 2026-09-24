import { db } from '../lib/firebase';
import { sendCommand } from '../lib/api';
// Auth removed for now, using guest user
const GUEST_UID = 'guest_user_123';
import { collection, doc, setDoc, getDocs, getDoc, query, where, onSnapshot, serverTimestamp, orderBy, updateDoc, writeBatch, documentId } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: GUEST_UID,
      email: 'guest@example.com',
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface DraftIntent {
  id: string;
  authorId: string;
  status: 'PROPOSED' | 'PROMOTED';
  mutationType: 'PROPOSE_NEED' | 'PROPOSE_OFFER' | 'CREATE_WORK' | 'ADD_ACTOR' | 'CREATE_GAP' | 'UPDATE_ACTOR' | 'ADD_EVIDENCE' | 'RESOLVE_WORK' | 'UNKNOWN';
  targetWorkId?: string;
  targetNodeId?: string;
  interpretation: any;
  provenance: {
    originalText: string;
    sourceEventId: string;
    aiModel: string;
  };
  createdAt: any;
}


function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, cleanUndefined(v)])
    );
  }
  return obj;
}

export async function createDraftIntent(interpretation: any, originalText: string, mutationType: string = 'CREATE_WORK', targetWorkId?: string, targetNodeId?: string) {
  const uid = GUEST_UID;
  const draftData: any = {
    authorId: uid,
    status: 'PROPOSED',
    mutationType,
    interpretation: cleanUndefined(interpretation),
    provenance: {
      originalText,
      sourceEventId: `evt_${Date.now()}`,
      aiModel: 'gemini-3.1-pro',
    },
    createdAt: serverTimestamp()
  };
  
  if (targetWorkId) {
    draftData.targetWorkId = targetWorkId;
  }
  if (arguments[4]) { // targetNodeId
    draftData.targetNodeId = arguments[4];
  }

  try {
    const draftRef = doc(collection(db, 'users', uid, 'draft_intents'));
    await setDoc(draftRef, draftData);
    return draftRef.id;
  } catch (error) {
    try {
      const res = await sendCommand({
        type: 'CREATE_DRAFT',
        mutationType,
        interpretation: cleanUndefined(interpretation),
        originalText,
        targetWorkId,
        targetNodeId
      });
      if (res && res.draftId) return res.draftId;
    } catch (apiErr) {
      handleFirestoreError(error, OperationType.CREATE, `users/${uid}/draft_intents`);
    }
  }
}

export function subscribeToDraftIntents(callback: (drafts: DraftIntent[]) => void) {
  const uid = GUEST_UID;
  const q = query(
    collection(db, 'users', uid, 'draft_intents'), 
    where('status', '==', 'PROPOSED'),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const drafts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DraftIntent));
    callback(drafts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `users/${uid}/draft_intents`);
  });
}

export async function promoteDraftIntent(draftId: string, draftData: DraftIntent): Promise<string | undefined> {
  try {
    const data = await sendCommand({
      type: 'PROMOTE_DRAFT',
      draftId,
      draftData,
      workId: draftData.targetWorkId
    });
    if (data && data.workId) {
      return data.workId;
    }
    return draftData.targetWorkId;
  } catch (cmdError: any) {
    console.error("Canonical command PROMOTE_DRAFT failed:", cmdError);
    handleFirestoreError(cmdError, OperationType.WRITE, `commands/PROMOTE_DRAFT/${draftId}`);
    throw cmdError;
  }
}

export function subscribeToWorks(callback: (works: any[]) => void) {
  const q = query(collection(db, 'works'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(works);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works`);
  });
}

export function subscribeToWorkNeeds(workId: string, callback: (needs: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'needs'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const needs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(needs);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/needs`);
  });
}

export function subscribeToWorkIntents(workId: string, callback: (intents: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'intents'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const intents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(intents);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/intents`);
  });}

export function subscribeToWorkCapabilities(workId: string, callback: (caps: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'capabilities'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/capabilities`);
  });
}

export function subscribeToWorkRelations(workId: string, callback: (rels: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'relations'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/relations`);
  });
}

export function subscribeToWorkResponsibilities(workId: string, callback: (resp: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'responsibilities'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/responsibilities`);
  });
}

export function subscribeToWorkCommitments(workId: string, callback: (comm: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'commitments'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/commitments`);
  });
}

export function subscribeToGlobalActorsByIds(actorIds: string[], callback: (actors: any[]) => void) {
  if (!actorIds || actorIds.length === 0) {
    callback([]);
    return () => {}; // No-op unsubscribe
  }
  // Firestore 'in' query allows up to 10 elements
  const chunks = [];
  for (let i = 0; i < actorIds.length; i += 10) {
    chunks.push(actorIds.slice(i, i + 10));
  }
  
  // For simplicity, handle only the first chunk if more than 10. In a real app we'd combine queries.
  const queryChunk = chunks[0];
  const q = query(collection(db, 'actors'), where(documentId(), 'in', queryChunk));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `actors`);
  });
}

export function subscribeToWorkActors(workId: string, callback: (actors: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'actors'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/actors`);
  });
}

export function subscribeToWorkGaps(workId: string, callback: (gaps: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'gaps'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/gaps`);
  });
}

export function subscribeToWorkEvidences(workId: string, callback: (evidences: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'evidences'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/evidences`);
  });
}

export function subscribeToWorkExecutions(workId: string, callback: (executions: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'executions'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/executions`);
  });
}

export function subscribeToWorkOutcomes(workId: string, callback: (outcomes: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'outcomes'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/outcomes`);
  });
}

export function subscribeToWorkEvents(workId: string, callback: (events: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'events'), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/events`);
  });
}

export function subscribeToWorkInvitations(workId: string, callback: (invitations: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'invitations'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `works/${workId}/invitations`);
  });
}