import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Mic,
  Heart,
  User,
  Hourglass,
  ArrowRight,
  Check,
  X,
  Truck,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Volume2,
  VolumeX,
  Compass,
  Languages,
  HelpCircle,
  Package,
  Layers,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  CircleDollarSign,
  ChevronDown,
  ChevronUp,
  Info,
  Wallet,
  Navigation,
  History,
  Award,
  Scale,
  Share2,
  Link2,
} from 'lucide-react';
import { useCausalState } from '../engine/causalStore';
import { causalAudio } from '../lib/causalAudio';
import { parseCausalSemanticQuery, ParsedWant } from '../engine/causalSemanticParser';
import { SCENARIO_PRESETS, ScenarioPreset } from '../data/journeyScenarios';
import { EscrowTrackerModal } from './EscrowTrackerModal';
import { LiveRouteTrackerModal } from './LiveRouteTrackerModal';
import { PhysicalProofModal } from './PhysicalProofModal';
import { SettlementCertificateModal } from './SettlementCertificateModal';
import { CausalAuditTrailModal } from './CausalAuditTrailModal';
import { ExternalActorCausalSurface } from './ExternalActorCausalSurface';
import { UniversalActorSurface } from './UniversalActorSurface';
import { ShareableCLinkModal } from './ShareableCLinkModal';

interface ISpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop?: () => void;
}

interface SupplierCandidate {
  id: 'karim' | 'mina' | 'faruk';
  name: string;
  nameBn: string;
  quantity: string;
  location: string;
  locationBn: string;
  ratePerKg: number;
  totalPrice: number;
  rating: string;
  speed: string;
}

const CANDIDATES: SupplierCandidate[] = [
  {
    id: 'karim',
    name: 'Karim (Mill No. 4)',
    nameBn: 'করিম (মিল নং ৪)',
    quantity: '20kg',
    location: 'Mirpur, Dhaka',
    locationBn: 'মিরপুর, ঢাকা',
    ratePerKg: 120,
    totalPrice: 2400,
    rating: '4.9 ★',
    speed: 'Ready for pickup in 30 mins',
  },
  {
    id: 'mina',
    name: 'Mina (Mill No. 2)',
    nameBn: 'মিনা (মিল নং ২)',
    quantity: '15kg',
    location: 'Savar, Dhaka',
    locationBn: 'সাভার, ঢাকা',
    ratePerKg: 125,
    totalPrice: 1875,
    rating: '4.8 ★',
    speed: 'Packed & ready',
  },
  {
    id: 'faruk',
    name: 'Faruk Agro Depot',
    nameBn: 'ফারুক এগ্রো ডিপো',
    quantity: '20kg',
    location: 'Dhanmondi, Dhaka',
    locationBn: 'ধানমন্ডি, ঢাকা',
    ratePerKg: 125,
    totalPrice: 2500,
    rating: '4.7 ★',
    speed: 'Same-day dispatch',
  },
];

interface LivingCausalSurfaceProps {
  onSwitchToDesktopTopology?: () => void;
}

import { useUniversalCompose } from "../engine/universal/useUniversalCompose";


