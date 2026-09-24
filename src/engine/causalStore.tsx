import React, { createContext, useContext, useState, useCallback } from 'react';
import { PARTICIPANTS } from '../data/clinkData';
import { RealityGraph, RealityObject, SemanticAction } from '../types';
import { initialRealityGraph, reduceReality } from './RealityEngine';

export type EpistemicStatus = 
  | 'UNKNOWN' 
  | 'POSSIBLE' 
  | 'OFFERED' 
  | 'COMMITTED' 
  | 'ASKING' 
  | 'DECLINED' 
  | 'BLOCKED' 
  | 'SCHEDULED' 
  | 'PENDING' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'VERIFIED' 
  | 'PAID';

export interface CausalActorNode {
  id: string;
  name: string;
  role: string;
  quantity: number;
  unit: string;
  price: string;
  status: EpistemicStatus;
  confidence: 'High' | 'Medium' | 'Low';
  avatar: string;
  source: string;
  provenance: string;
  lastUpdate: string;
  notes?: string;
}

export interface CausalDependencyNode {
  id: string;
  title: string;
  status: EpistemicStatus;
  detail: string;
  driver?: {
    name: string;
    phone: string;
    cost: string;
    vehicle: string;
  };
  dueDate?: string;
  requiredProof?: string;
  totalAmount?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface CausalTimelineEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'want' | 'commit' | 'offer' | 'pending' | 'blocked' | 'verified' | 'paid' | 'declined';
  actor?: string;
  provenance?: string;
}

export interface CausalChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'karim' | 'rahim' | 'system';
  text: string;
  time: string;
  status?: string;
  options?: { label: string; action: () => void }[];
}

export interface CausalState {
  want: {
    title: string;
    quantity: number;
    unit: string;
    target: string;
    dueTime: string;
    status: 'Active' | 'Completed';
  };
  actors: {
    rahim: CausalActorNode;
    karim: CausalActorNode;
    mina: CausalActorNode;
  };
  coverage: {
    total: number;
    covered: number;
    unit: string;
    isFullyCovered: boolean;
  };
  dependencies: {
    transport: CausalDependencyNode;
    delivery: CausalDependencyNode;
    proof: CausalDependencyNode;
    payment: CausalDependencyNode;
  };
  timelineEvents: CausalTimelineEvent[];
  chatMessages: CausalChatMessage[];
  selectedNodeId: string;
  activeTab: 'living' | 'timeline' | 'history' | 'files' | 'notes';
  aiTransient: {
    active: boolean;
    text: string;
    step?: string;
    status: 'thinking' | 'success' | 'alert' | 'idle';
  };
  toastMessage: string | null;
  searchQuery: string;
  activeScenarioId: number;
  activeWorkspace: 'operations' | 'supply-chain' | 'finance' | 'hr' | 'projects';
  operations: {
    id: string;
    title: string;
    category: string;
    quantity: number;
    unit: string;
    target: string;
    dueTime: string;
    status: 'Active' | 'Completed';
    coveragePercent: number;
  }[];
  activeOperationId: string;
  selectedDoc: {
    id: string;
    title: string;
    filename: string;
    category: 'challan' | 'weighbridge' | 'payment' | 'trip-pass';
    size: string;
    date: string;
    refNumber: string;
    issuedBy: string;
    recipient: string;
    items: { description: string; qty: string; rate: string; total: string }[];
    totalAmount: string;
    verificationHash: string;
    notes?: string;
  } | null;
  graph: RealityGraph;
}

const DEFAULT_OPERATIONS = [
  {
    id: 'op-rice',
    title: '50kg Rice Delivery',
    category: 'Grains & Food Sourcing',
    quantity: 50,
    unit: 'kg',
    target: 'Office • Today, 6:00 PM',
    dueTime: 'Today, 6:00 PM',
    status: 'Active' as const,
    coveragePercent: 60,
  },
  {
    id: 'op-oil',
    title: '100L Mustard Oil',
    category: 'Edible Oils & Sourcing',
    quantity: 100,
    unit: 'L',
    target: 'Canteen Kitchen • Today, 8:00 PM',
    dueTime: 'Today, 8:00 PM',
    status: 'Active' as const,
    coveragePercent: 100,
  },
  {
    id: 'op-eggs',
    title: '500 Dozen Organic Eggs',
    category: 'Fresh Poultry & Farm Produce',
    quantity: 500,
    unit: 'Dozen',
    target: 'Dhanmondi Branch • Tomorrow, 9:00 AM',
    dueTime: 'Tomorrow, 9:00 AM',
    status: 'Active' as const,
    coveragePercent: 70,
  },
];

