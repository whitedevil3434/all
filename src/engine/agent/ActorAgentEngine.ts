// ============================================================================
// OathLink Actor Agent Engine
// ============================================================================
// Every participant entity in OathLink (Human, Business, Machine, Sensor, Service)
// is bound to a persistent digital representative: "Your OathLink Agent".
//
// Key Axioms:
// 1. Actor ≠ Actor Agent
//    - The agent never says "I am Liton". It always acts as "Liton's Agent" or
//      "Acting on behalf of Liton".
// 2. Bound Authority & Strict Governance:
//    - The agent operates strictly within explicit capability and authority boundaries.
//    - It cannot commit to what the actor has not authorized.
// 3. Autonomous Agent-to-Agent Negotiation:
//    - Two agents negotiate while both humans are offline.
//    - Negotiation is NOT commitment until terms satisfy authority -> Canonical Commitment.
// 4. Human-in-the-Loop Interception:
//    - Escalate to human whenever terms exceed auto-authority limits.
// 5. Epistemic Machine & Sensor Agents:
//    - Telemetry from Trucks and IoT Scales enter the same causal grammar.
// ============================================================================

export type EntityType = 'HUMAN' | 'BUSINESS' | 'MACHINE' | 'SENSOR' | 'SERVICE';

export interface AuthorityManifest {
  actorId: string;
  actorName: string;
  entityType: EntityType;
  roleDescription: string;
  // Boundaries
  maxPricePerUnit?: number;        // Buyer limit (e.g. ৳620)
  autoAcceptPriceMax?: number;     // Buyer auto-accept threshold (e.g. ≤ ৳610)
  minAcceptablePrice?: number;     // Seller floor (e.g. ৳615)
  targetPricePerUnit?: number;     // Starting anchor (e.g. ৳600 for buyer, ৳630 for seller)
  maxQuantity: number;             // Maximum quantity authority (e.g. 500 kg)
  allowedUnits: string[];          // e.g. ['kg', 'ton', 'L']
  // Permission flags
  canDiscoverSuppliers: boolean;
  canNegotiatePrice: boolean;
  canNegotiateQuantity: boolean;
  canAutoCommit: boolean;
  // Prohibited actions (Constitution)
  cannotExceedPriceLimit: boolean;
  cannotExceedQuantityLimit: boolean;
  cannotChangeDeliveryLocation: boolean;
  cannotBorrowMoney: boolean;
  cannotAcceptUnverifiedQuality: boolean;
  autonomyMode: 'FULL_AUTONOMOUS' | 'SUPERVISED' | 'ASK_EVERY_STEP';
}

export interface AgentDecisionTrace {
  id: string;
  timestamp: string;
  actorName: string;
  agentTitle: string;
  actionTaken: string;
  counterPartyAgent: string;
  inputReceived: string;
  reasoning: {
    priceFloorOrCeiling: string;
    stockOrNeed: string;
    appliedPolicy: string;
    calculation: string;
  };
  outputResult: string;
  isEscalatedToHuman: boolean;
  provenanceHash: string;
}

export interface WhileAwayRecord {
  id: string;
  timestamp: string;
  summary: string;
  counterParty: string;
  termsAgreed?: {
    item: string;
    quantity: string;
    price: string;
    deliveryTime: string;
  };
  status: 'SETTLED' | 'IN_PROGRESS' | 'NEEDS_APPROVAL' | 'REJECTED';
  traces: AgentDecisionTrace[];
}

export interface NegotiationStep {
  turn: number;
  speaker: 'BUYER_AGENT' | 'SELLER_AGENT' | 'HUMAN_BUYER' | 'HUMAN_SELLER';
  agentTitle: string;
  text: string;
  offeredPrice: number;
  offeredQuantity: number;
  state: 'OFFER' | 'COUNTER' | 'ACCEPT' | 'ESCALATED' | 'REJECT';
  timestamp: string;
  authorityCheckPassed: boolean;
}

