// Legacy types to maintain compatibility while transitioning
export type ObjectKind = 'WANT' | 'ACTOR' | 'GAP' | 'CAPABILITY' | 'COMMITMENT' | 'EXECUTION' | 'PROOF' | 'OUTCOME' | 'DEPENDENCY';
export type EpistemicState = 'UNKNOWN' | 'POSSIBLE' | 'OBSERVED' | 'STATED' | 'OFFERED' | 'COMMITTED' | 'EXECUTING' | 'PROVEN' | 'DONE' | 'BLOCKED' | 'CONFLICTED' | 'EXPIRED' | 'REJECTED' | 'ASKING';
export type ProvenanceSource = 'user_directed' | 'ai_inferred' | 'actor_stated' | 'system_verified' | 'evidence_backed';

export interface RealityObject {
  id: string;
  kind: ObjectKind;
  title: string;
  subtitle?: string;
  state: EpistemicState;
  actorId?: string;
  quantity?: number;
  unit?: string;
  provenance: ProvenanceSource;
  attentionScore?: number; 
  aiTransientMessage?: string; 
  availableActions?: string[];
  evidence?: string[];
  temporalState?: string;
}

export type RelationKind = 'requires' | 'covers' | 'depends_on' | 'candidate' | 'alternative' | 'committed_by' | 'proves' | 'unresolved';
export type RelationVisibility = 'visible' | 'hidden' | 'dimmed';

export interface CausalRelation {
  id: string;
  fromId: string;
  toId: string;
  kind: RelationKind;
  visibility: RelationVisibility;
}

export interface RealityGraph {
  objects: RealityObject[];
  relations: CausalRelation[];
}

export type SemanticActionType = 
  | 'PROPOSE_NEED'
  | 'PROPOSE_OFFER'
  | 'CREATE_WANT'
  | 'DISCOVER_ACTOR'
  | 'IDENTIFY_GAP'
  | 'FIND_CANDIDATES'
  | 'ASK_ACTOR'
  | 'ACCEPT_COMMITMENT'
  | 'DECLINE_COMMITMENT'
  | 'REVEAL'
  | 'TRANSFORM'
  | 'RELATE'
  | 'REFRAME'
  | 'COMPARE'
  | 'SIMULATE'
  | 'TRACE'
  | 'SHOW_NEXT';

export interface SemanticProposal {
  proposalId?: string;
  workId?: string;
  intent: {
    type: 'NEED' | 'CAPABILITY_OFFER';
    description?: string;
    quantity?: number;
    unit?: string;
    actorName?: string;
    capabilityDescription?: string;
  };
  provenance: {
    originalText: string;
  };
}

export interface CanonicalCommand {
  type: 'DECLARE_NEED' | 'DECLARE_OFFER' | 'REQUEST_COMMITMENT' | 'ACCEPT_COMMITMENT' | 'DECLINE_COMMITMENT' | 'GENERATE_INVITATION' | 'ACCEPT_INVITATION' | 'START_EXECUTION' | 'UPDATE_EXECUTION' | 'SUBMIT_EVIDENCE' | 'DECLARE_OUTCOME' | 'VERIFY_OUTCOME';
  proposalId?: string;
  workId?: string;
  payload: {
    description?: string;
    quantity?: number;
    unit?: string;
    actorName?: string;
    capabilityDescription?: string;
    needId?: string;
    actorId?: string;
    capabilityId?: string;
    responsibilityId?: string;
    roleName?: string;
    invitationId?: string;
    deadline?: string;
    commitmentId?: string;
    executionId?: string;
    state?: string;
    evidenceIds?: string[];
    outcomeId?: string;
  };
  provenance: {
    originalText: string;
  };
}

export interface SemanticAction {
  id?: string;
  type: SemanticActionType;
  targetId?: string;
  targetActorName?: string;
  payload?: any;
  message?: string;
}

export interface RealityContext {
  id: string;
  ownerId?: string; 
  title: string;
  subtitle: string;
  folder: string;
  colorGradient: string;
  iconName: string;
  status: 'active' | 'in_transit' | 'partially_covered' | 'completed' | 'draft';
  statusText?: string;
  actors?: string[];
  graph?: RealityGraph;
}

export type WorkspaceLayoutMode = 'split' | 'full_board' | 'full_chat';

// ==========================================
// CANONICAL REALITY SCHEMA (Phase 1 Spine)
// ==========================================

export interface CanonicalWork {
  id: string;
  ownerId: string;
  intent: string; // the original natural language intent
  status: 'OPEN' | 'DOING' | 'RESOLVED';
  createdAt: number;
}

export interface CanonicalNeed {
  id: string;
  workId: string;
  parentId?: string; // For recursive child work
  description: string;
  status: 'UNKNOWN' | 'ADDRESSING' | 'RESOLVED';
  createdAt: number;
}

export interface CanonicalCapability {
  id: string;
  workId: string;
  description: string;
  status: 'STATED' | 'VERIFIED' | 'PROVEN';
  createdAt: number;
}

export interface CanonicalResponsibility {
  id: string;
  workId: string;
  actorId: string;
  needId: string;
  capabilityId: string;
  description: string;
  status: 'PROPOSED' | 'ACCEPTED' | 'DECLINED' | 'CHANGED';
  createdAt: number;
}

export interface CanonicalInvitation {
  id: string;
  workId: string;
  needId: string;
  capabilityId: string;
  roleName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  createdAt: number;
}

export interface CanonicalExecution {
  id: string;
  workId: string;
  description: string;
  state: 'STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'FAILED' | 'COMPLETED';
  createdAt: number;
}

export interface CanonicalOutcome {
  id: string;
  workId: string;
  needId: string;
  description: string;
  state: 'PROPOSED' | 'PARTIAL' | 'VERIFIED' | 'REJECTED';
  createdAt: number;
}

export interface CanonicalRelation {
  id: string;
  workId: string;
  from: string; // Format: "type:id"
  relation: 'REQUIRES' | 'OFFERED_BY' | 'HAS_RESPONSIBILITY' | 'BECOMES' | 'HAS_INVITATION' | 'ACCEPTS_INVITATION' | 'DRIVES' | 'PRODUCES' | 'SUPPORTS' | 'SATISFIES';
  to: string; // Format: "type:id"
  createdAt: number;
}

export interface CanonicalActor {
  id: string;
  displayName: string;
  type: 'HUMAN' | 'AGENT' | 'SYSTEM';
  reputation: number;
  capabilities: string[];
}

export interface CanonicalCommitment {
  id: string;
  workId: string;
  responsibilityId: string;
  needId: string;
  actorId: string;
  terms: {
    description: string;
    quantity?: number;
    unit?: string;
    deadline?: string;
  };
  status: 'COMMITTED' | 'FULFILLED' | 'BREACHED';
  createdAt: number;
}

export interface CanonicalEvent {
  id: string;
  workId: string;
  actorId: string;
  type: 'WORK_CREATED' | 'NEED_IDENTIFIED' | 'ACTOR_PROPOSED' | 'COMMITMENT_OFFERED' | 'COMMITMENT_ACCEPTED' | 'EXECUTION_STARTED' | 'PROOF_SUBMITTED' | 'OUTCOME_VERIFIED' | 'responsibility.requested' | 'commitment.agreed' | 'commitment.declined' | 'invitation.generated' | 'invitation.accepted' | 'execution.started' | 'execution.updated' | 'evidence.submitted' | 'outcome.declared' | 'outcome.verified' | 'outcome.rejected' | 'work.blocked' | 'work.failed';
  payload: any;
  createdAt: number;
}
