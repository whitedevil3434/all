import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  History, 
  ChevronLeft,
  ChevronRight,
  AlertTriangle, 
  Camera, 
  CheckCircle2, 
  User,
  Clock,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Loader2,
  X,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  Sliders,
  CheckCircle,
  Truck,
  Package,
  Plus,
  GitFork,
  Network,
  Maximize2,
  FileText,
  Wallet,
  Bot,
  Share2,
  HelpCircle,
  ShieldCheck,
  Handshake
} from 'lucide-react';
import { DraftIntent } from '../engine/firebase-engine';
import { SpatialTreeProjection } from './SpatialTreeProjection';
import { SCENARIO_PRESETS, ScenarioPreset } from '../data/journeyScenarios';
import { PhysicalProofModal } from './PhysicalProofModal';
import { LiveRouteTrackerModal } from './LiveRouteTrackerModal';
import { SettlementCertificateModal } from './SettlementCertificateModal';
import { EscrowTrackerModal } from './EscrowTrackerModal';
import { DocumentViewerModal, OperationalDocument } from './DocumentViewerModal';
import { ShareableCLinkModal } from './ShareableCLinkModal';
import { ActorDiscoveryDrawer } from './ActorDiscoveryDrawer';
import { AgentAuthorityModal } from './agent/AgentAuthorityModal';
import { WhileAwayInboxModal } from './agent/WhileAwayInboxModal';
import { AgentWhyInspectorModal } from './agent/AgentWhyInspectorModal';
import { AutonomousNegotiationDock } from './agent/AutonomousNegotiationDock';
import {
  AuthorityManifest,
  DEFAULT_KARIM_BUYER_AGENT,
  DEFAULT_LITON_SELLER_AGENT,
  AgentDecisionTrace
} from '../engine/agent/ActorAgentEngine';
import {
  IsometricCubeIcon,
  BagIcon,
  AvatarOutlineIcon,
  ShieldOutlineIcon,
  HandshakeIcon,
  DeliveryVanIcon,
  FrontierFlagIcon,
  BellWeightIcon,
  OutlineClockIcon,
  CausalDownArrow,
  RiceBowlGraphic
} from './CausalIcons';

interface CausalBentoRealitySurfaceProps {
  activeWorkId: string | null;
  setActiveWorkId: (id: string) => void;
  worksList: any[];
  intents: any[];
  needs: any[];
  capabilities: any[];
  actors: any[];
  gaps: any[];
  commitments: any[];
  responsibilities: any[];
  evidences: any[];
  events: any[];
  relations: any[];
  draftIntents: DraftIntent[];
  onAction: (action: string, value?: any) => Promise<void>;
  aiResponse: string | null;
  isProcessing: boolean;
  onOpenLedger: () => void;
  onPromoteDraft: (draft: DraftIntent) => Promise<void>;
  currentUserRole?: 'OWNER' | 'ACTOR';
  setCurrentUserRole?: (role: 'OWNER' | 'ACTOR') => void;
  globalActors?: any[];
  currentActorId?: string | null;
  setCurrentActorId?: (id: string | null) => void;
}

// Conversation turn type matching C-Link's Semantic Grammar
export interface CausalMessage {
  id: string;
  sender: 'user' | 'clink' | 'actor' | 'agent' | 'sensor';
  actorName?: string;
  actorRole?: string;
  epistemicType?: 'STATED' | 'OBSERVED' | 'PROVEN' | 'AGENT_DELEGATED';
  agentAuthority?: {
    search: boolean;
    compare: boolean;
    recommend: boolean;
    commit: boolean;
  };
  text: string;
  responseType?: 'ANSWER' | 'QUESTION' | 'PROPOSAL' | 'ACTION' | 'CLARIFICATION' | 'CHOICE' | 'EXPLAIN' | 'DELTA' | 'SILENCE';
  choices?: { label: string; action: string; value?: any }[];
  timestamp: string;
  semanticTrace?: {
    actorAction: string;
    capabilityImpact: string;
    affects: string;
    currentReality: string;
  };
  whyPerson?: {
    personName: string;
    need: string;
    capability: string;
    reason: string;
  };
  materializedComponent?: 
    | 'WANT_CARD' 
    | 'COMMITMENT_CARD' 
    | 'TRANSPORT_CARD' 
    | 'PROOF_CARD' 
    | 'OUTCOME_CARD'
    | 'APPOINTMENT_CARD'
    | 'SPLIT_CARD'
    | 'DELTA_CARD'
    | 'EXPLAIN_CARD'
    | 'DELEGATE_CARD'
    | 'SILENCE_CARD'
    | 'CONFLICT_CARD'
    | 'CONSTRAINT_CARD'
    | 'CATCHUP_CARD'
    | 'WHAT_IF_CARD'
    | 'TRANSIT_CARD'
    | 'EPISTEMIC_CARD';
  dockedCausalCard?: {
    kind: string;
    label: string;
    value: string;
    status: string;
  };
  causalExplanation?: {
    title: string;
    whyHere: string;
    chain: string[];
  };
  splitDetails?: {
    committedActor: string;
    committedAmount: string;
    remainingAmount: string;
    status: string;
  };
  deltaItems?: { status: 'POSITIVE' | 'WARNING' | 'NEUTRAL'; text: string }[];
  conflictDetails?: {
    supplierTime: string;
    driverTime: string;
    requiredTime: string;
    summary: string;
  };
  constraintDetails?: {
    type: string;
    value: string;
    impact: string;
    evaluations: { candidate: string; status: 'MET' | 'EXCEEDED' | 'PENDING'; note: string }[];
  };
  catchupDetails?: {
    totalEvents: number;
    resolvedGaps: number;
    pendingDecisions: number;
    stages: { stage: string; summary: string; settled: boolean }[];
  };
  whatIfDetails?: {
    question: string;
    branchA: { title: string; cost: string; time: string; coordination: string; risk: string; action: string };
    branchB: { title: string; cost: string; time: string; coordination: string; risk: string; action: string };
    branchC?: { title: string; cost: string; time: string; coordination: string; risk: string; action: string };
  };
  transitDetails?: {
    driverName: string;
    vehicle: string;
    pickupLocation: string;
    currentLocation: string;
    destination: string;
    speed: string;
    eta: string;
    condition: 'OPTIMAL' | 'CONGESTED' | 'DELAYED';
    conditionNote: string;
    gpsTimestamp: string;
  };
  epistemicDetails?: {
    actorName: string;
    capability: string;
    statedClaim: string;
    sensorProof: string;
    reputationScore: string;
    epistemicLevel: 'STATED' | 'OBSERVED' | 'PROVEN';
    auditProofHash: string;
  };
}

// The 5 semantic questions of the entry carousel
const SEMANTIC_CAROUSEL_QUESTIONS = [
  {
    id: 'desire',
    question: 'What is your desire?',
    hint: 'মানুষ প্রথমে বলে সে কী ঘটাতে চায়',
    sample: 'কাল আমার রেস্টুরেন্টের জন্য ৫০ কেজি চাল লাগবে।'
  },
  {
    id: 'must_be_true',
    question: 'What must be true?',
    hint: 'এই ইচ্ছা পূরণ হতে বাস্তবতায় কী কী সত্য হতে হবে',
    sample: '৫০ কেজি চাল মানসম্মত হতে হবে এবং কাল সকাল ১০টায় উত্তরায় পৌঁছাতে হবে।'
  },
  {
    id: 'can_do_yourself',
    question: 'What can you do yourself?',
    hint: 'আপনি নিজে কী করবেন আর অন্যের ওপর কীসের নির্ভরতা',
    sample: 'আমি রান্নাঘরে চালান গ্রহণ করব এবং ক্যাশ/ট্রান্সফারে পেমেন্ট করব।'
  },
  {
    id: 'who_might_help',
    question: 'Who or what might help?',
    hint: 'কোন কোন অ্যাক্টরের সক্ষমতা প্রয়োজন',
    sample: 'Rahim Foods চাল সরবরাহ করবে এবং কোনো ডেলিভারি ভ্যান পরিবহন করবে।'
  },
  {
    id: 'success_outcome',
    question: 'What would success look like?',
    hint: 'চূড়ান্ত নিষ্পত্তির প্রমাণ ও লক্ষণ কী',
    sample: 'সঠিক ৫০ কেজি চালের বস্তা ডিজিটাল স্কেলে সার্টিফাই হয়ে রান্নাঘরে পৌঁছানো।'
  }
];

const springTransition = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
  mass: 0.8
};

// Subtle Web Audio Synthesizer for high-fidelity sensory feedback
const playHapticTone = (freq1: number, freq2: number, duration: number = 0.25) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq1, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + duration * 0.7);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

const DEFAULT_CHALLAN_DOC: OperationalDocument = {
  id: 'doc-ch-4921',
  title: 'Commercial Delivery Challan & Dispatch Certificate',
  filename: 'CHALLAN-2026-09-50KG-RICE.pdf',
  category: 'challan',
  size: '184 KB',
  date: '24 Sep 2026, 10:30 AM',
  refNumber: 'CHN-DHK-88912',
  issuedBy: 'Rahim Foods & Alim Farms Agro Consortium',
  recipient: 'Uttara Supershop & Kitchen, Sector 4, Dhaka',
  items: [
    { description: 'Premium Nazirshail Rice (New Harvest, 50kg sack)', qty: '50.0 kg', rate: '৳ 615 / kg', total: '৳ 30,750' },
    { description: 'Refrigerated Covered Van Transit (HiAce DHK-4421)', qty: '1 trip', rate: '৳ 800', total: '৳ 800' }
  ],
  totalAmount: '৳ 31,550',
  verificationHash: '0x9d4a...77b1e8 (Hardware Observed Signature)',
  notes: 'Certified by Digital Dual-Key Weighbridge (Load cell reading: 50.02kg)'
};