const INITIAL_STATE: CausalState = {
  want: {
    title: '50kg Rice',
    quantity: 50,
    unit: 'kg',
    target: 'Office • Today, 6:00 PM',
    dueTime: 'Today, 6:00 PM',
    status: 'Active',
  },
  actors: {
    rahim: {
      id: 'rahim',
      name: 'Rahim',
      role: 'Farmer / Primary Supplier',
      quantity: 30,
      unit: 'kg',
      price: '৳ 3,600',
      status: 'COMMITTED',
      confidence: 'High',
      avatar: PARTICIPANTS[1].avatar,
      source: 'Direct agreement',
      provenance: 'Signed digital agreement',
      lastUpdate: '09:24 AM',
      notes: 'Confirmed Miniket rice, packaged in two 15kg sacks.',
    },
    karim: {
      id: 'karim',
      name: 'Karim',
      role: 'Local Mill Supplier',
      quantity: 20,
      unit: 'kg',
      price: '৳ 2,400',
      status: 'OFFERED',
      confidence: 'Medium',
      avatar: PARTICIPANTS[0].avatar,
      source: 'Karim stated in chat',
      provenance: 'Direct chat conversation',
      lastUpdate: '10:19 AM',
      notes: 'Available for immediate pickup at Mill No. 4, Mirpur.',
    },
    mina: {
      id: 'mina',
      name: 'Mina',
      role: 'Candidate Supplier',
      quantity: 15,
      unit: 'kg',
      price: '৳ 1,800',
      status: 'POSSIBLE',
      confidence: 'Low',
      avatar: PARTICIPANTS[2].avatar,
      source: 'Directory matching',
      provenance: 'AI discovery engine',
      lastUpdate: '10:20 AM',
      notes: 'Standby backup supplier in case Karim declines.',
    },
  },
  coverage: {
    total: 50,
    covered: 30, // Rahim 30kg, Karim has offered 20kg
    unit: 'kg',
    isFullyCovered: false,
  },
  dependencies: {
    transport: {
      id: 'transport',
      title: 'Transport',
      status: 'BLOCKED',
      detail: 'Driver not confirmed • Required by 4:00 PM',
      dueDate: 'Today, 4:00 PM',
    },
    delivery: {
      id: 'delivery',
      title: 'Delivery',
      status: 'PENDING',
      detail: '50kg to Gulshan 2 Office • Expected: 6:00 PM',
      dueDate: 'Today, 6:00 PM',
    },
    proof: {
      id: 'proof',
      title: 'Proof of Delivery',
      status: 'PENDING',
      detail: 'Delivery confirmation required: Photo + Weight slip',
      requiredProof: 'Photo + Weighing Bridge Slip',
    },
    payment: {
      id: 'payment',
      title: 'Payment',
      status: 'PENDING',
      detail: '৳ 12,500 total for Rahim + Karim + Transport',
      totalAmount: '৳ 12,500',
    },
  },
  timelineEvents: [
    {
      id: 'evt-1',
      time: '09:12 AM',
      title: 'Want created',
      subtitle: '50kg rice (office, today 6:00 PM)',
      type: 'want',
      actor: 'Sabbir',
      provenance: 'User voice input',
    },
    {
      id: 'evt-2',
      time: '09:24 AM',
      title: 'Rahim offered 30kg',
      subtitle: 'Committed and signed',
      type: 'commit',
      actor: 'Rahim',
      provenance: 'Direct agreement',
    },
    {
      id: 'evt-3',
      time: '10:19 AM',
      title: 'Karim found',
      subtitle: 'Offered 20kg @ ৳2,400',
      type: 'offer',
      actor: 'Karim',
      provenance: 'Direct message',
    },
    {
      id: 'evt-4',
      time: '11:05 AM',
      title: 'Transport pending',
      subtitle: 'Waiting for driver confirmation',
      type: 'blocked',
      actor: 'System',
      provenance: 'Automated dependency check',
    },
  ],
  chatMessages: [
    {
      id: 'msg-1',
      sender: 'user',
      text: 'আজকের important কাজের কী অবস্থা? কী সমস্যা?',
      time: '11:15 AM',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'আজকের চাল সরবরাহে ২টি বিষয় জরুরি মনোযোগ দাবি করছে:\n1. করিম ২০ কেজি চালের প্রস্তাব দিয়েছে, যা অনুমোদনের অপেক্ষায় রয়েছে।\n2. পরিবহন এখনো নিশ্চিত হয়নি — একজন পিকআপ ড্রাইভার নির্বাচন করা প্রয়োজন।',
      time: '11:15 AM',
    },
  ],
  selectedNodeId: 'karim',
  activeTab: 'living',
  aiTransient: {
    active: false,
    text: '',
    status: 'idle',
  },
  toastMessage: null,
  searchQuery: '',
  activeScenarioId: 1,
  activeWorkspace: 'operations',
  operations: DEFAULT_OPERATIONS,
  activeOperationId: 'op-rice',
  selectedDoc: null,
  graph: initialRealityGraph,
};

export interface CreateOperationData {
  title: string;
  quantity: number;
  unit: string;
  target: string;
  dueTime: string;
  actor1Name: string;
  actor1Qty: number;
  actor1Price: string;
  actor2Name?: string;
  actor2Qty?: number;
  actor2Price?: string;
  transportCost?: string;
}

interface CausalContextType {
  state: CausalState;
  setSelectedNode: (nodeId: string) => void;
  setActiveTab: (tab: 'living' | 'timeline' | 'history' | 'files' | 'notes') => void;
  setActiveWorkspace: (ws: 'operations' | 'supply-chain' | 'finance' | 'hr' | 'projects') => void;
  setSearchQuery: (query: string) => void;
  showToast: (msg: string) => void;
  askKarim: () => void;
  acceptKarim: () => void;
  declineKarim: () => void;
  assignDriver: (driverName?: string, cost?: string) => void;
  confirmDelivery: () => void;
  processPayment: () => void;
  sendChatMessage: (text: string) => void;
  applyScenario: (scenarioNumber: number) => void;
  resetAll: () => void;
  createOperation: (data: CreateOperationData) => void;
  switchOperation: (opId: string) => void;
  setSelectedDoc: (doc: CausalState['selectedDoc']) => void;
  downloadDocument: (doc: NonNullable<CausalState['selectedDoc']>) => void;
  dispatchSemanticAction: (action: SemanticAction) => RealityObject | undefined;
  handleCardAction: (actionName: string, objectId: string) => void;
}

const CausalContext = createContext<CausalContextType | null>(null);