// ----------------------------------------------------------------------------
// Default Authority Manifests for Core OathLink Entities
// ----------------------------------------------------------------------------
export const DEFAULT_KARIM_BUYER_AGENT: AuthorityManifest = {
  actorId: 'karim_restaurant',
  actorName: 'Karim (Uttara Kitchen)',
  entityType: 'HUMAN',
  roleDescription: 'Restaurant Owner & Procurement',
  targetPricePerUnit: 600,
  autoAcceptPriceMax: 610,
  maxPricePerUnit: 620,
  maxQuantity: 200,
  allowedUnits: ['kg'],
  canDiscoverSuppliers: true,
  canNegotiatePrice: true,
  canNegotiateQuantity: true,
  canAutoCommit: true,
  cannotExceedPriceLimit: true,
  cannotExceedQuantityLimit: true,
  cannotChangeDeliveryLocation: true,
  cannotBorrowMoney: true,
  cannotAcceptUnverifiedQuality: true,
  autonomyMode: 'SUPERVISED'
};

export const DEFAULT_LITON_SELLER_AGENT: AuthorityManifest = {
  actorId: 'liton_agro',
  actorName: 'Liton Mia (Alim Farms)',
  entityType: 'BUSINESS',
  roleDescription: 'Certified Grain Producer & Miller',
  targetPricePerUnit: 630,
  minAcceptablePrice: 615,
  maxQuantity: 500,
  allowedUnits: ['kg'],
  canDiscoverSuppliers: false,
  canNegotiatePrice: true,
  canNegotiateQuantity: true,
  canAutoCommit: true,
  cannotExceedPriceLimit: false,
  cannotExceedQuantityLimit: true,
  cannotChangeDeliveryLocation: false,
  cannotBorrowMoney: true,
  cannotAcceptUnverifiedQuality: false,
  autonomyMode: 'FULL_AUTONOMOUS'
};

export const DEFAULT_TRUCK_MACHINE_AGENT: AuthorityManifest = {
  actorId: 'truck_van_4421',
  actorName: 'Covered Van (Dhaka Metro-Ta 11-4421)',
  entityType: 'MACHINE',
  roleDescription: 'Telematics & Live Transit Sensor',
  maxQuantity: 2000,
  allowedUnits: ['kg'],
  canDiscoverSuppliers: false,
  canNegotiatePrice: false,
  canNegotiateQuantity: false,
  canAutoCommit: false,
  cannotExceedPriceLimit: true,
  cannotExceedQuantityLimit: true,
  cannotChangeDeliveryLocation: true,
  cannotBorrowMoney: true,
  cannotAcceptUnverifiedQuality: true,
  autonomyMode: 'FULL_AUTONOMOUS'
};

export const DEFAULT_SCALE_SENSOR_AGENT: AuthorityManifest = {
  actorId: 'iot_scale_weighbridge',
  actorName: 'IoT Certified Dual-Key Scale (SN: SC-8921)',
  entityType: 'SENSOR',
  roleDescription: 'Hardware Calibration & Epistemic Weight Telemetry',
  maxQuantity: 1000,
  allowedUnits: ['kg'],
  canDiscoverSuppliers: false,
  canNegotiatePrice: false,
  canNegotiateQuantity: false,
  canAutoCommit: false,
  cannotExceedPriceLimit: true,
  cannotExceedQuantityLimit: true,
  cannotChangeDeliveryLocation: true,
  cannotBorrowMoney: true,
  cannotAcceptUnverifiedQuality: true,
  autonomyMode: 'FULL_AUTONOMOUS'
};

