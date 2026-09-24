import test from "node:test";
import assert from "node:assert";
import { db } from "../src/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const BASE_URL = "http://localhost:3000";

test("C-Link Slice 5: Execution, Evidence, and Outcome", async (t) => {
  let workId: string;
  let needId: string;
  let capabilityId: string;
  let actorId: string;
  let responsibilityId: string;
  let commitmentId: string;
  let executionId: string;
  let evidenceId: string;
  let outcomeId: string;

  await t.test("Setup: Create full chain to Commitment", async () => {
    // 1. Need
    let res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: { type: "DECLARE_NEED", payload: { description: "50kg rice", quantity: 50, unit: "kg" } } })
    });
    let data = await res.json();
    workId = data.workId; needId = data.needId;

    // 2. Offer (Capability + Actor + Responsibility)
    res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: { type: "DECLARE_OFFER", workId, payload: { actorName: "Supplier A", capabilityDescription: "Supply rice", needId } } })
    });
    data = await res.json();
    actorId = data.actorId; capabilityId = data.capabilityId;

    // Get responsibility id
    const respsSnap = await getDocs(query(collection(db, 'works', workId, 'responsibilities')));
    responsibilityId = respsSnap.docs[0].id;

    // 3. Accept Commitment
    res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: { type: "ACCEPT_COMMITMENT", workId, payload: { responsibilityId } } })
    });
    data = await res.json();
    commitmentId = data.commitmentId;
    assert.ok(commitmentId);
  });

  await t.test("1. START_EXECUTION", async () => {
    const res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "START_EXECUTION",
          workId,
          payload: { commitmentId, description: "Packing rice", actorId }
        }
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    executionId = data.executionId;
    assert.ok(executionId);

    // Verify relations
    const relsSnap = await getDocs(query(collection(db, 'works', workId, 'relations'), where('relation', '==', 'DRIVES')));
    assert.ok(relsSnap.docs.some(d => d.data().from === `commitment:${commitmentId}` && d.data().to === `execution:${executionId}`));
  });

  await t.test("2. SUBMIT_EVIDENCE", async () => {
    const res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "SUBMIT_EVIDENCE",
          workId,
          payload: { executionId, description: "Delivery photo", actorId }
        }
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    evidenceId = data.evidenceId;
    assert.ok(evidenceId);

    // Verify relations
    const relsSnap = await getDocs(query(collection(db, 'works', workId, 'relations'), where('relation', '==', 'PRODUCES')));
    assert.ok(relsSnap.docs.some(d => d.data().from === `execution:${executionId}` && d.data().to === `evidence:${evidenceId}`));
  });

  await t.test("3. DECLARE_OUTCOME", async () => {
    const res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "DECLARE_OUTCOME",
          workId,
          payload: { needId, evidenceIds: [evidenceId], description: "Rice delivered", state: "PROPOSED", actorId: "owner123" }
        }
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    outcomeId = data.outcomeId;
    assert.ok(outcomeId);

    // Verify relations
    const relsSnap = await getDocs(query(collection(db, 'works', workId, 'relations'), where('relation', '==', 'SUPPORTS')));
    assert.ok(relsSnap.docs.some(d => d.data().from === `evidence:${evidenceId}` && d.data().to === `outcome:${outcomeId}`));
  });

  await t.test("4. VERIFY_OUTCOME", async () => {
    const res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "VERIFY_OUTCOME",
          workId,
          payload: { outcomeId, state: "VERIFIED", actorId: "owner123" }
        }
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);

    // Verify Need is resolved
    const needSnap = await getDoc(doc(db, 'works', workId, 'needs', needId));
    assert.equal(needSnap.data()?.status, 'RESOLVED');

    // Verify relations
    const relsSnap = await getDocs(query(collection(db, 'works', workId, 'relations'), where('relation', '==', 'SATISFIES')));
    assert.ok(relsSnap.docs.some(d => d.data().from === `outcome:${outcomeId}` && d.data().to === `need:${needId}`));
  });
});
setTimeout(() => process.exit(0), 10000).unref();
