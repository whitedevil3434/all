const fs = require('fs');

let code = `
import { RealityGraph, SemanticAction, RealityObject, CausalRelation } from '../types';

export const initialRealityGraph: RealityGraph = {
  objects: [],
  relations: []
};

// The Reality Engine applies Semantic Actions to the current Reality Graph to produce a new Canonical Reality
export function reduceReality(graph: RealityGraph, action: SemanticAction): RealityGraph {
  const newGraph = { 
    objects: [...graph.objects.map(o => ({ ...o }))], 
    relations: [...graph.relations.map(r => ({ ...r }))] 
  };

  const getObj = (id: string) => newGraph.objects.find(o => o.id === id);
  // Helper to find the primary WANT node to attach things to if targetId is missing
  const getPrimaryWant = () => newGraph.objects.find(o => o.kind === 'WANT');

  switch (action.type) {
    case 'CREATE_WANT':
      newGraph.objects.push({
        id: action.targetId || 'want-1',
        kind: 'WANT',
        title: action.payload?.title || 'Requirement',
        state: 'UNKNOWN',
        quantity: action.payload?.quantity,
        unit: action.payload?.unit,
        provenance: 'user_directed',
        attentionScore: 100,
        availableActions: ['Breakdown', 'Assign']
      });
      break;

    case 'DISCOVER_ACTOR': {
      const wantId = action.targetId || getPrimaryWant()?.id;
      const actorId = 'actor-' + Date.now();
      newGraph.objects.push({
        id: actorId,
        kind: 'ACTOR',
        title: action.targetActorName || 'Unknown Actor',
        state: 'OFFERED',
        quantity: action.payload?.quantity,
        unit: action.payload?.unit,
        provenance: 'ai_inferred',
        attentionScore: 80,
        availableActions: ['Accept', 'Decline', 'Ask']
      });
      if (wantId) {
        newGraph.relations.push({
          id: 'rel-' + Date.now(),
          fromId: wantId,
          toId: actorId,
          kind: 'covers',
          visibility: 'visible'
        });
      }
      break;
    }

    case 'IDENTIFY_GAP': {
      const wantId = action.payload?.wantId || getPrimaryWant()?.id;
      const gapId = action.targetId || 'gap-1';
      newGraph.objects.push({
        id: gapId,
        kind: 'GAP',
        title: action.payload?.title || 'Unresolved Gap',
        state: 'UNKNOWN',
        quantity: action.payload?.quantity,
        unit: action.payload?.unit,
        provenance: 'system_verified',
        attentionScore: 100,
        aiTransientMessage: \`Still open\`,
        availableActions: ['Find', 'Ask', 'Why?']
      });
      if (wantId) {
        newGraph.relations.push({
          id: 'rel-' + Date.now(),
          fromId: wantId,
          toId: gapId,
          kind: 'requires',
          visibility: 'visible'
        });
      }
      break;
    }

    case 'FIND_CANDIDATES': {
      // Find the primary gap to attach to if targetId is missing
      const primaryGap = newGraph.objects.find(o => o.kind === 'GAP');
      const gapId = action.targetId || primaryGap?.id;
      const gap = gapId ? getObj(gapId) : null;
      if (gap) {
        gap.aiTransientMessage = undefined;
        gap.attentionScore = 50;
      }
      
      const candidates = action.payload?.candidates || [];
      candidates.forEach((cand: any, i: number) => {
        const candId = cand.id || 'cand-' + i + '-' + Date.now();
        newGraph.objects.push({
          id: candId,
          kind: 'ACTOR',
          title: cand.name,
          state: cand.state || 'POSSIBLE',
          quantity: cand.quantity,
          unit: cand.unit,
          provenance: 'ai_inferred',
          attentionScore: 90,
          aiTransientMessage: cand.message,
          availableActions: ['Ask', 'Inspect', 'Compare']
        });
        if (gapId) {
          newGraph.relations.push({
            id: 'rel-cand-' + candId,
            fromId: gapId,
            toId: candId,
            kind: 'candidate',
            visibility: 'visible'
          });
        }
      });
      break;
    }

    case 'ASK_ACTOR': {
      const actor = getObj(action.targetId!);
      if (actor) {
        actor.state = 'ASKING';
        actor.aiTransientMessage = '✦ asking...';
        actor.availableActions = [];
        actor.attentionScore = 100;
      }
      break;
    }

    case 'TRANSFORM': {
      const target = getObj(action.targetId!);
      if (target && action.payload) {
        if (action.payload.state) target.state = action.payload.state;
        if (action.payload.aiTransientMessage !== undefined) target.aiTransientMessage = action.payload.aiTransientMessage;
        if (action.payload.availableActions) target.availableActions = action.payload.availableActions;
        if (action.payload.provenance) target.provenance = action.payload.provenance;
        target.attentionScore = action.payload.attentionScore ?? 80;
      }
      break;
    }

    case 'ACCEPT_COMMITMENT': {
      const actor = getObj(action.targetId!);
      if (actor) {
        actor.state = 'COMMITTED';
        actor.aiTransientMessage = undefined;
        actor.provenance = 'user_directed';
        actor.availableActions = ['Change', 'Trace', 'Show proof'];
        actor.attentionScore = 60; // Settles
        
        // Find if it covers a gap, then resolve the gap
        const rel = newGraph.relations.find(r => r.toId === actor.id && r.kind === 'candidate');
        if (rel) {
          rel.kind = 'covers';
          const gap = getObj(rel.fromId);
          if (gap && gap.kind === 'GAP') {
            gap.state = 'DONE';
            gap.attentionScore = 10;
            gap.title = 'Resolved';
          }
        }
      }
      break;
    }
    
    case 'SHOW_NEXT': {
      // Reframe surface around unresolved execution
      newGraph.objects.forEach(o => {
        if (o.state === 'COMMITTED' || o.state === 'DONE') {
          o.attentionScore = 20; // dim
        }
      });
      
      const transportId = 'dep-transport';
      newGraph.objects.push({
        id: transportId,
        kind: 'DEPENDENCY',
        title: 'Transport',
        state: 'UNKNOWN',
        provenance: 'system_verified',
        attentionScore: 100,
        aiTransientMessage: 'Transport is the next unresolved dependency.',
        availableActions: ['Find Driver', 'Assign']
      });
      
      // Find the want
      const want = newGraph.objects.find(o => o.kind === 'WANT');
      if (want) {
        newGraph.relations.push({
          id: 'rel-' + Date.now(),
          fromId: want.id,
          toId: transportId,
          kind: 'depends_on',
          visibility: 'visible'
        });
      }
      break;
    }
  }

  return newGraph;
}
`;

fs.writeFileSync('src/engine/RealityEngine.ts', code);
