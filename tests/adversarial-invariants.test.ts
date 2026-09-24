import test from "node:test";
import assert from "node:assert";
import { db } from "../src/lib/firebase";
import { collection, getDocs, terminate } from "firebase/firestore";

const BASE_URL = "http://localhost:3000";

test("OathLink Constitutional Hard Invariants (I1 - I4) Adversarial Test Suite", async (t) => {
  let testWorkId: string;

  await t.test("Setup: Initialize Canonical Work Context", async () => {
    const res = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "DECLARE_NEED",
          payload: {
            description: "50kg Nazirshail Rice for Uttara Kitchen",
            quantity: 50,
            unit: "kg"
          }
        }
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200, "Setup DECLARE_NEED must succeed");
    assert.ok(data.workId, "Must return valid workId");
    testWorkId = data.workId;
  });

  await t.test("Invariant 2 & 3: Authority Failure = Zero Canonical Mutation (Adversarial Ceiling Breach)", async () => {
    // 1. Snapshot Firestore collections before the attack
    const commsBefore = await getDocs(collection(db, "works", testWorkId, "commitments"));
    const eventsBefore = await getDocs(collection(db, "works", testWorkId, "events"));
    const initialCommCount = commsBefore.size;
    const initialEventCount = eventsBefore.size;

    // 2. Adversarial Action: Agent tries to commit at ৳628 (Buyer Ceiling is ৳620)
    const hostileRes = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "EXECUTE_AGENT_COMMITMENT",
          workId: testWorkId,
          payload: {
            workId: testWorkId,
            buyerAgent: {
              actorId: "karim_restaurant",
              actorName: "Karim (Uttara Kitchen)",
              policyId: "karim_policy_12",
              maxPrice: 620, // Ceiling is 620!
              maxQuantity: 200
            },
            sellerAgent: {
              actorId: "liton_agro",
              actorName: "Liton Mia (Alim Farms)",
              policyId: "liton_policy_04",
              minPrice: 615
            },
            agreedTerms: {
              item: "50kg Nazirshail Rice",
              quantity: 50,
              price: 628, // VIOLATION! 628 > 620
              unit: "kg",
              deliveryTime: "Tomorrow 10:00 AM"
            },
            provenance: "Adversarial Test: Hostile Price Escalation"
          }
        }
      })
    });

    const hostileData = await hostileRes.json();

    // 3. Verification: Server must REJECT with 422 AUTHORITY_VIOLATION
    assert.strictEqual(hostileRes.status, 422, "Hostile proposal must be rejected with HTTP 422");
    assert.strictEqual(hostileData.success, false, "success flag must be false");
    assert.strictEqual(hostileData.error, "AUTHORITY_VIOLATION", "Error must be AUTHORITY_VIOLATION");
    assert.strictEqual(hostileData.canonicalMutationExecuted, false, "canonicalMutationExecuted must be false");

    // 4. Verification of Hard Invariant 3: Zero Canonical Mutation in Database
    const commsAfter = await getDocs(collection(db, "works", testWorkId, "commitments"));
    const eventsAfter = await getDocs(collection(db, "works", testWorkId, "events"));

    assert.strictEqual(commsAfter.size, initialCommCount, "Commitments collection MUST NOT grow on authority violation");
    assert.strictEqual(eventsAfter.size, initialEventCount, "Events collection MUST NOT grow on authority violation");
  });

  await t.test("Invariant 3: Authority Failure on Seller Floor Violation", async () => {
    // Adversarial Action: Agent tries to force sale at ৳610 (Seller Floor is ৳615)
    const hostileRes = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "EXECUTE_AGENT_COMMITMENT",
          workId: testWorkId,
          payload: {
            workId: testWorkId,
            buyerAgent: {
              actorId: "karim_restaurant",
              actorName: "Karim",
              maxPrice: 620,
              maxQuantity: 200
            },
            sellerAgent: {
              actorId: "liton_agro",
              actorName: "Liton",
              minPrice: 615 // Floor is 615!
            },
            agreedTerms: {
              item: "50kg Rice",
              quantity: 50,
              price: 610 // VIOLATION! 610 < 615
            }
          }
        }
      })
    });

    const hostileData = await hostileRes.json();
    assert.strictEqual(hostileRes.status, 422, "Floor breach must be rejected with HTTP 422");
    assert.strictEqual(hostileData.error, "AUTHORITY_VIOLATION");
    assert.strictEqual(hostileData.canonicalMutationExecuted, false);
  });

  await t.test("Invariant 4: Canonical Reality changes only through Canonical Command (Atomic Transaction)", async () => {
    // 1. Snapshot Firestore collections before valid execution
    const commsBefore = await getDocs(collection(db, "works", testWorkId, "commitments"));
    const eventsBefore = await getDocs(collection(db, "works", testWorkId, "events"));
    const initialCommCount = commsBefore.size;
    const initialEventCount = eventsBefore.size;

    // 2. Authorized Action: Negotiated terms within bounds (50kg @ ৳615, within 615-620)
    const validRes = await fetch(`${BASE_URL}/api/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: {
          type: "EXECUTE_AGENT_COMMITMENT",
          workId: testWorkId,
          payload: {
            workId: testWorkId,
            buyerAgent: {
              actorId: "karim_restaurant",
              actorName: "Karim (Uttara Kitchen)",
              policyId: "karim_policy_12",
              maxPrice: 620,
              maxQuantity: 200
            },
            sellerAgent: {
              actorId: "liton_agro",
              actorName: "Liton Mia (Alim Farms)",
              policyId: "liton_policy_04",
              minPrice: 615
            },
            agreedTerms: {
              item: "50kg Nazirshail Rice",
              quantity: 50,
              price: 615, // VALID: 615 <= 620 and 615 >= 615
              unit: "kg",
              deliveryTime: "Tomorrow 10:00 AM"
            },
            provenance: "Autonomous Agent Bargaining Protocol"
          }
        }
      })
    });

    const validData = await validRes.json();
    assert.strictEqual(validRes.status, 200, "Valid authorized command must succeed with HTTP 200");
    assert.strictEqual(validData.success, true);
    assert.strictEqual(validData.canonicalMutationExecuted, true);
    assert.strictEqual(validData.status, "COMMITTED");
    assert.strictEqual(validData.domainEvent, "commitment.formed");
    assert.ok(validData.commitmentId, "Must return canonical commitment ID");

    // 3. Verify Atomic Mutation in Canonical Reality
    const commsAfter = await getDocs(collection(db, "works", testWorkId, "commitments"));
    const eventsAfter = await getDocs(collection(db, "works", testWorkId, "events"));

    assert.strictEqual(commsAfter.size, initialCommCount + 1, "Exactly ONE commitment document must be atomically created");
    assert.strictEqual(eventsAfter.size, initialEventCount + 1, "Exactly ONE domain event document must be atomically created");

    // 4. Verify created commitment matches exact canonical terms
    const createdComm = commsAfter.docs.find((d) => d.id === validData.commitmentId)?.data();
    assert.ok(createdComm, "Created commitment must exist in Firestore");
    assert.strictEqual(createdComm.terms.pricePerUnit, 615);
    assert.strictEqual(createdComm.terms.quantity, 50);
    assert.strictEqual(createdComm.status, "COMMITTED");
    assert.strictEqual(createdComm.authority.buyerPolicyId, "karim_policy_12");
    assert.strictEqual(createdComm.authority.sellerPolicyId, "liton_policy_04");
  });

  t.after(async () => {
    try {
      await terminate(db);
    } catch {
      // ignore
    }
  });
});