export function CausalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CausalState>(INITIAL_STATE);

  const showToast = useCallback((msg: string) => {
    setState((prev) => ({ ...prev, toastMessage: msg }));
    setTimeout(() => {
      setState((prev) => (prev.toastMessage === msg ? { ...prev, toastMessage: null } : prev));
    }, 3500);
  }, []);

  const setSelectedNode = useCallback((nodeId: string) => {
    setState((prev) => ({ ...prev, selectedNodeId: nodeId }));
  }, []);

  const setActiveTab = useCallback((tab: 'living' | 'timeline' | 'history' | 'files' | 'notes') => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  // Action: Ask Karim
  const askKarim = useCallback(() => {
    setState((prev) => ({
      ...prev,
      graph: reduceReality(prev.graph, {
        type: 'ASK_ACTOR',
        targetActorName: 'Karim',
        targetId: 'actor-karim',
      }),
      actors: {
        ...prev.actors,
        karim: {
          ...prev.actors.karim,
          status: 'ASKING',
        },
      },
      aiTransient: {
        active: true,
        text: '✦ Inquiring Karim regarding delivery timeline and exact quality...',
        step: 'Messaging Actor',
        status: 'thinking',
      },
    }));

    showToast('✦ Sent inquiry to Karim');

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        graph: reduceReality(prev.graph, {
          type: 'FIND_CANDIDATES',
          targetId: 'gap-rice-20',
          payload: {
            candidates: [
              { name: 'Karim (Mill No. 4)', quantity: 20, unit: 'kg', state: 'OFFERED', message: 'Available 20kg @ ৳2,400' },
            ],
          },
        }),
        actors: {
          ...prev.actors,
          karim: {
            ...prev.actors.karim,
            status: 'OFFERED',
            notes: 'Karim confirmed: 20kg premium rice ready at Mill No. 4, pickup before 4:30 PM.',
            lastUpdate: 'Just now',
          },
        },
        chatMessages: [
          ...prev.chatMessages,
          {
            id: `msg-${Date.now()}`,
            sender: 'karim',
            text: 'ভাই, ২০ কেজি মিনিকেট চাল রেডি আছে। বিকেল ৪:৩০ এর মধ্যে পিকআপ পাঠালে আজকের মধ্যেই পৌঁছে দেওয়া সম্ভব। দর ৳২,৪০০।',
            time: 'Just now',
          },
        ],
        aiTransient: {
          active: true,
          text: '✓ Karim confirmed offer: 20kg available @ ৳2,400',
          step: 'Offer Received',
          status: 'success',
        },
      }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          aiTransient: { active: false, text: '', status: 'idle' },
        }));
      }, 3500);
    }, 1500);
  }, [showToast]);

  // Action: Accept Karim
  const acceptKarim = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setState((prev) => {
      const newCoverage = 30 + 20;
      const updatedGraph = reduceReality(prev.graph, {
        type: 'ACCEPT_COMMITMENT',
        targetActorName: 'Karim',
        targetId: 'actor-karim',
      });
      return {
        ...prev,
        graph: updatedGraph,
        actors: {
          ...prev.actors,
          karim: {
            ...prev.actors.karim,
            status: 'COMMITTED',
            lastUpdate: timeStr,
            notes: 'Committed: 20kg @ ৳2,400. Direct commitment signed.',
          },
        },
        coverage: {
          ...prev.coverage,
          covered: newCoverage,
          isFullyCovered: true,
        },
        timelineEvents: [
          ...prev.timelineEvents,
          {
            id: `evt-${Date.now()}`,
            time: timeStr,
            title: 'Karim committed',
            subtitle: '20kg committed (100% rice requirement fulfilled)',
            type: 'commit',
            actor: 'Karim',
            provenance: 'User accepted offer in Living Board',
          },
        ],
        chatMessages: [
          ...prev.chatMessages,
          {
            id: `msg-${Date.now()}`,
            sender: 'ai',
            text: '✓ করিমের ২০ কেজি চালের প্রস্তাব গ্রহণ করা হয়েছে! মোট ৫০ কেজি চালের সরবরাহ এখন ১০০% কভার্ড। পরবর্তী পদক্ষেপ: পরিবহন ড্রাইভার কনফার্ম করা।',
            time: timeStr,
          },
        ],
        aiTransient: {
          active: true,
          text: '✓ Karim 20kg committed! 100% Rice covered. Next: Transport.',
          step: 'Commitment Finalized',
          status: 'success',
        },
      };
    });

    showToast('✓ Karim commitment accepted (50kg 100% Covered)');
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aiTransient: { active: false, text: '', status: 'idle' },
      }));
    }, 3500);
  }, [showToast]);

  // Action: Decline Karim (Harsh moment demo)
  const declineKarim = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setState((prev) => ({
      ...prev,
      graph: reduceReality(prev.graph, {
        type: 'DECLINE_COMMITMENT',
        targetActorName: 'Karim',
        targetId: 'actor-karim',
      }),
      actors: {
        ...prev.actors,
        karim: {
          ...prev.actors.karim,
          status: 'DECLINED',
          lastUpdate: timeStr,
          notes: 'Karim declined or could not meet delivery terms.',
        },
      },
      coverage: {
        ...prev.coverage,
        covered: 30,
        isFullyCovered: false,
      },
      timelineEvents: [
        ...prev.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: timeStr,
          title: 'Karim declined 20kg',
          subtitle: '20kg gap reopened in rice supply',
          type: 'declined',
          actor: 'Karim',
          provenance: 'Actor response / User decline',
        },
      ],
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: '⚠️ করিমের প্রস্তাব বাতিল হয়েছে। ২০ কেজি চালের ঘাটতি তৈরি হয়েছে। বিকল্প সরবরাহকারী: মিনা (১৫ কেজি) এবং নজরুল (১০ কেজি) উপলব্ধ আছে।',
          time: timeStr,
        },
      ],
      aiTransient: {
        active: true,
        text: '⚠️ Karim declined. 20kg Gap reopened. Finding backup suppliers...',
        step: 'Gap Reopened',
        status: 'alert',
      },
    }));

    showToast('⚠️ Karim declined: 20kg gap reopened');
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aiTransient: { active: false, text: '', status: 'idle' },
      }));
    }, 3500);
  }, [showToast]);

  // Action: Assign Driver (Unblocks Transport)
  const assignDriver = useCallback((driverName = 'Tariq', cost = '৳ 800') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setState((prev) => ({
      ...prev,
      graph: reduceReality(prev.graph, {
        type: 'ASSIGN_DRIVER' as any,
        payload: { driverName, cost },
      }),
      dependencies: {
        ...prev.dependencies,
        transport: {
          ...prev.dependencies.transport,
          status: 'SCHEDULED',
          detail: `Driver ${driverName} assigned • Pickup at 4:30 PM`,
          driver: {
            name: driverName,
            phone: '01712-482910',
            cost: cost,
            vehicle: 'Covered Van (Dhaka Metro-Ta 11-4029)',
          },
        },
        delivery: {
          ...prev.dependencies.delivery,
          status: 'IN_TRANSIT',
          detail: 'Transport en route for pickup from Rahim and Karim.',
        },
      },
      timelineEvents: [
        ...prev.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: timeStr,
          title: `Driver ${driverName} assigned`,
          subtitle: `Transport unblocked (${cost}) • Pickup scheduled`,
          type: 'commit',
          actor: driverName,
          provenance: 'Assigned via C-Link Logistics',
        },
      ],
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `✓ ড্রাইভার ${driverName} (${cost}) সফলভাবে নিযুক্ত হয়েছেন! পরিবহন এখন শিডিউলড। ডেলিভারি রুটের আপডেট লাইভ ট্র্যাকিংয়ে পাওয়া যাবে।`,
          time: timeStr,
        },
      ],
      aiTransient: {
        active: true,
        text: `✓ Transport unblocked! Driver ${driverName} scheduled for pickup.`,
        step: 'Transport Active',
        status: 'success',
      },
    }));

    showToast(`✓ Driver ${driverName} assigned (${cost}). Transport unblocked!`);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aiTransient: { active: false, text: '', status: 'idle' },
      }));
    }, 3500);
  }, [showToast]);

  // Action: Confirm Delivery
  const confirmDelivery = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setState((prev) => ({
      ...prev,
      graph: reduceReality(prev.graph, {
        type: 'CONFIRM_DELIVERY' as any,
      }),
      dependencies: {
        ...prev.dependencies,
        delivery: {
          ...prev.dependencies.delivery,
          status: 'DELIVERED',
          detail: 'Delivered to Gulshan 2 Office • 50kg verified',
        },
        proof: {
          ...prev.dependencies.proof,
          status: 'VERIFIED',
          detail: 'Digital receipt + Weighing bridge photo verified by Security Gate.',
        },
      },
      want: {
        ...prev.want,
        status: 'Completed',
      },
      timelineEvents: [
        ...prev.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: timeStr,
          title: '50kg Rice Delivered',
          subtitle: 'Received at Office & Verified by Security Gate',
          type: 'verified',
          actor: 'Sabbir',
          provenance: 'Photo + Weighing Bridge Slip verified',
        },
      ],
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: '🎉 ডেলিভারি সম্পন্ন এবং ভেরিফাই করা হয়েছে! ৫০ কেজি চাল গুলশান অফিসে পৌঁছানো হয়েছে। বাকি শুধু চূড়ান্ত বিল পরিশোধ।',
          time: timeStr,
        },
      ],
      aiTransient: {
        active: true,
        text: '🎉 Delivery completed and verified! Requirement fully satisfied.',
        step: 'Requirement Complete',
        status: 'success',
      },
    }));

    showToast('🎉 Delivery verified! Requirement fully satisfied.');
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aiTransient: { active: false, text: '', status: 'idle' },
      }));
    }, 3500);
  }, [showToast]);

  // Action: Process Payment
  const processPayment = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const trxId = 'TRX-' + Math.floor(100000 + Math.random() * 900000);
    setState((prev) => ({
      ...prev,
      graph: reduceReality(prev.graph, {
        type: 'PROCESS_PAYMENT' as any,
      }),
      dependencies: {
        ...prev.dependencies,
        payment: {
          ...prev.dependencies.payment,
          status: 'PAID',
          detail: `৳ 12,500 settled via bKash Merchant (Trx: ${trxId})`,
          paymentMethod: 'bKash Corporate',
          transactionId: trxId,
        },
      },
      timelineEvents: [
        ...prev.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: timeStr,
          title: 'Payment settled (৳ 12,500)',
          subtitle: `bKash Corporate Trx: ${trxId} • Rahim + Transport paid`,
          type: 'paid',
          actor: 'Accounts',
          provenance: 'bKash Merchant Gateway API',
        },
      ],
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `✓ পেমেন্ট সফল হয়েছে! ৳ ১২,৫০০ রহিম ও ড্রাইভারকে পরিশোধ করা হয়েছে (ট্রানজেকশন আইডি: ${trxId})।`,
          time: timeStr,
        },
      ],
      aiTransient: {
        active: true,
        text: `✓ Payment settled! Trx ID: ${trxId}. All dependencies cleared.`,
        step: 'Payment Settled',
        status: 'success',
      },
    }));

    showToast(`✓ Payment of ৳ 12,500 settled (Trx: ${trxId})`);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aiTransient: { active: false, text: '', status: 'idle' },
      }));
    }, 3500);
  }, [showToast]);


  const setActiveWorkspace = useCallback((ws: 'operations' | 'supply-chain' | 'finance' | 'hr' | 'projects') => {
    setState((prev) => ({ ...prev, activeWorkspace: ws }));
  }, []);

  const setSelectedDoc = useCallback((doc: CausalState['selectedDoc']) => {
    setState((prev) => ({ ...prev, selectedDoc: doc }));
  }, []);

  const downloadDocument = useCallback((doc: NonNullable<CausalState['selectedDoc']>) => {
    const content = `=======================================================
C-LINK REALITY PROTOCOL - OFFICIAL OPERATIONAL VOUCHER
=======================================================
Title: ${doc.title}
Reference: ${doc.refNumber}
Category: ${doc.category.toUpperCase()}
Date Issued: ${doc.date}
Verification Hash: ${doc.verificationHash}

ISSUED BY:
${doc.issuedBy}
Primary Supply & Sourcing Terminal, Dhaka

RECIPIENT:
${doc.recipient}
Gulshan-2 Central Office Terminal, Dhaka

ITEMS BREAKDOWN:
-------------------------------------------------------
${doc.items.map((it) => `${it.description.padEnd(30)} | Qty: ${it.qty.padEnd(8)} | Rate: ${it.rate.padEnd(10)} | Total: ${it.total}`).join('\n')}
-------------------------------------------------------
TOTAL CERTIFIED AMOUNT: ${doc.totalAmount}

STATUS: VERIFIED & CRYPTOGRAPHICALLY SEALED
Audit Note: ${doc.notes || 'Verified against C-Link live reality ledger.'}
=======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.filename.replace(/\.pdf$/, '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`✦ Downloaded official voucher: ${doc.filename}`);
  }, [showToast]);

  const switchOperation = useCallback((opId: string) => {
    setState((prev) => {
      const op = prev.operations.find((o) => o.id === opId);
      if (!op) return prev;

      if (opId === 'op-oil') {
        return {
          ...prev,
          activeOperationId: opId,
          want: {
            title: '100L Mustard Oil',
            quantity: 100,
            unit: 'L',
            target: 'Canteen Kitchen • Today, 8:00 PM',
            dueTime: 'Today, 8:00 PM',
            status: 'Active',
          },
          actors: {
            rahim: {
              ...prev.actors.rahim,
              name: 'Akram Agro Mills',
              role: 'Oil Processing & Mill',
              quantity: 60,
              unit: 'L',
              price: '৳ 12,000',
              status: 'COMMITTED',
              notes: 'Pure cold-pressed mustard oil in 5L food-grade cans.',
            },
            karim: {
              ...prev.actors.karim,
              name: 'Jamal Oil Traders',
              role: 'Edible Oil Depot',
              quantity: 40,
              unit: 'L',
              price: '৳ 8,400',
              status: 'OFFERED',
              notes: 'Demra river terminal depot stock.',
            },
            mina: {
              ...prev.actors.mina,
              name: 'Mina Backup Sourcing',
              role: 'Standby Reserve Hub',
              quantity: 25,
              unit: 'L',
              price: '৳ 5,500',
              status: 'POSSIBLE',
            },
          },
          coverage: {
            total: 100,
            covered: 60,
            unit: 'L',
            isFullyCovered: false,
          },
          dependencies: {
            transport: {
              ...prev.dependencies.transport,
              status: 'BLOCKED',
              detail: 'Requires covered tanker van for 100L oil',
            },
            delivery: {
              ...prev.dependencies.delivery,
              detail: '100L Oil to Canteen Kitchen',
            },
            proof: prev.dependencies.proof,
            payment: {
              ...prev.dependencies.payment,
              status: 'PENDING',
              totalAmount: '৳ 21,600',
            },
          },
        };
      } else if (opId === 'op-eggs') {
        return {
          ...prev,
          activeOperationId: opId,
          want: {
            title: '500 Dozen Organic Eggs',
            quantity: 500,
            unit: 'Dozen',
            target: 'Dhanmondi Branch • Tomorrow, 9:00 AM',
            dueTime: 'Tomorrow, 9:00 AM',
            status: 'Active',
          },
          actors: {
            rahim: {
              ...prev.actors.rahim,
              name: 'Savar Poultry Cluster',
              role: 'Primary Organic Farm',
              quantity: 350,
              unit: 'Dozen',
              price: '৳ 42,000',
              status: 'COMMITTED',
              notes: 'Grade-A brown organic farm eggs packaged in standard crates.',
            },
            karim: {
              ...prev.actors.karim,
              name: 'Gazipur Organic Farms',
              role: 'Poultry Supplier',
              quantity: 150,
              unit: 'Dozen',
              price: '৳ 18,500',
              status: 'OFFERED',
              notes: 'Ready for crate pickup tomorrow dawn.',
            },
            mina: {
              ...prev.actors.mina,
              name: 'Mina Emergency Reserve',
              role: 'Standby Buffer',
              quantity: 100,
              unit: 'Dozen',
              price: '৳ 12,000',
              status: 'POSSIBLE',
            },
          },
          coverage: {
            total: 500,
            covered: 350,
            unit: 'Dozen',
            isFullyCovered: false,
          },
          dependencies: {
            transport: {
              ...prev.dependencies.transport,
              status: 'BLOCKED',
              detail: 'Requires cushioned tray delivery van',
            },
            delivery: {
              ...prev.dependencies.delivery,
              detail: '500 Dozen to Dhanmondi Branch',
            },
            proof: prev.dependencies.proof,
            payment: {
              ...prev.dependencies.payment,
              status: 'PENDING',
              totalAmount: '৳ 63,000',
            },
          },
        };
      } else {
        // Switch back to Rice
        return {
          ...prev,
          activeOperationId: 'op-rice',
          want: INITIAL_STATE.want,
          actors: INITIAL_STATE.actors,
          coverage: INITIAL_STATE.coverage,
          dependencies: INITIAL_STATE.dependencies,
        };
      }
    });
    showToast(`✦ Switched to operation: ${opId}`);
  }, [showToast]);

  const createOperation = useCallback((data: CreateOperationData) => {
    const newId = 'op-' + Date.now();
    const newOp = {
      id: newId,
      title: `${data.quantity}${data.unit} ${data.title}`,
      category: 'Custom Demand Requirement',
      quantity: data.quantity,
      unit: data.unit,
      target: `${data.target} • ${data.dueTime}`,
      dueTime: data.dueTime,
      status: 'Active' as const,
      coveragePercent: Math.round((data.actor1Qty / data.quantity) * 100),
    };

    setState((prev) => ({
      ...prev,
      operations: [newOp, ...prev.operations],
      activeOperationId: newId,
      activeWorkspace: 'operations',
      want: {
        title: `${data.quantity}${data.unit} ${data.title}`,
        quantity: data.quantity,
        unit: data.unit,
        target: `${data.target} • ${data.dueTime}`,
        dueTime: data.dueTime,
        status: 'Active',
      },
      actors: {
        rahim: {
          ...prev.actors.rahim,
          name: data.actor1Name,
          quantity: data.actor1Qty,
          unit: data.unit,
          price: data.actor1Price,
          status: 'COMMITTED',
          notes: `Committed ${data.actor1Qty} ${data.unit} for ${data.title}.`,
        },
        karim: {
          ...prev.actors.karim,
          name: data.actor2Name || 'Secondary Supplier',
          quantity: data.actor2Qty || Math.max(0, data.quantity - data.actor1Qty),
          unit: data.unit,
          price: data.actor2Price || '৳ 2,000',
          status: 'OFFERED',
          notes: `Offered remaining buffer for ${data.title}.`,
        },
        mina: {
          ...prev.actors.mina,
          name: 'Mina Backup Sourcing',
          quantity: Math.round(data.quantity * 0.2),
          unit: data.unit,
          price: '৳ 1,500',
          status: 'POSSIBLE',
        },
      },
      coverage: {
        total: data.quantity,
        covered: data.actor1Qty,
        unit: data.unit,
        isFullyCovered: data.actor1Qty >= data.quantity,
      },
      dependencies: {
        transport: {
          ...prev.dependencies.transport,
          status: 'BLOCKED',
          detail: `Vehicle dispatch needed for ${data.title}`,
        },
        delivery: {
          ...prev.dependencies.delivery,
          detail: `${data.quantity}${data.unit} to ${data.target}`,
        },
        proof: prev.dependencies.proof,
        payment: {
          ...prev.dependencies.payment,
          status: 'PENDING',
          totalAmount: data.actor1Price,
        },
      },
      timelineEvents: [
        {
          id: `evt-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `New Reality Created: ${data.quantity}${data.unit} ${data.title}`,
          subtitle: `Target: ${data.target} • Due: ${data.dueTime}`,
          type: 'want',
          actor: 'User',
          provenance: 'Manual Causal Materialization',
        },
        ...prev.timelineEvents,
      ],
      aiTransient: {
        active: true,
        text: `✦ Materialized new Causal Reality: ${data.quantity}${data.unit} ${data.title}`,
        step: 'Graph Materialized',
        status: 'success',
      },
    }));

    showToast(`✓ Created new reality: ${data.quantity}${data.unit} ${data.title}`);
  }, [showToast]);

  // Send Chat Message with Backend API & Deep Fallback
  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: CausalChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      time: timeStr,
    };

    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMsg],
      aiTransient: {
        active: true,
        text: '✦ Analyzing intent and inspecting causal reality graph...',
        step: 'C-Link Engine',
        status: 'thinking',
      },
    }));

    let aiReply = '';
    let autoAction: (() => void) | null = null;
    let transientNote = '✓ Reality updated based on semantic intent';

    // 1. Attempt server AI call
    try {
      const res = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentReality: {
            want: state.want,
            actors: state.actors,
            coverage: state.coverage,
            dependencies: state.dependencies,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          aiReply = data.response;
          if (data.transientObservation) {
            transientNote = data.transientObservation;
          }

          if (data.semanticAction?.type === 'ACCEPT_COMMITMENT') {
            autoAction = () => acceptKarim();
          } else if (data.semanticAction?.type === 'ASSIGN_DRIVER') {
            autoAction = () => assignDriver('Tariq', '৳ 800');
          } else if (data.semanticAction?.type === 'PROCESS_PAYMENT') {
            autoAction = () => processPayment();
          } else if (data.semanticAction?.type === 'ASK_ACTOR') {
            autoAction = () => askKarim();
          } else if (data.semanticAction?.type === 'CONFIRM_DELIVERY') {
            autoAction = () => confirmDelivery();
          }
        }
      }
    } catch {
      // Fallback
    }

    // 2. Comprehensive local knowledge engine if no server response
    if (!aiReply) {
      const lower = text.toLowerCase();

      // Contact queries
      if (lower.includes('রহিম') && (lower.includes('ফোন') || lower.includes('নম্বর') || lower.includes('phone') || lower.includes('contact') || lower.includes('নাম্বার'))) {
        aiReply = '📞 রহিম উদ্দিনের (কৃষক/সরবরাহকারী) ফোন নম্বর: 01711-234567। তিনি শেরপুর থেকে ৩০ কেজি মিনিকেট চাল কনফার্ম করেছেন।';
      } else if (lower.includes('করিম') && (lower.includes('ফোন') || lower.includes('নম্বর') || lower.includes('phone') || lower.includes('contact') || lower.includes('নাম্বার'))) {
        aiReply = '📞 করিম আহমেদের (মিলার) ফোন নম্বর: 01819-876543। তিনি মিরপুর মিল নং ৪ এর দায়িত্বে আছেন এবং ২০ কেজি চাল অফার করেছেন।';
      } else if (lower.includes('মিনা') && (lower.includes('ফোন') || lower.includes('নম্বর') || lower.includes('phone') || lower.includes('contact') || lower.includes('নাম্বার'))) {
        aiReply = '📞 মিনা সোর্সিং হাবের ফোন নম্বর: 01912-345678। তিনি কাওরান বাজারে ১৫ কেজি বাফার স্টক নিয়ে স্ট্যান্ডবাই আছেন।';
      } else if ((lower.includes('ড্রাইভার') || lower.includes('তারিক')) && (lower.includes('ফোন') || lower.includes('নম্বর') || lower.includes('phone') || lower.includes('contact') || lower.includes('নাম্বার'))) {
        aiReply = '📞 ড্রাইভার তারিক আল-আমিনের ফোন নম্বর: 01611-998877। গাড়ি: কাভার্ড ভ্যান (DHAKA-METRO-TA 11-4029), পিকআপ চার্জ ৳৮০০।';
      }
      // Status & blockers
      else if (lower.includes('অবস্থা') || lower.includes('status') || lower.includes('সমস্যা') || lower.includes('block') || lower.includes('ঘাটতি')) {
        aiReply = `আজকের রিকোয়ারমেন্ট: ${state.want.title}। বর্তমান কভারেজ: ${state.coverage.covered} / ${state.coverage.total}${state.coverage.unit} (${state.coverage.isFullyCovered ? '১০০%' : '৬০%'})। রহিম ৩০ কেজি নিশ্চিত করেছেন। প্রধান ব্লকার: পরিবহন ড্রাইভার এখনও চূড়ান্ত হয়নি।`;
      }
      // Price & Payment
      else if (lower.includes('টাকা') || lower.includes('খরচ') || lower.includes('পেমেন্ট') || lower.includes('বিল') || lower.includes('cost') || lower.includes('price')) {
        aiReply = '💰 আজকের মোট হিসাব: রহিম পাবেন ৳৩,৬০০ (৩০ কেজি চাল), করিম পাবেন ৳২,৪০০ (২০ কেজি চাল), এবং ড্রাইভার তারিক পাবেন ৳৮০০। মোট প্রাক্কলিত খরচ ৳১২,৫০০ (কোম্পানি এসক্রো বাজেট)।';
      }
      // Direct semantic actions
      else if (lower.includes('karim') && (lower.includes('accept') || lower.includes('গ্রহণ') || lower.includes('নাও') || lower.includes('agree'))) {
        aiReply = '✓ করিমের ২০ কেজি চালের প্রস্তাব গ্রহণ করা হয়েছে। চালের চাহিদা ১০০% পূরণ হয়েছে। এখন ড্রাইভার তারিককে পিকআপের জন্য বুক করতে পারেন।';
        autoAction = () => acceptKarim();
      } else if (lower.includes('karim') && (lower.includes('decline') || lower.includes('বাতিল') || lower.includes('বাদ') || lower.includes('reject'))) {
        aiReply = '⚠️ করিমের প্রস্তাব বাতিল করা হয়েছে। ফলে ২০ কেজি ঘাটতি সৃষ্টি হয়েছে এবং ব্যাকআপ সাপ্লায়ার মিনা সক্রিয় হয়েছে।';
        autoAction = () => declineKarim();
      } else if (lower.includes('driver') || lower.includes('ড্রাইভার') || lower.includes('transport') || lower.includes('গাড়ি') || lower.includes('তারিক')) {
        aiReply = '✓ ড্রাইভার তারিক (৳৮০০) বুক করা হয়েছে। কাভার্ড ভ্যান বিকেল ৪:৩০ এ পিকআপ শুরু করবে।';
        autoAction = () => assignDriver('Tariq', '৳ 800');
      } else if (lower.includes('pay') || lower.includes('পেমেন্ট পরিশোধ') || lower.includes('পরিশোধ')) {
        aiReply = '✓ bKash Corporate এর মাধ্যমে বকেয়া বিল পরিশোধের প্রক্রিয়া সম্পন্ন করা হয়েছে।';
        autoAction = () => processPayment();
      } else if (lower.includes('delivery') || lower.includes('ডেলিভারি') || lower.includes('পৌঁছে')) {
        aiReply = '✓ ডেলিভারি কনফার্মেশন ও ওজন স্লিপ যাচাই করে চাহিদা সম্পন্ন হিসেবে রেকর্ড করা হয়েছে।';
        autoAction = () => confirmDelivery();
      } else {
        aiReply = `আমি আপনার নির্দেশ "${text}" গ্রহণ করেছি। আপনি সরাসরি ফোন নম্বর জানতে চাইতে পারেন (যেমন: "রহিমের ফোন কত?"), করিমের প্রস্তাব গ্রহণ করতে পারেন ("Karim গ্রহণ করো"), অথবা ড্রাইভার বুক করতে পারেন ("ড্রাইভার তারিক বুক করো")।`;
      }
    }

    setState((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      aiTransient: {
        active: true,
        text: transientNote,
        step: 'Reality Mutated',
        status: 'success',
      },
    }));

    if (autoAction) {
      autoAction();
    }

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aiTransient: { active: false, text: '', status: 'idle' },
      }));
    }, 3500);
  }, [state.want, state.actors, state.coverage, state.dependencies, acceptKarim, declineKarim, assignDriver, processPayment, confirmDelivery, askKarim]);

  // Apply Canonical Scenario
  const applyScenario = useCallback((scenarioNumber: number) => {
    setState((prev) => {
      const next = { ...prev, activeScenarioId: scenarioNumber };
      switch (scenarioNumber) {
        case 1: // Initial Living Board
          return {
            ...INITIAL_STATE,
            activeScenarioId: 1,
          };
        case 2: // User Types a Message
          return {
            ...INITIAL_STATE,
            activeScenarioId: 2,
            chatMessages: [
              ...INITIAL_STATE.chatMessages,
              {
                id: 'msg-s2',
                sender: 'user',
                text: 'আজকের important কাজের কী অবস্থা? কী সমস্যা?',
                time: '11:15 AM',
              },
            ],
          };
        case 3: // AI Interpreting
          return {
            ...INITIAL_STATE,
            activeScenarioId: 3,
            aiTransient: {
              active: true,
              text: '✦ Detecting intent • Finding relevant context • Preparing causal response',
              step: 'Interpreting',
              status: 'thinking',
            },
          };
        case 4: // AI Response Projection
          return {
            ...INITIAL_STATE,
            activeScenarioId: 4,
            selectedNodeId: 'karim',
          };
        case 5: // Explore specific issue: Transport Blocked
          return {
            ...INITIAL_STATE,
            activeScenarioId: 5,
            selectedNodeId: 'transport',
          };
        case 6: // AI Finds Options
          return {
            ...INITIAL_STATE,
            activeScenarioId: 6,
            selectedNodeId: 'karim',
          };
        case 7: // View Actor Details
          return {
            ...INITIAL_STATE,
            activeScenarioId: 7,
            selectedNodeId: 'karim',
          };
        case 8: // Karim Responds
          return {
            ...INITIAL_STATE,
            activeScenarioId: 8,
            actors: {
              ...INITIAL_STATE.actors,
              karim: {
                ...INITIAL_STATE.actors.karim,
                status: 'OFFERED',
                notes: 'Karim: "I have 20kg available @ ৳2,400 ready for immediate pickup."',
              },
            },
          };
        case 9: // Accept Commitment
          return {
            ...INITIAL_STATE,
            activeScenarioId: 9,
            selectedNodeId: 'karim',
          };
        case 10: // Reality Updated
          return {
            ...INITIAL_STATE,
            activeScenarioId: 10,
            actors: {
              ...INITIAL_STATE.actors,
              karim: {
                ...INITIAL_STATE.actors.karim,
                status: 'COMMITTED',
              },
            },
            coverage: {
              total: 50,
              covered: 50,
              unit: 'kg',
              isFullyCovered: true,
            },
          };
        case 11: // Ask what's next (Transport prompt)
          return {
            ...INITIAL_STATE,
            activeScenarioId: 11,
            actors: {
              ...INITIAL_STATE.actors,
              karim: { ...INITIAL_STATE.actors.karim, status: 'COMMITTED' },
            },
            coverage: { total: 50, covered: 50, unit: 'kg', isFullyCovered: true },
            selectedNodeId: 'transport',
          };
        case 12: // Full Causal View
          return {
            ...INITIAL_STATE,
            activeScenarioId: 12,
            activeTab: 'living',
          };
        case 13: // Timeline / History
          return {
            ...INITIAL_STATE,
            activeScenarioId: 13,
            activeTab: 'timeline',
          };
        case 14: // Harsh Moment: Actor Decline
          return {
            ...INITIAL_STATE,
            activeScenarioId: 14,
            actors: {
              ...INITIAL_STATE.actors,
              karim: { ...INITIAL_STATE.actors.karim, status: 'DECLINED' },
            },
            coverage: { total: 50, covered: 30, unit: 'kg', isFullyCovered: false },
            selectedNodeId: 'karim',
          };
        case 15: // Compact View (All Done)
          return {
            ...INITIAL_STATE,
            activeScenarioId: 15,
            actors: {
              ...INITIAL_STATE.actors,
              karim: { ...INITIAL_STATE.actors.karim, status: 'COMMITTED' },
            },
            coverage: { total: 50, covered: 50, unit: 'kg', isFullyCovered: true },
            dependencies: {
              transport: { ...INITIAL_STATE.dependencies.transport, status: 'SCHEDULED' },
              delivery: { ...INITIAL_STATE.dependencies.delivery, status: 'DELIVERED' },
              proof: { ...INITIAL_STATE.dependencies.proof, status: 'VERIFIED' },
              payment: { ...INITIAL_STATE.dependencies.payment, status: 'PAID' },
            },
            want: { ...INITIAL_STATE.want, status: 'Completed' },
          };
        default:
          return next;
      }
    });
    showToast(`✦ Switched to Canonical Scenario ${scenarioNumber}`);
  }, [showToast]);

  const resetAll = useCallback(() => {
    setState(INITIAL_STATE);
    showToast('✦ Workspace state reset to initial reality');
  }, [showToast]);

  const dispatchSemanticAction = useCallback((action: SemanticAction): RealityObject | undefined => {
    let affectedObj: RealityObject | undefined;
    setState((prev) => {
      const updatedGraph = reduceReality(prev.graph, action);
      if (action.targetId) {
        affectedObj = updatedGraph.objects.find((o) => o.id === action.targetId);
      } else if (action.targetActorName) {
        affectedObj = updatedGraph.objects.find((o) =>
          o.title.toLowerCase().includes(action.targetActorName!.toLowerCase())
        );
      } else if (action.type === 'CREATE_WANT') {
        affectedObj = updatedGraph.objects.find((o) => o.kind === 'WANT');
      } else if (action.type === 'IDENTIFY_GAP') {
        affectedObj = updatedGraph.objects.find((o) => o.kind === 'GAP');
      } else {
        affectedObj = updatedGraph.objects[updatedGraph.objects.length - 1];
      }
      return {
        ...prev,
        graph: updatedGraph,
        selectedNodeId: affectedObj
          ? affectedObj.id.includes('karim')
            ? 'karim'
            : affectedObj.id.includes('rahim')
            ? 'rahim'
            : affectedObj.id.includes('transport')
            ? 'transport'
            : affectedObj.id
          : prev.selectedNodeId,
      };
    });
    return affectedObj;
  }, []);

  const handleCardAction = useCallback(
    (actionName: string, objectId: string) => {
      const act = actionName.toLowerCase();
      if (act.includes('accept') || act.includes('গ্রহণ')) {
        acceptKarim();
      } else if (act.includes('decline') || act.includes('reject') || act.includes('বাতিল')) {
        declineKarim();
      } else if (act.includes('ask') || act.includes('জিজ্ঞেস')) {
        askKarim();
      } else if (
        act.includes('driver') ||
        act.includes('tariq') ||
        act.includes('assign') ||
        act.includes('তারিক')
      ) {
        assignDriver('Tariq', '৳ 800');
      } else if (
        act.includes('confirm') ||
        act.includes('delivery') ||
        act.includes('gate') ||
        act.includes('ডেলিভারি')
      ) {
        confirmDelivery();
      } else if (
        act.includes('pay') ||
        act.includes('settle') ||
        act.includes('পেমেন্ট') ||
        act.includes('টাকা')
      ) {
        processPayment();
      } else if (act.includes('next') || act.includes('পরবর্তী')) {
        dispatchSemanticAction({ type: 'SHOW_NEXT' });
        showToast('✦ Reframed Living Board to next unresolved dependency');
      } else if (act.includes('find') || act.includes('candidate') || act.includes('খোঁজ')) {
        dispatchSemanticAction({
          type: 'FIND_CANDIDATES',
          targetId: objectId,
          payload: {
            candidates: [
              {
                name: 'Karim (Mill No. 4)',
                quantity: 20,
                unit: 'kg',
                state: 'OFFERED',
                message: 'Karim offered 20kg @ ৳2,400',
              },
              {
                name: 'Mina (Sourcing Hub)',
                quantity: 15,
                unit: 'kg',
                state: 'POSSIBLE',
                message: 'Mina standby buffer',
              },
            ],
          },
        });
        showToast('✦ Discovered suppliers: Karim & Mina');
      } else {
        showToast(`✦ Action executed: ${actionName}`);
      }
    },
    [
      acceptKarim,
      declineKarim,
      askKarim,
      assignDriver,
      confirmDelivery,
      processPayment,
      dispatchSemanticAction,
      showToast,
    ]
  );

  return (
    <CausalContext.Provider
      value={{
        state,
        setSelectedNode,
        setActiveTab,
        setActiveWorkspace,
        setSearchQuery,
        showToast,
        askKarim,
        acceptKarim,
        declineKarim,
        assignDriver,
        confirmDelivery,
        processPayment,
        sendChatMessage,
        applyScenario,
        resetAll,
        createOperation,
        switchOperation,
        setSelectedDoc,
        downloadDocument,
        dispatchSemanticAction,
        handleCardAction,
      }}
    >
      {children}
    </CausalContext.Provider>
  );
}

export function useCausalState() {
  const ctx = useContext(CausalContext);
  if (!ctx) {
    throw new Error('useCausalState must be used within a CausalProvider');
  }
  return ctx;
}
