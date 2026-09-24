/**
 * Phase 0: The Reality Contract
 * 
 * Immutable definitions of C-Link's core entities.
 * These represent CANONICAL TRUTH, not AI hypotheses.
 */

export type CausalState = 
  | 'UNKNOWN'      // AI hypothesized this, but reality hasn't confirmed it
  | 'POSSIBLE'     // Capability exists and is discovered
  | 'OFFERED'      // Actor proposed commitment
  | 'COMMITTED'    // Locked via Canonical Event
  | 'EXECUTING'    // Action is in progress
  | 'VERIFYING'    // Proof submitted, awaiting validation
  | 'RESOLVED'     // Outcome fully materialized
  | 'FAILED';      // Broken causal chain

/**
 * ACTOR: A persistent universal entity.
 * An Actor is NEVER defined by an occupational box (Supplier, Buyer).
 * Roles are contextual based on the graph.
 */
export interface Actor {
  id: string;
  name: string; // The identity
  // Note: No 'type' or 'role' here. Identity is fundamental.
}

/**
 * INTENT: The raw, contextual desire expressed by an Actor.
 * E.g., "আগামী শুক্রবার আমার science project complete করতে হবে।"
 */
export interface Intent {
  id: string;
  creatorId: string; // Actor ID
  rawExpression: string;
  timestamp: number;
}

/**
 * OUTCOME: The actual materialization of the Intent in reality.
 */
export interface Outcome {
  id: string;
  intentId: string;
  description: string;
  state: CausalState;
}

/**
 * DEPENDENCY: A required component (Material, Action, Permission) 
 * for an Outcome or another Dependency to resolve.
 */
export interface Dependency {
  id: string;
  parentId: string; // Outcome ID or another Dependency ID
  label: string;
  state: CausalState;
  fulfilledByActorId?: string; // Who holds the Responsibility?
}

/**
 * RESPONSIBILITY: A Dependency that an Actor has committed to fulfilling.
 * This is the bridge where a Child Work can spawn recursively.
 */
export interface Responsibility {
  id: string;
  dependencyId: string;
  actorId: string;
  state: CausalState;
}

/**
 * EVENT: The Canonical Mutation.
 * AI does NOT change Reality. Events change Reality.
 */
export interface CanonicalEvent {
  id: string;
  type: 'INTENT_DECLARED' | 'CAPABILITY_DISCOVERED' | 'OFFER_MADE' | 'COMMITMENT_LOCKED' | 'EVIDENCE_SUBMITTED' | 'OUTCOME_VERIFIED';
  actorId: string;
  targetId: string; // ID of Dependency, Responsibility, or Outcome
  payload: Record<string, any>;
  timestamp: number;
}
