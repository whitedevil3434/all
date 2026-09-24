import { Intent, Dependency } from './RealityContract';

export interface GraphMutation {
  type: 'UPDATE_STATE' | 'ADD_NODE';
  nodeId?: string; 
  state?: 'UNKNOWN' | 'POSSIBLE' | 'ASKING' | 'OFFERED' | 'COMMITTED' | 'EXECUTING' | 'VERIFYING' | 'RESOLVED' | 'FAILED';
  nodeType?: 'WANT' | 'DEPENDENCY' | 'GAP' | 'ACTOR' | 'EVIDENCE';
  label?: string;
  rationale?: string;
}

export interface OutcomeHypothesis {
  intentId: string;
  inferredMeaning: string; 
  proposedDependencies: ProposedDependency[];
  actionOptions?: { label: string; actionType: string; payload?: any }[];
  unknowns: string[];
  recommendedAction?: SemanticActionProposal;
  
  // New: Direct mutations to the graph based on conversation
  mutations?: GraphMutation[];
}

export interface ProposedDependency {
  label: string;
  rationale: string; 
  contextualDetails?: string;
  clarificationQuestions?: string[];
  confidence: number;
}

export interface SemanticActionProposal {
  type: 'FIND_ACTOR' | 'ASK_CAPABILITY' | 'CLARIFY_INTENT' | 'LOCK_COMMITMENT';
  targetLabel: string; 
}