// ----------------------------------------------------------------------------
// Autonomous Agent Negotiator
// ----------------------------------------------------------------------------
export class AutonomousNegotiator {
  /**
   * Executes the Canonical Command on the backend /api/commands to verify authority
   * and emit the domain event into Canonical Reality.
   */
  static async executeCanonicalCommitment(params: {
    workId?: string;
    buyerAgent: AuthorityManifest;
    sellerAgent: AuthorityManifest;
    agreedTerms: {
      item: string;
      quantity: number;
      price: number;
      unit?: string;
      deliveryTime?: string;
    };
  }): Promise<{
    success: boolean;
    canonicalMutationExecuted: boolean;
    status: 'COMMITTED' | 'AUTHORITY_VIOLATED' | 'FAILED';
    error?: string;
    reason?: string;
    domainEvent?: string;
    commitmentId?: string;
  }> {
    try {
      const response = await fetch('/api/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: {
            type: 'EXECUTE_AGENT_COMMITMENT',
            workId: params.workId || 'work_default',
            payload: {
              workId: params.workId || 'work_default',
              buyerAgent: {
                actorId: params.buyerAgent.actorId,
                actorName: params.buyerAgent.actorName,
                policyId: 'karim_policy_12',
                maxPrice: params.buyerAgent.maxPricePerUnit || 620,
                maxQuantity: params.buyerAgent.maxQuantity || 500
              },
              sellerAgent: {
                actorId: params.sellerAgent.actorId,
                actorName: params.sellerAgent.actorName,
                policyId: 'liton_policy_04',
                minPrice: params.sellerAgent.minAcceptablePrice || 615
              },
              agreedTerms: params.agreedTerms,
              provenance: 'Autonomous Agent Bargaining Protocol'
            }
          }
        })
      });

      const data = await response.json();

      if (response.status === 422 || !data.success) {
        return {
          success: false,
          canonicalMutationExecuted: false,
          status: 'AUTHORITY_VIOLATED',
          error: data.error || 'AUTHORITY_VIOLATION',
          reason: data.reason || 'Agent authority ceiling or floor violated.'
        };
      }

      return {
        success: true,
        canonicalMutationExecuted: true,
        status: 'COMMITTED',
        domainEvent: data.domainEvent || 'commitment.formed',
        commitmentId: data.commitmentId
      };
    } catch (err: any) {
      return {
        success: false,
        canonicalMutationExecuted: false,
        status: 'FAILED',
        error: err.message,
        reason: 'Network or server failure.'
      };
    }
  }

  /**
   * Simulates full autonomous turn-by-turn bargaining between Buyer Agent and Seller Agent.
   * If both agents find mutually acceptable terms within authority limits,
   * it returns an Agent Proposal awaiting canonical execution.
   */
  static runBargainingProtocol(
    buyerPolicy: AuthorityManifest,
    sellerPolicy: AuthorityManifest,
    requestedQuantity: number = 50,
    initialBid: number = 600,
    adversarialScenario?: 'NORMAL' | 'CEILING_VIOLATION' | 'FLOOR_VIOLATION'
  ): {
    success: boolean;
    finalPrice?: number;
    finalQuantity?: number;
    steps: NegotiationStep[];
    escalated: boolean;
    escalationReason?: string;
    traces: AgentDecisionTrace[];
  } {
    const steps: NegotiationStep[] = [];
    const traces: AgentDecisionTrace[] = [];

    // Turn 1: Buyer Agent sends inquiry
    let currentBid = initialBid;
    steps.push({
      turn: 1,
      speaker: 'BUYER_AGENT',
      agentTitle: `${buyerPolicy.actorName}'s Agent`,
      text: `${requestedQuantity} কেজি চাল দরকার। দর ৳${currentBid}/কেজি দেওয়া সম্ভব?`,
      offeredPrice: currentBid,
      offeredQuantity: requestedQuantity,
      state: 'OFFER',
      timestamp: '10:14 PM',
      authorityCheckPassed: true
    });

    traces.push({
      id: `trace-b1-${Date.now()}`,
      timestamp: '10:14 PM',
      actorName: buyerPolicy.actorName,
      agentTitle: `${buyerPolicy.actorName}'s Agent`,
      actionTaken: 'Sent Initial Capability & Price Inquiry',
      counterPartyAgent: `${sellerPolicy.actorName}'s Agent`,
      inputReceived: `User request for ${requestedQuantity}kg rice`,
      reasoning: {
        priceFloorOrCeiling: `Buyer Auto-Accept ≤ ৳${buyerPolicy.autoAcceptPriceMax}, Max ≤ ৳${buyerPolicy.maxPricePerUnit}`,
        stockOrNeed: `Requirement: ${requestedQuantity}kg`,
        appliedPolicy: 'Anchor bid at targetPricePerUnit (৳600)',
        calculation: 'Bid ৳600 to initiate bargaining within limits'
      },
      outputResult: `Inquiry: ৳${currentBid} / ${requestedQuantity}kg`,
      isEscalatedToHuman: false,
      provenanceHash: '0x8f4b1...buyer'
    });

    // Adversarial Scenario 1: Seller demands ৳628 (Violates Buyer Ceiling ৳620)
    if (adversarialScenario === 'CEILING_VIOLATION') {
      const hostilePrice = 628;
      steps.push({
        turn: 2,
        speaker: 'SELLER_AGENT',
        agentTitle: `${sellerPolicy.actorName}'s Agent`,
        text: `বর্তমানে বাজারে ঘাটতি রয়েছে। সর্বনিম্ন দর ৳${hostilePrice}/কেজি ছাড়া সরবরাহ সম্ভব নয়।`,
        offeredPrice: hostilePrice,
        offeredQuantity: requestedQuantity,
        state: 'COUNTER',
        timestamp: '10:15 PM',
        authorityCheckPassed: true
      });

      steps.push({
        turn: 3,
        speaker: 'BUYER_AGENT',
        agentTitle: `${buyerPolicy.actorName}'s Agent`,
        text: `বিক্রেতার দাবি ৳${hostilePrice} করিমের অনুমোদিত সর্বোচ্চ সীমা ৳${buyerPolicy.maxPricePerUnit} অতিক্রম করেছে। সাংবিধানিক নিয়মে স্বয়ংক্রিয় চুক্তি নাকচ করা হলো।`,
        offeredPrice: hostilePrice,
        offeredQuantity: requestedQuantity,
        state: 'ESCALATED',
        timestamp: '10:16 PM',
        authorityCheckPassed: false
      });

      traces.push({
        id: `trace-adv-${Date.now()}`,
        timestamp: '10:16 PM',
        actorName: buyerPolicy.actorName,
        agentTitle: `${buyerPolicy.actorName}'s Agent`,
        actionTaken: 'REJECTED: Authority Ceiling Violated',
        counterPartyAgent: `${sellerPolicy.actorName}'s Agent`,
        inputReceived: `Demanded ৳${hostilePrice}/kg`,
        reasoning: {
          priceFloorOrCeiling: `Ceiling ৳${buyerPolicy.maxPricePerUnit} < Offered ৳${hostilePrice}`,
          stockOrNeed: `${requestedQuantity}kg`,
          appliedPolicy: 'Constitutional Rule: No mutation when authority boundary breached',
          calculation: `Delta: +৳${hostilePrice - (buyerPolicy.maxPricePerUnit || 620)} over limit`
        },
        outputResult: 'No Canonical Mutation. No Reality Change.',
        isEscalatedToHuman: true,
        provenanceHash: '0xce111...violation'
      });

      return {
        success: false,
        finalPrice: hostilePrice,
        finalQuantity: requestedQuantity,
        steps,
        escalated: true,
        escalationReason: `Agent authority ceiling violated: Demanded ৳${hostilePrice} exceeds authorized maximum ৳${buyerPolicy.maxPricePerUnit}`,
        traces
      };
    }

    // Turn 2: Seller Agent inspects rules
    // Seller rule: min acceptable is 615, asks 620
    const sellerCounter = sellerPolicy.minAcceptablePrice && sellerPolicy.minAcceptablePrice > currentBid
      ? Math.max(sellerPolicy.minAcceptablePrice + 5, 620)
      : 620;

    steps.push({
      turn: 2,
      speaker: 'SELLER_AGENT',
      agentTitle: `${sellerPolicy.actorName}'s Agent`,
      text: `${requestedQuantity} কেজি প্রস্তুত রাখা যাবে, তবে ৳${currentBid} টাকায় হবে না। আমাদের রেট ৳${sellerCounter}/কেজি।`,
      offeredPrice: sellerCounter,
      offeredQuantity: requestedQuantity,
      state: 'COUNTER',
      timestamp: '10:15 PM',
      authorityCheckPassed: true
    });

    traces.push({
      id: `trace-s1-${Date.now()}`,
      timestamp: '10:15 PM',
      actorName: sellerPolicy.actorName,
      agentTitle: `${sellerPolicy.actorName}'s Agent`,
      actionTaken: 'Rejected below-floor bid & issued Counter-Offer',
      counterPartyAgent: `${buyerPolicy.actorName}'s Agent`,
      inputReceived: `Bid of ৳${currentBid}/kg`,
      reasoning: {
        priceFloorOrCeiling: `Seller Minimum Price Floor: ৳${sellerPolicy.minAcceptablePrice}/kg`,
        stockOrNeed: `Stock available: 80kg (covers ${requestedQuantity}kg)`,
        appliedPolicy: 'Policy #12: Auto-counter at margin (+৳5 above floor)',
        calculation: `Floor ৳${sellerPolicy.minAcceptablePrice} + margin ৳5 = ৳${sellerCounter}`
      },
      outputResult: `Counter-offer: ৳${sellerCounter}/kg`,
      isEscalatedToHuman: false,
      provenanceHash: '0x3c99a...seller'
    });

    // Turn 3: Buyer Agent counters with ৳610 (Karim's ceiling for auto)
    const buyerAuto = buyerPolicy.autoAcceptPriceMax || 610;
    const buyerMax = buyerPolicy.maxPricePerUnit || 620;

    const buyerCounter2 = buyerAuto;
    steps.push({
      turn: 3,
      speaker: 'BUYER_AGENT',
      agentTitle: `${buyerPolicy.actorName}'s Agent`,
      text: `আমাদের সর্বোচ্চ অনুমোদন ৳${buyerCounter2}। এই দরে চূড়ান্ত করা যাবে?`,
      offeredPrice: buyerCounter2,
      offeredQuantity: requestedQuantity,
      state: 'COUNTER',
      timestamp: '10:16 PM',
      authorityCheckPassed: true
    });

    // Turn 4: Seller Agent offers midpoint 615
    const sellerMidpoint = sellerPolicy.minAcceptablePrice || 615;
    steps.push({
      turn: 4,
      speaker: 'SELLER_AGENT',
      agentTitle: `${sellerPolicy.actorName}'s Agent`,
      text: `৳${buyerCounter2} হলে ৪০ কেজি দিতে পারি। তবে ৫০ কেজি পুরো নিলে সর্বনিম্ন ৳${sellerMidpoint} রাখা যাবে।`,
      offeredPrice: sellerMidpoint,
      offeredQuantity: requestedQuantity,
      state: 'COUNTER',
      timestamp: '10:17 PM',
      authorityCheckPassed: true
    });

    // Turn 5: Buyer Agent evaluates 615
    steps.push({
      turn: 5,
      speaker: 'BUYER_AGENT',
      agentTitle: `${buyerPolicy.actorName}'s Agent`,
      text: `অনুমোদিত নীতিমালার মধ্যে (≤ ৳${buyerMax}): ৳${sellerMidpoint} দরে ৫০ কেজি চাল কনফার্ম করছি।`,
      offeredPrice: sellerMidpoint,
      offeredQuantity: requestedQuantity,
      state: 'ACCEPT',
      timestamp: '10:18 PM',
      authorityCheckPassed: true
    });

    traces.push({
      id: `trace-b2-${Date.now()}`,
      timestamp: '10:18 PM',
      actorName: buyerPolicy.actorName,
      agentTitle: `${buyerPolicy.actorName}'s Agent`,
      actionTaken: 'Formed Agent Proposal for Canonical Execution',
      counterPartyAgent: `${sellerPolicy.actorName}'s Agent`,
      inputReceived: `Final counter of ৳${sellerMidpoint}/kg for ${requestedQuantity}kg`,
      reasoning: {
        priceFloorOrCeiling: `Price ৳${sellerMidpoint} ≤ Allowed Limit ৳${buyerMax}`,
        stockOrNeed: `50kg satisfied 100%`,
        appliedPolicy: 'Authority rule #4: Auto-accept within ceiling bounds',
        calculation: `৳${sellerMidpoint} * 50 = ৳${sellerMidpoint * 50} total escrow allocation`
      },
      outputResult: `Terms Agreed: 50kg @ ৳${sellerMidpoint} (Awaiting Canonical Lock)`,
      isEscalatedToHuman: false,
      provenanceHash: '0xaa17c...final'
    });

    // Turn 6: Seller Agent agrees to submit proposal
    steps.push({
      turn: 6,
      speaker: 'SELLER_AGENT',
      agentTitle: `${sellerPolicy.actorName}'s Agent`,
      text: `✓ সম্মতি প্রস্তুত। ৫০ কেজি @ ৳${sellerMidpoint}। Authority Engine-এ ক্যানোনিকাল কমিটমেন্টের জন্য প্রেরিত হচ্ছে।`,
      offeredPrice: sellerMidpoint,
      offeredQuantity: requestedQuantity,
      state: 'ACCEPT',
      timestamp: '10:19 PM',
      authorityCheckPassed: true
    });

    return {
      success: true,
      finalPrice: sellerMidpoint,
      finalQuantity: requestedQuantity,
      steps,
      escalated: false,
      traces
    };
  }
}
