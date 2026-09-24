
import { RealityGraph, SemanticAction, RealityObject, CausalRelation } from '../types';

export const initialRealityGraph: RealityGraph = {
  objects: [
    {
      id: 'want-rice',
      kind: 'WANT',
      title: '50kg Rice Requirement',
      subtitle: 'Office • Today, 6:00 PM',
      state: 'COMMITTED',
      quantity: 50,
      unit: 'kg',
      provenance: 'user_directed',
      attentionScore: 70,
      availableActions: ['Breakdown', 'Show Next'],
    },
    {
      id: 'actor-rahim',
      kind: 'ACTOR',
      title: 'Rahim (Farmer)',
      subtitle: 'Sherpur • ৳3,600',
      state: 'COMMITTED',
      quantity: 30,
      unit: 'kg',
      provenance: 'actor_stated',
      attentionScore: 50,
      availableActions: ['View Agreement', 'Trace'],
    },
    {
      id: 'gap-rice-20',
      kind: 'GAP',
      title: '20kg Rice Open Gap',
      subtitle: 'Unfulfilled Requirement',
      state: 'UNKNOWN',
      quantity: 20,
      unit: 'kg',
      provenance: 'system_verified',
      attentionScore: 95,
      aiTransientMessage: '✦ 20kg open gap',
      availableActions: ['Find Candidates', 'Why?'],
    },
    {
      id: 'actor-karim',
      kind: 'ACTOR',
      title: 'Karim (Mill No. 4)',
      subtitle: 'Mirpur • ৳2,400',
      state: 'OFFERED',
      quantity: 20,
      unit: 'kg',
      provenance: 'actor_stated',
      attentionScore: 88,
      aiTransientMessage: 'Offered 20kg @ ৳2,400',
      availableActions: ['Accept', 'Decline', 'Ask'],
    },
    {
      id: 'actor-mina',
      kind: 'ACTOR',
      title: 'Mina (Sourcing Hub)',
      subtitle: 'Kawran Bazar • ৳1,800',
      state: 'POSSIBLE',
      quantity: 15,
      unit: 'kg',
      provenance: 'ai_inferred',
      attentionScore: 35,
      availableActions: ['Ask', 'Inspect'],
    },
    {
      id: 'dep-transport',
      kind: 'DEPENDENCY',
      title: 'Transport',
      subtitle: 'Driver unassigned • Required 4:00 PM',
      state: 'BLOCKED',
      provenance: 'system_verified',
      attentionScore: 85,
      aiTransientMessage: '✦ Driver needed by 4:00 PM',
      availableActions: ['Assign Driver', 'Find Vehicle'],
    },
    {
      id: 'dep-delivery',
      kind: 'DEPENDENCY',
      title: 'Delivery',
      subtitle: 'Gulshan 2 Office • Expected 6:00 PM',
      state: 'UNKNOWN',
      provenance: 'system_verified',
      attentionScore: 40,
    },
    {
      id: 'dep-payment',
      kind: 'DEPENDENCY',
      title: 'Payment',
      subtitle: 'bKash Corporate • ৳12,500 total',
      state: 'UNKNOWN',
      provenance: 'system_verified',
      attentionScore: 40,
    },
  ],
  relations: [
    {
      id: 'rel-want-rahim',
      fromId: 'want-rice',
      toId: 'actor-rahim',
      kind: 'covers',
      visibility: 'visible',
    },
    {
      id: 'rel-want-gap',
      fromId: 'want-rice',
      toId: 'gap-rice-20',
      kind: 'requires',
      visibility: 'visible',
    },
    {
      id: 'rel-gap-karim',
      fromId: 'gap-rice-20',
      toId: 'actor-karim',
      kind: 'candidate',
      visibility: 'visible',
    },
    {
      id: 'rel-gap-mina',
      fromId: 'gap-rice-20',
      toId: 'actor-mina',
      kind: 'alternative',
      visibility: 'visible',
    },
    {
      id: 'rel-want-transport',
      fromId: 'want-rice',
      toId: 'dep-transport',
      kind: 'depends_on',
      visibility: 'visible',
    },
    {
      id: 'rel-transport-delivery',
      fromId: 'dep-transport',
      toId: 'dep-delivery',
      kind: 'depends_on',
      visibility: 'visible',
    },
    {
      id: 'rel-want-payment',
      fromId: 'want-rice',
      toId: 'dep-payment',
      kind: 'depends_on',
      visibility: 'visible',
    },
  ],
};