export function LivingCausalSurface({ onSwitchToDesktopTopology }: LivingCausalSurfaceProps) {
  const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();
  const causal = useCausalState();

  // Language state: 'bn' | 'en' (defaulting to bn friendly since user requested in Bangla)
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Surface Perspective View: 'live' (Main Reality) | 'rahim' (Farmer Scope) | 'tariq' (Driver Scope)
  const [perspectiveView, setPerspectiveView] = useState<'live' | 'rahim' | 'tariq'>('live');

  // Interactive Explainer Drawer / "How C-Link Works" Modal
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Input & Voice State
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [findingActorForIdx, setFindingActorForIdx] = useState<number | null>(null);
  const [dynamicReality, setDynamicReality] = useState<{ active: boolean, nodes: any[] }>({ active: false, nodes: [] });
  const [resolvedActors, setResolvedActors] = useState<Record<number, any>>({});
  
  const handleFindActor = (idx: number, dep: any) => {
    setFindingActorForIdx(idx);
    causalAudio.playTick();
    setTimeout(() => {
      causalAudio.playCommitChord();
      setResolvedActors(prev => ({
        ...prev,
        [idx]: {
          name: dep.label === "Hardware Specification Definition" || dep.label.includes("Hardware") ? "System Expert" : 
                (dep.label.includes("Vendor") || dep.label.includes("Supplier") ? "StarTech (Verified Vendor)" : "Operations Manager"),
          status: "COMMITTED"
        }
      }));
      setFindingActorForIdx(null);
    }, 2500);
  };
  const [activeVoicePrompt, setActiveVoicePrompt] = useState<string | null>(null);

  // Dynamic Want Data
  const [activeWant, setActiveWant] = useState<ParsedWant>({
    item: '৫০ কেজি চাল',
    quantity: '50kg',
    destination: 'গুলশান অফিস · কাল সকাল ১০টা',
    dueTime: 'কাল সকাল ১০টা',
    committedAmount: '30kg',
    gapAmount: '20kg',
    committedActor: 'রহিম (কৃষক)',
    committedPrice: '৳৩,৬০০',
  });

  // Reality Lifecycle States
  // States: 'gap_open' (Rahim 30kg committed, 20kg gap open)
  //         'karim_asking' (Inquiring Karim)
  //         'karim_offered' (Karim offered 20kg, awaiting accept)
  //         'all_sourced' (50kg sourced, transport needed)
  //         'transport_active' (Driver Tariq assigned & in transit)
  //         'settled' (Delivered, proof verified, done)
  const [realityStage, setRealityStage] = useState<
    'empty' | 'gap_open' | 'karim_asking' | 'karim_offered' | 'all_sourced' | 'transport_active' | 'settled' | 'universal_reasoning'
  >('gap_open');

  const [selectedCandidate, setSelectedCandidate] = useState<SupplierCandidate>(CANDIDATES[0]);
  const [showCandidatesDrawer, setShowCandidatesDrawer] = useState(false);

  // Multi-Scenario State (50kg Rice, 100L Mustard Oil, 5x Oxygen Cylinders)
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  // Modals for complete user journey
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showPhysicalProofModal, setShowPhysicalProofModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);

  // In-Place Semantic Zoom State (Card tapped for higher resolution)
  const [zoomedCardId, setZoomedCardId] = useState<string | null>(null);

  // Causal Diagnostic Inspection Modal (Proof of Reality / Cryptographic Receipt)
  const [activeProofModal, setActiveProofModal] = useState<'weighbridge' | 'provenance' | null>(null);

  // Diagnostic "Why Blocked?" Banner
  const [showBlockedDiagnostic, setShowBlockedDiagnostic] = useState(false);

  // AI Transient Narration
  const [transientAiText, setTransientAiText] = useState<string | null>(null);

  // Counter-Bargaining State with Karim
  const [showCounterDrawer, setShowCounterDrawer] = useState(false);
  const [counterRate, setCounterRate] = useState<number>(115);
  const [bargainStatus, setBargainStatus] = useState<'idle' | 'accepted'>('idle');

  // Karim's Recursive Sub-Tasks State (Fractal C-Link Loop)
  const [karimSubTasks, setKarimSubTasks] = useState({
    sacksSealed: false,
    moistureTested: false,
    pickupReady: false,
  });

  // Tariq's Recursive Sub-Tasks State (Fractal Logistics Loop)
  const [tariqSubTasks, setTariqSubTasks] = useState({
    fuelAdvanceRequested: false,
    gpsReported: false,
    weighSlipUploaded: false,
  });

  // Shareable C-Link Modal State
  const [activeShareLinkModal, setActiveShareLinkModal] = useState<'karim' | 'tariq' | null>(null);

  // Switch scenario helper
  const handleSwitchScenario = (sc: ScenarioPreset) => {
    setCurrentScenario(sc);
    setActiveWant({
      item: sc.itemBn,
      quantity: sc.totalQuantity,
      destination: sc.destinationBn,
      dueTime: sc.dueTimeBn,
      committedAmount: sc.primaryActor.quantity,
      gapAmount: sc.gapQuantity,
      committedActor: sc.primaryActor.nameBn,
      committedPrice: sc.primaryActor.price,
    });
    setSelectedCandidate(sc.candidates[0]);
    setRealityStage('gap_open');
    setShowScenarioMenu(false);
    causalAudio.playTick();
    setTransientAiText(
      lang === 'bn'
        ? `✦ নতুন বাস্তবতা সক্রিয়: ${sc.nameBn}`
        : `✦ New Reality Activated: ${sc.name}`
    );
  };

  // Sync sound setting to audio engine
  useEffect(() => {
    causalAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle Card Zooming
  const toggleZoom = (cardId: string) => {
    causalAudio.playTick();
    setZoomedCardId((prev) => (prev === cardId ? null : cardId));
  };

  // Main Semantic Action Dispatcher
  const handleComposerSubmit = (text: string) => {
    const raw = (text || inputValue).trim();
    if (!raw) return;

    setInputValue('');
    setShowBlockedDiagnostic(false);
    causalAudio.playTick();

    // buildContextSnapshot is now internal to submitIntent
    submitIntent(raw);
    const parsed = parseCausalSemanticQuery(raw);
    const narrationMessage = lang === 'bn' ? (parsed.explanationBn || parsed.explanationEn) : parsed.explanationEn;
    setTransientAiText(narrationMessage || '✦ কজাল উদ্দেশ্য বিশ্লেষণ করা হচ্ছে...');

    setTimeout(() => {
      switch (parsed.action) {
        case 'RESET_REALITY':
          setRealityStage('empty');
          setShowBlockedDiagnostic(false);
          setTransientAiText(null);
          causal.resetAll();
          break;

        case 'EXPLAIN_BLOCKAGE':
          setShowBlockedDiagnostic(true);
          causalAudio.playAlertChime();
          if (realityStage === 'gap_open' || realityStage === 'karim_offered') {
            setTransientAiText(
              lang === 'bn'
                ? '✦ বাধা: ২০ কেজি চাল এখনো নিশ্চিত হয়নি। করিম বা মিনার প্রস্তাব গ্রহণ করুন।'
                : '✦ Blocked by open GAP: 20kg supply pending commitment.'
            );
          } else if (realityStage === 'all_sourced') {
            setTransientAiText(
              lang === 'bn'
                ? '✦ বাধা: ৫০ কেজি চাল রেডি, কিন্তু পিকআপের জন্য চালক নির্ধারণ হয়নি।'
                : '✦ Blocked by Transport Dependency: Driver missing for pickup.'
            );
          } else if (realityStage === 'transport_active') {
            setTransientAiText(
              lang === 'bn'
                ? '✦ অপেক্ষা: লোডিং ও ওজনের ডিজিটাল ওয়েইব্রিজ স্লিপ অপেক্ষমান।'
                : '✦ Awaiting Weighbridge proof of loading.'
            );
          } else {
            setTransientAiText(
              lang === 'bn'
                ? '✦ কোনো বাধা নেই। বাস্তবতা সম্পূর্ণরূপে নিষ্পত্তি হয়েছে।'
                : '✦ No blockers. Reality is settled.'
            );
          }
          break;

        case 'SWITCH_DESKTOP_TOPOLOGY':
          if (onSwitchToDesktopTopology) {
            onSwitchToDesktopTopology();
          }
          break;

        case 'SWITCH_SCOPE_RAHIM':
          setPerspectiveView('rahim');
          setTransientAiText(
            lang === 'bn'
              ? '✦ রহিমের দায়িত্বের কজাল প্রজেকশন সক্রিয়।'
              : "✦ Scoped to Rahim's causal responsibility."
          );
          break;

        case 'SWITCH_SCOPE_TARIQ':
          setPerspectiveView('tariq');
          setTransientAiText(
            lang === 'bn'
              ? '✦ ড্রাইভার তারিকের পরিবহন রুট সক্রিয়।'
              : "✦ Scoped to Driver Tariq's logistics route."
          );
          break;

        case 'SWITCH_SCOPE_COORDINATOR':
          setPerspectiveView('live');
          setTransientAiText(
            lang === 'bn'
              ? '✦ কেন্দ্রীয় সার্বিক বাস্তবতায় ফিরে আসা হয়েছে।'
              : '✦ Returned to Central Reality Projection.'
          );
          break;

        case 'INQUIRE_SUPPLY':
          setPerspectiveView('live');
          setRealityStage('karim_asking');
          causal.askKarim();
          if (parsed.targetCandidate === 'mina') {
            setSelectedCandidate(CANDIDATES[1]);
          } else if (parsed.targetCandidate === 'faruk') {
            setSelectedCandidate(CANDIDATES[2]);
          } else {
            setSelectedCandidate(CANDIDATES[0]);
          }
          setTimeout(() => {
            setRealityStage('karim_offered');
            causalAudio.playCommitChord();
            setTransientAiText(
              lang === 'bn'
                ? `✦ ${selectedCandidate.nameBn} ২০ কেজি চালের প্রস্তাব দিয়েছেন (৳${selectedCandidate.totalPrice})। গ্রহণ করতে চাপুন।`
                : `✦ ${selectedCandidate.name} offered 20kg @ ৳${selectedCandidate.totalPrice}. Tap Accept.`
            );
          }, 1000);
          break;

        case 'ACCEPT_OFFER':
          setPerspectiveView('live');
          setRealityStage('all_sourced');
          causal.acceptKarim();
          causalAudio.playCommitChord();
          setTransientAiText(
            lang === 'bn'
              ? '✦ ৫০ কেজি চাল সম্পূর্ণরূপে নিশ্চিত! পরবর্তী ধাপ: ড্রাইভার তারিককে পাঠানো।'
              : '✦ 50kg rice is fully committed! Next step: Assign driver Tariq.'
          );
          break;

        case 'DECLINE_OFFER':
          setRealityStage('gap_open');
          causal.declineKarim();
          causalAudio.playAlertChime();
          setTransientAiText(
            lang === 'bn'
              ? '✦ প্রস্তাব বাতিল হয়েছে। ২০ কেজি ঘাটতি পূরণে বিকল্প মিলসমূহ উন্মুক্ত।'
              : '✦ Offer declined. 20kg gap reopened. Alternatives available.'
          );
          break;

        case 'ASSIGN_LOGISTICS':
          setPerspectiveView('live');
          setRealityStage('transport_active');
          causal.assignDriver('Tariq Ahmed', '৳800');
          causalAudio.playCommitChord();
          setTransientAiText(
            lang === 'bn'
              ? '✦ ড্রাইভার তারিক নির্ধারিত (৮০০ টাকা)। শেরপুর ও মিরপুর থেকে পিকআপ চলমান।'
              : '✦ Driver Tariq assigned (৳800). Pickup in progress.'
          );
          break;

        case 'VERIFY_PROOF':
        case 'SETTLE_REALITY':
          setPerspectiveView('live');
          setRealityStage('settled');
          causal.confirmDelivery();
          causalAudio.playSettleHarmony();
          setTransientAiText(null); // AI cursor disappears on settlement per Rule 4
          break;

        case 'UNIVERSAL_INTENT':
          // We switch to the universal reasoning view
          setRealityStage('universal_reasoning');
          setPerspectiveView('live');
          break;

        case 'MATERIALIZE_WANT':
        default:
          if (parsed.wantData) {
            setActiveWant(parsed.wantData);
          }
          setPerspectiveView('live');
          setRealityStage('gap_open');
          causalAudio.playCommitChord();
          setTransientAiText(
            lang === 'bn'
              ? '✦ ৩০ কেজি চাল নিশ্চিত। বাকি ২০ কেজির জন্য সরবরাহকারী প্রয়োজন।'
              : '✦ 30kg is committed. 20kg still needs a source.'
          );
          break;
      }
    }, 400);
  };

  // Real Web Speech API Handler with Fallback
  const handleVoiceToggle = () => {
    causalAudio.playTick();

    if (isListening) {
      setIsListening(false);
      setActiveVoicePrompt(null);
      return;
    }

    const windowObj = window as unknown as {
      SpeechRecognition?: new () => ISpeechRecognition;
      webkitSpeechRecognition?: new () => ISpeechRecognition;
    };
    const SpeechRecognitionClass = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setActiveVoicePrompt(
            lang === 'bn' ? 'শুনছি... আপনার প্রয়োজনীয়তা বলুন' : 'Listening... Speak your causal intent'
          );
        };

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          const spokenText = event.results[0][0].transcript;
          setIsListening(false);
          setActiveVoicePrompt(null);
          setInputValue(spokenText);
          handleComposerSubmit(spokenText);
        };

        recognition.onerror = () => {
          setIsListening(false);
          triggerSimulatedVoiceFallback();
        };

        recognition.onend = () => {
          setIsListening(false);
          setActiveVoicePrompt(null);
        };

        recognition.start();
        return;
      } catch {
        triggerSimulatedVoiceFallback();
      }
    } else {
      triggerSimulatedVoiceFallback();
    }
  };

  const triggerSimulatedVoiceFallback = () => {
    setIsListening(true);
    const promptsEn = [
      'Listening: "Ask Karim if he can provide 20kg..."',
      'Listening: "Accept Karim\'s offer..."',
      'Listening: "Assign driver Tariq..."',
      'Listening: "Why is this blocked?"',
    ];
    const promptsBn = [
      'শুনছি: "করিমকে জিজ্ঞেস করো ২০ কেজি দিতে পারবে কিনা..."',
      'শুনছি: "করিমের প্রস্তাব গ্রহণ করো..."',
      'শুনছি: "ড্রাইভার তারিককে পাঠাও..."',
      'শুনছি: "কেন আটকে আছে দেখাও..."',
    ];
    const prompts = lang === 'bn' ? promptsBn : promptsEn;
    const selected = prompts[Math.floor(Math.random() * prompts.length)];
    setActiveVoicePrompt(selected);

    setTimeout(() => {
      setIsListening(false);
      setActiveVoicePrompt(null);
      if (realityStage === 'gap_open') {
        handleComposerSubmit(lang === 'bn' ? 'করিমকে জিজ্ঞেস করো ২০ কেজি দিতে পারবে কিনা' : 'Ask Karim for 20kg');
      } else if (realityStage === 'karim_offered') {
        handleComposerSubmit(lang === 'bn' ? 'করিমের প্রস্তাব গ্রহণ করো' : 'Accept Karim offer');
      } else if (realityStage === 'all_sourced') {
        handleComposerSubmit(lang === 'bn' ? 'ড্রাইভার তারিককে পাঠাও' : 'Assign driver Tariq');
      } else if (realityStage === 'transport_active') {
        handleComposerSubmit(lang === 'bn' ? 'ওজন স্লিপ যাচাই ও সম্পন্ন' : 'Verify proof and settle');
      } else {
        handleComposerSubmit(lang === 'bn' ? '৫০ কেজি চাল গুলশান অফিস কাল সকাল ১০টায়' : '50kg rice office tomorrow');
      }
    }, 2200);
  };

  // Dynamic Suggestion Chips
  const getContextualSuggestions = () => {
    if (lang === 'bn') {
      if (realityStage === 'empty') return ['৫০ কেজি চাল গুলশান অফিস কাল সকাল ১০টায়', 'রিসেট'];
      if (realityStage === 'gap_open') return ['করিমকে জিজ্ঞেস করো (২০ কেজি)', 'বিকল্প মিনা দেখো', 'কেন আটকে আছে?'];
      if (realityStage === 'karim_offered') return ['করিমের প্রস্তাব গ্রহণ করো', 'প্রস্তাব বাতিল', 'রেট বিস্তারিত'];
      if (realityStage === 'all_sourced') return ['ড্রাইভার তারিককে পাঠাও (৳৮০০)', 'কেন আটকে আছে?'];
      if (realityStage === 'transport_active') return ['ওজন স্লিপ যাচাই ও নিষ্পত্তি', 'তারিকের লাইভ ভিউ'];
      if (realityStage === 'settled') return ['বাস্তবতা রিসেট', 'ডিজিটাল সার্টিফিকেট দেখুন', 'ডেস্কটপ টপোলজি'];
      return ['করিমকে জিজ্ঞেস করো', 'ড্রাইভার পাঠাও', 'রিসেট'];
    }

    if (realityStage === 'empty') return ['50kg Rice Office Tomorrow 10 AM', 'Reset'];
    if (realityStage === 'gap_open') return ['Ask Karim (20kg)', 'Try candidate Mina (15kg)', 'Why is it blocked?'];
    if (realityStage === 'karim_offered') return ['Accept Karim Offer', 'Decline offer', 'Offer Details'];
    if (realityStage === 'all_sourced') return ['Assign Driver Tariq (৳800)', 'Why is it pending?'];
    if (realityStage === 'transport_active') return ['Verify Weighbridge & Settle', 'Driver Tariq Live View'];
    if (realityStage === 'settled') return ['Reset reality to Empty', 'Inspect Cryptographic Proof', 'Desktop Topology'];
    return ['Ask Karim', 'Assign Driver Tariq', 'Reset'];
  };

  // Sub-surface narration
  const getNarrationText = () => {
    if (realityStage === 'settled') return null; // AI cursor disappears on settlement per Rule 4
    if (transientAiText) return transientAiText;

    if (lang === 'bn') {
      if (realityStage === 'empty') return '✦ সি-লিঙ্ককে বলুন কী কাজ সম্পন্ন করতে হবে';
      if (realityStage === 'gap_open') return '✦ ৩০ কেজি চাল নিশ্চিত। বাকি ২০ কেজির জন্য সরবরাহকারী খুঁজুন।';
      if (realityStage === 'karim_asking') return '✦ করিমের মিলের সাথে যোগাযোগ করা হচ্ছে...';
      if (realityStage === 'karim_offered') return '✦ করিম ২০ কেজি চালের প্রস্তাব দিয়েছেন (৳২,৪০০)। গ্রহণ করতে চাপুন।';
      if (realityStage === 'all_sourced') return '✦ ৫০ কেজি চাল সংগৃহীত। এবার পণ্য পরিবহনের জন্য চালক নির্ধারণ করুন।';
      if (realityStage === 'transport_active') return '✦ চালক তারিক পণ্য নিয়ে গন্তব্যের পথে (শেরপুর ও মিরপুর পিকআপ সম্পন্ন)।';
      if (realityStage === 'universal_reasoning') return '✦ কজাল অপটিমাইজেশন চলছে...';
      return '✦ ৩০ কেজি চাল নিশ্চিত। বাকি ২০ কেজির জন্য সরবরাহকারী খুঁজুন।';
    }

    if (realityStage === 'empty') return '✦ Tell C-Link what needs to happen';
    if (realityStage === 'gap_open') return '✦ 30kg is committed. 20kg still needs a source.';
    if (realityStage === 'karim_asking') return '✦ Inquiring Karim regarding 20kg supply...';
    if (realityStage === 'karim_offered') return '✦ Karim offered 20kg @ ৳2,400. Tap Accept.';
    if (realityStage === 'all_sourced') return '✦ 50kg rice is secured. Assign driver to unblock transport.';
    if (realityStage === 'transport_active') return '✦ Driver Tariq in transit with 50kg rice.';
    if (realityStage === 'universal_reasoning') return '✦ Materializing Causal Surface...';
    return '✦ 30kg is committed. 20kg still needs a source.';
  };

  // Progress metrics calculation
  const totalKg = 50;
  const committedKg = realityStage === 'empty' ? 0 : realityStage === 'gap_open' || realityStage === 'karim_asking' || realityStage === 'karim_offered' ? 30 : 50;
  const progressPercent = (committedKg / totalKg) * 100;
  
  const isUniversalMode = realityStage === 'universal_reasoning' || hypothesis !== null || dynamicReality.active;
  const universalTotal = hypothesis ? hypothesis.proposedDependencies.length : (dynamicReality.active ? dynamicReality.nodes.length : 1);
  const universalCommitted = dynamicReality.active ? dynamicReality.nodes.length : Object.keys(resolvedActors).length;
  const universalProgressPercent = (universalCommitted / universalTotal) * 100;

  return (
    <div className="w-full min-h-screen bg-neo-bg text-[#1C1C1A] flex flex-col items-center justify-between font-sans antialiased select-none relative overflow-x-hidden">
      {/* Subtle Noise / Ambient Light Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#000 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ========================================================= */}
      {/* TOP PROTOCOL HEADER                                       */}
      {/* ========================================================= */}
      <header className="w-full pt-5 pb-3 px-6 flex flex-col items-center relative z-20 border-b border-black/[0.03] bg-neo-bg/90 backdrop-blur-xs">
        <div className="flex items-center justify-between w-full max-w-lg">
          {/* Left: Language & Sound Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                causalAudio.playTick();
                setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
              }}
              title="Toggle Language (বাংলা / English)"
              className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider bg-black/5 hover:bg-black/10 text-gray-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-black/5 transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
            </button>
          </div>

          {/* Center Brand: Exact Tracked-out Minimal "C - L I N K" */}
          <div className="flex flex-col items-center">
            <h1 className="text-xs sm:text-sm font-semibold tracking-[0.38em] uppercase text-[#1C1C1A]">
              C - L I N K
            </h1>
            <span className="text-[9px] text-gray-400 font-medium tracking-widest mt-0.5">
              LIVING CAUSAL SURFACE
            </span>
          </div>

          {/* Right: How it Works & Reset */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                causalAudio.playTick();
                setShowHowItWorks(true);
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-600 bg-black/5 hover:bg-black/10 flex items-center gap-1 cursor-pointer transition-all"
              title="How C-Link Works (ভিজ্যুয়াল গাইড)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'গাইড' : 'Guide'}</span>
            </button>

            <button
              onClick={() => {
                causalAudio.playTick();
                if (onSwitchToDesktopTopology) {
                  onSwitchToDesktopTopology();
                }
              }}
              title="Desktop Topology Surface"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-black/5 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                causalAudio.playTick();
                setRealityStage('empty');
                setPerspectiveView('live');
                setShowBlockedDiagnostic(false);
                setTransientAiText(null);
                causal.resetAll();
              }}
              title="Reset Reality to Empty"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-black/5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Clean, Human-Friendly Perspective Switcher with C-Link External Sessions */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 flex-wrap">
          <button
            onClick={() => {
              causalAudio.playTick();
              setPerspectiveView('live');
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              perspectiveView === 'live'
                ? 'bg-neo-bg text-[#1C1C1A] font-bold shadow-neo-down'
                : 'text-gray-500 hover:text-gray-800 hover:bg-black/[0.04]'
            }`}
          >
            {lang === 'bn' ? '✦ সার্বিক বাস্তবতা (ঢাকা)' : '✦ Live Reality (Dhaka)'}
          </button>

          <button
            onClick={() => {
              causalAudio.playTick();
              setPerspectiveView('rahim');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              perspectiveView === 'rahim'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 bg-neo-bg border border-white/40'
            }`}
          >
            <span>🌾</span>
            <span>{lang === 'bn' ? 'করিম (C-Link লুপ)' : 'Karim (C-Link Loop)'}</span>
          </button>

          <button
            onClick={() => {
              causalAudio.playTick();
              setPerspectiveView('tariq');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              perspectiveView === 'tariq'
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 bg-neo-bg border border-white/40'
            }`}
          >
            <span>🚚</span>
            <span>{lang === 'bn' ? 'তারিক (C-Link লুপ)' : 'Tariq (C-Link Loop)'}</span>
          </button>

          <button
            onClick={() => {
              causalAudio.playTick();
              setActiveShareLinkModal('karim');
            }}
            title="Share C-Link to Outside Actor"
            className="px-2 py-1 rounded-full text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Share2 className="w-3 h-3" />
            <span>{lang === 'bn' ? 'লিংক পাঠান' : 'Send Link'}</span>
          </button>
        </div>

        {/* Multi-Scenario Switcher Bar */}
        <div className="relative mt-2.5 flex items-center justify-center">
          <button
            onClick={() => setShowScenarioMenu((prev) => !prev)}
            className="px-3 py-1 bg-neo-bg/90 hover:bg-neo-bg border border-black/[0.08] rounded-full text-[11px] font-bold text-gray-800 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
          >
            <span className="text-xs">📦</span>
            <span>{lang === 'bn' ? currentScenario.nameBn : currentScenario.name}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {/* Scenario Menu Dropdown */}
          <AnimatePresence>
            {showScenarioMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className="absolute top-8 z-50 w-64 bg-neo-bg rounded-2xl shadow-neo-up-lg border border-black/[0.08] p-2 flex flex-col gap-1 text-left"
              >
                <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'বাস্তব সিনারিও নির্বাচন করুন' : 'Select Causal Scenario'}
                </div>
                {SCENARIO_PRESETS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSwitchScenario(sc)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors cursor-pointer ${
                      currentScenario.id === sc.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-neo-bg'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">
                        {lang === 'bn' ? sc.nameBn : sc.name}
                      </span>
                      <span
                        className={`text-[10px] ${
                          currentScenario.id === sc.id ? 'text-gray-300' : 'text-gray-400'
                        }`}
                      >
                        {lang === 'bn' ? sc.categoryBn : sc.category}
                      </span>
                    </div>
                    {currentScenario.id === sc.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* User Journey Action Quick-Ribbon (Escrow, Route, Proof, Audit, Certificate) */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto max-w-full px-2 py-0.5 no-scrollbar">
          {/* Escrow Vault Button */}
          <button
            onClick={() => {
              causalAudio.playTick();
              setShowEscrowModal(true);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border ${
              realityStage === 'settled'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-neo-bg text-gray-700 border-white/40 hover:bg-neo-bg shadow-2xs'
            }`}
          >
            <Wallet className="w-3 h-3 text-emerald-600" />
            <span>{lang === 'bn' ? 'এসক্রো (৳' + currentScenario.escrowTotal.toLocaleString() + ')' : 'Escrow (৳' + currentScenario.escrowTotal.toLocaleString() + ')'}</span>
          </button>

          {/* Live Route Button */}
          <button
            onClick={() => {
              causalAudio.playTick();
              setShowRouteModal(true);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border ${
              realityStage === 'transport_active'
                ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse'
                : 'bg-neo-bg text-gray-700 border-white/40 hover:bg-neo-bg shadow-2xs'
            }`}
          >
            <Navigation className="w-3 h-3 text-blue-600" />
            <span>{lang === 'bn' ? 'লাইভ রুট' : 'Live Route'}</span>
          </button>

          {/* Physical Proof Button */}
          <button
            onClick={() => {
              causalAudio.playTick();
              setShowPhysicalProofModal(true);
            }}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neo-bg text-gray-700 border border-white/40 hover:bg-neo-bg shadow-2xs flex items-center gap-1 cursor-pointer transition-all"
          >
            <FileCheck className="w-3 h-3 text-amber-600" />
            <span>{lang === 'bn' ? 'ওজন স্লিপ' : 'Weigh Slip'}</span>
          </button>

          {/* Audit Trail Button */}
          <button
            onClick={() => {
              causalAudio.playTick();
              setShowAuditTrailModal(true);
            }}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neo-bg text-gray-700 border border-white/40 hover:bg-neo-bg shadow-2xs flex items-center gap-1 cursor-pointer transition-all"
          >
            <History className="w-3 h-3 text-gray-500" />
            <span>{lang === 'bn' ? 'অডিট লগ' : 'Audit Log'}</span>
          </button>

          {/* Settlement Certificate (Highlighted when settled) */}
          <button
            onClick={() => {
              causalAudio.playTick();
              setShowCertificateModal(true);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border ${
              realityStage === 'settled'
                ? 'bg-[#1C1C1A] text-white border-black shadow-neo-down-sm'
                : 'bg-neo-bg text-gray-400 border-white/40 hover:text-gray-700'
            }`}
          >
            <Award className="w-3 h-3 text-amber-400" />
            <span>{lang === 'bn' ? 'সনদপত্র' : 'Certificate'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CRYSTAL-CLEAR CAUSAL COVERAGE BAR (Visual Story at a Glance) */}
      {/* ========================================================= */}
      {realityStage !== 'empty' && perspectiveView === 'live' && (
        isUniversalMode ? (
          <div className="w-full max-w-[340px] sm:max-w-[380px] px-4 pt-3 z-10">
          <div className="bg-neo-bg rounded-2xl p-3.5 shadow-2xs border border-black/[0.04] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'bn' ? 'বাস্তবতার অগ্রগতি' : 'Reality Coverage'}
              </span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                  universalProgressPercent === 100
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}
              >
                {universalCommitted} / {universalTotal} ({Math.round(universalProgressPercent)}%)
              </span>
            </div>
            {/* Split Progress Meter */}
            <div className="w-full h-2.5 bg-neo-bg rounded-full overflow-hidden flex">
              <div
                style={{ width: `${universalProgressPercent}%` }}
                className={`h-full transition-all duration-500 ${universalProgressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              />
            </div>
          </div>
        </div>
        ) :
        (
        <div className="w-full max-w-[340px] sm:max-w-[380px] px-4 pt-3 z-10">
          <div className="bg-neo-bg rounded-2xl p-3.5 shadow-2xs border border-black/[0.04] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'bn' ? 'চালের সরবরাহ কভারেজ' : 'Supply Coverage'}
              </span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                  progressPercent === 100
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {committedKg} / {totalKg} kg ({progressPercent}%)
              </span>
            </div>

            {/* Split Progress Meter */}
            <div className="w-full h-2.5 bg-neo-bg rounded-full overflow-hidden flex">
              {/* Rahim 30kg (60%) */}
              <div
                style={{ width: '60%' }}
                className="bg-emerald-600 h-full transition-all duration-500 relative"
                title="Rahim 30kg (Agreed)"
              />
              {/* Karim 20kg (40%) */}
              {progressPercent === 100 ? (
                <div
                  style={{ width: '40%' }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                  title="Karim 20kg (Committed)"
                />
              ) : (
                <div
                  style={{ width: '40%' }}
                  className="bg-amber-400/70 h-full transition-all duration-500 relative overflow-hidden"
                  title="20kg Unfulfilled Gap"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:12px_12px] animate-pulse" />
                </div>
              )}
            </div>

            {/* Clear Legend explaining each part */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" />
                {lang === 'bn' ? 'রহিম ৩০ কেজি নিশ্চিত' : 'Rahim: 30kg secured'}
              </span>
              {progressPercent === 100 ? (
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" />
                  {lang === 'bn' ? 'করিম ২০ কেজি নিশ্চিত' : 'Karim: 20kg secured'}
                </span>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-amber-700">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {lang === 'bn' ? '২০ কেজি বাকি (ঘাটতি)' : '20kg still missing'}
                </span>
              )}
            </div>
          </div>
        </div>
        )
      )}

      {/* Causal Diagnostic Banner (When "Why is it blocked?" is invoked) */}
      <AnimatePresence>
        {showBlockedDiagnostic && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="w-full max-w-[340px] sm:max-w-[380px] px-4 mt-2 z-20"
          >
            <div className="bg-amber-50/95 border border-amber-200/90 rounded-2xl p-3.5 shadow-neo-down-sm text-xs text-amber-950 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {lang === 'bn' ? 'কজাল নির্ভরতার বাধা (Causal Dependency)' : 'Causal Dependency Frontier'}
                  </span>
                  <span className="text-[11px] text-amber-800">
                    {realityStage === 'gap_open' || realityStage === 'karim_offered'
                      ? lang === 'bn'
                        ? '২০ কেজি চালের সরবরাহ এখনো অনির্ধারিত। করিম অথবা মিনার সাথে যোগাযোগ করুন।'
                        : '20kg supply source missing. Inquire candidate Karim or Mina.'
                      : realityStage === 'all_sourced'
                      ? lang === 'bn'
                        ? '৫০ কেজি চাল রেডি, তবে পরিবহনের জন্য চালক নির্ধারণ করা প্রয়োজন।'
                        : 'Transport dependency unfulfilled. Driver required for pickup.'
                      : realityStage === 'transport_active'
                      ? lang === 'bn'
                        ? 'পণ্য বোঝাইয়ের ডিজিটাল প্রমাণপত্র (ওয়েইব্রিজ স্লিপ) জমা হওয়া বাকি।'
                        : 'Physical weighbridge proof of loading pending verification.'
                      : lang === 'bn'
                      ? 'সকল শর্ত সন্তুষ্ট।'
                      : 'All dependency requirements satisfied.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowBlockedDiagnostic(false)}
                className="text-amber-500 hover:text-amber-800 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PRIMARY CAUSAL CANVAS                                     */}
      {/* ========================================================= */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* 1. EMPTY REALITY STATE                                    */}
          {/* ========================================================= */}
          {realityStage === 'empty' && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div
                onClick={() => {
                  causalAudio.playCommitChord();
                  setRealityStage('gap_open');
                  setTransientAiText(
                    lang === 'bn'
                      ? '✦ ৩০ কেজি চাল নিশ্চিত। বাকি ২০ কেজির জন্য উৎস প্রয়োজন।'
                      : '✦ 30kg is committed. 20kg still needs a source.'
                  );
                }}
                className="group flex items-center gap-2 text-sm text-[#8A8A86] hover:text-[#1C1C1A] font-normal cursor-pointer transition-colors px-4 py-2 rounded-full hover:bg-black/[0.02]"
              >
                <Sparkles className="w-4 h-4 text-[#8A8A86] group-hover:scale-110 transition-transform" />
                <span>
                  {lang === 'bn' ? 'সি-লিঙ্ককে বলুন কী ঘটতে হবে' : 'Tell C-Link what needs to happen'}
                </span>
              </div>

              {/* Instant starter suggestion */}
              <button
                onClick={() =>
                  handleComposerSubmit(
                    lang === 'bn' ? '৫০ কেজি চাল গুলশান অফিস কাল সকাল ১০টায়' : '50kg Rice Office Tomorrow 10 AM'
                  )
                }
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 cursor-pointer transition-colors"
              >
                {lang === 'bn'
                  ? 'উদাহরণ: "৫০ কেজি চাল গুলশান অফিস কাল সকাল ১০টায়"'
                  : 'Example: "50kg Rice Office Tomorrow 10 AM"'}
              </button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 2. LIVE PERSPECTIVE: THE CAUSAL REALITY STACK             */}
          {/* ========================================================= */}
          {realityStage !== 'empty' && perspectiveView === 'live' && (
            <motion.div
              key="live-reality-stack"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex flex-col items-center gap-0 max-w-[340px] sm:max-w-[360px]"
            >
              {/* CARD 1: THE GOAL (WANT) */}
              <motion.div
                layout="position"
                onClick={() => toggleZoom('want')}
                className={`w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex items-center gap-4 cursor-pointer hover:shadow-neo-up-xl transition-all ${
                  zoomedCardId === 'want' ? 'ring-2 ring-black/10' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-[#1C1C1A]">
                  <Heart className="w-5 h-5 text-gray-700 stroke-[1.5]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {lang === 'bn' ? 'উদ্দেশ্য (WANT)' : 'GOAL (WANT)'}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      {activeWant.dueTime}
                    </span>
                  </div>
                  <span className="text-base sm:text-[17px] font-bold text-[#1C1C1A] leading-snug">
                    {isComposing ? 'Analyzing intention...' : (hypothesis ? (hypothesis as any).inferredMeaning || activeWant.item : activeWant.item || '50kg Rice')}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">{activeWant.destination}</span>
                </div>
              </motion.div>

              {/* In-Place Semantic Zoom for WANT */}
              <AnimatePresence>
                {zoomedCardId === 'want' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-[92%] bg-neo-bg/95 border-x border-b border-black/[0.04] rounded-b-2xl p-3.5 text-xs text-gray-600 flex flex-col gap-2 -mt-2 z-0"
                  >
                    <div className="flex justify-between border-b border-black/[0.04] pb-1.5">
                      <span className="font-semibold text-gray-800">Total Batch Required:</span>
                      <span className="font-mono font-bold">{activeWant.quantity}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/[0.04] pb-1.5">
                      <span className="font-semibold text-gray-800">Target Location:</span>
                      <span>{activeWant.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Target Completion:</span>
                      <span>{activeWant.dueTime}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Atmospheric Connector 1 */}
              <div className="flex flex-col items-center my-0.5">
                <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
              </div>

              
              {hypothesis ? (
                <>
                
                {/* AI REASONING / SEMANTIC ENVELOPE CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex flex-col relative overflow-hidden mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-indigo-500">
                      <Sparkles className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                        AI SEMANTIC INTERPRETATION
                      </span>
                      <span className="text-base font-black text-gray-900 leading-tight">
                        Causal Hypothesis
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 px-1">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {hypothesis.inferredMeaning}
                    </p>
                  </div>
                  
                  {hypothesis.unknowns && hypothesis.unknowns.length > 0 && (
                    <div className="mt-4 p-3 bg-neo-bg shadow-neo-down rounded-xl border border-transparent">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Missing Dependencies / Unknowns
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {hypothesis.unknowns.map((u: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-indigo-400 mt-0.5">•</span>
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Atmospheric Connector */}
                <div className="flex flex-col items-center my-0.5">
                  <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                  <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                </div>
    
              <AnimatePresence>
                  {hypothesis.proposedDependencies.map((dep: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex flex-col relative overflow-hidden mt-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-amber-600">
                            <Hourglass className="w-5 h-5 stroke-[1.75]" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                              PENDING DEPENDENCY
                            </span>
                            <span className="text-lg font-black text-gray-900 leading-tight">
                              {dep.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 font-medium">{dep.rationale}</p>
                        <div className="w-full h-px shadow-neo-down my-3" />
                        {resolvedActors[idx] ? (
                          <div className="w-full py-3 px-4 bg-neo-bg rounded-xl shadow-neo-down border-l-2 border-emerald-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-bold text-gray-800">{resolvedActors[idx].name}</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{resolvedActors[idx].status}</span>
                          </div>
                        ) : findingActorForIdx === idx ? (
                          <div className="w-full py-2.5 bg-neo-bg rounded-xl shadow-neo-down flex items-center justify-center gap-2 text-amber-600 font-bold text-xs">
                            <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <span>Scanning Causal Network...</span>
                          </div>
                        ) : (
                          <button onClick={() => handleFindActor(idx, dep)} className="w-full py-2.5 bg-neo-bg text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-neo-up-md hover:shadow-neo-down">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Find Actor &rarr;</span>
                          </button>
                        )}
                      </motion.div>
                      
                      {idx < hypothesis.proposedDependencies.length - 1 && (
                        <div className="flex flex-col items-center my-0.5">
                          <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                          <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </>
              ) : (
                <>
                  
              {dynamicReality.active ? (
                <>
                  {dynamicReality.nodes.map((node, idx) => (
                    <React.Fragment key={'dynamic-'+idx}>
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex items-center gap-4 mt-2"
                      >
                        <div className="w-12 h-12 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-[#1C1C1A]">
                          <User className="w-5 h-5 text-emerald-600 stroke-[1.5]" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {node.label}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              COMMITTED
                            </span>
                          </div>
                          <span className="text-base sm:text-[17px] font-bold text-[#1C1C1A] leading-snug">
                            {node.actor.name}
                          </span>
                          <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{node.rationale}</p>
                        </div>
                      </motion.div>
                      {idx < dynamicReality.nodes.length - 1 && (
                        <div className="flex flex-col items-center my-0.5">
                          <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                          <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Delivery Node for Dynamic Reality */}
                  <div className="flex flex-col items-center my-0.5">
                    <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                    <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                  </div>
                  <motion.div className="w-full bg-neo-bg rounded-full px-5 py-3 shadow-neo-up border border-white/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 block leading-tight">All Operations Verified</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Awaiting Execution</span>
                    </div>
                  </motion.div>
                </>
              ) : realityStage === 'universal_reasoning' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-gray-500 w-full">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 animate-pulse">Materializing Logic...</span>
                </motion.div>
              ) : (
                <>
                  {/* CARD 2: COMMITTED SUPPLIER (Rahim) */}

              <motion.div
                layout="position"
                onClick={() => toggleZoom('rahim')}
                className={`w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex items-center gap-4 cursor-pointer hover:shadow-neo-up-xl transition-all ${
                  zoomedCardId === 'rahim' ? 'ring-2 ring-black/10' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-[#1C1C1A]">
                  <User className="w-5 h-5 text-gray-700 stroke-[1.5]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {lang === 'bn' ? '১ম সরবরাহকারী (WHO)' : 'SUPPLIER 1 (WHO)'}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      {lang === 'bn' ? 'সম্মত' : 'Agreed'}
                    </span>
                  </div>
                  <span className="text-base sm:text-[17px] font-bold text-[#1C1C1A] leading-snug">
                    {activeWant.committedActor || 'Rahim (Farmer)'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 font-medium">
                      {activeWant.committedAmount || '30kg'} · {activeWant.committedPrice || '৳3,600'}
                    </span>
                    <span className="text-[11px] text-gray-400">Sherpur Farm</span>
                  </div>
                </div>
              </motion.div>

              {/* In-Place Semantic Zoom for Rahim */}
              <AnimatePresence>
                {zoomedCardId === 'rahim' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-[92%] bg-neo-bg/95 border-x border-b border-black/[0.04] rounded-b-2xl p-3.5 text-xs text-gray-600 flex flex-col gap-2 -mt-2 z-0"
                  >
                    <div className="flex justify-between border-b border-black/[0.04] pb-1.5">
                      <span className="font-semibold text-gray-800">Farmer:</span>
                      <span>Rahim (Sherpur Agro)</span>
                    </div>
                    <div className="flex justify-between border-b border-black/[0.04] pb-1.5">
                      <span className="font-semibold text-gray-800">Unit Price:</span>
                      <span className="font-mono font-bold">৳120 / kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Proof Commitment:</span>
                      <span>Digital Signed Commitment #842</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Atmospheric Connector 2 */}
              <div className="flex flex-col items-center my-0.5">
                <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
              </div>

              

              {/* ========================================================= */}
              {/* CARD 3: THE DEFICIT / 2ND SUPPLIER / LOGISTICS FRONTIER  */}
              {/* ========================================================= */}
              {/* STAGE A: 20kg Gap Open (Invitation to Find / Connect) */}
              {(realityStage === 'gap_open' || realityStage === 'karim_asking') && (
                <motion.div
                  layout
                  className="w-full bg-neo-bg rounded-[26px] p-5 shadow-neo-up-lg border-2 border-transparent relative flex flex-col relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-amber-600">
                        <Hourglass className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                          {lang === 'bn' ? 'ঘাটতি • পূরণ আবশ্যক' : 'UNMET DEFICIT • ACTION NEEDED'}
                        </span>
                        <span className="text-lg font-black text-gray-900 leading-tight">
                          {activeWant.gapAmount || '20kg'} {lang === 'bn' ? 'বাকি' : 'Missing'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800 animate-pulse">
                      {realityStage === 'karim_asking'
                        ? lang === 'bn'
                          ? 'যোগাযোগ চলছে...'
                          : 'Asking...'
                        : lang === 'bn'
                        ? 'উন্মুক্ত'
                        : 'OPEN'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {lang === 'bn'
                      ? '৫০ কেজি সম্পূর্ণ করতে আরও ২০ কেজি চাল প্রয়োজন। নিকটস্থ মিলের সন্ধান করুন।'
                      : 'Needs a 2nd supplier to complete the 50kg batch.'}
                  </p>

                  <div className="w-full h-px shadow-neo-down my-3" />

                  {/* Obvious, High-Gravity Action Button */}
                  <button
                    onClick={() => {
                      causalAudio.playTick();
                      setShowCandidatesDrawer((prev) => !prev);
                    }}
                    className="w-full py-2.5 bg-neo-bg text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-neo-up-md hover:shadow-neo-down"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {lang === 'bn'
                        ? '২০ কেজির জন্য সরবরাহকারী খুঁজুন (৩টি উপলব্ধ) →'
                        : 'Find Supplier for 20kg (3 Available) →'}
                    </span>
                  </button>

                  {/* Unfolded Candidates Drawer right in the GAP card */}
                  <AnimatePresence>
                    {showCandidatesDrawer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/50 flex flex-col gap-2"
                      >
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {lang === 'bn' ? 'উপলব্ধ মিলসমূহ' : 'Available Local Mills'}
                        </span>

                        {CANDIDATES.map((cand) => (
                          <div
                            key={cand.id}
                            onClick={() => {
                              setSelectedCandidate(cand);
                              causalAudio.playTick();
                              handleComposerSubmit(`Ask ${cand.name}`);
                            }}
                            className="p-2.5 rounded-xl border border-white/40/90 hover:border-gray-400 hover:bg-neo-bg transition-all flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-gray-900">
                                  {lang === 'bn' ? cand.nameBn : cand.name}
                                </span>
                                <span className="text-[10px] text-amber-600 font-semibold">{cand.rating}</span>
                              </div>
                              <span className="text-[10px] text-gray-500 block">
                                {cand.quantity} · {lang === 'bn' ? cand.locationBn : cand.location}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-bold font-mono text-gray-900 block">
                                ৳{cand.totalPrice}
                              </span>
                              <span className="text-[10px] text-blue-600 font-bold">
                                {lang === 'bn' ? 'যোগাযোগ করুন →' : 'Inquire →'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* STAGE B: Karim has Offered (Direct Accept / Decline Choice) */}
              {realityStage === 'karim_offered' && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-neo-bg rounded-[26px] p-5 shadow-neo-up-lg border-2 border-blue-400 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                          {lang === 'bn' ? 'প্রস্তাব এসেছে (OFFERED)' : 'PROPOSAL RECEIVED (OFFERED)'}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {lang === 'bn' ? selectedCandidate.nameBn : selectedCandidate.name}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ৳{selectedCandidate.totalPrice}
                    </span>
                  </div>

                  <div className="mt-3 p-3 bg-neo-bg rounded-xl text-xs text-gray-600 flex flex-col gap-1 border border-white/50">
                    <div className="flex justify-between">
                      <span className="text-gray-500">পরিমাণ (Quantity):</span>
                      <span className="font-bold text-gray-900">{selectedCandidate.quantity} Miniket Rice</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">লোকেশন (Pickup):</span>
                      <span className="font-semibold text-gray-800">{selectedCandidate.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">রেট (Rate):</span>
                      <span className="font-semibold text-gray-800">৳{selectedCandidate.ratePerKg} / kg</span>
                    </div>
                  </div>

                  {/* Obvious Accept / Counter-Bargain / Decline Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleComposerSubmit('Accept Karim Offer')}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-neo-down-sm"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>
                        {bargainStatus === 'accepted'
                          ? (lang === 'bn' ? `দর-কষাকষিকৃত অফার গ্রহণ (৳${selectedCandidate.totalPrice})` : `Accept Negotiated (৳${selectedCandidate.totalPrice})`)
                          : (lang === 'bn' ? 'প্রস্তাব গ্রহণ করুন (Accept)' : 'Accept Offer (20kg)')}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        causalAudio.playTick();
                        setShowCounterDrawer((prev) => !prev);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        showCounterDrawer
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-neo-bg hover:bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                      }`}
                    >
                      {lang === 'bn' ? '💬 দর কষাকষি' : '💬 Bargain'}
                    </button>

                    <button
                      onClick={() => handleComposerSubmit('Decline')}
                      className="px-3 py-2.5 bg-neo-bg hover:bg-rose-50 text-gray-600 hover:text-rose-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Decline'}
                    </button>
                  </div>

                  {/* Counter-Bargaining Interactive Drawer */}
                  <AnimatePresence>
                    {showCounterDrawer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900">
                            {lang === 'bn' ? 'করিমকে পাল্টা দর প্রস্তাব করুন:' : 'Propose Counter-Offer to Karim:'}
                          </span>
                          <span className="text-[10px] text-blue-700 font-mono font-bold">
                            বর্তমান: ৳{selectedCandidate.ratePerKg}/কেজি
                          </span>
                        </div>

                        {/* Quick Rate Pills */}
                        <div className="flex items-center gap-2">
                          {[115, 112, 110].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => {
                                causalAudio.playTick();
                                setCounterRate(rate);
                              }}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                                counterRate === rate
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                  : 'bg-neo-bg text-gray-700 border-white/40 hover:border-blue-300'
                              }`}
                            >
                              ৳{rate}/kg
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-600 bg-neo-bg/80 p-2 rounded-xl border border-black/[0.04]">
                          <span>{lang === 'bn' ? 'প্রস্তাবিত মোট মূল্য:' : 'Proposed Total:'}</span>
                          <span className="font-bold text-gray-900 font-mono">
                            ২০ কেজি × ৳{counterRate} = ৳{(20 * counterRate).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              causalAudio.playCommitChord();
                              const newTotal = 20 * counterRate;
                              setSelectedCandidate((prev) => ({
                                ...prev,
                                ratePerKg: counterRate,
                                totalPrice: newTotal,
                              }));
                              setBargainStatus('accepted');
                              setShowCounterDrawer(false);
                              setTransientAiText(
                                lang === 'bn'
                                  ? `✦ করিম সাড়া দিল: "আচ্ছা ভাই, ৳${counterRate}/কেজি রেটেই রাজি হলাম! মোট ৳${newTotal}।" `
                                  : `✦ Karim agreed: "Accepted at ৳${counterRate}/kg! Total: ৳${newTotal}."`
                              );
                            }}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-neo-down-sm"
                          >
                            {lang === 'bn' ? 'করিমকে পাল্টা প্রস্তাব পাঠান →' : 'Send Counter Offer to Karim →'}
                          </button>
                          <button
                            onClick={() => setShowCounterDrawer(false)}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            {lang === 'bn' ? 'বন্ধ' : 'Close'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Direct C-Link Preview Button */}
                  <button
                    onClick={() => {
                      causalAudio.playTick();
                      setActiveShareLinkModal('karim');
                    }}
                    className="mt-2.5 w-full py-1.5 px-3 bg-blue-50/70 hover:bg-blue-100 text-blue-700 rounded-xl text-[11px] font-bold border border-blue-200/80 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {lang === 'bn'
                        ? '🔗 করিমকে C-Link পাঠান ও তার সাব-নিড লুপ পরীক্ষা করুন'
                        : '🔗 Send C-Link to Karim & Inspect Recursive Loop'}
                    </span>
                  </button>
                </motion.div>
              )}

              {/* STAGE C: All 50kg Sourced! Transport is Needed */}
              {realityStage === 'all_sourced' && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-neo-bg rounded-[26px] p-5 shadow-neo-up-lg border-2 border-amber-300 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                          {lang === 'bn' ? 'পরবর্তী ধাপ • পরিবহন' : 'NEXT STEP • TRANSPORT'}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {lang === 'bn' ? 'ড্রাইভার আবশ্যক' : 'Transport Needed'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 animate-pulse uppercase">
                      {lang === 'bn' ? 'আটকে আছে' : 'BLOCKED'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {lang === 'bn'
                      ? '৫০ কেজি চাল প্রস্তুত (রহিম ৩০ কেজি + করিম ২০ কেজি)। শেরপুর ও মিরপুর থেকে পিকআপ করে গুলশানে পৌঁছে দেওয়ার জন্য গাড়ি পাঠাতে হবে।'
                      : '50kg rice is secured. Covered van needed to collect from Sherpur & Mirpur and deliver to Gulshan Office.'}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleComposerSubmit('Assign Driver Tariq')}
                      className="flex-1 py-2.5 bg-neo-bg text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-neo-up-md hover:shadow-neo-down"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ড্রাইভার তারিককে পাঠান (৳৮০০) →' : 'Assign Driver Tariq (৳800) →'}</span>
                    </button>

                    <button
                      onClick={() => {
                        causalAudio.playTick();
                        setActiveShareLinkModal('tariq');
                      }}
                      title="Share C-Link to Tariq"
                      className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'C-Link' : 'Link'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE D: Transport Active / Delivery & Proof */}
              {(realityStage === 'transport_active' || realityStage === 'settled') && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`w-full bg-neo-bg rounded-[26px] p-5 shadow-neo-up-lg border-2 flex flex-col ${
                    realityStage === 'settled' ? 'border-emerald-500' : 'border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                        {realityStage === 'settled' ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Truck className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {realityStage === 'settled'
                            ? lang === 'bn'
                              ? 'নিষ্পত্তি সম্পন্ন'
                              : 'SETTLED'
                            : lang === 'bn'
                            ? 'পরিবহন চলছে'
                            : 'IN TRANSIT'}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {realityStage === 'settled'
                            ? lang === 'bn'
                              ? '● ডেলিভারি সম্পন্ন ও প্রমাণিত'
                              : '● Delivery Complete & Verified'
                            : lang === 'bn'
                            ? 'ড্রাইভার তারিক (ভ্যান #DHK-4821)'
                            : 'Driver Tariq (Van #DHK-4821)'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        realityStage === 'settled'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {realityStage === 'settled'
                        ? lang === 'bn'
                          ? '✓ সম্পন্ন'
                          : '✓ DONE'
                        : lang === 'bn'
                        ? 'চলমান'
                        : 'TRANSIT'}
                    </span>
                  </div>

                  {realityStage !== 'settled' ? (
                    <div className="mt-3 pt-3 border-t border-white/50 flex flex-col gap-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{lang === 'bn' ? 'পিকআপ: শেরপুর + মিরপুর (উত্তোলিত ✓)' : 'Pickup: Dual Locations (Loaded ✓)'}</span>
                        <span className="font-bold text-gray-900">{activeWant.quantity}</span>
                      </div>

                      {/* Live Route Tracker Pill */}
                      <button
                        onClick={() => {
                          causalAudio.playTick();
                          setShowRouteModal(true);
                        }}
                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-between px-3 cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-bold">
                          <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                          {lang === 'bn' ? 'লাইভ ট্র্যাকিং: মহাখালী ফ্লাইওভার (বাকি ৩.২ কিমি)' : 'Live GPS: Mohakhali Flyover (3.2km left)'}
                        </span>
                        <span className="text-[10px] text-blue-600 font-bold underline">
                          {lang === 'bn' ? 'রুট দেখুন →' : 'View Route →'}
                        </span>
                      </button>

                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => {
                            causalAudio.playTick();
                            setShowPhysicalProofModal(true);
                          }}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-neo-down-sm flex items-center justify-center gap-1.5"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'ওজন স্লিপ ও ফটো প্রমাণ যাচাই' : 'Verify Weighbridge Proof'}</span>
                        </button>
                        <button
                          onClick={() => {
                            causalAudio.playTick();
                            setShowEscrowModal(true);
                          }}
                          className="px-3 py-2.5 bg-neo-bg hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <Wallet className="w-3.5 h-3.5 text-gray-600" />
                          <span>{lang === 'bn' ? 'এসক্রো' : 'Escrow'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-white/50 flex flex-col gap-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          {lang === 'bn' ? 'সকল শর্ত সফলভাবে সন্তুষ্ট ও নিষ্পত্তিপ্রাপ্ত' : 'All causal conditions fulfilled'}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold">
                          100% DONE
                        </span>
                      </div>

                      {/* Certificate & Escrow Action Bar */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            causalAudio.playTick();
                            setShowCertificateModal(true);
                          }}
                          className="flex-1 py-2.5 bg-neo-bg text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-neo-up-md hover:shadow-neo-down"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-300" />
                          <span>{lang === 'bn' ? 'সনদপত্র ডাউনলোড / প্রিন্ট' : 'View Settlement Certificate'}</span>
                        </button>
                        <button
                          onClick={() => {
                            causalAudio.playTick();
                            setShowEscrowModal(true);
                          }}
                          className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{lang === 'bn' ? 'অর্থ ছাড় রসিদ' : 'Escrow Slip'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
                </>
              )}
                            </>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. PARTICIPANT VIEW: KARIM (FARMER FRACTAL C-LINK SCOPE)   */}
          {/* ========================================================= */}
          {perspectiveView === 'rahim' && (
            <ExternalActorCausalSurface
              key="karim-fractal-surface"
              actorType="karim"
              scenario={currentScenario}
              lang={lang}
              onBackToLive={() => {
                causalAudio.playCommitChord();
                setPerspectiveView('live');
              }}
              onSyncRealityEvent={(eventDesc) => {
                setTransientAiText(eventDesc);
              }}
              karimSubTasks={karimSubTasks}
              setKarimSubTasks={setKarimSubTasks}
              tariqSubTasks={tariqSubTasks}
              setTariqSubTasks={setTariqSubTasks}
            />
          )}

          {/* ========================================================= */}
          {/* 4. PARTICIPANT VIEW: TARIQ (DRIVER LOGISTICS FRACTAL SCOPE)*/}
          {/* ========================================================= */}
          {perspectiveView === 'tariq' && (
            <ExternalActorCausalSurface
              key="tariq-fractal-surface"
              actorType="tariq"
              scenario={currentScenario}
              lang={lang}
              onBackToLive={() => {
                causalAudio.playCommitChord();
                setPerspectiveView('live');
              }}
              onSyncRealityEvent={(eventDesc) => {
                setTransientAiText(eventDesc);
              }}
              karimSubTasks={karimSubTasks}
              setKarimSubTasks={setKarimSubTasks}
              tariqSubTasks={tariqSubTasks}
              setTariqSubTasks={setTariqSubTasks}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================= */}
      {/* AI SUB-SURFACE NARRATION (Quiet, Non-intrusive)            */}
      {/* ========================================================= */}
      <div className="w-full max-w-md px-6 py-1 min-h-[26px] flex flex-col items-center text-center relative z-20">
        <AnimatePresence mode="wait">
          {getNarrationText() && (
            <motion.p
              key={getNarrationText()}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-normal text-[#8A8A86] tracking-tight leading-relaxed"
            >
              {getNarrationText()}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================= */}
      {/* DYNAMIC CONTEXTUAL ACTION CHIPS                           */}
      {/* ========================================================= */}
      <div className="w-full max-w-[360px] sm:max-w-[420px] px-4 pb-2 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar relative z-20">
        {getContextualSuggestions().map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleComposerSubmit(sug)}
            className="px-3 py-1 rounded-full bg-neo-bg/80 hover:bg-neo-bg text-[11px] font-medium text-gray-700 hover:text-gray-900 border border-black/[0.04] shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM FLOATING PILL COMPOSER (Match to IMG_0146, 0147)   */}
      {/* ========================================================= */}
      <footer className="w-full max-w-[360px] sm:max-w-[420px] px-4 pb-8 pt-1 relative z-30 flex flex-col items-center">
        {/* Active Voice Listening Waves */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mb-2 px-3.5 py-1.5 bg-black text-white text-[11px] rounded-full flex items-center gap-2.5 shadow-neo-up-lg"
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-3 bg-rose-500 animate-pulse rounded-full" />
                <span className="w-1.5 h-4 bg-rose-400 animate-pulse delay-75 rounded-full" />
                <span className="w-1.5 h-2 bg-rose-500 animate-pulse delay-150 rounded-full" />
              </div>
              <span className="font-medium">{activeVoicePrompt || (lang === 'bn' ? 'শুনছি...' : 'Listening...')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pill Input Box */}
        <div className="w-full bg-neo-bg rounded-full px-4 py-2.5 shadow-neo-up-lg border border-transparent flex items-center gap-3 transition-shadow">
          <Sparkles className="w-4 h-4 text-[#8A8A86] shrink-0 stroke-[1.75]" />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleComposerSubmit(inputValue);
              }
            }}
            placeholder={lang === 'bn' ? 'সি-লিঙ্ককে বলুন...' : 'Tell C-Link...'}
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#1C1C1A] placeholder:text-[#8A8A86] font-normal"
          />

          {inputValue.trim() ? (
            <button
              onClick={() => handleComposerSubmit(inputValue)}
              className="w-7 h-7 rounded-full bg-[#1C1C1A] text-white flex items-center justify-center cursor-pointer hover:bg-black transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleVoiceToggle}
              title={lang === 'bn' ? 'ভয়েস দিয়ে বলুন' : 'Voice Semantic Action'}
              className={`p-1.5 text-[#8A8A86] hover:text-[#1C1C1A] transition-colors cursor-pointer rounded-full hover:bg-black/5 ${
                isListening ? 'text-rose-500 bg-rose-50 animate-pulse' : ''
              }`}
            >
              <Mic className="w-4 h-4 stroke-[1.75]" />
            </button>
          )}
        </div>
      </footer>

      {/* ========================================================= */}
      {/* "HOW C-LINK WORKS" VISUAL GUIDE MODAL                     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="w-full max-w-md bg-neo-bg rounded-3xl p-6 shadow-neo-up-xl border border-white/50 flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-sm text-gray-900">
                    {lang === 'bn' ? 'সি-লিঙ্ক কিভাবে কাজ করে?' : 'How C-Link Works'}
                  </span>
                </div>
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="w-7 h-7 rounded-full bg-neo-bg hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-4 flex flex-col gap-4 text-xs text-gray-700">
                <p className="text-gray-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'সি-লিঙ্ক কোনো সাধারণ ফর্ম বা ট্র্যাকার নয়। এটি হলো জীবন্ত বাস্তবতার ইন্টারফেস (Living Causal Surface)।'
                    : 'C-Link is not a static dashboard. It is an interface to living causal reality.'}
                </p>

                {/* Step 1 */}
                <div className="bg-neo-bg rounded-2xl p-3.5 border border-white/50 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ১
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">
                      {lang === 'bn' ? '১. উদ্দেশ্য নির্ধারণ (WANT)' : '1. State your Goal (WANT)'}
                    </span>
                    <span className="text-gray-600">
                      {lang === 'bn'
                        ? 'আপনি বললেন "৫০ কেজি চাল কাল অফিসে প্রয়োজন"। সি-লিঙ্ক এটি লক্ষ্য হিসেবে গ্রহণ করে।'
                        : 'You state what needs to happen. C-Link forms the canonical requirement.'}
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-neo-bg rounded-2xl p-3.5 border border-white/50 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ২
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">
                      {lang === 'bn' ? '২. কে সাহায্য করছে (WHO) ও ঘাটতি (GAP)' : '2. Who commits (WHO) & Deficit (GAP)'}
                    </span>
                    <span className="text-gray-600">
                      {lang === 'bn'
                        ? 'রহিম ৩০ কেজি দিতে সম্মত হলো। বাকি ২০ কেজি হলো ঘাটতি (GAP), যা পূরণ করতে হবে।'
                        : 'Rahim commits 30kg. The remaining 20kg becomes the critical frontier to solve.'}
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-neo-bg rounded-2xl p-3.5 border border-white/50 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ৩
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">
                      {lang === 'bn' ? '৩. স্বয়ংক্রিয় সমন্বয় ও পরিবহন' : '3. Autonomous Coordination & Transport'}
                    </span>
                    <span className="text-gray-600">
                      {lang === 'bn'
                        ? 'করিম ২০ কেজি দিলে লক্ষ্য ১০০% পূর্ণ হয়। তারপর চালক তারিক পণ্য নিয়ে অফিসে পৌঁছে দেয়।'
                        : 'Karim supplies the 20kg, driver Tariq picks up both sacks and drives to destination.'}
                    </span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-neo-bg rounded-2xl p-3.5 border border-white/50 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ৪
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">
                      {lang === 'bn' ? '৪. প্রমাণ ও নিষ্পত্তি (Proof & Settlement)' : '4. Proof & Settlement'}
                    </span>
                    <span className="text-gray-600">
                      {lang === 'bn'
                        ? 'ওয়েইব্রিজ ওজন স্লিপ যাচাইয়ের সাথে সাথেই পেমেন্ট নিষ্পত্তি ও বাস্তবতা সম্পূর্ণ হয়।'
                        : 'Weighbridge loading slip verifies weight and releases payments cryptographically.'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-full py-2.5 bg-[#1C1C1A] text-white hover:bg-black rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'bn' ? 'বুঝেছি, শুরু করুন' : 'Got it, let’s go'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 5 COMPREHENSIVE JOURNEY MODALS                             */}
      {/* ========================================================= */}
      {/* 1. Escrow Vault & Financial Commitment Modal */}
      <EscrowTrackerModal
        isOpen={showEscrowModal}
        onClose={() => setShowEscrowModal(false)}
        scenario={currentScenario}
        realityStage={realityStage}
        lang={lang}
      />

      {/* 2. Live Logistics & Driver Route Tracker Modal */}
      <LiveRouteTrackerModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        scenario={currentScenario}
        realityStage={realityStage}
        lang={lang}
      />

      {/* 3. Physical Proof & Quality Slip Modal */}
      <PhysicalProofModal
        isOpen={showPhysicalProofModal}
        onClose={() => setShowPhysicalProofModal(false)}
        scenario={currentScenario}
        realityStage={realityStage}
        lang={lang}
        onVerifyAndSettle={() => handleComposerSubmit('Verify Proof and Settle')}
      />

      {/* 4. Settlement Certificate & Printable Receipt Modal */}
      <SettlementCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        scenario={currentScenario}
        lang={lang}
      />

      {/* 5. Causal Audit Trail & Provenance Modal */}
      <CausalAuditTrailModal
        isOpen={showAuditTrailModal}
        onClose={() => setShowAuditTrailModal(false)}
        scenario={currentScenario}
        realityStage={realityStage}
        lang={lang}
      />

      {/* 6. Shareable C-Link & External Participant Link Modal */}
      <ShareableCLinkModal
        isOpen={activeShareLinkModal !== null}
        onClose={() => setActiveShareLinkModal(null)}
        actor={activeShareLinkModal || 'karim'}
        lang={lang}
        onSimulateActorSession={() => {
          if (activeShareLinkModal === 'tariq') {
            setPerspectiveView('tariq');
          } else {
            setPerspectiveView('rahim');
          }
        }}
      />
    </div>
  );
}