export const CausalBentoRealitySurface: React.FC<CausalBentoRealitySurfaceProps> = ({
  activeWorkId,
  setActiveWorkId,
  worksList,
  intents,
  needs,
  capabilities = [],
  actors,
  gaps,
  commitments,
  responsibilities = [],
  evidences,
  events = [],
  relations = [],
  draftIntents,
  onAction,
  aiResponse,
  isProcessing,
  onOpenLedger
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carousel index for the initial Desire Composer
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Has the user initiated a desire? (If false -> shows First Screen: Pure Desire Composer + Carousel)
  const [isDesireInitiated, setIsDesireInitiated] = useState(false);

  // Living conversation history (C-Link runtime)
  const [messages, setMessages] = useState<CausalMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'কাল আমার রেস্টুরেন্টের জন্য ৫০ কেজি চাল লাগবে।',
      timestamp: 'Yesterday 10:14 PM'
    },
    {
      id: 'msg-2',
      sender: 'clink',
      text: 'বুঝেছি। কাল ৫০ কেজি চাল দরকার।',
      responseType: 'ANSWER',
      timestamp: 'Yesterday 10:14 PM',
      materializedComponent: 'WANT_CARD'
    },
    {
      id: 'msg-3',
      sender: 'user',
      text: 'Rahim Foods পারবে মনে হয়। ওদের জিজ্ঞেস করো।',
      timestamp: 'Yesterday 10:15 PM'
    },
    {
      id: 'msg-4',
      sender: 'actor',
      actorName: 'Rahim Foods',
      actorRole: 'Supplier',
      text: 'হ্যাঁ ভাই, কাল সকালের মধ্যে ৫০ কেজি নাজিরশাইল চাল প্রস্তুত রাখতে পারব।',
      timestamp: 'Yesterday 10:17 PM',
      materializedComponent: 'COMMITMENT_CARD'
    }
  ]);

  // Proof studio states
  const [proofPhotoPreview, setProofPhotoPreview] = useState<string | null>(null);
  const [proofWeightKg, setProofWeightKg] = useState<number>(50.0);
  const [isScaleVerified, setIsScaleVerified] = useState(false);
  const [overrideDriverAssigned, setOverrideDriverAssigned] = useState(false);
  const [overrideRealitySettled, setOverrideRealitySettled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Projection Mode: 'SPATIAL_TREE' (Pristine view like IMG_0359), 'UNIFIED', or 'STREAM'
  const [projectionMode, setProjectionMode] = useState<'UNIFIED' | 'SPATIAL_TREE' | 'STREAM'>('SPATIAL_TREE');
  const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false);

  // Active docked Causal Node from Spatial Tree
  const [activeDockedNode, setActiveDockedNode] = useState<{
    id: string;
    kind: string;
    label: string;
    value: string;
    status: string;
    metadata?: Record<string, string>;
    actionChoices?: { label: string; action: string }[];
  } | null>(null);

  // Master toggle for Spatial Tree Projection via C-LINK logo
  const [isSpatialTreeVisible, setIsSpatialTreeVisible] = useState(true);

  // Dynamic Living Scenario: 'RICE_CONSIGNMENT' | 'WEDDING' | 'HOSPITAL_VISIT'
  const [activeScenario, setActiveScenario] = useState<'RICE_CONSIGNMENT' | 'WEDDING' | 'HOSPITAL_VISIT'>('RICE_CONSIGNMENT');

  // Hospital Visit scenario live state
  const [hospitalState, setHospitalState] = useState<{
    appointmentStatus: 'WAITING' | 'COMMITTED' | 'ACCEPTED';
    transportStatus: 'WAITING' | 'COMMITTED' | 'ACCEPTED';
    accompanyStatus: 'PENDING' | 'ACCEPTED';
    appointmentSlot?: string;
    driverName?: string;
  }>({
    appointmentStatus: 'WAITING',
    transportStatus: 'WAITING',
    accompanyStatus: 'PENDING'
  });

  // Split Fulfillment state (Counter-proposal: Liton 30kg + other supplier 20kg)
  const [splitFulfillment, setSplitFulfillment] = useState<{
    isSplit: boolean;
    primarySupplier: { name: string; amountKg: number; status: string };
    secondaryNeed: { amountKg: number; status: string };
  } | null>(null);

  // Causal Explainability Drawer / Sheet Data ("Why am I seeing this?")
  const [activeExplainData, setActiveExplainData] = useState<{
    title: string;
    whyHere: string;
    causalChain: string[];
    actorRole?: string;
  } | null>(null);

  // Reality Inbox Drawer ("What materially changed in reality")
  const [isRealityInboxOpen, setIsRealityInboxOpen] = useState(false);

  // Living Contract Versioning (Version 1 -> Version 2 on requirement changes)
  const [contractVersion, setContractVersion] = useState<number>(1);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Active Multi-Actor Persona for Universal Group Composer
  const [activePersona, setActivePersona] = useState<'KARIM' | 'LITON' | 'RAHIM' | 'AGENT' | 'SENSOR'>('KARIM');

  // Attention-only filter for pure causal focus (Principle #13)
  const [isAttentionOnlyFilterActive, setIsAttentionOnlyFilterActive] = useState(false);

  // Living constraints registered via natural language ("Say it naturally")
  const [registeredConstraints, setRegisteredConstraints] = useState<{
    budgetMax?: number;
    deadline?: string;
    qualitySpec?: string;
  }>({
    budgetMax: 10000,
    deadline: 'Tomorrow 10:00 AM'
  });

  // End-to-End Reality Modals & Causal Simulation
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);

  // OathLink Persistent Actor Agent States
  const [buyerAgentPolicy, setBuyerAgentPolicy] = useState<AuthorityManifest>(DEFAULT_KARIM_BUYER_AGENT);
  const [sellerAgentPolicy, setSellerAgentPolicy] = useState<AuthorityManifest>(DEFAULT_LITON_SELLER_AGENT);
  const [isAgentAuthorityModalOpen, setIsAgentAuthorityModalOpen] = useState(false);
  const [isWhileAwayModalOpen, setIsWhileAwayModalOpen] = useState(false);
  const [isNegotiationDockOpen, setIsNegotiationDockOpen] = useState(false);
  const [selectedWhyTrace, setSelectedWhyTrace] = useState<AgentDecisionTrace | null>(null);

  // Unwired Core Modals States
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [activeOperationalDoc, setActiveOperationalDoc] = useState<OperationalDocument | null>(null);
  const [isShareCLinkModalOpen, setIsShareCLinkModalOpen] = useState(false);
  const [isActorDiscoveryOpen, setIsActorDiscoveryOpen] = useState(false);
  const [activeEpistemicModalData, setActiveEpistemicModalData] = useState<{
    actorName: string;
    capability: string;
    statedClaim: string;
    sensorProof: string;
    reputationScore: string;
    epistemicLevel: 'STATED' | 'OBSERVED' | 'PROVEN';
    auditProofHash: string;
  } | null>(null);
  const [activeWhatIfSimulation, setActiveWhatIfSimulation] = useState<any | null>(null);

  // Track expanded semantic traces per message
  const [expandedTraceMessageIds, setExpandedTraceMessageIds] = useState<Record<string, boolean>>({});

  const toggleSemanticTrace = (msgId: string) => {
    setExpandedTraceMessageIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
    playHapticTone(500, 620, 0.1);
  };

  // Real-time suggested contextual action for docked causal card
  const getSuggestedActionText = (node: any) => {
    if (!node) return '';
    const label = node.label?.toUpperCase() || '';
    const id = node.id || '';
    
    // Hospital Scenario Nodes
    if (label === 'APPOINTMENT' || id.includes('appointment')) {
      return hospitalState.appointmentStatus === 'COMMITTED'
        ? `Dr. Shamsul Alam-এর সাথে ${hospitalState.appointmentSlot || '9:30 AM'} স্লট নিশ্চিত হয়েছে। পরবর্তী কন্ডিশন: ট্রান্সপোর্টেশন।`
        : 'Evercare Hospital-এ ডক্টর শামসুল আলমের আগামীকাল সকাল ৯:৩০ অথবা ১১:০০-র স্লট চেক বা বুক করবেন?';
    }
    if (id.includes('hospital-transport')) {
      return hospitalState.transportStatus === 'COMMITTED'
        ? 'ড্রাইভার কবির মিয়া পিকআপের জন্য নির্ধারিত। প্রস্তুত থাকতে বলুন।'
        : 'বাবার চিকিৎসার জন্য হুইলচেয়ার-উপযোগী প্রাইভেট কার ও চালক নিশ্চিত করবেন?';
    }
    if (id.includes('prescriptions') || label === 'MEDICAL DOCS') {
      return 'পূর্ববর্তী প্রেসক্রিপশন ও ইসিজি রিপোর্ট ব্যাগে গুছিয়ে প্রস্তুত রাখবেন কি না জানান।';
    }

    // Wedding Scenario Nodes
    if (label === 'CATERING' || id.includes('catering')) {
      return 'Catering-এর জন্য Iqbal Caterers-কে মেনু সাইন-অফ ও বুকিংয়ের প্রস্তাব পাঠাব?';
    }
    if (label === 'VENUE' || id.includes('venue')) {
      return 'Sena Malancha কনভেনশন হলের বুকিং কনফার্ম অথবা স্লট পুনর্বিবেচনা করবেন?';
    }
    if (label === 'PARTE' || id.includes('parte')) {
      return 'উভয় পরিবারের সম্মতির শর্তাদি চূড়ান্ত হয়েছে কি না যাচাই করবেন?';
    }

    // Rice Consignment Nodes
    if (label === 'SUPPLIER' || id.includes('supplier')) {
      return 'Rahim Foods (Gazipur Mill)-কে ৫০ কেজি নাজিরশাইল চালের ডেলিভারি প্রস্তুত রাখতে জিজ্ঞেস করব?';
    }
    if (label === 'TRANSPORT' || id.includes('transport')) {
      return 'নতুন ড্রাইভার তারিক এম. (Toyota HiAce)-কে উত্তরায় ডেলিভারিতে অ্যাসাইন করবেন?';
    }
    if (label === 'DIGITAL SCALE' || id.includes('scale') || label === 'PROOF') {
      return 'উত্তরা গেটে ৫০.০ কেজি ডিজিটাল স্কেলের রসিদ বা লাইভ ছবি সংযুক্তি করবেন?';
    }
    return `${node.label} (${node.value}) সম্পর্কিত পরবর্তী কজাল অ্যাকশনটি নির্বাচন বা নির্দেশ করুন।`;
  };

  // Stepper / Execution inspection
  const [inspectedStepperStep, setInspectedStepperStep] = useState<string>('DISPATCH');

  // Reality context
  const rootNeed = needs[0] || intents[0];
  const isDriverAssigned = overrideDriverAssigned || actors.some(a => a.role === 'Driver' || (a.name && a.name.toLowerCase().includes('tariq')));
  const isProofSubmitted = evidences.length > 0 || isScaleVerified;
  const isRealitySettled = overrideRealitySettled || rootNeed?.status === 'RESOLVED' || rootNeed?.status === 'VERIFIED';

  // Automatically start with ongoing conversation if work exists
  useEffect(() => {
    if (activeWorkId || intents.length > 0 || needs.length > 0) {
      setIsDesireInitiated(true);
    }
  }, [activeWorkId, intents, needs]);

  // Scroll to bottom when conversation advances
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  // Web Speech API initialization (Bangla bn-BD with English fallback)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'bn-BD';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputText(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        speechRecognitionRef.current = recognition;
      } catch {
        speechRecognitionRef.current = null;
      }
    }
    return () => {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const handleToggleVoiceInput = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      if (inputText.trim()) {
        handleSendDesire(inputText.trim());
      }
    } else {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
          return;
        } catch {}
      }
      // Instant simulated voice capture if mic hardware unavailable
      const currentSample = SEMANTIC_CAROUSEL_QUESTIONS[carouselIndex].sample;
      setInputText(currentSample);
      playHapticTone(440, 600, 0.2);
    }
  };

  const handleSendDesire = async (text: string, attachedNode?: any) => {
    if (!text.trim() && !attachedNode) return;
    const cleanText = text.trim() || (attachedNode ? `[${attachedNode.label}] ${attachedNode.value}` : '');
    const nodeToAttach = attachedNode || activeDockedNode;
    setInputText('');
    playHapticTone(520, 680, 0.15);

    // If first screen, materialize into reality
    if (!isDesireInitiated) {
      setIsDesireInitiated(true);
    }

    // ── OathLink Instant Voice & Semantic Interceptions ──
    const lower = cleanText.toLowerCase();
    if (lower.includes('দর কষাকষি') || lower.includes('bargain') || lower.includes('negotiat') || lower.includes('লিটনের সাথে')) {
      setIsNegotiationDockOpen(true);
      return;
    }
    if (lower.includes('while you were away') || lower.includes('অফলাইনে') || lower.includes('কি হয়েছিল') || lower.includes('away inbox')) {
      setIsWhileAwayModalOpen(true);
      return;
    }
    if (lower.includes('policy') || lower.includes('সীমারেখা') || lower.includes('ক্ষমতা') || lower.includes('authority') || lower.includes('এজেন্টের নিয়ম')) {
      setIsAgentAuthorityModalOpen(true);
      return;
    }
    if (lower.includes('চালান') || lower.includes('challan') || lower.includes('slip') || lower.includes('গেটপাস') || lower.includes('weighbridge')) {
      setActiveOperationalDoc(DEFAULT_CHALLAN_DOC);
      return;
    }
    if (lower.includes('escrow') || lower.includes('এসক্রো') || lower.includes('ভল্ট') || lower.includes('bkash vault')) {
      setIsEscrowModalOpen(true);
      return;
    }
    if (lower.includes('share') || lower.includes('ইনভাইট') || lower.includes('সি-লিঙ্ক') || lower.includes('clink link')) {
      setIsShareCLinkModalOpen(true);
      return;
    }
    if (lower.includes('কেন বললে') || lower.includes('why did my agent') || lower.includes('এজেন্ট কেন')) {
      setSelectedWhyTrace({
        id: 'trace-why-instant',
        timestamp: 'Just now',
        actorName: 'Karim (Uttara Kitchen)',
        agentTitle: "Karim's OathLink Agent",
        actionTaken: 'Autonomous Counter-Offer Decision',
        counterPartyAgent: "Liton Mia's Agent",
        inputReceived: cleanText,
        reasoning: {
          priceFloorOrCeiling: `Configured Ceiling ≤ ৳${buyerAgentPolicy.maxPricePerUnit}`,
          stockOrNeed: 'Target: 50.0kg Nazirshail Rice',
          appliedPolicy: 'Authority Policy: Auto-negotiate within bounds without exceeding ceiling',
          calculation: `৳615/kg is below your ceiling ৳${buyerAgentPolicy.maxPricePerUnit}/kg`
        },
        outputResult: 'Accepted counter-offer @ ৳615/kg for 50kg consignment',
        isEscalatedToHuman: false,
        provenanceHash: '0x39a1f...hash'
      });
      return;
    }

    // ── Universal Multi-Actor Persona Dispatch ──
    if (activePersona === 'LITON') {
      const litonMsg: CausalMessage = {
        id: `msg-liton-${Date.now()}`,
        sender: 'actor',
        actorName: 'Liton Mia',
        actorRole: 'Local Grain Supplier',
        epistemicType: 'STATED',
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        semanticTrace: {
          actorAction: `Liton Mia stated: "${cleanText}"`,
          capabilityImpact: cleanText.includes('৩০') ? 'CAPABILITY RESPONSE: 30 KG MAXIMUM' : 'SUPPLIER COUNTER-OFFER',
          affects: '50 kg rice requirement',
          currentReality: 'Statement recorded in causal ledger'
        }
      };
      setMessages(prev => [...prev, litonMsg]);
      setActiveDockedNode(null);

      setTimeout(() => {
        playHapticTone(560, 740, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-clink-eval-${Date.now()}`,
            sender: 'clink',
            text: `লিটন ভাইয়ের বক্তব্য রেজিস্টার করা হয়েছে ("${cleanText}")। বিদ্যমান ৫০ কেজির রিকোয়ারমেন্টের সাথে এটি অসঙ্গতি তৈরি করায় বিকল্প নিষ্পত্তির পথ নিম্নে দেওয়া হলো:`,
            responseType: 'PROPOSAL',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: '৩০ কেজি নাও, বাকি ২০ কেজি অন্যজন থেকে (Split)', action: 'ACCEPT_30_SPLIT' },
              { label: 'না, এখন ৩০ কেজিই যথেষ্ট (Amend Contract v2)', action: 'CHANGE_TO_30' },
              { label: 'বিকল্প সাপ্লায়ার খুঁজতে agent-কে বলো', action: 'DELEGATE_AGENT' }
            ]
          }
        ]);
      }, 600);
      return;
    }

    if (activePersona === 'RAHIM') {
      const rahimMsg: CausalMessage = {
        id: `msg-rahim-${Date.now()}`,
        sender: 'actor',
        actorName: 'Rahim Foods',
        actorRole: 'Commercial Supplier',
        epistemicType: 'STATED',
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        semanticTrace: {
          actorAction: `Rahim Foods stated: "${cleanText}"`,
          capabilityImpact: 'DECLARED 50 KG COMMERCIAL SUPPLY',
          affects: 'Restaurant rice consignment',
          currentReality: 'Offer active, awaiting human confirmation'
        }
      };
      setMessages(prev => [...prev, rahimMsg]);
      setActiveDockedNode(null);

      setTimeout(() => {
        playHapticTone(600, 800, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-clink-rahim-${Date.now()}`,
            sender: 'clink',
            text: 'Rahim Foods-এর সক্ষমতা ফ্রন্টিয়ারে সরাসরি যুক্ত হয়েছে। ৫০ কেজি চালের সরবরাহ নিশ্চিত করতে চান?',
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'COMMITMENT_CARD',
            choices: [
              { label: 'ডেলিভারির ব্যবস্থা করো', action: 'ARRANGE_DELIVERY' },
              { label: 'ডিজিটাল স্কেলে ওজন পরিমাপ করো', action: 'VERIFY_SCALE' }
            ]
          }
        ]);
      }, 600);
      return;
    }

    if (activePersona === 'AGENT') {
      const agentMsg: CausalMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        actorName: 'Procurement Agent',
        actorRole: 'Autonomous Agent',
        epistemicType: 'AGENT_DELEGATED',
        agentAuthority: { search: true, compare: true, recommend: true, commit: false },
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        semanticTrace: {
          actorAction: `Autonomous Agent: "${cleanText}"`,
          capabilityImpact: 'DELEGATED SEARCH & COMPARISON',
          affects: 'Candidate selection',
          currentReality: 'Operating strictly under human authority boundary'
        }
      };
      setMessages(prev => [...prev, agentMsg]);
      setActiveDockedNode(null);

      setTimeout(() => {
        playHapticTone(580, 760, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-clink-agent-eval-${Date.now()}`,
            sender: 'clink',
            text: 'Agent-এর অডিট সম্পন্ন। পলিসি অনুযায়ী কোনো ফান্ড সরাসরি কমিট করা হয়নি (Commitment Authority: Restricted to Human)।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: 'অনুমোদন দাও', action: 'ASK_RAHIM' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 600);
      return;
    }

    if (activePersona === 'SENSOR') {
      setIsScaleVerified(true);
      const sensorMsg: CausalMessage = {
        id: `msg-sensor-${Date.now()}`,
        sender: 'sensor',
        actorName: 'IoT Digital Scale #DS-09',
        actorRole: 'Calibrated Hardware',
        epistemicType: 'OBSERVED',
        text: cleanText.includes('kg') ? cleanText : `WEIGH_IN TELEMETRY: ${cleanText} kg • CONFIDENCE: 99.8% • TAMPER_LOCK: INTACT`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        semanticTrace: {
          actorAction: 'Sensor hardware telemetred physical mass',
          capabilityImpact: 'EMPIRICAL PHYSICAL EVIDENCE LOGGED',
          affects: 'Consignment proof',
          currentReality: 'Weight certified on cryptographic ledger'
        }
      };
      setMessages(prev => [...prev, sensorMsg]);
      setActiveDockedNode(null);

      setTimeout(() => {
        playHapticTone(640, 920, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-clink-sensor-ack-${Date.now()}`,
            sender: 'clink',
            text: '✓ হার্ডওয়্যার সেন্সর সাক্ষ্য সত্য প্রতিপন্ন হয়েছে (Hardware Observed Telemetry: Verified)। ডেলিভারি চুক্তি চূড়ান্ত নিষ্পত্তির যোগ্য।',
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'PROOF_CARD',
            choices: [
              { label: 'রিসিভ কনফার্ম করো (Settle Reality)', action: 'CONFIRM_RECEIVE' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 600);
      return;
    }

    // Default: User (Karim)
    const userMsg: CausalMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dockedCausalCard: nodeToAttach ? {
        kind: nodeToAttach.kind,
        label: nodeToAttach.label,
        value: nodeToAttach.value,
        status: nodeToAttach.status
      } : undefined
    };
    setMessages(prev => [...prev, userMsg]);
    setActiveDockedNode(null); // gently undock from composer!

    // 1. Hospital Scenario Desire: "আমার বাবাকে কাল হাসপাতালে নিয়ে যেতে হবে"
    if (lower.includes('বাবা') || lower.includes('হাসপাতাল') || lower.includes('hospital') || lower.includes('father')) {
      setActiveScenario('HOSPITAL_VISIT');
      setTimeout(() => {
        playHapticTone(580, 720, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-hosp-init-${Date.now()}`,
            sender: 'clink',
            text: 'ঠিক আছে। কাল হাসপাতালে পৌঁছানোটা ঘটাতে কী কী সত্য হতে হবে দেখি।',
            responseType: 'PROPOSAL',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'APPOINTMENT_CARD',
            choices: [
              { label: 'Appointment আছে?', action: 'CHECK_APPOINTMENT' },
              { label: 'Find one tomorrow morning', action: 'FIND_APPOINTMENT' },
              { label: 'হাসপাতালে পৌঁছানোর জন্য transport দরকার', action: 'NEED_TRANSPORT' }
            ]
          }
        ]);
      }, 700);
      await onAction("Take Father to Hospital tomorrow morning");
    } 
    // 2. Appointment Query: "Appointment আছে?"
    else if (lower.includes('appointment আছে') || lower.includes('appointment?') || lower.includes('check_appointment')) {
      setTimeout(() => {
        playHapticTone(520, 680, 0.18);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-hosp-appt-${Date.now()}`,
            sender: 'clink',
            text: 'এখনও কোনো appointment পাওয়া যায়নি।',
            responseType: 'QUESTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'APPOINTMENT_CARD',
            choices: [
              { label: 'Find one tomorrow morning', action: 'FIND_APPOINTMENT' },
              { label: 'আমি নিজে হাসপাতালে কল করব', action: 'CALL_HOSPITAL' }
            ]
          }
        ]);
      }, 600);
    }
    // 3. Find Appointment Tomorrow Morning: External system agent search
    else if (lower.includes('find one tomorrow morning') || lower.includes('find appointment') || lower.includes('find_appointment') || lower.includes('সকালে স্লট')) {
      setTimeout(() => {
        playHapticTone(580, 760, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-hosp-slots-${Date.now()}`,
            sender: 'clink',
            text: 'কাল ৯:৩০ এবং ১১:০০-এ Dr. Shamsul Alam (Cardiologist, Evercare Hospital)-এর appointment পাওয়া গেছে।',
            responseType: 'CHOICE',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'APPOINTMENT_CARD',
            choices: [
              { label: '9:30 AM', action: 'CHOOSE_930' },
              { label: '11:00 AM', action: 'CHOOSE_1100' }
            ]
          }
        ]);
      }, 800);
    }
    // 4. Confirm Slot: 9:30 AM or 11:00 AM -> Immediate shift of current frontier to transport!
    else if (lower.includes('9:30') || lower.includes('৯:৩০') || lower.includes('11:00') || lower.includes('১১:০০') || lower.includes('choose_930') || lower.includes('choose_1100')) {
      const chosenSlot = (lower.includes('11') || lower.includes('১১')) ? '11:00 AM' : '9:30 AM';
      setHospitalState(prev => ({
        ...prev,
        appointmentStatus: 'COMMITTED',
        appointmentSlot: chosenSlot
      }));
      setTimeout(() => {
        playHapticTone(620, 840, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-hosp-confirmed-${Date.now()}`,
            sender: 'clink',
            text: `Appointment ✓ Confirmed (${chosenSlot})। এখন হাসপাতালে পৌঁছানোর জন্য transport দরকার।`,
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'TRANSPORT_CARD',
            choices: [
              { label: 'Driver নিয়োগ করো', action: 'ASSIGN_HOSPITAL_DRIVER' },
              { label: 'আমি নিজে ড্রাইভ করব', action: 'SELF_DRIVE' }
            ]
          }
        ]);
      }, 700);
    }
    // 5. Hospital Transport Assignment
    else if ((activeScenario === 'HOSPITAL_VISIT' && (lower.includes('driver') || lower.includes('নিয়োগ') || lower.includes('car'))) || lower.includes('assign_hospital_driver')) {
      setHospitalState(prev => ({
        ...prev,
        transportStatus: 'COMMITTED',
        driverName: 'কবির মিয়া (Toyota Premio)'
      }));
      setTimeout(() => {
        playHapticTone(640, 880, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-hosp-trans-${Date.now()}`,
            sender: 'clink',
            text: 'হাসপাতালের জন্য ড্রাইভার কবির মিয়া (Toyota Premio #DHK-2891) কনফার্ম হয়েছে। কাল সকাল ৮:৪৫-এ বাসা থেকে পিকআপ করবে।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'TRANSPORT_CARD',
            choices: [
              { label: 'কাগজপত্র প্রস্তুত আছে', action: 'DOCS_READY' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 700);
    }
    // 6. Hospital Medical Docs Ready
    else if (lower.includes('কাগজপত্র') || lower.includes('docs_ready')) {
      setHospitalState(prev => ({
        ...prev,
        accompanyStatus: 'ACCEPTED'
      }));
      setTimeout(() => {
        playHapticTone(660, 920, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-hosp-docs-${Date.now()}`,
            sender: 'clink',
            text: '✓ সমস্ত মেডিকেল ফাইল ও প্রেসক্রিপশন প্রস্তুত। বাবার হাসপাতাল ভিজিটের সকল কজাল শর্ত নিষ্পত্তি হয়েছে।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'OUTCOME_CARD'
          }
        ]);
      }, 600);
    }
    // 7. Liton Negotiation & Counter-Proposal (Requested 50kg -> Offered 30kg)
    else if (lower.includes('liton') || lower.includes('লিটন')) {
      setTimeout(() => {
        playHapticTone(520, 680, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-liton-stated-${Date.now()}`,
            sender: 'actor',
            actorName: 'Liton Mia',
            actorRole: 'Local Grain Supplier',
            epistemicType: 'STATED',
            text: 'না ভাই, কাল ৫০ কেজি পারব না। গুদামে সীমিত স্টক আছে, সর্বোচ্চ ৩০ কেজি দিতে পারব।',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            semanticTrace: {
              actorAction: 'Liton said: "কাল পারব না, সর্বোচ্চ ৩০ কেজি দিতে পারব"',
              capabilityImpact: 'CAPABILITY RESPONSE: UNABLE (50KG EXCEEDS CAPACITY)',
              affects: 'AFFECTS: 50 kg rice requirement',
              currentReality: 'CURRENT REALITY: Counter-proposal (30kg offered, 20kg gap)'
            }
          },
          {
            id: `msg-liton-prop-${Date.now() + 1}`,
            sender: 'clink',
            text: 'Liton ৩০ কেজি দিতে পারবে, ৫০ কেজি নয় (Counter-Proposal)। আপনি চাইলে ৩০ কেজি গ্রহণ করে বাকি ২০ কেজির জন্য বিকল্প স্প্লিট ফুলফিলমেন্ট খুলতে পারেন।',
            responseType: 'PROPOSAL',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'SPLIT_CARD',
            splitDetails: {
              committedActor: 'Liton Mia',
              committedAmount: '30 kg',
              remainingAmount: '20 kg',
              status: 'COUNTER_PROPOSAL'
            },
            choices: [
              { label: '৩০ কেজি নাও, বাকি ২০ কেজি অন্যজন থেকে', action: 'ACCEPT_30_SPLIT' },
              { label: 'না, এখন ৩০ কেজিই যথেষ্ট (Change Requirement)', action: 'CHANGE_TO_30' },
              { label: '৫০ কেজির জন্যই আবার বলো', action: 'ASK_50_AGAIN' },
              { label: 'অন্য কাউকে খুঁজব', action: 'FIND_ANOTHER_SUPPLIER' }
            ]
          }
        ]);
      }, 750);
    }
    // Re-ask Liton for full 50kg
    else if (lower.includes('আবার বলো') || lower.includes('ask_50_again')) {
      setTimeout(() => {
        playHapticTone(500, 640, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-liton-final-${Date.now()}`,
            sender: 'actor',
            actorName: 'Liton Mia',
            actorRole: 'Local Grain Supplier',
            epistemicType: 'STATED',
            text: 'না ভাই, মিল থেকে কাল সকালের আগে অতিরিক্ত ২০ কেজি আনা কোনোভাবেই সম্ভব না। ৩০ কেজির বেশি এক ছটাকও পারব না।',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            semanticTrace: {
              actorAction: 'Liton confirmed: "অতিরিক্ত ২০ কেজি অসম্ভব"',
              capabilityImpact: 'CAPABILITY RESPONSE: HARD LIMIT 30KG',
              affects: 'AFFECTS: 50 kg requirement',
              currentReality: 'CURRENT REALITY: Split fulfillment required'
            },
            choices: [
              { label: '৩০ কেজি নাও, বাকি ২০ কেজি অন্যজন থেকে', action: 'ACCEPT_30_SPLIT' },
              { label: 'না, এখন ৩০ কেজিই যথেষ্ট', action: 'CHANGE_TO_30' },
              { label: 'সাপ্লায়ার খোঁজার কাজটা আমার agent-কে দাও', action: 'DELEGATE_AGENT' }
            ]
          }
        ]);
      }, 700);
    }
    // Living Contract Versioning: "I changed my mind / ৩০ কেজিই যথেষ্ট"
    else if (lower.includes('৩০ কেজিই যথেষ্ট') || lower.includes('change_to_30') || lower.includes('changed my mind') || lower.includes('মন পরিবর্তন')) {
      setTimeout(() => {
        playHapticTone(580, 760, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-change-mind-${Date.now()}`,
            sender: 'clink',
            text: 'Existing requirement: 50 kg ➔ New user intent: 30 kg। ৫০ কেজির existing desire রয়েছে। আপনি কি Living Contract সংস্করণ আপডেট করতে চান?',
            responseType: 'PROPOSAL',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: 'Requirement ৩০ কেজিতে আপডেট করো (Version 2)', action: 'CONFIRM_VERSION_2' },
              { label: '৫০ কেজিই বহাল রাখো (Version 1)', action: 'KEEP_VERSION_1' }
            ]
          }
        ]);
      }, 600);
    }
    // Confirm Version 2 of Living Contract
    else if (lower.includes('version 2') || lower.includes('confirm_version_2')) {
      setContractVersion(2);
      setTimeout(() => {
        playHapticTone(640, 880, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-contract-v2-${Date.now()}`,
            sender: 'clink',
            text: '✓ Living Contract সংস্করণ ২ কার্যকর হয়েছে (Requirement: 30 kg)। পূর্ববর্তী ভার্সন ১ (50 kg) হিস্টোরিতে সংরক্ষিত।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: 'ডিজিটাল স্কেলে ৩০ কেজি পরিমাপ করো', action: 'VERIFY_SCALE' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 600);
    }
    // Reality Inbox direct trigger
    else if (lower.includes('inbox') || lower.includes('ইনবক্স')) {
      setIsRealityInboxOpen(true);
      playHapticTone(540, 700, 0.15);
    }
    // 8. Accept 30kg Split Fulfillment
    else if (lower.includes('accept 30') || lower.includes('৩০ কেজি নাও') || lower.includes('accept_30_split')) {
      setSplitFulfillment({
        isSplit: true,
        primarySupplier: { name: 'Liton Mia', amountKg: 30, status: 'COMMITTED' },
        secondaryNeed: { amountKg: 20, status: 'UNRESOLVED' }
      });
      setTimeout(() => {
        playHapticTone(600, 800, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-split-active-${Date.now()}`,
            sender: 'clink',
            text: 'Split Fulfilment সক্রিয় করা হয়েছে: লিটন ভাই থেকে ৩০ কেজি কনফার্ম (✓ Committed) এবং বাকি ২০ কেজির জন্য নতুন সাপ্লায়ার প্রয়োজন।',
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'SPLIT_CARD',
            splitDetails: {
              committedActor: 'Liton Mia',
              committedAmount: '30 kg',
              remainingAmount: '20 kg',
              status: 'SPLIT_ACTIVE'
            },
            choices: [
              { label: 'বাকি ২০ কেজির জন্য Rahim Foods-কে প্রস্তাব দাও', action: 'ASK_RAHIM' },
              { label: 'সাপ্লায়ার খোঁজার কাজটা আমার agent-কে দাও', action: 'DELEGATE_AGENT' }
            ]
          }
        ]);
      }, 700);
    }
    // 9. Causal Explainability ("Why am I seeing this?" & "Why is this person here?")
    else if (lower.includes('why') || lower.includes('কেন এটি') || lower.includes('কেন দেখাচ্ছ') || lower.includes('কেন রহিম') || lower.includes('explain')) {
      const isAboutRahim = lower.includes('rahim') || lower.includes('রহিম');
      setTimeout(() => {
        playHapticTone(560, 740, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-explain-${Date.now()}`,
            sender: 'clink',
            text: isAboutRahim
              ? 'Rahim Foods-এর ঘোষিত সক্ষমতা (Gazipur Mill) আপনার চালের স্পেসিফিকেশনের সাথে মিলে গেছে।'
              : 'বর্তমান কজাল বাস্তবতায় ওপেন ডিপেন্ডেন্সির কারণে এই কার্ডটি ফ্রন্টিয়ারে রয়েছে।',
            responseType: 'EXPLAIN',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'EXPLAIN_CARD',
            causalExplanation: isAboutRahim ? {
              title: 'WHY RAHIM FOODS IS HERE',
              whyHere: 'আপনার ৫০ কেজি চালের requirement-এর সঙ্গে তাদের declared capability মিলে গেছে। তারা এখনও commitment দেয়নি। বাজার র‍্যাঙ্কিং নয়, এটি সরাসরি কজাল সক্ষমতার ম্যাচ।',
              chain: [
                'Need: Rice 50kg for Restaurant',
                'Required capability: Commercial Bagging & Polishing',
                'Rahim Foods capability match: Gazipur Mill',
                'Candidate surfaced for mutual commitment'
              ]
            } : {
              title: 'WHY THIS IS HERE (Causal Explainability)',
              whyHere: 'Liton declined / short-supplied -> Previous commitment cannot proceed -> 50 kg requirement remains unresolved -> Alternative capability is now relevant.',
              chain: [
                'Desire: 50 kg rice consignment',
                'Initial resolver Liton could not satisfy 50kg',
                'Unresolved requirement gap created',
                'Alternative supplier materialized on active frontier'
              ]
            },
            choices: [
              { label: 'Rahim Foods-কে জিজ্ঞেস করো', action: 'ASK_RAHIM' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 600);
    }
    // 10. Attention Compression: "আমি না থাকার সময় কী হয়েছে?" / "What changed while I was away?"
    else if (lower.includes('away') || lower.includes('কী হয়েছে') || lower.includes('বদলেছে') || lower.includes('catch me up') || lower.includes('update')) {
      setTimeout(() => {
        playHapticTone(580, 780, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-delta-${Date.now()}`,
            sender: 'clink',
            text: 'আপনার অনুপস্থিতিতে বাস্তবতায় যা যা ঘটেছে (Causal Attention Delta):',
            responseType: 'DELTA',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'DELTA_CARD',
            deltaItems: [
              { status: 'POSITIVE', text: '✓ Liton declined 50kg, proposed 30kg counter-offer' },
              { status: 'POSITIVE', text: '✓ Rahim Foods proposed 50kg capacity' },
              { status: 'POSITIVE', text: '✓ Delivery transport capability verified' },
              { status: 'WARNING', text: '⚠ Commitment awaiting your final decision' },
              { status: 'NEUTRAL', text: '• Tomorrow 10:00 AM remains target window' }
            ],
            choices: [
              { label: 'শুধু যা attention দরকার তা দেখাও', action: 'SHOW_ATTENTION_ONLY' },
              { label: 'Rahim Foods-কে কনফার্ম করো', action: 'ASK_RAHIM' },
              { label: 'আমাকে পুরো ব্যাপারটা বুঝিয়ে বলো', action: 'CATCH_ME_UP' }
            ]
          }
        ]);
      }, 700);
    }
    // 10b. Natural Language Constraint: "বাজেটটা ১০ হাজারের বেশি যেন না হয়"
    else if (lower.includes('বাজেট') || lower.includes('budget') || lower.includes('টাকা') || lower.includes('cost')) {
      const budgetNum = lower.includes('5000') || lower.includes('৫০০০') ? 5000 : 10000;
      setRegisteredConstraints(prev => ({ ...prev, budgetMax: budgetNum }));
      setTimeout(() => {
        playHapticTone(580, 800, 0.22);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-budget-${Date.now()}`,
            sender: 'clink',
            text: `বাজেট সীমাবদ্ধতা রেজিস্টার করা হয়েছে: সর্বোচ্চ ৳${budgetNum.toLocaleString()}। প্রার্থীদের কস্ট অডিট সম্পন্ন:`,
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'CONSTRAINT_CARD',
            constraintDetails: {
              type: 'BUDGET CEILING',
              value: `৳${budgetNum.toLocaleString()}`,
              impact: `মোট ব্যয় ৳${budgetNum.toLocaleString()}-এর মধ্যে সীমিত থাকতে হবে। যেকোনো সরবরাহকারী এই সীমা অতিক্রম করলে স্বয়ংক্রিয়ভাবে অযোগ্য ঘোষিত হবে।`,
              evaluations: [
                { candidate: 'Liton Mia (30 kg @ ৳60/kg)', status: 'MET', note: '৳1,800 (Within limit)' },
                { candidate: 'Rahim Foods (50 kg @ ৳65/kg)', status: 'MET', note: '৳3,250 (Within limit)' },
                { candidate: 'Premium Direct Import Mill', status: 'EXCEEDED', note: '৳11,200 (Violates constraint)' }
              ]
            },
            choices: [
              { label: 'Rahim Foods-কে প্রপোজ করো', action: 'ASK_RAHIM' },
              { label: 'শুধু যা attention দরকার তা দেখাও', action: 'SHOW_ATTENTION_ONLY' }
            ]
          }
        ]);
      }, 600);
    }
    // 10c. Holistic Explanation: "আমাকে পুরো ব্যাপারটা বুঝিয়ে বলো"
    else if (lower.includes('বুঝিয়ে বলো') || lower.includes('হিস্টোরি') || lower.includes('catch_me_up') || lower.includes('পুরো')) {
      setTimeout(() => {
        playHapticTone(560, 760, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-catchup-${Date.now()}`,
            sender: 'clink',
            text: 'বর্তমান বাস্তবতার সামগ্রিক কজাল সারসংক্ষেপ (Causal Attention Reconstruction):',
            responseType: 'EXPLAIN',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'CATCHUP_CARD',
            catchupDetails: {
              totalEvents: 14,
              resolvedGaps: 2,
              pendingDecisions: 1,
              stages: [
                { stage: 'Desire Originated', summary: 'কাল ৫০ কেজি চাল রেস্টুরেন্টে পৌঁছানোর ইচ্ছা ঘোষিত।', settled: true },
                { stage: 'First Resolution Attempt', summary: 'লিটন মিয়া গুদামে ঘাটতির কারণে ৩০ কেজির কাউন্টার-অফার দেন।', settled: true },
                { stage: 'Split Fulfillment Gap', summary: '২০ কেজি চালের নতুন রিকোয়ারমেন্ট গ্যাপ সৃষ্টি হয়।', settled: true },
                { stage: 'Alternative Capability Surfaced', summary: 'Rahim Foods ৫০ কেজি সরবরাহের সামর্থ্য ঘোষণা করেছে।', settled: true },
                { stage: 'Current Attention Frontier', summary: 'আপনার একটি চূড়ান্ত অনুমোদনের অপেক্ষায় (Rahim Foods confirmation)।', settled: false }
              ]
            },
            choices: [
              { label: 'Rahim Foods-কে অনুমোদন দাও', action: 'ASK_RAHIM' },
              { label: 'শুধু যা attention দরকার তা দেখাও', action: 'SHOW_ATTENTION_ONLY' }
            ]
          }
        ]);
      }, 650);
    }
    // 10d. Filter Pure Attention: "শুধু যা attention দরকার তা দেখাও"
    else if (lower.includes('show_attention_only') || (lower.includes('শুধু') && lower.includes('attention'))) {
      setIsAttentionOnlyFilterActive(true);
      setTimeout(() => {
        playHapticTone(620, 840, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-attn-filter-${Date.now()}`,
            sender: 'clink',
            text: '⚡ Attention-Only ফিল্টার সক্রিয় হয়েছে। স্ক্রিনে অপ্রয়োজনীয় ব্যাকগ্রাউন্ড বার্তা সংকুচিত করে শুধু আপনার সক্রিয় সিদ্ধান্ত ফ্রন্টিয়ার দেখানো হচ্ছে।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: 'সব হিস্টোরি আবার দেখাও', action: 'RESET_ATTENTION_FILTER' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 500);
    }
    // 10e. Soft Negotiation: "ওকে বাদ দিও না, আগে জিজ্ঞেস করো"
    else if (lower.includes('বাদ দিও না') || lower.includes('অন্যভাবে') || lower.includes('negotiate')) {
      setTimeout(() => {
        playHapticTone(540, 720, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-soft-neg-${Date.now()}`,
            sender: 'clink',
            text: 'লিটন ভাইয়ের সাথে বিকল্প ডেলিভারি ব্যাচিং বা সময় পরিবর্তনের শর্তে আলোচনা শুরু করা হচ্ছে...',
            responseType: 'PROPOSAL',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: 'সকালে ৩০ কেজি + বিকালে ২০ কেজি নেওয়া যায়?', action: 'ASK_LITON_BATCH' },
              { label: 'বিকল্প সাপ্লায়ার খুঁজব', action: 'FIND_ANOTHER_SUPPLIER' }
            ]
          }
        ]);
      }, 600);
    }
    // 11. Silence is Valid / "কিছু করার আছে?" (Zen state)
    else if (lower.includes('কিছু করার আছে') || lower.includes('nothing to do') || lower.includes('any action') || lower.includes('শান্ত')) {
      setTimeout(() => {
        playHapticTone(500, 600, 0.3);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-silence-${Date.now()}`,
            sender: 'clink',
            text: 'না। আপনার Workগুলো বর্তমানে আপনার কোনো action-এর অপেক্ষায় নেই।',
            responseType: 'SILENCE',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'SILENCE_CARD',
            choices: [
              { label: 'নতুন কোনো ইচ্ছা বলুন', action: 'NEW_DESIRE' },
              { label: 'সব হিস্টোরি দেখাও', action: 'CATCH_ME_UP' }
            ]
          }
        ]);
      }, 500);
    }
    // 12. Autonomous Agent Delegation ("কাজটা আমার agent-কে দাও")
    else if (lower.includes('agent') || lower.includes('এজেন্ট') || lower.includes('delegate')) {
      setTimeout(() => {
        playHapticTone(600, 820, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-agent-${Date.now()}`,
            sender: 'agent',
            actorName: 'Procurement Agent',
            actorRole: 'Autonomous Agent',
            epistemicType: 'AGENT_DELEGATED',
            agentAuthority: {
              search: true,
              compare: true,
              recommend: true,
              commit: false
            },
            text: '৩ জন alternative supplier পাওয়া গেছে (Rahim Foods, Meghna Mills, Square)। Rahim Foods কাল সকাল ১০টায় দিতে পারবে। Authority: Search ✓, Recommend ✓, Commit ✕ (Requires your approval)।',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'DELEGATE_CARD',
            choices: [
              { label: 'Rahim Foods-কে Propose করো', action: 'ASK_RAHIM' },
              { label: 'অন্য কাউকে দেখো', action: 'FIND_ANOTHER_SUPPLIER' }
            ]
          }
        ]);
      }, 700);
    }
    // 13. Time Conflict Surface ("Conflict আছে কি?")
    else if (lower.includes('conflict') || lower.includes('দ্বন্দ্ব') || lower.includes('সময় মিলছে না')) {
      setTimeout(() => {
        playHapticTone(460, 520, 0.3);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-conflict-${Date.now()}`,
            sender: 'clink',
            text: 'সময়গত অসঙ্গতি দেখা দিয়েছে (Time Window Conflict):',
            responseType: 'QUESTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'CONFLICT_CARD',
            conflictDetails: {
              supplierTime: '08:00 AM (Ready)',
              driverTime: '12:00 PM (Available)',
              requiredTime: '10:00 AM (Target window)',
              summary: 'ডেলিভারি কাঙ্ক্ষিত সময় সকাল ১০টায় পূরণ করা সম্ভব হচ্ছে না।'
            },
            choices: [
              { label: 'ডেলিভারি ১২:০০-তে স্থানান্তর করো', action: 'MOVE_TIME_12' },
              { label: 'অন্য ড্রাইভার খুঁজো', action: 'ASSIGN_TARIQ' },
              { label: 'সাপ্লায়ারকে হোল্ড করতে বলো', action: 'HOLD_SUPPLIER' }
            ]
          }
        ]);
      }, 600);
    }
    // 14. Classic Rice Consignment Initiations
    else if (lower.includes('চাল লাগবে') || lower.includes('50kg') || lower.includes('50 kg') || lower.includes('rice')) {
      setActiveScenario('RICE_CONSIGNMENT');
      setTimeout(() => {
        playHapticTone(580, 720, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-resp-${Date.now()}`,
            sender: 'clink',
            text: 'বুঝেছি। কাল ৫০ কেজি চাল দরকার। প্রয়োজনীয় অবস্থা ও সক্ষমতা তৈরি করছি।',
            responseType: 'PROPOSAL',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'WANT_CARD',
            choices: [
              { label: 'Rahim Foods-কে জিজ্ঞেস করি', action: 'ASK_RAHIM' },
              { label: 'Liton ভাই দিতে পারবেন?', action: 'ASK_LITON' },
              { label: 'Why am I seeing this?', action: 'EXPLAIN_WHY' }
            ]
          }
        ]);
      }, 700);
      await onAction("I need 50kg rice delivered to Uttara");
    } else if (lower.includes('জিজ্ঞেস করো') || lower.includes('rahim') || lower.includes('ask')) {
      setTimeout(() => {
        playHapticTone(540, 780, 0.2);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-actor-${Date.now()}`,
            sender: 'actor',
            actorName: 'Rahim Foods',
            actorRole: 'Supplier',
            epistemicType: 'STATED',
            text: 'হ্যাঁ ভাই, আমরা কাল সকাল ১০টার মধ্যে ৫০ কেজি নাজিরশাইল চাল প্রস্তুত রাখব। গাজীপুর মিল সাইলোতে পর্যাপ্ত স্টক রয়েছে।',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'COMMITMENT_CARD',
            responseType: 'PROPOSAL',
            choices: [
              { label: 'ডেলিভারি ব্যবস্থা করো', action: 'ARRANGE_DELIVERY' },
              { label: 'রহিম ফুডসের বিশ্বাসযোগ্যতা যাচাই (Epistemic Trust)', action: 'INSPECT_EPISTEMIC' },
              { label: 'What-If সিমুলেশন দেখো (কোনটা ভালো?)', action: 'SIMULATE_WHAT_IF' },
              { label: 'Why is Rahim here?', action: 'WHY_RAHIM' }
            ]
          }
        ]);
      }, 800);
      await onAction("ASK_ACTOR", { actorName: "Rahim Foods" });
    } else if (lower.includes('driver') || lower.includes('ডেলিভারি') || lower.includes('গাড়ি') || lower.includes('van') || lower.includes('তারিক')) {
      setOverrideDriverAssigned(true);
      setTimeout(() => {
        playHapticTone(560, 740, 0.22);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-trans-${Date.now()}`,
            sender: 'clink',
            text: 'ড্রাইভার তারিক আহমেদ (Toyota HiAce #DHK-4421) দায়িত্ব গ্রহণ করেছে। পণ্য লোড শেষে পরিবহন চলমান রয়েছে (Physical Transit Active):',
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'TRANSIT_CARD',
            transitDetails: {
              driverName: 'তারিক আহমেদ (Tariq Ahmed)',
              vehicle: 'Toyota Covered Van (#DHK-4421)',
              pickupLocation: 'গাজীপুর মিল (Gazipur Mill No. 4)',
              currentLocation: 'টঙ্গী ফ্লাইওভার (Tongi Flyover)',
              destination: 'উত্তরা সেক্টর ৪ রেস্টুরেন্ট ডক (Uttara Dock)',
              speed: '৪২ কিমি/ঘণ্টা',
              eta: '০৯:৪৫ AM (১৫ মিনিট বাফারসহ)',
              condition: 'OPTIMAL',
              conditionNote: 'এয়ারপোর্ট রোডে স্বাভাবিক ট্রাফিক প্রবাহ রয়েছে, সময়মতো পৌঁছাবে।',
              gpsTimestamp: '২ মিনিট আগে পিং করা হয়েছে'
            },
            choices: [
              { label: 'লাইভ রুট ট্র্যাকার ম্যাপ দেখুন', action: 'OPEN_TRACKER_MODAL' },
              { label: 'ডিজিটাল স্কেল প্রুফ যাচাই করো', action: 'OPEN_PROOF_MODAL' },
              { label: 'Conflict আছে কি?', action: 'CHECK_CONFLICT' }
            ]
          }
        ]);
      }, 750);
      await onAction("Find replacement driver");
    } else if (lower.includes('what if') || lower.includes('যদি') || lower.includes('সিমুলেট') || lower.includes('simulate') || lower.includes('কোনটা ভালো')) {
      setTimeout(() => {
        playHapticTone(580, 780, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-whatif-${Date.now()}`,
            sender: 'clink',
            text: 'ভবিষ্যত কজাল রিপল সিমুলেশন (Causal Counterfactual Simulation): সিদ্ধান্ত গ্রহণের পূর্বে সম্ভাব্য ফলাফল মূল্যায়ন করুন:',
            responseType: 'EXPLAIN',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'WHAT_IF_CARD',
            whatIfDetails: {
              question: '৫০ কেজি চালের জন্য বিকল্প সিদ্ধান্ত শাখা তুলনা',
              branchA: {
                title: 'পাথ ক: স্প্লিট ফুলফিলমেন্ট (লিটন ৩০ কেজি + নতুন সাপ্লায়ার ২০ কেজি)',
                cost: '৳৩,১০০ BDT',
                time: 'কাল সকাল ১০:৩০ AM (+৩০ মিনিট)',
                coordination: '২টি ডেলিভারি ও পৃথক আনলোডিং সমন্বয় প্রয়োজন',
                risk: 'মাঝারি (দ্বিতীয় সাপ্লায়ারের ট্রানজিট বাফার অনিশ্চিত)',
                action: 'ACCEPT_30_SPLIT'
              },
              branchB: {
                title: 'পাথ খ: একক সরবরাহকারী (সম্পূর্ণ ৫০ কেজি Rahim Foods)',
                cost: '৳৩,২৫০ BDT (+৳১৫০)',
                time: 'কাল সকাল ১০:০০ AM (টার্গেট নিখুঁত)',
                coordination: '১টি একক পিকআপ, এক ভ্যানে সরাসরি ডেলিভারি',
                risk: 'সর্বনিম্ন (মিলের সাইলোতে সার্টিফাইড ১০০+ বস্তা উপস্থিত)',
                action: 'ASK_RAHIM'
              },
              branchC: {
                title: 'পাথ গ: লিটনের সাথে দুই ধাপে ডেলিভারি (সকালে ৩০ কেজি + বিকালে ২০ কেজি)',
                cost: '৳৩,০০০ BDT',
                time: 'সকাল ১০:০০ (৩০ কেজি) + বিকাল ৪:০০ (২০ কেজি)',
                coordination: 'একই বিক্রেতার দুই ধাপে ট্রিপ',
                risk: 'কম, তবে সন্ধ্যার রান্নার প্রস্তুতিতে সাময়িক চাপ',
                action: 'ASK_LITON_BATCH'
              }
            },
            choices: [
              { label: 'পাথ খ বেছে নাও (Rahim Foods ৫০ কেজি)', action: 'ASK_RAHIM' },
              { label: 'পাথ ক বেছে নাও (৩০ কেজি নাও, বাকি ২০ কেজি অন্যজন)', action: 'ACCEPT_30_SPLIT' },
              { label: 'রহিম ফুডসের বিশ্বাসযোগ্যতা যাচাই (Epistemic Trust)', action: 'INSPECT_EPISTEMIC' }
            ]
          }
        ]);
      }, 700);
    } else if (lower.includes('trust') || lower.includes('বিশ্বাস') || lower.includes('প্রমাণ আছে কি') || lower.includes('কেন রহিমকে বিশ্বাস') || lower.includes('epistemic')) {
      setTimeout(() => {
        playHapticTone(560, 760, 0.22);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-epistemic-${Date.now()}`,
            sender: 'clink',
            text: 'রহিম ফুডসের এপোস্টেমিক ট্রাস্ট ও সক্ষমতা অডিট (Epistemic Trust Gradient):',
            responseType: 'EXPLAIN',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'EPISTEMIC_CARD',
            epistemicDetails: {
              actorName: 'Rahim Foods (Gazipur Commercial Mill)',
              capability: 'Industrial Milling, Polishing & Commercial Bagging',
              statedClaim: 'সাপ্লায়ারের বক্তব্য: "কাল সকাল ১০টার মধ্যে ৫০ কেজি নাজিরশাইল চাল প্রস্তুত থাকবে।"',
              sensorProof: 'IoT ওয়েইব্রিজ সেন্সর #WB-849102-BD: মিল সাইলোতে ১২০ বস্তা প্রি-প্যাকড চাল অটো-ডিটেক্টেড।',
              reputationScore: '৯৯.৪% অন-টাইম ফুলফিলমেন্ট রেট (বিগত ১৮টি কমিটমেন্টে শূন্য ডিসপিউট)',
              epistemicLevel: 'PROVEN',
              auditProofHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
            },
            choices: [
              { label: 'Rahim Foods-কে কনফার্ম করো', action: 'ASK_RAHIM' },
              { label: 'What-If সিমুলেশন দেখো', action: 'SIMULATE_WHAT_IF' }
            ]
          }
        ]);
      }, 650);
    } else if (lower.includes('ওজন') || lower.includes('proof') || lower.includes('স্কেল') || lower.includes('প্রমাণ') || lower.includes('slip')) {
      setIsScaleVerified(true);
      setTimeout(() => {
        playHapticTone(600, 840, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-proof-${Date.now()}`,
            sender: 'clink',
            text: '৫০ কেজি চালের বস্তা ডিজিটাল স্কেলে পরিমাপ করা হয়েছে (Weight: 50.0 kg verified)। সিল ও ফিজিক্যাল প্রুফ যাচাই করুন:',
            responseType: 'ACTION',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'PROOF_CARD',
            choices: [
              { label: 'ফিজিক্যাল প্রুফ ও কোয়ালিটি স্লিপ ওপেন করুন', action: 'OPEN_PROOF_MODAL' },
              { label: 'চাল গ্রহণ নিশ্চিত করুন (Confirm Received)', action: 'CONFIRM_RECEIPT' }
            ]
          }
        ]);
      }, 600);
    } else if (lower.includes('রিসিভ') || lower.includes('পৌঁছেছে') || lower.includes('received') || lower.includes('accept') || lower.includes('settle')) {
      setOverrideRealitySettled(true);
      setTimeout(() => {
        playHapticTone(640, 960, 0.3);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-out-${Date.now()}`,
            sender: 'clink',
            text: '✓ বাস্তবতা চূড়ান্তভাবে নিষ্পত্তি হয়েছে (Reality Settled & Equilibrium Reached)। চাল গ্রহণ সম্পন্ন, অবলিগেশন খালাস এবং কজাল লেজারে অপরিবর্তনীয় সনদ ইস্যু করা হয়েছে।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            materializedComponent: 'OUTCOME_CARD',
            choices: [
              { label: 'কজাল নিষ্পত্তি সনদপত্র দেখুন (Settlement Certificate)', action: 'OPEN_SETTLEMENT_MODAL' },
              { label: 'কিছু করার আছে?', action: 'NOTHING_TO_DO' }
            ]
          }
        ]);
      }, 700);
      await onAction("Confirm Received");
    } else if (lower.includes('wedding') || lower.includes('বিয়ে') || lower.includes('catering') || lower.includes('ক্যাটারিং') || nodeToAttach?.id === 'wedding-catering') {
      setActiveScenario('WEDDING');
      setTimeout(() => {
        playHapticTone(580, 780, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-cat-${Date.now()}`,
            sender: 'clink',
            text: 'Iqbal Caterers (Gulshan)-এর সাথে ৩৫০ অতিথির মুঘলাই মেনু সাইন-অফ সম্পন্ন হয়েছে। C-Link Causal Commitment: committed.',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            choices: [
              { label: 'ভেন্যুর সাথে সিঙ্ক করো', action: 'SYNC_VENUE' },
              { label: 'উভয় পরিবারের সম্মতি', action: 'CONFIRM_PARTE' }
            ]
          }
        ]);
      }, 700);
      await onAction("Commit Wedding Catering");
    } else if (lower.includes('venue') || lower.includes('ভেন্যু') || nodeToAttach?.id === 'wedding-venue') {
      setTimeout(() => {
        playHapticTone(580, 780, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-ven-${Date.now()}`,
            sender: 'clink',
            text: 'Sena Malancha কনভেনশন হলের ভেন্যু বুকিং ও স্লট কনফার্মেশন সম্পন্ন হয়েছে। Venue status: committed.',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
      await onAction("Commit Venue");
    } else if (lower.includes('parte') || nodeToAttach?.id === 'wedding-parte') {
      setTimeout(() => {
        playHapticTone(580, 780, 0.25);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-parte-${Date.now()}`,
            sender: 'clink',
            text: 'উভয় পরিবারের সম্মতি এবং চুক্তি চূড়ান্তভাবে গৃহীত হয়েছে (✓ Accepted)।',
            responseType: 'ANSWER',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
      await onAction("Confirm Parte");
    } else {
      await onAction(cleanText);
    }
  };

  const handleChoiceSelect = async (choice: { label: string; action: string; value?: any }) => {
    playHapticTone(540, 740, 0.2);
    // Push the chosen option as user utterance
    const userMsg: CausalMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: choice.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    if (choice.action === 'ASK_RAHIM') {
      handleSendDesire('Rahim Foods-কে জিজ্ঞেস করো');
    } else if (choice.action === 'ASK_LITON') {
      handleSendDesire('Liton ভাই দিতে পারবেন?');
    } else if (choice.action === 'ARRANGE_DELIVERY' || choice.action === 'ASSIGN_TARIQ') {
      handleSendDesire('ডেলিভারির জন্য ড্রাইভার নির্ধারণ করো');
    } else if (choice.action === 'SUBMIT_SCALE') {
      handleSendDesire('স্কেল প্রুফ সাবমিট করো');
    } else if (choice.action === 'CONFIRM_RECEIPT') {
      handleSendDesire('চাল বুঝে পেয়েছি, রিসিভ কনফার্ম করো');
    } else if (choice.action === 'CHECK_APPOINTMENT') {
      handleSendDesire('Appointment আছে?');
    } else if (choice.action === 'FIND_APPOINTMENT') {
      handleSendDesire('Find one tomorrow morning');
    } else if (choice.action === 'CHOOSE_930') {
      handleSendDesire('9:30 AM');
    } else if (choice.action === 'CHOOSE_1100') {
      handleSendDesire('11:00 AM');
    } else if (choice.action === 'NEED_TRANSPORT' || choice.action === 'ASSIGN_HOSPITAL_DRIVER') {
      handleSendDesire('Driver নিয়োগ করো');
    } else if (choice.action === 'DOCS_READY') {
      handleSendDesire('কাগজপত্র প্রস্তুত আছে');
    } else if (choice.action === 'SHOW_ATTENTION_ONLY') {
      setIsAttentionOnlyFilterActive(true);
      playHapticTone(600, 800, 0.2);
    } else if (choice.action === 'RESET_ATTENTION_FILTER') {
      setIsAttentionOnlyFilterActive(false);
      playHapticTone(520, 680, 0.15);
    } else if (choice.action === 'CATCH_ME_UP') {
      handleSendDesire('আমাকে পুরো ব্যাপারটা বুঝিয়ে বলো');
    } else if (choice.action === 'VERIFY_SCALE') {
      setIsScaleVerified(true);
      handleSendDesire('ডিজিটাল স্কেলে ৫০ কেজি পরিমাপ সম্পন্ন হয়েছে');
    } else if (choice.action === 'ACCEPT_30_SPLIT') {
      handleSendDesire('৩০ কেজি নাও, বাকি ২০ কেজি অন্যজন থেকে');
    } else if (choice.action === 'EXPLAIN_WHY') {
      handleSendDesire('Why am I seeing this?');
    } else if (choice.action === 'WHY_RAHIM') {
      handleSendDesire('Why is Rahim here?');
    } else if (choice.action === 'INSPECT_EPISTEMIC') {
      handleSendDesire('রহিম ফুডসের বিশ্বাসযোগ্যতা যাচাই');
    } else if (choice.action === 'SIMULATE_WHAT_IF') {
      handleSendDesire('What-If সিমুলেশন দেখো');
    } else if (choice.action === 'OPEN_TRACKER_MODAL') {
      setIsRouteModalOpen(true);
      playHapticTone(600, 780, 0.2);
    } else if (choice.action === 'OPEN_PROOF_MODAL') {
      setIsProofModalOpen(true);
      playHapticTone(600, 840, 0.2);
    } else if (choice.action === 'OPEN_SETTLEMENT_MODAL') {
      setIsSettlementModalOpen(true);
      playHapticTone(640, 920, 0.25);
    } else if (choice.action === 'CATCH_ME_UP') {
      handleSendDesire('আমি না থাকার সময় কী হয়েছে?');
    } else if (choice.action === 'SHOW_ATTENTION_ONLY') {
      handleSendDesire('শুধু যা attention দরকার তা দেখাও');
    } else if (choice.action === 'NOTHING_TO_DO') {
      handleSendDesire('কিছু করার আছে?');
    } else if (choice.action === 'DELEGATE_AGENT') {
      handleSendDesire('supplier খোঁজার কাজটা আমার agent-কে দাও');
    } else if (choice.action === 'CHECK_CONFLICT') {
      handleSendDesire('Conflict আছে কি?');
    } else {
      await onAction(choice.label);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProofPhotoPreview(url);
      setIsScaleVerified(true);
      setProofWeightKg(50.0);
      playHapticTone(600, 850, 0.25);
    }
  };

  const handleExecuteProofSubmission = async () => {
    setIsScaleVerified(true);
    playHapticTone(580, 880, 0.3);
    await onAction("SUBMIT EVIDENCE", {
      photoUrl: proofPhotoPreview || undefined,
      weightKg: proofWeightKg || 50,
      description: 'Certified 50kg rice consignment batch'
    });
    setMessages(prev => [
      ...prev,
      {
        id: `msg-ev-${Date.now()}`,
        sender: 'actor',
        actorName: 'Tariq M.',
        actorRole: 'Driver',
        text: 'চালান উত্তরায় সুপারশপে পৌঁছেছে। বস্তার ডিজিটাল স্কেল সার্টিফাইড ৫০.০ কেজি।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseType: 'PROPOSAL',
        choices: [
          { label: 'চাল গ্রহণ ও রিসিট সম্পন্ন করুন', action: 'CONFIRM_RECEIPT' },
          { label: 'ওজন পুনরায় যাচাই করি', action: 'RECHECK_WEIGHT' }
        ]
      }
    ]);
  };

  const handleResetToDesireComposer = () => {
    setIsDesireInitiated(false);
    setInputText('');
    setProofPhotoPreview(null);
    setIsScaleVerified(false);
    setProofWeightKg(50.0);
    playHapticTone(400, 520, 0.2);
  };

  // Weight tolerance computation: 50kg target (+/- 0.5kg)
  const weightDeficit = 50.0 - proofWeightKg;
  const isWeightWithinTolerance = Math.abs(weightDeficit) <= 0.5;

  return (
    <div className="h-[100dvh] w-full bg-[#FAF8F5] text-[#1A1A1A] font-sans flex flex-col relative overflow-hidden select-none">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Header: Exact replica of IMG_0359.JPG                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 shrink-0 flex items-center justify-between relative z-30 gap-4">
        {/* Left: Minimalist C-LINK Wordmark & Spatial Projection Portal */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => {
              setIsSpatialTreeVisible(prev => !prev);
              playHapticTone(520, 680, 0.15);
            }}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            title={isSpatialTreeVisible ? "Click C-LINK to fold Spatial Tree" : "Click C-LINK to project Spatial Tree"}
          >
            <span className="font-medium text-neutral-900 text-[14px] sm:text-[15px] tracking-[0.28em] uppercase select-none font-sans group-hover:opacity-80 transition-opacity">
              C-LINK
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono transition-all uppercase tracking-wider ${
              isSpatialTreeVisible 
                ? 'bg-neutral-900 text-white' 
                : 'bg-neutral-200 text-neutral-600 group-hover:bg-neutral-300'
            }`}>
              {isSpatialTreeVisible ? 'Tree ON' : 'Tree OFF'}
            </span>
          </button>
        </div>

        {/* Center/Right: Floating Pill Composer (Exact from IMG_0359.JPG: ✦ Tell C-Link what should happen...) */}
        <div className="flex items-center bg-white/95 border border-neutral-200/80 rounded-full px-4 py-2 sm:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] gap-2.5 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] transition-all focus-within:ring-2 focus-within:ring-neutral-400/25 focus-within:border-neutral-300">
          <span className="text-neutral-500 text-xs sm:text-sm select-none">✦</span>
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendDesire(inputText, activeDockedNode);
              }
            }}
            placeholder={activeDockedNode ? `Ask or instruct about ${activeDockedNode.label}...` : "Tell C-Link what should happen..."}
            className="bg-transparent border-0 outline-none text-xs sm:text-[13px] text-neutral-800 placeholder:text-neutral-400 flex-1 min-w-0 font-normal"
          />
          <button
            onClick={handleToggleVoiceInput}
            className={`p-1 rounded-full text-neutral-400 hover:text-neutral-800 transition-colors shrink-0 cursor-pointer ${isListening ? 'text-red-500 animate-pulse' : ''}`}
            title="Voice action (Speech recognition)"
          >
            <Mic size={14} />
          </button>
          {inputText.trim() && (
            <button
              onClick={() => handleSendDesire(inputText, activeDockedNode)}
              className="text-neutral-900 hover:text-black p-1 shrink-0 cursor-pointer"
              title="Send action"
            >
              <Send size={12} />
            </button>
          )}
        </div>

        {/* Right: Projection Switcher & Ledger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center bg-neutral-200/50 p-0.5 rounded-full text-[10px]">
            <button
              onClick={() => {
                setProjectionMode('SPATIAL_TREE');
                playHapticTone(540, 720, 0.15);
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                projectionMode === 'SPATIAL_TREE'
                  ? 'bg-white text-neutral-900 shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              🌿 Tree
            </button>
            <button
              onClick={() => {
                setProjectionMode('UNIFIED');
                playHapticTone(520, 680, 0.15);
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                projectionMode === 'UNIFIED'
                  ? 'bg-white text-neutral-900 shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              ✦ Unified
            </button>
            <button
              onClick={() => {
                setProjectionMode('STREAM');
                playHapticTone(500, 640, 0.15);
              }}
              className={`hidden sm:inline-block px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                projectionMode === 'STREAM'
                  ? 'bg-white text-neutral-900 shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              💬 Stream
            </button>
          </div>

          <button
            onClick={() => {
              setIsRealityInboxOpen(true);
              playHapticTone(560, 720, 0.15);
            }}
            className="text-[11px] font-medium text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 transition-colors bg-white border border-neutral-200/80 rounded-full px-2.5 sm:px-3 py-1.5 shadow-xs cursor-pointer"
            title="Reality Inbox: Material causal updates only"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline font-sans text-xs">Reality Inbox</span>
            <span className="text-[9.5px] font-mono font-semibold bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded-full">3</span>
          </button>

          <button
            onClick={onOpenLedger}
            className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 uppercase tracking-widest flex items-center gap-1.5 transition-colors bg-white border border-neutral-200/70 rounded-full px-3 py-1.5 shadow-xs cursor-pointer"
          >
            <History size={12} />
            <span className="hidden sm:inline">Ledger</span>
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* OATHLINK AGENT RUNTIME STRIP: Bound Digital Representative   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="pt-2 px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-2 z-20 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Your OathLink Agent Pill */}
          <button
            onClick={() => {
              setIsAgentAuthorityModalOpen(true);
              playHapticTone(520, 680, 0.15);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-neutral-200/90 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all text-xs cursor-pointer group"
            title="Configure Your OathLink Agent Authority & Policy Boundaries"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-neutral-900 group-hover:text-amber-700 transition-colors">
              Your Agent: Karim&apos;s Agent
            </span>
            <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.5 rounded-md">
              ≤ ৳{buyerAgentPolicy.maxPricePerUnit}/kg
            </span>
            <span className="text-[10px] text-amber-700 font-medium">Policy ⚙</span>
          </button>

          {/* While You Were Away Pill */}
          <button
            onClick={() => {
              setIsWhileAwayModalOpen(true);
              playHapticTone(560, 720, 0.15);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 transition-colors text-xs font-medium cursor-pointer"
            title="Actions and autonomous negotiations resolved while you were away"
          >
            <span className="text-amber-600 font-mono text-[11px]">✦</span>
            <span>While You Were Away</span>
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] flex items-center justify-center font-mono font-bold">
              3
            </span>
          </button>

          {/* Autonomous Agent Bargaining Simulator */}
          <button
            onClick={() => {
              setIsNegotiationDockOpen(true);
              playHapticTone(580, 780, 0.15);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-neutral-200/80 hover:bg-neutral-50 transition-colors text-xs text-neutral-800 shadow-2xs cursor-pointer"
            title="Watch Karim's Agent & Liton's Agent negotiate while both humans are offline"
          >
            <Handshake size={12} className="text-amber-600" />
            <span>Agent Bargain (Karim ↔ Liton)</span>
          </button>
        </div>

        {/* Operational Realities: Escrow, Challan, Shareable C-Link */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setIsEscrowModalOpen(true);
              playHapticTone(540, 700, 0.15);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200/80 hover:bg-neutral-50 text-[11px] font-medium text-neutral-700 shadow-2xs cursor-pointer"
            title="bKash Escrow Vault & Fuel Advance"
          >
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Escrow Vault</span>
          </button>

          <button
            onClick={() => {
              setActiveOperationalDoc(DEFAULT_CHALLAN_DOC);
              playHapticTone(520, 660, 0.15);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200/80 hover:bg-neutral-50 text-[11px] font-medium text-neutral-700 shadow-2xs cursor-pointer"
            title="Official Delivery Challan & Weighbridge Certificate"
          >
            <FileText size={12} className="text-blue-600" />
            <span>Challan & Pass</span>
          </button>

          <button
            onClick={() => {
              setIsShareCLinkModalOpen(true);
              playHapticTone(500, 640, 0.15);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200/80 hover:bg-neutral-50 text-[11px] font-medium text-neutral-700 shadow-2xs cursor-pointer"
            title="Generate Shareable C-Link for External Actor"
          >
            <Share2 size={12} className="text-purple-600" />
            <span>Share C-Link</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Main Surface: Desire Composer vs Living Materialization       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-8 py-3 pb-36 sm:pb-28 flex flex-col items-center justify-start relative">
        <div className={`w-full ${isDesireInitiated && projectionMode === 'UNIFIED' ? 'max-w-5xl' : 'max-w-2xl'} flex flex-col items-center transition-all duration-300`}>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 1. FIRST SCREEN: Pure Desire Composer + Questions Carousel   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {!isDesireInitiated ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springTransition}
              className="w-full max-w-lg min-h-[75vh] flex flex-col items-center justify-center text-center px-2 py-8"
            >
              {/* Monogram */}
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-lg font-mono font-semibold shadow-md mb-6">
                ✦
              </div>

              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-2">
                What do you want to make true?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mb-8 leading-relaxed">
                কোনো একাউন্ট বা ড্যাশবোর্ড খোলার দরকার নেই। শুধু বাংলায় বা ইংরেজিতে বলুন আপনি বাস্তবতায় কী ঘটাতে চান—বাকিটা C-Link সমন্বয় করবে।
              </p>

              {/* Central Desire Composer Input Box */}
              <div className="w-full bg-white rounded-3xl p-3 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] border border-neutral-200/80 mb-6 transition-all focus-within:border-neutral-400 focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendDesire(inputText);
                    }
                  }}
                  rows={3}
                  placeholder="Tell C-Link what you want..."
                  className="w-full bg-transparent border-0 outline-none text-neutral-900 text-sm sm:text-base placeholder:text-neutral-400 resize-none font-normal leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span>Press Enter ↵ to project</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleVoiceInput}
                      className={`p-2.5 rounded-full transition-all cursor-pointer ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                      title="Microphone input"
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>

                    <button
                      onClick={() => handleSendDesire(inputText)}
                      disabled={!inputText.trim() || isProcessing}
                      className="bg-neutral-900 hover:bg-black disabled:opacity-30 text-white rounded-full p-2.5 px-4 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Make True</span>
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Semantic Questions Carousel (Non-form prompts) */}
              <div className="w-full bg-white/60 backdrop-blur-xs rounded-2xl p-4 border border-neutral-200/60 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                    Semantic Inquiry Prompts
                  </span>
                  <div className="flex items-center gap-1">
                    {SEMANTIC_CAROUSEL_QUESTIONS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCarouselIndex(idx);
                          playHapticTone(500, 600, 0.1);
                        }}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          carouselIndex === idx ? 'bg-neutral-900 scale-125' : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="min-h-[64px] flex flex-col justify-center">
                  <div className="text-xs font-semibold text-neutral-900 mb-0.5">
                    {SEMANTIC_CAROUSEL_QUESTIONS[carouselIndex].question}
                  </div>
                  <div className="text-[11px] text-neutral-500 mb-2">
                    {SEMANTIC_CAROUSEL_QUESTIONS[carouselIndex].hint}
                  </div>

                  {/* Clickable prompt sample to test instantly */}
                  <button
                    onClick={() => {
                      setInputText(SEMANTIC_CAROUSEL_QUESTIONS[carouselIndex].sample);
                      playHapticTone(520, 640, 0.15);
                    }}
                    className="text-left text-xs bg-white border border-neutral-200/80 rounded-xl p-2.5 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate mr-2 font-medium">"{SEMANTIC_CAROUSEL_QUESTIONS[carouselIndex].sample}"</span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-neutral-800 shrink-0">Use prompt →</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-100 text-[10px] text-neutral-400">
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : SEMANTIC_CAROUSEL_QUESTIONS.length - 1))}
                    className="hover:text-neutral-900 flex items-center gap-0.5 cursor-pointer"
                  >
                    <ChevronLeft size={12} /> Previous
                  </button>
                  <span>{carouselIndex + 1} of {SEMANTIC_CAROUSEL_QUESTIONS.length}</span>
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev < SEMANTIC_CAROUSEL_QUESTIONS.length - 1 ? prev + 1 : 0))}
                    className="hover:text-neutral-900 flex items-center gap-0.5 cursor-pointer"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>

            </motion.div>
          ) : (
            
            /* ═══════════════════════════════════════════════════════════ */
            /* 2. LIVING REALITY SURFACE: MERGED COMPOSER & SPATIAL TREE   */
            /* ═══════════════════════════════════════════════════════════ */
            <div className="w-full flex flex-col items-center">
              {projectionMode === 'SPATIAL_TREE' ? (
                <div className="w-full max-w-3xl flex flex-col items-center space-y-4 py-2">
                  <AnimatePresence mode="wait">
                    {isSpatialTreeVisible ? (
                      <motion.div
                        key="spatial-tree-visible"
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="w-full flex flex-col items-center"
                      >
                        <SpatialTreeProjection
                          activeScenario={activeScenario}
                          onScenarioChange={setActiveScenario}
                          hospitalState={hospitalState}
                          intents={intents}
                          needs={needs}
                          capabilities={capabilities}
                          actors={actors}
                          gaps={gaps}
                          commitments={commitments}
                          evidences={evidences}
                          isDriverAssigned={isDriverAssigned}
                          isScaleVerified={isScaleVerified}
                          isRealitySettled={isRealitySettled}
                          onSelectAction={handleSendDesire}
                          onPlayHaptic={playHapticTone}
                          isCompact={false}
                          activeSelectedNodeId={activeDockedNode?.id || null}
                          onNodeSelect={(node) => {
                            setActiveDockedNode(node);
                            if (node) {
                              playHapticTone(540, 720, 0.15);
                            }
                          }}
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              setProjectionMode('UNIFIED');
                              playHapticTone(520, 680, 0.15);
                            }}
                            className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200/90 rounded-full px-4 py-1.5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>💬 View Living Stream & Scale Verification Studio</span>
                            <span className="text-neutral-400">→</span>
                          </button>
                        </div>
                        <div className="text-center text-[11px] text-neutral-400 py-1">
                          <span>✦ Touch any node above or use the Composer below to command reality</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="spatial-tree-hidden"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="w-full max-w-xl py-4 flex flex-col items-center space-y-4"
                      >
                        <div className="p-3.5 bg-white/95 border border-neutral-200/80 rounded-2xl shadow-xs text-xs text-neutral-600 flex items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-900 font-serif text-sm">✦</span>
                            <span>Spatial Tree is folded. Tap <strong>C-LINK</strong> in the top bar to project the tree.</span>
                          </div>
                          <button
                            onClick={() => {
                              setIsSpatialTreeVisible(true);
                              playHapticTone(520, 680, 0.15);
                            }}
                            className="text-[11px] font-medium bg-neutral-900 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-black transition-colors shrink-0"
                          >
                            Project Tree
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className={`w-full ${projectionMode === 'UNIFIED' ? 'flex flex-col lg:flex-row items-start justify-center gap-8' : 'flex flex-col items-center'}`}>
                  
                  {/* In UNIFIED mode: Living Spatial Tree on Left / Sticky */}
                  {projectionMode === 'UNIFIED' && isSpatialTreeVisible && (
                    <div className="w-full lg:w-7/12 flex flex-col items-center lg:sticky lg:top-2">
                      <SpatialTreeProjection
                        activeScenario={activeScenario}
                        onScenarioChange={setActiveScenario}
                        hospitalState={hospitalState}
                        intents={intents}
                        needs={needs}
                        capabilities={capabilities}
                        actors={actors}
                        gaps={gaps}
                        commitments={commitments}
                        evidences={evidences}
                        isDriverAssigned={isDriverAssigned}
                        isScaleVerified={isScaleVerified}
                        isRealitySettled={isRealitySettled}
                        onSelectAction={handleSendDesire}
                        onPlayHaptic={playHapticTone}
                        isCompact={false}
                        activeSelectedNodeId={activeDockedNode?.id || null}
                        onNodeSelect={(node) => {
                          setActiveDockedNode(node);
                          if (node) {
                            playHapticTone(540, 720, 0.15);
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Conversation Stream */}
                  <div className="w-full lg:w-5/12 max-w-[440px] space-y-4 mx-auto">
                    {/* In STREAM mode: In-Stream Spatial Tree Preview Card */}
                    {projectionMode === 'STREAM' && (
                      <div className="bg-white/80 rounded-3xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2 mb-2">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                            <Network size={13} className="text-neutral-600" />
                            <span>Living Causal Tree</span>
                          </div>
                          <button
                            onClick={() => {
                              setProjectionMode('SPATIAL_TREE');
                              playHapticTone(520, 680, 0.15);
                            }}
                            className="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                          >
                            Expand Tree ↗
                          </button>
                        </div>
                        <SpatialTreeProjection
                          activeScenario={activeScenario}
                          onScenarioChange={setActiveScenario}
                          hospitalState={hospitalState}
                          intents={intents}
                          needs={needs}
                          capabilities={capabilities}
                          actors={actors}
                          gaps={gaps}
                          commitments={commitments}
                          evidences={evidences}
                          isDriverAssigned={isDriverAssigned}
                          isScaleVerified={isScaleVerified}
                          isRealitySettled={isRealitySettled}
                          onSelectAction={handleSendDesire}
                          onPlayHaptic={playHapticTone}
                          isCompact={true}
                        />
                      </div>
                    )}

                    {/* Attention-Only Filter Active Notice */}
                    {isAttentionOnlyFilterActive && (
                      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-600 font-bold">⚡</span>
                          <span><strong>Attention Mode:</strong> Showing only active decision frontiers</span>
                        </div>
                        <button
                          onClick={() => {
                            setIsAttentionOnlyFilterActive(false);
                            playHapticTone(500, 620, 0.1);
                          }}
                          className="text-[10px] font-semibold bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                        >
                          Show Full Stream
                        </button>
                      </div>
                    )}

                    {/* Living Conversation Stream */}
                    {(isAttentionOnlyFilterActive
                      ? messages.filter(m => m.materializedComponent === 'SPLIT_CARD' || m.materializedComponent === 'CONFLICT_CARD' || m.materializedComponent === 'CONSTRAINT_CARD' || (m.choices && m.choices.length > 0) || m.sender === 'user')
                      : messages
                    ).map((msg) => (
                <div key={msg.id} className="space-y-3">
                  
                  {/* Human User Message */}
                  {msg.sender === 'user' && (
                    <div className="flex flex-col items-end gap-1">
                      {msg.dockedCausalCard && (
                        <div className="flex items-center gap-1.5 bg-[#FAF7F0] border border-neutral-300/80 rounded-xl px-2.5 py-1 text-[11px] text-neutral-800 shadow-2xs">
                          <span className="text-[9px] uppercase font-mono tracking-widest bg-neutral-900 text-white px-1.5 py-0.2 rounded font-medium">
                            {msg.dockedCausalCard.label}
                          </span>
                          <span className="font-semibold text-neutral-900 truncate max-w-[150px]">
                            {msg.dockedCausalCard.value}
                          </span>
                          <span className="text-[9.5px] text-neutral-500 font-mono">
                            [{msg.dockedCausalCard.status}]
                          </span>
                        </div>
                      )}
                      <div className="flex justify-end items-center gap-2">
                        <div className="bg-white border border-neutral-200/80 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs text-neutral-800 shadow-xs max-w-[85%] leading-relaxed">
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-neutral-400">You</span>
                      </div>
                    </div>
                  )}

                  {/* C-Link AI Message */}
                  {msg.sender === 'clink' && (
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                        ✦
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-neutral-400 block mb-0.5">C-Link</span>
                        <div className="bg-white border border-neutral-200/80 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-neutral-800 shadow-xs leading-relaxed">
                          {msg.text}

                          {/* Structured Semantic Choice Primitives (Rule 3) */}
                          {msg.choices && msg.choices.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-wrap gap-1.5">
                              {msg.choices.map((choice, cIdx) => (
                                <button
                                  key={cIdx}
                                  onClick={() => handleChoiceSelect(choice)}
                                  className="text-[11px] font-medium bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-lg px-2.5 py-1 text-neutral-800 transition-colors cursor-pointer"
                                >
                                  [{choice.label}]
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* External Actor Message in Shared Inbox */}
                  {msg.sender === 'actor' && (
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        <AvatarOutlineIcon size={12} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5 justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-neutral-900">{msg.actorName}</span>
                            <span className="text-[9px] uppercase tracking-wider bg-neutral-100 px-1 py-0.2 rounded text-neutral-500">
                              {msg.actorRole}
                            </span>
                            {msg.epistemicType && (
                              <span className="text-[8.5px] font-mono uppercase bg-neutral-200/80 text-neutral-700 px-1 py-0.2 rounded">
                                {msg.epistemicType}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setActiveExplainData({
                                title: `WHY ${msg.actorName?.toUpperCase() || 'THIS ACTOR'} IS HERE`,
                                whyHere: `আপনার ৫০ কেজি চালের requirement-এর সঙ্গে ${msg.actorName}-এর declared capability মিলে গেছে। তারা এখনও commitment দেয়নি।`,
                                causalChain: [
                                  'Need: Rice 50kg for Restaurant',
                                  'Required capability: Commercial Bagging & Transport',
                                  `${msg.actorName} capability matched in ledger`,
                                  'Candidate surfaced for mutual commitment'
                                ],
                                actorRole: msg.actorRole
                              });
                              playHapticTone(520, 680, 0.15);
                            }}
                            className="text-[9px] text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                          >
                            Why {msg.actorName?.split(' ')[0]}?
                          </button>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-neutral-800 shadow-xs leading-relaxed">
                          {msg.text}

                          {/* Expandable Semantic Trace (Philosophical Principle #1) */}
                          {msg.semanticTrace && (
                            <div className="mt-2.5 pt-2 border-t border-emerald-200/60">
                              <button
                                onClick={() => toggleSemanticTrace(msg.id)}
                                className="text-[10px] font-mono text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>✦ {expandedTraceMessageIds[msg.id] ? 'Hide semantic trace' : 'Show semantic trace'}</span>
                              </button>
                              {expandedTraceMessageIds[msg.id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-1.5 p-2.5 bg-emerald-100/50 border border-emerald-200/80 rounded-xl text-[10px] font-mono text-neutral-800 space-y-1 leading-normal"
                                >
                                  <div className="text-neutral-600">{msg.semanticTrace.actorAction}</div>
                                  <div className="text-emerald-600 pl-2">↓</div>
                                  <div className="text-neutral-900 font-semibold">{msg.semanticTrace.capabilityImpact}</div>
                                  <div className="text-emerald-600 pl-2">↓</div>
                                  <div className="text-neutral-700">{msg.semanticTrace.affects}</div>
                                  <div className="text-emerald-600 pl-2">↓</div>
                                  <div className="text-emerald-900 font-bold">{msg.semanticTrace.currentReality}</div>
                                </motion.div>
                              )}
                            </div>
                          )}

                          {/* Actor Choices */}
                          {msg.choices && msg.choices.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-emerald-100 flex flex-wrap gap-1.5">
                              {msg.choices.map((choice, cIdx) => (
                                <button
                                  key={cIdx}
                                  onClick={() => handleChoiceSelect(choice)}
                                  className="text-[11px] font-medium bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg px-2.5 py-1 text-emerald-900 transition-colors cursor-pointer"
                                >
                                  [{choice.label}]
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Autonomous Agent Message */}
                  {msg.sender === 'agent' && (
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 text-purple-800 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        🤖
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-semibold text-neutral-900">{msg.actorName || 'Autonomous Agent'}</span>
                          <span className="text-[9px] uppercase tracking-wider bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-medium">
                            {msg.actorRole || 'Agent'}
                          </span>
                          <span className="text-[8.5px] font-mono bg-neutral-100 text-neutral-600 px-1 py-0.2 rounded">
                            DELEGATED
                          </span>
                        </div>
                        <div className="bg-purple-50/40 border border-purple-200/70 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-neutral-800 shadow-xs leading-relaxed">
                          {msg.text}

                          {msg.choices && msg.choices.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-purple-100 flex flex-wrap gap-1.5">
                              {msg.choices.map((choice, cIdx) => (
                                <button
                                  key={cIdx}
                                  onClick={() => handleChoiceSelect(choice)}
                                  className="text-[11px] font-medium bg-white hover:bg-purple-100/60 border border-purple-200 rounded-lg px-2.5 py-1 text-purple-900 transition-colors cursor-pointer"
                                >
                                  [{choice.label}]
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IoT / Sensor Message (e.g. Digital Scale) */}
                  {msg.sender === 'sensor' && (
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        ⚡
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-semibold text-neutral-900">{msg.actorName || 'Hardware Sensor'}</span>
                          <span className="text-[8.5px] font-mono bg-blue-50 text-blue-800 px-1 py-0.2 rounded">
                            OBSERVED
                          </span>
                        </div>
                        <div className="bg-blue-50/40 border border-blue-200/60 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-neutral-800 shadow-xs leading-relaxed">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* PROGRESSIVE CAUSAL MATERIALIZATION PRIMITIVES             */}
                  {/* ───────────────────────────────────────────────────────── */}

                  {/* 1. WANT & WHAT MUST BE TRUE */}
                  {msg.materializedComponent === 'WANT_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-700">
                            <IsometricCubeIcon size={14} />
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">WANT</div>
                            <div className="text-xs font-semibold text-neutral-900">50 kg rice</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-neutral-400">Needed: Tomorrow</span>
                      </div>

                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                          WHAT MUST BE TRUE
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                            <span className="text-neutral-700 font-medium">○ Rice supply capability</span>
                            <span className="text-[10px] text-neutral-400">Available</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                            <span className="text-neutral-700 font-medium">○ Responsible actor (Rahim Foods)</span>
                            <span className="text-[10px] text-amber-600 font-medium">Proposed</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                            <span className="text-neutral-700 font-medium">○ Delivery to Uttara Supershop</span>
                            <span className="text-[10px] text-neutral-400">Open condition</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 2. COMMITMENT FORMATION */}
                  {msg.materializedComponent === 'COMMITMENT_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-2.5 my-2"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
                          CANONICAL COMMITMENT
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                          <Check size={11} /> Formed
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-neutral-400 font-semibold text-[10px]">AGREED</span>
                        <span className="font-semibold text-neutral-900">50kg rice</span>
                      </div>
                      <CausalDownArrow />
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-neutral-400 font-semibold text-[10px]">WHO</span>
                        <span className="font-semibold text-neutral-900">Rahim Foods</span>
                      </div>
                      <CausalDownArrow />
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-neutral-400 font-semibold text-[10px]">CURRENT FRONTIER</span>
                        <span className="font-semibold text-amber-800">Transport & Physical Proof</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 3. TRANSPORT & CAUSAL WHY */}
                  {msg.materializedComponent === 'TRANSPORT_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3 my-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DeliveryVanIcon size={14} className="text-neutral-700" />
                          <span className="text-xs font-semibold text-neutral-900">TRANSPORT DISPATCH</span>
                        </div>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          Driver Assigned
                        </span>
                      </div>

                      <div className="bg-[#FAF8F5] border border-neutral-200/70 rounded-2xl p-3 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Driver</span>
                          <span className="font-medium text-neutral-900">Tariq M. (HiAce #DHK-4421)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Route</span>
                          <span className="font-medium text-neutral-900">Gazipur Hub → Uttara Sector 4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">ETA</span>
                          <span className="font-medium text-emerald-700">15 mins</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 4. PHYSICAL PROOF STUDIO */}
                  {msg.materializedComponent === 'PROOF_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-4 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                        <div className="flex items-center gap-2">
                          <BellWeightIcon size={14} className="text-neutral-700" />
                          <span className="text-xs font-semibold text-neutral-900">PHYSICAL PROOF (50 KG RICE)</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isScaleVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {isScaleVerified ? '✓ Verified' : 'Awaiting Proof'}
                        </span>
                      </div>

                      {/* Photo preview box */}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />

                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
                      >
                        {proofPhotoPreview ? (
                          <img src={proofPhotoPreview} alt="Proof" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-center p-3">
                            <Camera size={20} className="text-neutral-400 mb-1" />
                            <span className="text-xs font-medium text-neutral-700">বস্তা ও স্কেলের ছবি তুলুন</span>
                            <span className="text-[10px] text-neutral-400">Click to upload consignment photo</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Weight Calibrator */}
                      <div className="bg-[#FAF8F5] border border-neutral-200/80 rounded-2xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-500">Digital Scale Reading:</span>
                          <span className="font-mono font-bold text-sm text-neutral-900">
                            {proofWeightKg.toFixed(1)} kg
                          </span>
                        </div>

                        <input
                          type="range"
                          min="45.0"
                          max="55.0"
                          step="0.5"
                          value={proofWeightKg}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setProofWeightKg(val);
                            if (Math.abs(50.0 - val) <= 0.5) {
                              setIsScaleVerified(true);
                            }
                          }}
                          className="w-full accent-neutral-900 cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400">Target: 50.0 kg</span>
                          <span className={isWeightWithinTolerance ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                            {isWeightWithinTolerance ? '✓ Exact Tolerance (+/- 0.5kg)' : `Deficit: ${weightDeficit.toFixed(1)} kg`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleExecuteProofSubmission}
                        className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-medium py-3 rounded-full shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check size={13} />
                        <span>Submit Physical Proof to Ledger</span>
                      </button>
                    </motion.div>
                  )}

                  {/* 5. OUTCOME SETTLED */}
                  {msg.materializedComponent === 'OUTCOME_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-3 my-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-700" />
                          <span className="text-xs font-bold text-emerald-900">REALITY SETTLED (OUTCOME)</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
                          BLOCK #88412
                        </span>
                      </div>

                      <div className="text-xs text-emerald-950 space-y-1 leading-relaxed">
                        <div>• <strong>Desire:</strong> ৫০ কেজি নাজিরশাইল চাল রেস্টুরেন্টের জন্য।</div>
                        <div>• <strong>Supplier:</strong> Rahim Foods (Agreed & Delivered)</div>
                        <div>• <strong>Transport:</strong> Tariq M. (Received by Uttara Supershop)</div>
                        <div>• <strong>Evidence:</strong> Certified 50.0 kg scale digital voucher.</div>
                      </div>

                      <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-800">C-Link Causal Integrity Sealed</span>
                        <button
                          onClick={handleResetToDesireComposer}
                          className="text-[11px] font-medium text-emerald-900 bg-white border border-emerald-300 rounded-full px-3 py-1 hover:bg-emerald-100/50 cursor-pointer"
                        >
                          ✦ Start Next Desire
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 6. HOSPITAL APPOINTMENT VERIFICATION */}
                  {msg.materializedComponent === 'APPOINTMENT_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-700 font-bold text-xs">
                            ✚
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">CAUSAL CONDITION</div>
                            <div className="text-xs font-semibold text-neutral-900">Hospital Appointment Verification</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          hospitalState.appointmentStatus === 'COMMITTED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {hospitalState.appointmentStatus === 'COMMITTED' ? '✓ Slot Confirmed' : 'Searching Slot'}
                        </span>
                      </div>

                      <div className="bg-[#FAF8F5] border border-neutral-200/70 rounded-2xl p-3 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Hospital:</span>
                          <span className="font-semibold text-neutral-900">Evercare Hospital (Bashundhara)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Specialist:</span>
                          <span className="font-medium text-neutral-900">Dr. Shamsul Alam (Cardiology)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Status:</span>
                          <span className="font-medium text-neutral-800">
                            {hospitalState.appointmentStatus === 'COMMITTED' 
                              ? `Confirmed for ${hospitalState.appointmentSlot || '9:30 AM'}` 
                              : '2 slots available tomorrow morning'}
                          </span>
                        </div>
                      </div>

                      {hospitalState.appointmentStatus !== 'COMMITTED' && (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => handleSendDesire('9:30 AM')}
                            className="flex-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-medium py-2 rounded-xl transition-all cursor-pointer text-center"
                          >
                            [9:30 AM বুক করো]
                          </button>
                          <button
                            onClick={() => handleSendDesire('11:00 AM')}
                            className="flex-1 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-medium py-2 rounded-xl transition-all cursor-pointer text-center"
                          >
                            [11:00 AM বুক করো]
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 7. NEGOTIATION & SPLIT FULFILLMENT */}
                  {msg.materializedComponent === 'SPLIT_CARD' && msg.splitDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 text-xs font-bold">
                            ⇄
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">CAUSAL NEGOTIATION</div>
                            <div className="text-xs font-semibold text-neutral-900">Split Fulfillment Formation</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          {msg.splitDetails.status === 'SPLIT_ACTIVE' ? 'Split Active' : 'Counter-Proposal'}
                        </span>
                      </div>

                      {/* Visual Fulfillment Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-700 font-medium">{msg.splitDetails.committedActor}: {msg.splitDetails.committedAmount} (60%)</span>
                          <span className="text-amber-700 font-medium">Unresolved Gap: {msg.splitDetails.remainingAmount} (40%)</span>
                        </div>
                        <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500 w-[60%]" title="Committed portion" />
                          <div className="h-full bg-amber-400 w-[40%] animate-pulse" title="Unresolved gap" />
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] border border-neutral-200/70 rounded-2xl p-3 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Total Requirement:</span>
                          <span className="font-semibold text-neutral-900">50 kg Rice</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">First Resolver:</span>
                          <span className="font-medium text-emerald-700">{msg.splitDetails.committedActor} ({msg.splitDetails.committedAmount})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Causal Gap:</span>
                          <span className="font-medium text-amber-700">{msg.splitDetails.remainingAmount} remaining</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 8. ATTENTION COMPRESSION (DELTA) */}
                  {msg.materializedComponent === 'DELTA_CARD' && msg.deltaItems && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                            ✦
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">ATTENTION COMPRESSION</div>
                            <div className="text-xs font-semibold text-neutral-900">While You Were Away (Causal Delta)</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                          5 Events Recomputed
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {msg.deltaItems.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 p-2 rounded-xl bg-neutral-50/80 border border-neutral-100">
                            <span className="text-xs shrink-0 mt-0.5">
                              {item.status === 'POSITIVE' ? '✓' : item.status === 'WARNING' ? '⚠' : '•'}
                            </span>
                            <span className={item.status === 'WARNING' ? 'text-amber-900 font-medium' : 'text-neutral-800'}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 9. CAUSAL EXPLAINABILITY */}
                  {msg.materializedComponent === 'EXPLAIN_CARD' && msg.causalExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-mono font-bold">
                            ?
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">CAUSAL EXPLAINABILITY</div>
                            <div className="text-xs font-semibold text-neutral-900">{msg.causalExplanation.title}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-800 leading-relaxed font-sans">
                        {msg.causalExplanation.whyHere}
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                          CAUSAL DEPENDENCY PATH
                        </div>
                        <div className="space-y-1 text-[11.5px]">
                          {msg.causalExplanation.chain.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-neutral-700">
                              <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-700 text-[10px] flex items-center justify-center font-mono shrink-0">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 10. AUTONOMOUS AGENT DELEGATION */}
                  {msg.materializedComponent === 'DELEGATE_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center text-xs font-semibold">
                            🤖
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">AGENT DELEGATION</div>
                            <div className="text-xs font-semibold text-neutral-900">Procurement & Capability Scanner</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                          Active Worker
                        </span>
                      </div>

                      <div className="bg-[#FAF8F5] border border-neutral-200/70 rounded-2xl p-3 text-xs space-y-2">
                        <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                          AUTHORITY BOUNDARIES
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 text-emerald-800">
                            <span>✓</span>
                            <span>Capability Search: <strong>Allowed</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-800">
                            <span>✓</span>
                            <span>Price Compare: <strong>Allowed</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-800">
                            <span>✓</span>
                            <span>Propose Match: <strong>Allowed</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-800">
                            <span>✕</span>
                            <span>Commit Funds: <strong>Human Approval</strong></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 11. ZEN SILENCE (NOTHING TO DO) */}
                  {msg.materializedComponent === 'SILENCE_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={springTransition}
                      className="bg-[#FAF9F6] border border-neutral-200/80 rounded-3xl p-6 shadow-2xs space-y-3 text-center my-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400 text-sm">
                        ○
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-neutral-900">শান্ত বাস্তবতা (Reality in Equilibrium)</div>
                        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                          আপনার কোনো Work এই মুহূর্তে আপনার সিদ্ধান্তের অপেক্ষায় নেই। যদি বাস্তবতা আপনার সাড়া না চায়, C-Link শান্ত থাকে। কোনো ফেক অ্যালার্ট বা নোটিফিকেশন স্প্যাম নেই।
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* 12. TEMPORAL CONFLICT RESOLVER */}
                  {msg.materializedComponent === 'CONFLICT_CARD' && msg.conflictDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-amber-50/50 border border-amber-200/80 rounded-3xl p-5 shadow-xs space-y-3 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-800 font-bold text-sm">⚠</span>
                          <span className="text-xs font-semibold text-amber-950">TEMPORAL CONFLICT DETECTED</span>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                          2h Discrepancy
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-neutral-800">
                        <div className="flex justify-between p-2 rounded-xl bg-white/80 border border-amber-100">
                          <span className="text-neutral-500">Supplier Ready:</span>
                          <span className="font-semibold text-neutral-900">{msg.conflictDetails.supplierTime}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-white/80 border border-amber-100">
                          <span className="text-neutral-500">Required Target:</span>
                          <span className="font-semibold text-neutral-900">{msg.conflictDetails.requiredTime}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-white/80 border border-amber-100">
                          <span className="text-neutral-500">Driver Window:</span>
                          <span className="font-semibold text-amber-800">{msg.conflictDetails.driverTime}</span>
                        </div>
                      </div>

                      <p className="text-[11.5px] text-amber-900 leading-snug">
                        {msg.conflictDetails.summary}
                      </p>
                    </motion.div>
                  )}

                  {/* 13. LIVING CONSTRAINT INSPECTOR */}
                  {msg.materializedComponent === 'CONSTRAINT_CARD' && msg.constraintDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-[#FAF9F5] border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 font-bold text-sm">✦</span>
                          <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">
                            {msg.constraintDetails.type} CONSTRAINT ACTIVE
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                          {msg.constraintDetails.value}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {msg.constraintDetails.impact}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                          CANDIDATE CAPABILITY AUDIT
                        </div>
                        {msg.constraintDetails.evaluations.map((ev, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-100 text-xs">
                            <span className="font-medium text-neutral-800">{ev.candidate}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-neutral-500">{ev.note}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                                ev.status === 'MET'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {ev.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 14. CAUSAL CATCH-UP ENGINE */}
                  {msg.materializedComponent === 'CATCHUP_CARD' && msg.catchupDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          <span className="text-xs font-semibold text-neutral-900">
                            Causal Attention Summary (Since You Left)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                          {msg.catchupDetails.totalEvents} Causal Transitions
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60">
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Resolved Gaps</div>
                          <div className="text-base font-bold text-emerald-800">{msg.catchupDetails.resolvedGaps}</div>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                          <div className="text-[10px] text-amber-800 uppercase tracking-wider font-mono">Pending Decisions</div>
                          <div className="text-base font-bold text-amber-900">{msg.catchupDetails.pendingDecisions}</div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                          CAUSAL STAGE PROGRESSION
                        </div>
                        {msg.catchupDetails.stages.map((st, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                              st.settled ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-amber-100 text-amber-900 font-bold'
                            }`}>
                              {st.settled ? '✓' : '○'}
                            </span>
                            <div className="flex-1">
                              <span className="font-semibold text-neutral-900">{st.stage}:</span>{' '}
                              <span className="text-neutral-600">{st.summary}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 15. CAUSAL WHAT-IF SIMULATOR */}
                  {msg.materializedComponent === 'WHAT_IF_CARD' && msg.whatIfDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-neutral-200/90 space-y-4 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-800 text-xs font-bold font-mono">
                            𝛙
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold font-mono">CAUSAL SIMULATOR</div>
                            <div className="text-xs font-semibold text-neutral-900">What-If Branching Consequence Preview</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-violet-100 text-violet-900 px-2 py-0.5 rounded-full font-medium">
                          Counterfactual
                        </span>
                      </div>

                      <div className="text-xs text-neutral-600 font-medium">
                        {msg.whatIfDetails.question}
                      </div>

                      {/* Branches Grid */}
                      <div className="space-y-2.5">
                        {/* Branch A */}
                        <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 hover:border-violet-300 transition-all space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900 font-sans">
                              {msg.whatIfDetails.branchA.title}
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-800">
                              {msg.whatIfDetails.branchA.cost}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-neutral-600 font-mono">
                            <div className="bg-white p-1.5 rounded-lg border border-neutral-100">
                              <span className="text-[9px] text-neutral-400 block uppercase">Time Target</span>
                              <span className="font-semibold text-neutral-800">{msg.whatIfDetails.branchA.time}</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-neutral-100">
                              <span className="text-[9px] text-neutral-400 block uppercase">Friction</span>
                              <span className="font-semibold text-amber-700">{msg.whatIfDetails.branchA.coordination}</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-neutral-100">
                              <span className="text-[9px] text-neutral-400 block uppercase">Causal Risk</span>
                              <span className="font-semibold text-neutral-800">{msg.whatIfDetails.branchA.risk}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleChoiceSelect({ label: 'পাথ ক গ্রহণ করো', action: msg.whatIfDetails!.branchA.action })}
                            className="w-full text-center text-xs py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-medium cursor-pointer transition-colors"
                          >
                            পাথ ক নির্বাচন করুন
                          </button>
                        </div>

                        {/* Branch B */}
                        <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 hover:border-emerald-400 transition-all space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-xs font-bold text-neutral-900 font-sans">
                                {msg.whatIfDetails.branchB.title}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-900">
                              {msg.whatIfDetails.branchB.cost}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-neutral-600 font-mono">
                            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] text-neutral-400 block uppercase">Time Target</span>
                              <span className="font-semibold text-emerald-800">{msg.whatIfDetails.branchB.time}</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] text-neutral-400 block uppercase">Friction</span>
                              <span className="font-semibold text-emerald-800">{msg.whatIfDetails.branchB.coordination}</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] text-neutral-400 block uppercase">Causal Risk</span>
                              <span className="font-semibold text-emerald-800">{msg.whatIfDetails.branchB.risk}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleChoiceSelect({ label: 'পাথ খ গ্রহণ করো (প্রস্তাবিত)', action: msg.whatIfDetails!.branchB.action })}
                            className="w-full text-center text-xs py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium cursor-pointer transition-colors shadow-xs"
                          >
                            পাথ খ নির্বাচন করুন (প্রস্তাবিত অপটিমাল শাখা)
                          </button>
                        </div>

                        {/* Branch C if present */}
                        {msg.whatIfDetails.branchC && (
                          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 hover:border-neutral-400 transition-all space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-900 font-sans">
                                {msg.whatIfDetails.branchC.title}
                              </span>
                              <span className="text-xs font-mono font-bold text-neutral-800">
                                {msg.whatIfDetails.branchC.cost}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-neutral-600 font-mono">
                              <div className="bg-white p-1.5 rounded-lg border border-neutral-100">
                                <span className="text-[9px] text-neutral-400 block uppercase">Time Target</span>
                                <span className="font-semibold text-neutral-800">{msg.whatIfDetails.branchC.time}</span>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-neutral-100">
                                <span className="text-[9px] text-neutral-400 block uppercase">Friction</span>
                                <span className="font-semibold text-neutral-800">{msg.whatIfDetails.branchC.coordination}</span>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-neutral-100">
                                <span className="text-[9px] text-neutral-400 block uppercase">Causal Risk</span>
                                <span className="font-semibold text-neutral-800">{msg.whatIfDetails.branchC.risk}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleChoiceSelect({ label: 'পাথ গ নির্বাচন করো', action: msg.whatIfDetails!.branchC!.action })}
                              className="w-full text-center text-xs py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-medium cursor-pointer transition-colors"
                            >
                              পাথ গ নির্বাচন করুন
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* 16. PHYSICAL TRANSIT LIVE REALITY STRIP */}
                  {msg.materializedComponent === 'TRANSIT_CARD' && msg.transitDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-[#0D1117] text-white rounded-3xl p-5 shadow-xl border border-neutral-800 space-y-4 my-2 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold font-mono">
                              PHYSICAL TRANSIT REALITY
                            </div>
                            <div className="text-xs font-semibold text-white">
                              {msg.transitDetails.driverName} • {msg.transitDetails.vehicle}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-medium">
                          {msg.transitDetails.speed}
                        </span>
                      </div>

                      {/* Transit Milestones Line */}
                      <div className="bg-neutral-900/90 rounded-2xl p-3 border border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-neutral-400">Pickup: {msg.transitDetails.pickupLocation}</span>
                          <span className="text-emerald-400 font-bold">✓ LOADED</span>
                        </div>
                        <div className="flex items-center gap-2 py-1">
                          <div className="h-1.5 flex-1 bg-neutral-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-400 w-[65%]" />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-300 shrink-0">65% En Route</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-medium">📍 {msg.transitDetails.currentLocation}</span>
                          <span className="text-neutral-300 font-mono font-bold">ETA: {msg.transitDetails.eta}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                        <span>{msg.transitDetails.conditionNote}</span>
                        <span className="text-[10px] font-mono text-neutral-500">{msg.transitDetails.gpsTimestamp}</span>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIsRouteModalOpen(true);
                            playHapticTone(600, 800, 0.2);
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-2 rounded-xl transition-all cursor-pointer text-center"
                        >
                          লাইভ রুট ম্যাপ খুলুন
                        </button>
                        <button
                          onClick={() => {
                            setIsProofModalOpen(true);
                            playHapticTone(580, 780, 0.2);
                          }}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium py-2 rounded-xl transition-all cursor-pointer text-center border border-neutral-700"
                        >
                          ডিজিটাল প্রুফ স্লিপ
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 17. EPISTEMIC TRUST GRADIENT MATRIX */}
                  {msg.materializedComponent === 'EPISTEMIC_CARD' && msg.epistemicDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-neutral-200/90 space-y-3.5 my-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 text-xs font-bold font-mono">
                            𝛆
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold font-mono">EPISTEMIC TRUST LAYER</div>
                            <div className="text-xs font-semibold text-neutral-900">{msg.epistemicDetails.actorName}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                          {msg.epistemicDetails.epistemicLevel} (VERIFIED)
                        </span>
                      </div>

                      {/* 3 Epistemic Tiers */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-neutral-500 font-mono uppercase font-bold">Layer 1: Stated Claim</span>
                            <span className="text-[9.5px] text-neutral-400 font-mono">Human Utterance</span>
                          </div>
                          <div className="text-neutral-700">{msg.epistemicDetails.statedClaim}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-blue-800 font-mono uppercase font-bold">Layer 2: Observed Telemetry</span>
                            <span className="text-[9.5px] text-blue-600 font-mono">Hardware IoT Scale</span>
                          </div>
                          <div className="text-blue-950 font-medium">{msg.epistemicDetails.sensorProof}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-emerald-800 font-mono uppercase font-bold">Layer 3: Proven Ledger History</span>
                            <span className="text-[9.5px] text-emerald-700 font-mono font-bold">Immutable Audit</span>
                          </div>
                          <div className="text-emerald-950 font-medium">{msg.epistemicDetails.reputationScore}</div>
                          <div className="text-[9.5px] font-mono text-emerald-700 truncate pt-0.5">
                            Hash: {msg.epistemicDetails.auditProofHash}
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleChoiceSelect({ label: 'Rahim Foods-কে চূড়ান্ত অনুমোদন দিন', action: 'ASK_RAHIM' })}
                          className="bg-neutral-900 hover:bg-black text-white text-xs px-4 py-2 rounded-xl font-medium cursor-pointer transition-colors"
                        >
                          সক্ষমতা নিশ্চিত করে কাজ দিন
                        </button>
                      </div>
                    </motion.div>
                  )}

                </div>
              ))}

                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Sticky Bottom Desire Composer (Active when in flow)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isDesireInitiated && (
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent z-40 flex flex-col items-center">
          
          {/* Fluent Docked Causal Card Expansion */}
          <AnimatePresence>
            {activeDockedNode && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="w-full max-w-xl mb-2.5 bg-[#FAF7F1] border border-[#E8E1D3] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-[0_10px_32px_rgba(0,0,0,0.07)] text-left space-y-2.5"
              >
                {/* Docked Causal Node Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/70">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-neutral-900 text-white px-2 py-0.5 rounded-md font-semibold">
                      {activeDockedNode.label}
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-neutral-900">
                      {activeDockedNode.value}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      activeDockedNode.status === 'ACCEPTED' || activeDockedNode.status === 'COMMITTED'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : activeDockedNode.status === 'GAP'
                        ? 'bg-amber-100 text-amber-950 border border-amber-200'
                        : 'bg-white text-neutral-700 border border-neutral-200'
                    }`}>
                      {activeDockedNode.status}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveDockedNode(null);
                      playHapticTone(400, 500, 0.1);
                    }}
                    className="text-neutral-400 hover:text-neutral-900 text-xs px-2 py-0.5 rounded-full hover:bg-neutral-200/60 cursor-pointer transition-colors"
                    title="Undock card"
                  >
                    ✕
                  </button>
                </div>

                {/* Real-time System Prompt for this specific card */}
                <div className="space-y-2">
                  <div className="flex items-start gap-1.5 text-neutral-800 text-xs sm:text-[13px] leading-snug">
                    <span className="text-neutral-900 text-sm font-serif select-none mt-0.5">✦</span>
                    <span className="font-medium text-neutral-900">
                      {getSuggestedActionText(activeDockedNode)}
                    </span>
                  </div>

                  {/* Contextual Action Chips */}
                  {activeDockedNode.actionChoices && activeDockedNode.actionChoices.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {activeDockedNode.actionChoices.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSendDesire(choice.label, activeDockedNode);
                          }}
                          className="text-[11px] font-medium bg-neutral-900 hover:bg-black active:scale-95 text-white px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <span>[{choice.label}]</span>
                          <Send size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Universal Multi-Actor Persona Switcher (Manifesto Principle #9 & #10) */}
          <div className="w-full max-w-xl flex items-center justify-between px-1 mb-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold font-mono mr-0.5 shrink-0">
                Persona:
              </span>

              {/* Karim (You) */}
              <button
                onClick={() => {
                  setActivePersona('KARIM');
                  playHapticTone(500, 600, 0.1);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer font-medium shrink-0 ${
                  activePersona === 'KARIM'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/70'
                }`}
              >
                <span>👤</span>
                <span>Karim (You)</span>
              </button>

              {/* Liton Mia */}
              <button
                onClick={() => {
                  setActivePersona('LITON');
                  playHapticTone(520, 640, 0.1);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer font-medium shrink-0 ${
                  activePersona === 'LITON'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/70'
                }`}
              >
                <span>🌾</span>
                <span>Liton Mia</span>
                <span className={`text-[9px] uppercase px-1 rounded ${activePersona === 'LITON' ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-900'}`}>Actor</span>
              </button>

              {/* Rahim Foods */}
              <button
                onClick={() => {
                  setActivePersona('RAHIM');
                  playHapticTone(540, 680, 0.1);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer font-medium shrink-0 ${
                  activePersona === 'RAHIM'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/70'
                }`}
              >
                <span>🏢</span>
                <span>Rahim Foods</span>
                <span className={`text-[9px] uppercase px-1 rounded ${activePersona === 'RAHIM' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-900'}`}>Actor</span>
              </button>

              {/* Procurement Agent */}
              <button
                onClick={() => {
                  setActivePersona('AGENT');
                  playHapticTone(580, 720, 0.1);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer font-medium shrink-0 ${
                  activePersona === 'AGENT'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/70'
                }`}
              >
                <span>✦</span>
                <span>Procurement Agent</span>
                <span className={`text-[9px] uppercase px-1 rounded font-mono ${activePersona === 'AGENT' ? 'bg-purple-950 text-purple-200' : 'bg-purple-100 text-purple-900'}`}>Agent</span>
              </button>

              {/* IoT Digital Scale */}
              <button
                onClick={() => {
                  setActivePersona('SENSOR');
                  playHapticTone(600, 800, 0.1);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer font-medium shrink-0 ${
                  activePersona === 'SENSOR'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/70'
                }`}
              >
                <span>⚖</span>
                <span>IoT Scale</span>
                <span className={`text-[9px] uppercase px-1 rounded font-mono ${activePersona === 'SENSOR' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-900'}`}>Sensor</span>
              </button>
            </div>

            {/* Living Contract Inspector Trigger */}
            <button
              onClick={() => {
                setIsContractModalOpen(true);
                playHapticTone(560, 720, 0.15);
              }}
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-2 py-0.5 rounded-full cursor-pointer hover:border-neutral-400 transition-colors shrink-0 ml-1 shadow-2xs"
              title="Inspect Living Contract"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Contract v{contractVersion}</span>
            </button>
          </div>

          <div className="w-full max-w-xl bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center gap-2">
            
            <button
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Microphone input"
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendDesire(inputText, activeDockedNode);
                }
              }}
              placeholder={
                activeDockedNode
                  ? `Ask or instruct C-Link about ${activeDockedNode.label}...`
                  : activePersona === 'LITON'
                  ? "Speak as Liton Mia (e.g. 'কাল সর্বোচ্চ ৩০ কেজি দিতে পারব')..."
                  : activePersona === 'RAHIM'
                  ? "Speak as Rahim Foods (e.g. '৫০ কেজি কাল সকাল ১০টায় দিতে প্রস্তুত')..."
                  : activePersona === 'AGENT'
                  ? "Instruct or report as Procurement Agent (e.g. 'Scanned 3 mills within budget')..."
                  : activePersona === 'SENSOR'
                  ? "Inject IoT sensor reading (e.g. '50.0' or 'WEIGHT: 50.0 KG')..."
                  : "Tell C-Link what to change, constrain, or ask..."
              }
              className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400"
            />

            <button
              onClick={() => handleSendDesire(inputText, activeDockedNode)}
              disabled={!inputText.trim() || isProcessing}
              className="bg-neutral-900 hover:bg-black disabled:opacity-30 text-white rounded-full p-2 px-3 text-xs font-medium flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <Send size={11} />
            </button>
          </div>

          {/* Quick semantic action triggers */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar max-w-xl pb-1">
            <span className="text-[10px] text-neutral-400 shrink-0">Prompts:</span>
            <button
              onClick={() => handleSendDesire("What-If সিমুলেশন দেখো")}
              className="text-[10px] bg-violet-50 border border-violet-200 hover:border-violet-400 text-violet-900 font-medium rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "What-If সিমুলেশন দেখো"
            </button>
            <button
              onClick={() => handleSendDesire("গাড়ি এখন রাস্তায় কোথায়?")}
              className="text-[10px] bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-emerald-900 font-medium rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "গাড়ি এখন কোথায়?"
            </button>
            <button
              onClick={() => handleSendDesire("রহিম ফুডসের বিশ্বাসযোগ্যতা যাচাই করো")}
              className="text-[10px] bg-blue-50 border border-blue-200 hover:border-blue-400 text-blue-900 font-medium rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "রহিম ফুডসের সক্ষমতা যাচাই"
            </button>
            <button
              onClick={() => handleSendDesire("বাজেটটা ১০ হাজারের বেশি যেন না হয়")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "বাজেটটা ১০ হাজারের বেশি যেন না হয়"
            </button>
            <button
              onClick={() => handleSendDesire("আমাকে পুরো ব্যাপারটা বুঝিয়ে বলো")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "আমাকে পুরো ব্যাপারটা বুঝিয়ে বলো"
            </button>
            <button
              onClick={() => handleSendDesire("ওকে বাদ দিও না, আগে জিজ্ঞেস করো")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "ওকে বাদ দিও না, আগে জিজ্ঞেস করো"
            </button>
            <button
              onClick={() => handleSendDesire("আমার বাবাকে কাল হাসপাতালে নিয়ে যেতে হবে")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "আমার বাবাকে কাল হাসপাতালে নিয়ে যেতে হবে"
            </button>
            <button
              onClick={() => handleSendDesire("Appointment আছে?")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "Appointment আছে?"
            </button>
            <button
              onClick={() => handleSendDesire("Liton ভাই দিতে পারবেন?")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "Liton ভাই দিতে পারবেন?"
            </button>
            <button
              onClick={() => handleSendDesire("আমি না থাকার সময় কী হয়েছে?")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "আমি না থাকার সময় কী হয়েছে?"
            </button>
            <button
              onClick={() => handleSendDesire("কাজটা আমার agent-কে দাও")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "কাজটা agent-কে দাও"
            </button>
            <button
              onClick={() => handleSendDesire("না, এখন ৩০ কেজিই যথেষ্ট")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "না, এখন ৩০ কেজিই যথেষ্ট"
            </button>
            <button
              onClick={() => handleSendDesire("conflict আছে কি?")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "Conflict আছে কি?"
            </button>
            <button
              onClick={() => handleSendDesire("কিছু করার আছে?")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "কিছু করার আছে?"
            </button>
            <button
              onClick={() => handleSendDesire("ওদের জিজ্ঞেস করো")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "ওদের জিজ্ঞেস করো"
            </button>
            <button
              onClick={() => handleSendDesire("ডেলিভারির ব্যবস্থা করো")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "ডেলিভারির ব্যবস্থা করো"
            </button>
            <button
              onClick={() => handleSendDesire("প্রুফ সংযুক্তি করো")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "প্রুফ সংযুক্তি করো"
            </button>
            <button
              onClick={() => handleSendDesire("রিসিভ কনফার্ম করো")}
              className="text-[10px] bg-white border border-neutral-200/70 hover:border-neutral-400 text-neutral-700 rounded-full px-2.5 py-0.5 shrink-0 transition-colors cursor-pointer"
            >
              "রিসিভ কনফার্ম করো"
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Causal Explainability Inspector Sheet ("Why am I seeing this?") */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeExplainData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveExplainData(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200/80 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono">
                    ?
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                      Causal Transparency
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {activeExplainData.title}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveExplainData(null)}
                  className="text-neutral-400 hover:text-neutral-900 text-sm px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-neutral-200/70 text-xs text-neutral-800 leading-relaxed">
                <strong className="block text-neutral-900 mb-1 font-semibold">Why this is on your screen:</strong>
                {activeExplainData.whyHere}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  Causal Predecessor Sequence
                </div>
                <div className="space-y-1.5">
                  {activeExplainData.chain.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveExplainData(null)}
                  className="bg-neutral-900 hover:bg-black text-white text-xs px-4 py-2 rounded-full cursor-pointer transition-colors"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* UNIVERSAL REALITY INBOX DRAWER (Manifesto Principle #15)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRealityInboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
            onClick={() => setIsRealityInboxOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#FAF9F6] border-l border-neutral-200/80 shadow-2xl flex flex-col p-5 overflow-y-auto space-y-4"
            >
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900">Reality Inbox</h2>
                    <p className="text-[10px] text-neutral-500 font-sans">
                      Not a message inbox. Only material causal transitions.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono bg-neutral-200 px-2 py-0.5 rounded-md font-medium text-neutral-700">
                    Living Contract v{contractVersion}
                  </span>
                  <button
                    onClick={() => setIsRealityInboxOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 cursor-pointer hover:bg-neutral-200/60"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Zero-noise Principle Banner */}
              <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 text-[11px] text-neutral-600 leading-relaxed">
                <span className="font-semibold text-neutral-900">✦ Causal Attention Rule:</span>
                {" "}Notifications are replaced by reality transitions. Silence is valid when no user action is pending.
              </div>

              {/* Real Causal In-Flight Items */}
              <div className="space-y-3 flex-1">
                
                {/* 1. Critical Gap: Liton Counter-Offer */}
                <div className="bg-white rounded-2xl p-3.5 border border-red-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-semibold uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">
                      🔴 UNRESOLVED GAP • 20 KG
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">10m ago</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Liton Mia counter-offered 30 kg instead of 50 kg
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Current reality has a 20 kg deficit. Requires split fulfillment or requirement amendment.
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        handleSendDesire("accept 30kg split");
                      }}
                      className="text-[10px] font-medium bg-neutral-900 text-white px-2.5 py-1 rounded-lg hover:bg-black cursor-pointer"
                    >
                      Accept 30kg Split
                    </button>
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        handleSendDesire("change requirement to 30kg");
                      }}
                      className="text-[10px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      Change Need to 30kg
                    </button>
                  </div>
                </div>

                {/* 2. Temporal Conflict */}
                <div className="bg-white rounded-2xl p-3.5 border border-amber-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100">
                      🟠 TIME CONFLICT • 2 HOURS
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">18m ago</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Supplier ready 8:00 AM vs Driver available 12:00 PM
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Target window 10:00 AM cannot be met simultaneously without rescheduling or alternate driver.
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        handleSendDesire("conflict আছে কি?");
                      }}
                      className="text-[10px] font-medium bg-amber-900 text-white px-2.5 py-1 rounded-lg hover:bg-black cursor-pointer"
                    >
                      Open Conflict Resolver
                    </button>
                  </div>
                </div>

                {/* 3. Committed Reality: Hospital / Wedding */}
                <div className="bg-white rounded-2xl p-3.5 border border-emerald-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                      🟢 COMMITTED • STABLE
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">35m ago</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Hospital Care Protocol / Wedding Venue
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Dr. Shamsul Alam (9:30 AM slot) confirmed. Transport condition now active.
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        setActiveScenario('HOSPITAL_VISIT');
                        handleSendDesire("Appointment আছে?");
                      }}
                      className="text-[10px] font-medium bg-emerald-800 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-900 cursor-pointer"
                    >
                      View Hospital Frontier
                    </button>
                  </div>
                </div>

                {/* 4. Autonomous Agent Capability Discovery */}
                <div className="bg-white rounded-2xl p-3.5 border border-purple-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-100">
                      🟣 AGENT DISCOVERY • MATCHED
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">1h ago</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Rahim Foods capability surfaced (Gazipur Mill)
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Agent searched 3 options. Rahim Foods matches 50kg requirement. Authority restricted: human approval required to commit.
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        handleSendDesire("Why Rahim Foods is here?");
                      }}
                      className="text-[10px] font-medium bg-purple-800 text-white px-2.5 py-1 rounded-lg hover:bg-purple-900 cursor-pointer"
                    >
                      Why Rahim Foods?
                    </button>
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        handleSendDesire("Rahim Foods-কে জিজ্ঞেস করি");
                      }}
                      className="text-[10px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      Propose
                    </button>
                  </div>
                </div>

                {/* 5. Sensory Evidence */}
                <div className="bg-white rounded-2xl p-3.5 border border-blue-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                      🔵 HARDWARE OBSERVED • SCALE
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">2h ago</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Digital Scale weigh-in: 50.0 kg verified
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    IoT hardware telemetry confirmed shipment integrity without human manual input.
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setIsRealityInboxOpen(false);
                        setProjectionMode('UNIFIED');
                      }}
                      className="text-[10px] font-medium bg-blue-800 text-white px-2.5 py-1 rounded-lg hover:bg-blue-900 cursor-pointer"
                    >
                      Inspect Evidence Studio
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-neutral-200/60 text-center text-[10px] text-neutral-400 font-mono">
                C-LINK REALITY PROTOCOL • NO UNNECESSARY NOTIFICATIONS
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LIVING CONTRACT INSPECTOR MODAL                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isContractModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsContractModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#FAF9F6] border border-neutral-200/90 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono">
                    v{contractVersion}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900">Living Contract Specification</h2>
                    <p className="text-[10.5px] text-neutral-500 font-mono">
                      Immutable causal state machine & constraint boundary
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsContractModalOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Version History & Evolution */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 font-mono tracking-wider">
                  Contract Version Evolution
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    contractVersion === 1
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-white border-neutral-200/80 text-neutral-600'
                  }`}>
                    <div>
                      <span className="font-mono font-bold mr-1.5">v1.0 (Initial Desire):</span>
                      <span>50 kg Miniket Rice Requirement</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100">
                      {contractVersion === 1 ? 'ACTIVE' : 'SUPERSEDED'}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    contractVersion === 2
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-white border-neutral-200/80 text-neutral-600'
                  }`}>
                    <div>
                      <span className="font-mono font-bold mr-1.5">v2.0 (Split / Scoped):</span>
                      <span>30 kg Confirmed (Liton) + 20 kg Gap or Single Supplier (Rahim)</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100">
                      {contractVersion === 2 ? 'ACTIVE' : 'READY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Registered Boundary Constraints */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 font-mono tracking-wider">
                  Active Constraints & Tolerances
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 space-y-1">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">Budget Ceiling</span>
                    <div className="font-semibold text-neutral-900 font-mono">৳{registeredConstraints.budgetMax.toLocaleString()} BDT</div>
                    <span className="text-[9.5px] text-emerald-700 block">✓ Zero overrun tolerance</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 space-y-1">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">Delivery Window</span>
                    <div className="font-semibold text-neutral-900 font-mono">{registeredConstraints.deadline}</div>
                    <span className="text-[9.5px] text-amber-700 block">⚠ Target 10:00 AM hard boundary</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">Quality & Epistemic Spec</span>
                    <div className="font-semibold text-neutral-900">{registeredConstraints.qualitySpec}</div>
                    <span className="text-[9.5px] text-neutral-500 block">Requires Hardware Observed Scale Telemetry</span>
                  </div>
                </div>
              </div>

              {/* Active Actor Commitments */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 font-mono tracking-wider">
                  Causal Commitments Matrix
                </div>
                <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-neutral-900">Liton Mia</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-semibold">30 kg COMMITTED</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-medium text-neutral-900">Rahim Foods</span>
                    </div>
                    <span className="font-mono text-blue-800 font-semibold">50 kg OFFERED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="font-medium text-neutral-900">Tariq Driver</span>
                    </div>
                    <span className="font-mono text-amber-800 font-semibold">READY (12:00 PM)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-neutral-200/70">
                <button
                  onClick={() => {
                    const nextVer = contractVersion === 1 ? 2 : 1;
                    setContractVersion(nextVer);
                    playHapticTone(600, 800, 0.2);
                  }}
                  className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3.5 py-2 rounded-full font-mono cursor-pointer transition-colors"
                >
                  Switch to Contract v{contractVersion === 1 ? 2 : 1}
                </button>
                <button
                  onClick={() => setIsContractModalOpen(false)}
                  className="bg-neutral-900 hover:bg-black text-white text-xs px-4 py-2 rounded-full cursor-pointer transition-colors"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PHYSICAL PROOF & DUAL-KEY HANDSHAKE MODAL                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <PhysicalProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        scenario={SCENARIO_PRESETS[0]}
        lang="bn"
        realityStage={isRealitySettled ? 'settled' : 'delivered'}
        onVerifyAndSettle={() => {
          setIsProofModalOpen(false);
          setIsScaleVerified(true);
          handleSendDesire('চাল বুঝে পেয়েছি, রিসিভ কনফার্ম করো');
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LIVE PHYSICAL ROUTE & TRANSIT TRACKER MODAL                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <LiveRouteTrackerModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        scenario={SCENARIO_PRESETS[0]}
        lang="bn"
        realityStage={isRealitySettled ? 'settled' : isDriverAssigned ? 'transit' : 'assigned'}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CAUSAL SETTLEMENT CERTIFICATE MODAL                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <SettlementCertificateModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        scenario={SCENARIO_PRESETS[0]}
        lang="bn"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ESCROW TRACKER & BKASH DIRECT CHECKOUT MODAL                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <EscrowTrackerModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
        scenario={SCENARIO_PRESETS[0]}
        realityStage={isRealitySettled ? 'settled' : isDriverAssigned ? 'transport_active' : 'assigned'}
        lang="bn"
        onReleaseEscrow={() => {
          setOverrideRealitySettled(true);
          handleSendDesire('এসক্রো তহবিল রিলিজ ও নিষ্পত্তি সম্পন্ন হয়েছে');
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* OPERATIONAL DOCUMENT VIEWER MODAL (CHALLAN / WEIGHBRIDGE)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <DocumentViewerModal
        document={activeOperationalDoc}
        onClose={() => setActiveOperationalDoc(null)}
        onDownload={(doc) => {
          alert(`Downloading ${doc.filename} (${doc.size})...`);
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SHAREABLE C-LINK INVITATION & ONBOARDING MODAL                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ShareableCLinkModal
        isOpen={isShareCLinkModalOpen}
        onClose={() => setIsShareCLinkModalOpen(false)}
        actor="karim"
        lang="bn"
        onSimulateActorSession={() => {
          setIsShareCLinkModalOpen(false);
          handleSendDesire('বহিরাগত অ্যাক্টর সি-লিঙ্ক গ্রহণ করেছে');
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ACTOR & CANDIDATE DISCOVERY DRAWER                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ActorDiscoveryDrawer
        isOpen={isActorDiscoveryOpen}
        onClose={() => setIsActorDiscoveryOpen(false)}
        targetNodeId={activeDockedNode?.id || 'need-rice-50kg'}
        targetNodeLabel={activeDockedNode?.label || '50kg Rice Supplier'}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* OATHLINK AGENT AUTHORITY & POLICY MODAL                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AgentAuthorityModal
        isOpen={isAgentAuthorityModalOpen}
        onClose={() => setIsAgentAuthorityModalOpen(false)}
        manifest={buyerAgentPolicy}
        onSaveManifest={(updated) => {
          setBuyerAgentPolicy(updated);
        }}
        lang="bn"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* WHILE YOU WERE AWAY: REALITY INBOX & AGENT MEMORY             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <WhileAwayInboxModal
        isOpen={isWhileAwayModalOpen}
        onClose={() => setIsWhileAwayModalOpen(false)}
        onOpenWhyInspector={(trace) => {
          setSelectedWhyTrace(trace);
        }}
        onReviewCommitment={() => {
          setIsSettlementModalOpen(true);
        }}
        lang="bn"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* WHY DID MY AGENT SAY THAT? (EXPLAINABLE CAUSAL TRACE)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AgentWhyInspectorModal
        isOpen={!!selectedWhyTrace}
        onClose={() => setSelectedWhyTrace(null)}
        trace={selectedWhyTrace}
        lang="bn"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* AUTONOMOUS AGENT-TO-AGENT BARGAINING DOCK                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AutonomousNegotiationDock
        isOpen={isNegotiationDockOpen}
        onClose={() => setIsNegotiationDockOpen(false)}
        buyerPolicy={buyerAgentPolicy}
        sellerPolicy={sellerAgentPolicy}
        onCommitmentFormed={(terms) => {
          playHapticTone(600, 850, 0.25);
          handleSendDesire(`এজেন্টদের বোঝাপড়ার পর ৳${terms.price} দরে ${terms.quantity} কেজি চাল কনফার্ম হয়েছে`);
        }}
        lang="bn"
      />

    </div>
  );
};