// The Reality Engine applies Semantic Actions to the current Reality Graph to produce a new Canonical Reality
export function reduceReality(graph: RealityGraph, action: SemanticAction): RealityGraph {
  const newGraph: RealityGraph = {
    objects: graph.objects.map((o) => ({ ...o })),
    relations: graph.relations.map((r) => ({ ...r })),
  };

  const getObj = (idOrTitle: string) => {
    const lower = idOrTitle.toLowerCase();
    return newGraph.objects.find(
      (o) => o.id === idOrTitle || o.title.toLowerCase().includes(lower)
    );
  };

  const getPrimaryWant = () => newGraph.objects.find((o) => o.kind === 'WANT');

  switch (action.type) {
    case 'CREATE_WANT': {
      const wantId = action.targetId || 'want-' + Date.now();
      const newWant: RealityObject = {
        id: wantId,
        kind: 'WANT',
        title: action.payload?.title || 'Requirement',
        state: 'COMMITTED',
        quantity: action.payload?.quantity,
        unit: action.payload?.unit || 'unit',
        provenance: 'user_directed',
        attentionScore: 100,
        availableActions: ['Breakdown', 'Assign', 'Show Next'],
      };
      newGraph.objects.push(newWant);

      // Also create an open GAP for this new want
      const gapId = 'gap-' + Date.now();
      newGraph.objects.push({
        id: gapId,
        kind: 'GAP',
        title: `${action.payload?.quantity || ''} ${action.payload?.unit || ''} Open Gap`.trim(),
        state: 'UNKNOWN',
        quantity: action.payload?.quantity,
        unit: action.payload?.unit || 'unit',
        provenance: 'system_verified',
        attentionScore: 95,
        aiTransientMessage: '✦ Unfulfilled gap',
        availableActions: ['Find Candidates', 'Why?'],
      });

      newGraph.relations.push({
        id: 'rel-' + Date.now(),
        fromId: wantId,
        toId: gapId,
        kind: 'requires',
        visibility: 'visible',
      });
      break;
    }

    case 'DISCOVER_ACTOR': {
      const wantId = action.targetId || getPrimaryWant()?.id;
      const actorId = 'actor-' + Date.now();
      newGraph.objects.push({
        id: actorId,
        kind: 'ACTOR',
        title: action.targetActorName || 'Rahim',
        subtitle: 'Confirmed Supplier',
        state: 'COMMITTED',
        quantity: action.payload?.quantity || 30,
        unit: action.payload?.unit || 'kg',
        provenance: 'actor_stated',
        attentionScore: 70,
        availableActions: ['View Agreement', 'Trace'],
      });

      if (wantId) {
        newGraph.relations.push({
          id: 'rel-' + Date.now(),
          fromId: wantId,
          toId: actorId,
          kind: 'covers',
          visibility: 'visible',
        });
      }
      break;
    }

    case 'IDENTIFY_GAP': {
      const wantId = action.payload?.wantId || getPrimaryWant()?.id;
      const gapId = action.targetId || 'gap-' + Date.now();
      newGraph.objects.push({
        id: gapId,
        kind: 'GAP',
        title: action.payload?.title || 'Unresolved Gap',
        state: 'UNKNOWN',
        quantity: action.payload?.quantity,
        unit: action.payload?.unit,
        provenance: 'system_verified',
        attentionScore: 100,
        aiTransientMessage: 'Still open',
        availableActions: ['Find', 'Ask', 'Why?'],
      });
      if (wantId) {
        newGraph.relations.push({
          id: 'rel-' + Date.now(),
          fromId: wantId,
          toId: gapId,
          kind: 'requires',
          visibility: 'visible',
        });
      }
      break;
    }

    case 'FIND_CANDIDATES': {
      const primaryGap = newGraph.objects.find((o) => o.kind === 'GAP');
      const gapId = action.targetId || primaryGap?.id;
      const gap = gapId ? newGraph.objects.find((o) => o.id === gapId) : null;
      if (gap) {
        gap.aiTransientMessage = undefined;
        gap.attentionScore = 60;
      }

      const candidates = action.payload?.candidates || [
        { name: 'Karim', quantity: 20, unit: 'kg', state: 'POSSIBLE', message: 'Karim may cover 20kg' },
        { name: 'Mina', quantity: 15, unit: 'kg', state: 'POSSIBLE', message: 'Mina standby' },
      ];

      candidates.forEach((cand: any, i: number) => {
        // If already exists, update
        const existing = newGraph.objects.find(
          (o) => o.title.toLowerCase().includes(cand.name.toLowerCase())
        );
        if (existing) {
          existing.state = cand.state || 'OFFERED';
          existing.attentionScore = 90;
          existing.aiTransientMessage = cand.message;
        } else {
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
            availableActions: ['Ask', 'Accept', 'Decline'],
          });
          if (gapId) {
            newGraph.relations.push({
              id: 'rel-cand-' + candId,
              fromId: gapId,
              toId: candId,
              kind: 'candidate',
              visibility: 'visible',
            });
          }
        }
      });
      break;
    }

    case 'ASK_ACTOR': {
      const targetActorName = action.targetActorName || 'Karim';
      const actor =
        (action.targetId ? getObj(action.targetId) : null) || getObj(targetActorName);
      if (actor) {
        actor.state = 'ASKING';
        actor.aiTransientMessage = '✦ asking for confirmation...';
        actor.availableActions = [];
        actor.attentionScore = 100;
      }
      break;
    }

    case 'ACCEPT_COMMITMENT': {
      const targetActorName = action.targetActorName || 'Karim';
      const actor =
        (action.targetId ? getObj(action.targetId) : null) || getObj(targetActorName);

      if (actor) {
        actor.state = 'COMMITTED';
        actor.aiTransientMessage = '✓ 20kg Committed';
        actor.provenance = 'actor_stated';
        actor.availableActions = ['View Slip', 'Trace'];
        actor.attentionScore = 60; // Settles

        // Resolve open gap
        const gap = newGraph.objects.find((o) => o.kind === 'GAP');
        if (gap) {
          gap.state = 'DONE';
          gap.title = '20kg Gap Resolved';
          gap.quantity = 0;
          gap.aiTransientMessage = '✓ 100% Covered';
          gap.attentionScore = 15; // Diminishes in semantic gravity
          gap.availableActions = [];
        }

        // Direct connection from WANT
        const want = getPrimaryWant();
        if (want) {
          const existingRel = newGraph.relations.find(
            (r) => r.fromId === want.id && r.toId === actor.id
          );
          if (!existingRel) {
            newGraph.relations.push({
              id: 'rel-want-' + actor.id,
              fromId: want.id,
              toId: actor.id,
              kind: 'covers',
              visibility: 'visible',
            });
          }
        }

        // Elevate transport attention
        const transport = newGraph.objects.find((o) => o.id === 'dep-transport');
        if (transport && transport.state === 'BLOCKED') {
          transport.attentionScore = 100;
          transport.aiTransientMessage = '✦ Next: Assign pickup driver';
          transport.availableActions = ['Assign Driver Tariq'];
        }
      }
      break;
    }

    case 'DECLINE_COMMITMENT': {
      const targetActorName = action.targetActorName || 'Karim';
      const actor =
        (action.targetId ? getObj(action.targetId) : null) || getObj(targetActorName);
      if (actor) {
        actor.state = 'REJECTED';
        actor.aiTransientMessage = '⚠️ Offer declined';
        actor.attentionScore = 30;
      }

      // Gap reopens
      const gap = newGraph.objects.find((o) => o.kind === 'GAP');
      if (gap) {
        gap.state = 'UNKNOWN';
        gap.title = '20kg Gap Reopened';
        gap.attentionScore = 100;
        gap.aiTransientMessage = '⚠️ 20kg gap open! Switch to Mina';
      }

      // Elevate Mina
      const mina = newGraph.objects.find((o) => o.title.toLowerCase().includes('mina'));
      if (mina) {
        mina.state = 'OFFERED';
        mina.attentionScore = 95;
        mina.aiTransientMessage = '✦ Standby backup ready (15kg)';
        mina.availableActions = ['Accept Mina (15kg)', 'Ask'];
      }
      break;
    }

    case 'ASSIGN_DRIVER' as any: {
      const driverName = action.payload?.driverName || 'Tariq';
      const cost = action.payload?.cost || '৳ 800';
      const transport = newGraph.objects.find((o) => o.id === 'dep-transport');
      if (transport) {
        transport.state = 'COMMITTED';
        transport.title = `Transport (${driverName} - ${cost})`;
        transport.subtitle = `Covered Van • Pickup 4:30 PM`;
        transport.provenance = 'system_verified';
        transport.attentionScore = 50;
        transport.aiTransientMessage = `✓ Driver ${driverName} booked`;
        transport.availableActions = ['Track Van', 'Call Tariq'];
      }

      const delivery = newGraph.objects.find((o) => o.id === 'dep-delivery');
      if (delivery) {
        delivery.state = 'EXECUTING';
        delivery.subtitle = 'En route for pickup from Rahim & Karim';
        delivery.attentionScore = 85;
        delivery.aiTransientMessage = '✦ Moving to pickup point';
        delivery.availableActions = ['Confirm Delivery', 'Check Security Gate'];
      }
      break;
    }

    case 'CONFIRM_DELIVERY' as any: {
      const delivery = newGraph.objects.find((o) => o.id === 'dep-delivery');
      if (delivery) {
        delivery.state = 'DONE';
        delivery.subtitle = 'Delivered & Verified at Gulshan Office';
        delivery.attentionScore = 30;
        delivery.aiTransientMessage = '✓ Delivered & Weight Verified';
        delivery.availableActions = ['View Challan'];
      }

      const want = getPrimaryWant();
      if (want) {
        want.state = 'DONE';
        want.attentionScore = 40;
      }

      const payment = newGraph.objects.find((o) => o.id === 'dep-payment');
      if (payment) {
        payment.state = 'OFFERED';
        payment.attentionScore = 100;
        payment.aiTransientMessage = '✦ Settle ৳12,500 total payout';
        payment.availableActions = ['Pay ৳12,500 via bKash'];
      }
      break;
    }

    case 'PROCESS_PAYMENT' as any: {
      const payment = newGraph.objects.find((o) => o.id === 'dep-payment');
      if (payment) {
        payment.state = 'PROVEN';
        payment.title = 'Payment (৳12,500 Settled)';
        payment.subtitle = 'bKash Corporate Trx verified';
        payment.attentionScore = 35;
        payment.aiTransientMessage = '✓ Payment Complete';
        payment.availableActions = ['View Receipt', 'Challan'];
      }
      break;
    }

    case 'SHOW_NEXT': {
      // Dim committed nodes
      newGraph.objects.forEach((o) => {
        if (o.state === 'COMMITTED' || o.state === 'DONE') {
          o.attentionScore = Math.min(o.attentionScore ?? 50, 30);
        }
      });

      const transport = newGraph.objects.find((o) => o.id === 'dep-transport');
      if (transport) {
        transport.attentionScore = 100;
        transport.aiTransientMessage = '✦ Next priority: Assign pickup driver';
        transport.availableActions = ['Assign Driver Tariq'];
      }
      break;
    }

    case 'TRANSFORM': {
      const target = getObj(action.targetId!);
      if (target && action.payload) {
        if (action.payload.state) target.state = action.payload.state;
        if (action.payload.aiTransientMessage !== undefined)
          target.aiTransientMessage = action.payload.aiTransientMessage;
        if (action.payload.availableActions) target.availableActions = action.payload.availableActions;
        if (action.payload.provenance) target.provenance = action.payload.provenance;
        target.attentionScore = action.payload.attentionScore ?? 80;
      }
      break;
    }
  }

  return newGraph;
}

