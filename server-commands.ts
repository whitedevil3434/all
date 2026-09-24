import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  writeBatch, 
  serverTimestamp as firestoreServerTimestamp,
  getDocs,
  getDoc
} from "firebase/firestore";
import fs from "fs";
import path from "path";

let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
} catch (e) {
  console.warn("Could not read firebase-applet-config.json", e);
}

const clientApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const rawDb = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(clientApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(clientApp);

const createFirestoreCompat = (firestore: any) => {
  const wrapDoc = (docRef: any) => ({
    id: docRef.id,
    _rawRef: docRef,
    ref: { _rawRef: docRef },
    collection: (subName: string) => wrapCollection(collection(docRef, subName)),
    get: async () => {
      const snap = await getDoc(docRef);
      return {
        exists: snap.exists(),
        data: () => snap.data(),
        id: snap.id,
        ref: wrapDoc(docRef)
      };
    }
  });

  const wrapCollection = (colRef: any) => ({
    _rawRef: colRef,
    doc: (docId?: string) => {
      const dRef = docId ? doc(colRef, docId) : doc(colRef);
      return wrapDoc(dRef);
    },
    get: async () => {
      const snap = await getDocs(colRef);
      const docs = snap.docs.map(d => ({
        id: d.id,
        ref: wrapDoc(d.ref),
        data: () => d.data(),
        exists: () => d.exists()
      }));
      return {
        docs,
        empty: snap.empty,
        size: snap.size,
        forEach: (fn: (d: any) => void) => docs.forEach(fn)
      };
    }
  });

  return {
    collection: (colName: string) => wrapCollection(collection(firestore, colName)),
    batch: () => {
      const b = writeBatch(firestore);
      const resolveRef = (target: any) => {
        if (!target) return target;
        if (target._rawRef) return target._rawRef;
        if (target.ref && target.ref._rawRef) return target.ref._rawRef;
        return target;
      };
      return {
        set: (docWrapper: any, data: any, options?: any) => {
          b.set(resolveRef(docWrapper), data, options || {});
        },
        update: (docWrapper: any, data: any) => {
          b.update(resolveRef(docWrapper), data);
        },
        delete: (docWrapper: any) => {
          b.delete(resolveRef(docWrapper));
        },
        commit: async () => {
          await b.commit();
        }
      };
    }
  };
};

const db = createFirestoreCompat(rawDb);
const serverTimestamp = firestoreServerTimestamp;

export async function handleCommand(req: any, res: any) {
  const authHeader = req.headers.authorization;
  let actorId = req.body?.command?.actorId || 'guest_user_123';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    if (token.startsWith('guest_token_')) {
      actorId = token.replace('guest_token_', '');
    } else {
      actorId = req.body?.command?.actorId || 'guest_user_123';
    }
  }

  const { command } = req.body;
  if (!command || !command.type) {
    return res.status(400).json({ error: "Invalid command structure" });
  }

  const batch = db.batch();

  if (command.type === "DECLARE_NEED") {
    try {
      let workId = command.workId;
      if (!workId) {
        const workRef = db.collection('works').doc();
        workId = workRef.id;
        batch.set(workRef, {
          authorId: actorId,
          status: 'OPEN',
          createdAt: serverTimestamp(),
          originDraftId: command.proposalId || null
        });
      }

      // Create Canonical Need
      const needRef = db.collection('works').doc(workId).collection('needs').doc();
      batch.set(needRef, {
        workId: workId,
        authorId: actorId,
        description: command.payload.description || '',
        quantity: command.payload.quantity || null,
        unit: command.payload.unit || '',
        status: 'OPEN',
        provenance: command.provenance || null,
        createdAt: serverTimestamp()
      });

      // Create Canonical Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId: workId,
        type: 'need.declared',
        actorId: actorId,
        payload: { 
          needId: needRef.id,
          description: command.payload.description
        },
        timestamp: serverTimestamp()
      });

      // Mark Draft as PROMOTED
      if (command.proposalId) {
        const draftRef = db.collection('users').doc(actorId).collection('draft_intents').doc(command.proposalId);
        batch.update(draftRef, { status: 'PROMOTED' });
      }

      await batch.commit();
      return res.json({ success: true, workId, needId: needRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "DECLARE_OFFER") {
    try {
      const workId = command.workId;
      if (!workId) return res.status(400).json({ error: "workId required" });
      
      const actorName = command.payload.actorName;
      const capabilityDesc = command.payload.capabilityDescription || "Capability";
      
      // 1. Create Capability
      const capRef = db.collection('works').doc(workId).collection('capabilities').doc();
      batch.set(capRef, {
        workId,
        description: capabilityDesc,
        quantity: command.payload.quantity || null,
        unit: command.payload.unit || '',
        status: 'STATED',
        createdAt: serverTimestamp()
      });
      
      // 2. Create Actor
      const actorRef = db.collection('actors').doc();
      batch.set(actorRef, {
        displayName: actorName,
        type: 'HUMAN',
        reputation: 0,
        capabilities: [],
        createdAt: serverTimestamp()
      });
      
      // 3. Create Relation REQUIRES (Need -> Capability)
      const rel1Ref = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(rel1Ref, {
        workId,
        from: `need:${command.payload.needId}`,
        relation: 'REQUIRES',
        to: `capability:${capRef.id}`,
        createdAt: serverTimestamp()
      });
      
      // 4. Create Relation OFFERED_BY (Capability -> Actor)
      const rel2Ref = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(rel2Ref, {
        workId,
        from: `capability:${capRef.id}`,
        relation: 'OFFERED_BY',
        to: `actor:${actorRef.id}`,
        createdAt: serverTimestamp()
      });
      
      // 5. Create Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'capability.offered',
        actorId: actorId,
        payload: {
           capabilityId: capRef.id,
           actorId: actorRef.id,
           needId: command.payload.needId
        },
        timestamp: serverTimestamp()
      });
      
      // 6. Mark Draft as PROMOTED
      if (command.proposalId) {
        const draftRef = db.collection('users').doc(actorId).collection('draft_intents').doc(command.proposalId);
        batch.update(draftRef, { status: 'PROMOTED' });
      }
      
      await batch.commit();
      return res.json({ success: true, workId, capabilityId: capRef.id, actorId: actorRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "GENERATE_INVITATION") {
    try {
      const workId = command.workId;
      const { needId, capabilityDescription, roleName } = command.payload;
      if (!workId || !needId || !capabilityDescription || !roleName) return res.status(400).json({ error: "Missing required fields" });

      // 1. Create Capability
      const capRef = db.collection('works').doc(workId).collection('capabilities').doc();
      batch.set(capRef, {
        workId,
        description: capabilityDescription,
        status: 'PROPOSED',
        createdAt: serverTimestamp()
      });

      // 2. Relation (Need -> Capability)
      const needRelRef = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(needRelRef, {
        workId,
        from: `need:${needId}`,
        relation: 'REQUIRES',
        to: `capability:${capRef.id}`,
        createdAt: serverTimestamp()
      });

      // 3. Create Invitation
      const invRef = db.collection('works').doc(workId).collection('invitations').doc();
      batch.set(invRef, {
        workId,
        needId,
        capabilityId: capRef.id,
        roleName,
        status: 'PENDING',
        createdAt: serverTimestamp()
      });

      // 4. Relation (Capability -> Invitation)
      const invRelRef = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(invRelRef, {
        workId,
        from: `capability:${capRef.id}`,
        relation: 'HAS_INVITATION',
        to: `invitation:${invRef.id}`,
        createdAt: serverTimestamp()
      });

      // 5. Create Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'invitation.generated',
        actorId: actorId,
        payload: {
           invitationId: invRef.id,
           roleName
        },
        timestamp: serverTimestamp()
      });

      if (command.proposalId) {
        const draftRef = db.collection('users').doc(actorId).collection('draft_intents').doc(command.proposalId);
        batch.update(draftRef, { status: 'PROMOTED' });
      }

      await batch.commit();
      return res.json({ success: true, workId, invitationId: invRef.id, capabilityId: capRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "ACCEPT_INVITATION") {
    try {
      const workId = command.workId;
      const { invitationId, actorName } = command.payload;
      if (!workId || !invitationId || !actorName) return res.status(400).json({ error: "Missing required fields" });
      const invRef = db.collection("works").doc(workId).collection("invitations").doc(invitationId);
      const invSnap = await invRef.get();
      if (!invSnap.exists) return res.status(404).json({ error: "Invitation not found" });
      const invData = invSnap.data();
      if (invData.status === "ACCEPTED") return res.status(400).json({ error: "Already accepted" });
      const globalActorRef = db.collection("global_actors").doc(actorId);
      batch.set(globalActorRef, { displayName: actorName, type: "HUMAN", reputation: 0, capabilities: [], createdAt: serverTimestamp() }, { merge: true });
      const workActorRef = db.collection("works").doc(workId).collection("actors").doc(actorId);
      batch.set(workActorRef, { actorId: actorId, role: invData.roleName, joinedAt: serverTimestamp() });
      batch.update(invRef, { status: "ACCEPTED", claimedBy: actorId });
      const accRelRef = db.collection("works").doc(workId).collection("relations").doc();
      batch.set(accRelRef, { workId, from: `actor:${actorId}`, relation: "ACCEPTS_INVITATION", to: `invitation:${invRef.id}`, createdAt: serverTimestamp() });
      const capRelRef = db.collection("works").doc(workId).collection("relations").doc();
      batch.set(capRelRef, { workId, from: `capability:${invData.capabilityId}`, relation: "OFFERED_BY", to: `actor:${actorId}`, createdAt: serverTimestamp() });
      const eventRef = db.collection("works").doc(workId).collection("events").doc();
      batch.set(eventRef, { workId, type: "invitation.accepted", actorId: actorId, payload: { invitationId: invRef.id, actorId: actorId }, timestamp: serverTimestamp() });
      await batch.commit();
      return res.json({ success: true, workId, actorId: actorId });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "REQUEST_COMMITMENT") {
    try {
      const workId = command.workId;
      const { actorId, needId, capabilityId, description } = command.payload;
      if (!workId || !actorId || !needId || !capabilityId) return res.status(400).json({ error: "Missing required fields" });

      // 1. Create Responsibility
      const respRef = db.collection('works').doc(workId).collection('responsibilities').doc();
      batch.set(respRef, {
        workId,
        actorId,
        needId,
        capabilityId,
        description: description || "Requested responsibility",
        status: 'PROPOSED',
        createdAt: serverTimestamp()
      });

      // 2. Create Relation HAS_RESPONSIBILITY (Actor -> Responsibility)
      const relRef = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(relRef, {
        workId,
        from: `actor:${actorId}`,
        relation: 'HAS_RESPONSIBILITY',
        to: `responsibility:${respRef.id}`,
        createdAt: serverTimestamp()
      });

      // 3. Create Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'responsibility.requested',
        actorId: actorId,
        payload: {
           responsibilityId: respRef.id,
           actorId,
           needId
        },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, responsibilityId: respRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "ACCEPT_COMMITMENT") {
    try {
      const workId = command.workId;
      const { responsibilityId, description, quantity, unit, deadline } = command.payload;
      if (!workId || !responsibilityId) return res.status(400).json({ error: "Missing required fields" });

      // Fetch responsibility to verify it exists and get relation info
      const respRef = db.collection('works').doc(workId).collection('responsibilities').doc(responsibilityId);
      const respSnap = await respRef.get();
      if (!respSnap.exists) {
        return res.status(404).json({ error: "Responsibility not found" });
      }
      const respData = respSnap.data();

      // 1. Update Responsibility status
      batch.update(respRef, { status: 'ACCEPTED' });

      // 2. Create Commitment
      const commRef = db.collection('works').doc(workId).collection('commitments').doc();
      batch.set(commRef, {
        workId,
        responsibilityId,
        needId: respData.needId,
        actorId: respData.actorId,
        terms: {
          description: description || respData.description,
          quantity: quantity || null,
          unit: unit || null,
          deadline: deadline || null
        },
        status: 'COMMITTED',
        createdAt: serverTimestamp()
      });

      // 3. Create Relation BECOMES (Responsibility -> Commitment)
      const relRef = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(relRef, {
        workId,
        from: `responsibility:${responsibilityId}`,
        relation: 'BECOMES',
        to: `commitment:${commRef.id}`,
        createdAt: serverTimestamp()
      });

      // 4. Create Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'commitment.agreed',
        actorId: respData.actorId,
        payload: {
           commitmentId: commRef.id,
           responsibilityId,
           actorId: respData.actorId
        },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, commitmentId: commRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "START_EXECUTION") {
    try {
      const workId = command.workId;
      const { commitmentId, description, actorId } = command.payload;
      if (!workId || !commitmentId || !description || !actorId) return res.status(400).json({ error: "Missing required fields" });

      const execRef = db.collection('works').doc(workId).collection('executions').doc();
      batch.set(execRef, {
        workId,
        commitmentId,
        description,
        state: 'STARTED',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const relRef = db.collection('works').doc(workId).collection('relations').doc();
      batch.set(relRef, {
        workId,
        from: `commitment:${commitmentId}`,
        relation: 'DRIVES',
        to: `execution:${execRef.id}`,
        createdAt: serverTimestamp()
      });

      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'execution.started',
        actorId,
        payload: { executionId: execRef.id, commitmentId },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, executionId: execRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "SUBMIT_EVIDENCE") {
    try {
      const workId = command.workId;
      const description = command.payload?.description || "Physical Proof Verified (50.0 kg)";
      const evActorId = command.payload?.actorId || actorId;
      if (!workId) return res.status(400).json({ error: "Missing workId" });

      const evRef = db.collection('works').doc(workId).collection('evidences').doc();
      batch.set(evRef, {
        workId,
        executionId: command.payload?.executionId || null,
        description,
        weightKg: command.payload?.weightKg || 50.0,
        photoUrl: command.payload?.photoUrl || null,
        createdAt: serverTimestamp()
      });

      if (command.payload?.executionId) {
        const relRef = db.collection('works').doc(workId).collection('relations').doc();
        batch.set(relRef, {
          workId,
          from: `execution:${command.payload.executionId}`,
          relation: 'PRODUCES',
          to: `evidence:${evRef.id}`,
          createdAt: serverTimestamp()
        });
      }

      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'evidence.provided',
        actorId: evActorId,
        payload: { evidenceId: evRef.id, description },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, evidenceId: evRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "ASSIGN_DRIVER") {
    try {
      const workId = command.workId;
      if (!workId) return res.status(400).json({ error: "Missing workId" });
      const driverName = command.payload?.driverName || "Tariq M. (Toyota HiAce #DHK-4421)";

      // Create or update Actor
      const actorRef = db.collection('works').doc(workId).collection('actors').doc();
      batch.set(actorRef, {
        workId,
        name: driverName,
        displayName: driverName,
        role: "Driver",
        status: "COMMITTED",
        vehicle: "Toyota HiAce #DHK-4421",
        createdAt: serverTimestamp()
      });

      // Update any open gaps to RESOLVED
      const gapsSnap = await db.collection('works').doc(workId).collection('gaps').get();
      gapsSnap.forEach(gapDoc => {
        batch.update(gapDoc.ref, { status: 'RESOLVED', resolution: `Assigned driver ${driverName}` });
      });

      // Append Canonical Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'driver.assigned',
        actorId: actorId,
        payload: { driverName, vehicle: "Toyota HiAce #DHK-4421", eta: "25 mins" },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, driverName });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "RESOLVE_WORK" || command.type === "CONFIRM_DELIVERY") {
    try {
      const workId = command.workId;
      if (!workId) return res.status(400).json({ error: "Missing workId" });

      // Mark work as RESOLVED
      const workRef = db.collection('works').doc(workId);
      batch.update(workRef, { status: 'RESOLVED', settledAt: serverTimestamp() });

      // Mark all needs as RESOLVED
      const needsSnap = await db.collection('works').doc(workId).collection('needs').get();
      needsSnap.forEach(needDoc => {
        batch.update(needDoc.ref, { status: 'RESOLVED', settledAt: serverTimestamp() });
      });

      // Append Canonical Event
      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'work.resolved',
        actorId: actorId,
        payload: { status: 'RESOLVED', recipient: "Uttara Supershop", verifiedWeight: "50.0 kg" },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "DECLARE_OUTCOME") {
    try {
      const workId = command.workId;
      const { needId, evidenceIds, description, state, actorId } = command.payload;
      if (!workId || !needId || !description || !state || !actorId) return res.status(400).json({ error: "Missing required fields" });

      const outcomeRef = db.collection('works').doc(workId).collection('outcomes').doc();
      batch.set(outcomeRef, {
        workId,
        needId,
        description,
        state,
        createdAt: serverTimestamp()
      });

      if (evidenceIds && evidenceIds.length > 0) {
        for (const evId of evidenceIds) {
          const relRef = db.collection('works').doc(workId).collection('relations').doc();
          batch.set(relRef, {
            workId,
            from: `evidence:${evId}`,
            relation: 'SUPPORTS',
            to: `outcome:${outcomeRef.id}`,
            createdAt: serverTimestamp()
          });
        }
      }

      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: 'outcome.declared',
        actorId,
        payload: { outcomeId: outcomeRef.id, needId, state },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, outcomeId: outcomeRef.id });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "VERIFY_OUTCOME") {
    try {
      const workId = command.workId;
      const { outcomeId, state, actorId } = command.payload;
      if (!workId || !outcomeId || !state || !actorId) return res.status(400).json({ error: "Missing required fields" });

      const outcomeRef = db.collection('works').doc(workId).collection('outcomes').doc(outcomeId);
      const outcomeSnap = await outcomeRef.get();
      if (!outcomeSnap.exists) return res.status(404).json({ error: "Outcome not found" });
      const outcomeData = outcomeSnap.data();

      batch.update(outcomeRef, { state });

      if (state === 'VERIFIED') {
        const needRef = db.collection('works').doc(workId).collection('needs').doc(outcomeData.needId);
        batch.update(needRef, { status: 'RESOLVED' });

        const relRef = db.collection('works').doc(workId).collection('relations').doc();
        batch.set(relRef, {
          workId,
          from: `outcome:${outcomeId}`,
          relation: 'SATISFIES',
          to: `need:${outcomeData.needId}`,
          createdAt: serverTimestamp()
        });
      }

      const eventRef = db.collection('works').doc(workId).collection('events').doc();
      batch.set(eventRef, {
        workId,
        type: state === 'VERIFIED' ? 'outcome.verified' : 'outcome.rejected',
        actorId,
        payload: { outcomeId, needId: outcomeData.needId, state },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      return res.json({ success: true, workId, outcomeId });
    } catch (e: any) {
      console.error("Command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "PROMOTE_DRAFT") {
    try {
      const draftId = command.draftId;
      const draftData = command.draftData || {};
      let targetWorkId = command.workId || draftData.targetWorkId;

      // 1. Mark Draft as PROMOTED in the user's draft_intents collection
      if (draftId) {
        const draftRef = db.collection('users').doc(actorId).collection('draft_intents').doc(draftId);
        batch.set(draftRef, { status: 'PROMOTED' }, { merge: true });
      }

      if (!targetWorkId || draftData.mutationType === 'CREATE_WORK') {
        // 2. Create Canonical Work
        const workRef = db.collection('works').doc();
        targetWorkId = workRef.id;
        batch.set(workRef, {
          authorId: actorId,
          status: 'OPEN',
          createdAt: serverTimestamp(),
          originDraftId: draftId || null
        });

        // 3. Create Canonical Intent
        const intentRef = db.collection('works').doc(targetWorkId).collection('intents').doc();
        batch.set(intentRef, {
          workId: targetWorkId,
          authorId: actorId,
          ...(draftData.interpretation || {}),
          provenance: {
            sourceDraftId: draftId || '',
            originalText: draftData.provenance?.originalText || ''
          },
          createdAt: serverTimestamp()
        });

        // 4. Create Canonical Need so it projects immediately on the C-Link surface
        const needRef = db.collection('works').doc(targetWorkId).collection('needs').doc();
        batch.set(needRef, {
          workId: targetWorkId,
          authorId: actorId,
          description: draftData.interpretation?.description || draftData.interpretation?.title || 'Need',
          quantity: draftData.interpretation?.quantity || null,
          unit: draftData.interpretation?.unit || '',
          status: 'OPEN',
          provenance: draftData.provenance || null,
          createdAt: serverTimestamp()
        });

        // 5. Create Canonical Event
        const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
        batch.set(eventRef, {
          workId: targetWorkId,
          type: 'work.created',
          actorId: actorId,
          payload: { promotedFromDraft: draftId, intentTitle: draftData.interpretation?.title || draftData.interpretation?.description },
          timestamp: serverTimestamp()
        });
      } else if (draftData.mutationType === 'ADD_ACTOR') {
        const actorRef = db.collection('works').doc(targetWorkId).collection('actors').doc();
        batch.set(actorRef, {
          workId: targetWorkId,
          authorId: actorId,
          ...(draftData.interpretation || {}),
          status: 'ASKING',
          provenance: { sourceDraftId: draftId, originalText: draftData.provenance?.originalText || '' },
          createdAt: serverTimestamp()
        });

        const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
        batch.set(eventRef, {
          workId: targetWorkId,
          type: 'actor.proposed',
          actorId: actorId,
          payload: { promotedFromDraft: draftId, actorName: draftData.interpretation?.name },
          timestamp: serverTimestamp()
        });
      } else if (draftData.mutationType === 'UPDATE_ACTOR') {
        if (draftData.targetNodeId) {
          const actorRef = db.collection('works').doc(targetWorkId).collection('actors').doc(draftData.targetNodeId);
          batch.update(actorRef, {
            status: draftData.interpretation?.status || 'COMMITTED',
          });

          const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
          batch.set(eventRef, {
            workId: targetWorkId,
            type: 'actor.updated',
            actorId: actorId,
            payload: { promotedFromDraft: draftId, status: draftData.interpretation?.status, actorId: draftData.targetNodeId },
            timestamp: serverTimestamp()
          });
        }
      } else if (draftData.mutationType === 'ADD_EVIDENCE') {
        const evRef = db.collection('works').doc(targetWorkId).collection('evidences').doc();
        batch.set(evRef, {
          workId: targetWorkId,
          authorId: actorId,
          ...(draftData.interpretation || {}),
          status: 'VERIFYING',
          provenance: { sourceDraftId: draftId, originalText: draftData.provenance?.originalText || '' },
          createdAt: serverTimestamp()
        });

        const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
        batch.set(eventRef, {
          workId: targetWorkId,
          type: 'evidence.provided',
          actorId: actorId,
          payload: { promotedFromDraft: draftId, description: draftData.interpretation?.description },
          timestamp: serverTimestamp()
        });
        
        if (draftData.targetNodeId) {
          const actorRef = db.collection('works').doc(targetWorkId).collection('actors').doc(draftData.targetNodeId);
          batch.update(actorRef, { status: 'VERIFYING' });
        }
      } else if (draftData.mutationType === 'RESOLVE_WORK') {
        const workRef = db.collection('works').doc(targetWorkId);
        batch.update(workRef, { status: 'RESOLVED' });
        
        const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
        batch.set(eventRef, {
          workId: targetWorkId,
          type: 'work.resolved',
          actorId: actorId,
          payload: { promotedFromDraft: draftId },
          timestamp: serverTimestamp()
        });
      } else if (draftData.mutationType === 'CREATE_GAP') {
        const gapRef = db.collection('works').doc(targetWorkId).collection('gaps').doc();
        batch.set(gapRef, {
          workId: targetWorkId,
          authorId: actorId,
          ...(draftData.interpretation || {}),
          status: 'OPEN',
          provenance: { sourceDraftId: draftId, originalText: draftData.provenance?.originalText || '' },
          createdAt: serverTimestamp()
        });

        const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
        batch.set(eventRef, {
          workId: targetWorkId,
          type: 'gap.created',
          actorId: actorId,
          payload: { promotedFromDraft: draftId, title: draftData.interpretation?.title },
          timestamp: serverTimestamp()
        });
      } else {
        if (targetWorkId) {
          const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();
          batch.set(eventRef, {
            workId: targetWorkId,
            type: 'intent.unknown',
            actorId: actorId,
            payload: { promotedFromDraft: draftId, interpretation: draftData.interpretation },
            timestamp: serverTimestamp()
          });
        }
      }

      await batch.commit();
      return res.json({ success: true, workId: targetWorkId });
    } catch (e: any) {
      console.error("Promote draft command error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "CREATE_DRAFT") {
    try {
      const draftRef = db.collection('users').doc(actorId).collection('draft_intents').doc();
      const draftData = {
        authorId: actorId,
        status: 'PROPOSED',
        mutationType: command.mutationType || 'CREATE_WORK',
        interpretation: command.interpretation || {},
        provenance: command.provenance || {
          originalText: command.originalText || '',
          sourceEventId: `evt_${Date.now()}`,
          aiModel: 'gemini-3.1-pro'
        },
        createdAt: serverTimestamp(),
        ...(command.targetWorkId ? { targetWorkId: command.targetWorkId } : {}),
        ...(command.targetNodeId ? { targetNodeId: command.targetNodeId } : {})
      };
      await draftRef.set(draftData);
      return res.json({ success: true, draftId: draftRef.id });
    } catch (e: any) {
      console.error("Create draft error:", e);
      return res.status(500).json({ error: e.message });
    }
  } else if (command.type === "EXECUTE_AGENT_COMMITMENT") {
    try {
      const {
        workId,
        buyerAgent,
        sellerAgent,
        agreedTerms,
        provenance
      } = command.payload || {};

      if (!buyerAgent || !sellerAgent || !agreedTerms) {
        return res.status(400).json({ error: "Missing required agent negotiation payload" });
      }

      const targetWorkId = workId || command.workId || 'work_default';

      // 1. STRICT CONSTITUTIONAL AUTHORITY CHECK
      // Check A: Price ceiling check for Buyer
      if (buyerAgent.maxPrice && agreedTerms.price > buyerAgent.maxPrice) {
        return res.status(422).json({
          success: false,
          error: "AUTHORITY_VIOLATION",
          reason: `Agreed price ৳${agreedTerms.price} exceeds Buyer Agent authorized ceiling of ৳${buyerAgent.maxPrice}`,
          canonicalMutationExecuted: false
        });
      }

      // Check B: Price floor check for Seller
      if (sellerAgent.minPrice && agreedTerms.price < sellerAgent.minPrice) {
        return res.status(422).json({
          success: false,
          error: "AUTHORITY_VIOLATION",
          reason: `Agreed price ৳${agreedTerms.price} is below Seller Agent authorized floor of ৳${sellerAgent.minPrice}`,
          canonicalMutationExecuted: false
        });
      }

      // Check C: Quantity boundary check
      if (buyerAgent.maxQuantity && agreedTerms.quantity > buyerAgent.maxQuantity) {
        return res.status(422).json({
          success: false,
          error: "AUTHORITY_VIOLATION",
          reason: `Requested quantity ${agreedTerms.quantity}kg exceeds Buyer Agent authorized limit of ${buyerAgent.maxQuantity}kg`,
          canonicalMutationExecuted: false
        });
      }

      // 2. AUTHORITY PASSED -> EXECUTE CANONICAL MUTATION
      const commRef = db.collection('works').doc(targetWorkId).collection('commitments').doc();
      const eventRef = db.collection('works').doc(targetWorkId).collection('events').doc();

      // Canonical Commitment
      batch.set(commRef, {
        workId: targetWorkId,
        actorId: sellerAgent.actorId || 'liton_agro',
        buyerActorId: buyerAgent.actorId || 'karim_restaurant',
        terms: {
          description: agreedTerms.item || '50kg Nazirshail Rice',
          quantity: agreedTerms.quantity || 50,
          unit: agreedTerms.unit || 'kg',
          pricePerUnit: agreedTerms.price,
          totalPrice: agreedTerms.price * (agreedTerms.quantity || 50),
          deliveryTime: agreedTerms.deliveryTime || 'Tomorrow 10:00 AM'
        },
        authority: {
          buyerPolicyId: buyerAgent.policyId || 'karim_policy_12',
          buyerCeiling: buyerAgent.maxPrice,
          sellerPolicyId: sellerAgent.policyId || 'liton_policy_04',
          sellerFloor: sellerAgent.minPrice,
          verifiedAt: new Date().toISOString()
        },
        status: 'COMMITTED',
        createdAt: serverTimestamp()
      });

      // Domain Event: commitment.formed
      batch.set(eventRef, {
        workId: targetWorkId,
        type: 'commitment.formed',
        actorId: buyerAgent.actorId || actorId,
        payload: {
          commitmentId: commRef.id,
          actor: sellerAgent.actorName || 'Liton Mia',
          item: agreedTerms.item || '50kg Nazirshail Rice',
          quantity: agreedTerms.quantity || 50,
          price: agreedTerms.price,
          authorityPolicy: buyerAgent.policyId || 'karim_policy_12',
          provenance: provenance || 'Autonomous Agent Bargaining Protocol'
        },
        timestamp: serverTimestamp()
      });

      await batch.commit();

      return res.json({
        success: true,
        canonicalMutationExecuted: true,
        workId: targetWorkId,
        commitmentId: commRef.id,
        status: 'COMMITTED',
        domainEvent: 'commitment.formed'
      });
    } catch (e: any) {
      console.error("Execute agent commitment error:", e);
      return res.status(500).json({ error: e.message, canonicalMutationExecuted: false });
    }
  }

  return res.status(400).json({ error: "Unknown command type" });
}
