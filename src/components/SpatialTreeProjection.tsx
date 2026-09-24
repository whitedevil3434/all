import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  Send,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';

export interface SpatialTreeNode {
  id: string;
  kind: 'NEED' | 'PARTE' | 'VENUE' | 'CATERING' | 'SUPPLIER' | 'TRANSPORT' | 'PROOF' | 'CUSTOM';
  label: string;
  value: string;
  status: 'ACCEPTED' | 'COMMITTED' | 'WAITING' | 'GAP' | 'SETTLED';
  isUnresolved?: boolean;
  unresolvedText?: string;
  actionChoices?: { label: string; action: string }[];
  metadata?: Record<string, string>;
}

interface SpatialTreeProjectionProps {
  intents?: any[];
  needs?: any[];
  capabilities?: any[];
  actors?: any[];
  gaps?: any[];
  commitments?: any[];
  evidences?: any[];
  isDriverAssigned?: boolean;
  isScaleVerified?: boolean;
  isRealitySettled?: boolean;
  onSelectAction: (actionText: string) => void;
  onPlayHaptic?: (f1: number, f2: number) => void;
  isCompact?: boolean;
  onOpenComposer?: () => void;
  activeSelectedNodeId?: string | null;
  onNodeSelect?: (node: SpatialTreeNode | null) => void;
  activeScenario?: 'RICE_CONSIGNMENT' | 'WEDDING' | 'HOSPITAL_VISIT';
  onScenarioChange?: (s: 'RICE_CONSIGNMENT' | 'WEDDING' | 'HOSPITAL_VISIT') => void;
  hospitalState?: {
    appointmentStatus: 'WAITING' | 'COMMITTED' | 'ACCEPTED';
    transportStatus: 'WAITING' | 'COMMITTED' | 'ACCEPTED';
    accompanyStatus: 'PENDING' | 'ACCEPTED';
    appointmentSlot?: string;
    driverName?: string;
  };
}

export const SpatialTreeProjection: React.FC<SpatialTreeProjectionProps> = ({
  intents = [],
  needs = [],
  capabilities = [],
  actors = [],
  gaps = [],
  commitments = [],
  evidences = [],
  isDriverAssigned = false,
  isScaleVerified = false,
  isRealitySettled = false,
  onSelectAction,
  onPlayHaptic,
  isCompact = false,
  onOpenComposer,
  activeSelectedNodeId,
  onNodeSelect,
  activeScenario,
  onScenarioChange,
  hospitalState
}) => {
  // Scenario switcher: 'RICE_CONSIGNMENT' vs 'HOSPITAL_VISIT' vs 'WEDDING'
  const [internalScenario, setInternalScenario] = useState<'RICE_CONSIGNMENT' | 'WEDDING' | 'HOSPITAL_VISIT'>('RICE_CONSIGNMENT');
  const scenario = activeScenario !== undefined ? activeScenario : internalScenario;

  const handleSetScenario = (s: 'RICE_CONSIGNMENT' | 'WEDDING' | 'HOSPITAL_VISIT') => {
    setInternalScenario(s);
    onScenarioChange?.(s);
  };

  const [internalSelectedNodeId, setInternalSelectedNodeId] = useState<string | null>(null);

  const selectedNodeId = activeSelectedNodeId !== undefined ? activeSelectedNodeId : internalSelectedNodeId;

  // Derive dynamic state for Rice scenario
  const hasSupplierCommitted = commitments.length > 0 || actors.some(a => a.status === 'COMMITTED' || a.name?.toLowerCase().includes('rahim'));

  // Wedding scenario nodes (matching exact screenshot IMG_0359.JPG)
  const [weddingState, setWeddingState] = useState<{
    parteStatus: 'ACCEPTED' | 'WAITING';
    venueStatus: 'COMMITTED' | 'WAITING';
    cateringStatus: 'WAITING' | 'COMMITTED' | 'ACCEPTED';
  }>({
    parteStatus: 'ACCEPTED',
    venueStatus: 'COMMITTED',
    cateringStatus: 'WAITING'
  });

  // Calculate current unresolved dependency note
  const getRiceUnresolvedDependency = () => {
    if (isRealitySettled) {
      return 'All conditions verified. Reality is settled and immutable.';
    }
    if (!hasSupplierCommitted) {
      return 'Rahim Foods (Supplier) is the current unresolved dependency.';
    }
    if (!isDriverAssigned) {
      return 'Transport (Driver assignment) is the current unresolved dependency.';
    }
    if (!isScaleVerified) {
      return 'Digital scale proof is the current unresolved dependency.';
    }
    return 'Final handoff receipt is the current unresolved dependency.';
  };

  const getWeddingUnresolvedDependency = () => {
    if (weddingState.cateringStatus === 'WAITING') {
      return 'Catering is the current unresolved dependency.';
    }
    if (weddingState.venueStatus === 'WAITING') {
      return 'Venue confirmation is the current unresolved dependency.';
    }
    if (weddingState.parteStatus === 'WAITING') {
      return 'Parte confirmation is the current unresolved dependency.';
    }
    return 'All dependencies resolved. Event reality is committed.';
  };

  const getHospitalUnresolvedDependency = () => {
    if (hospitalState?.appointmentStatus !== 'COMMITTED') {
      return 'Hospital appointment is the current unresolved dependency.';
    }
    if (hospitalState?.transportStatus !== 'COMMITTED') {
      return 'Transport (Driver / Car to Hospital) is the current unresolved dependency.';
    }
    if (hospitalState?.accompanyStatus !== 'ACCEPTED') {
      return 'Medical records and prescription readiness are pending.';
    }
    return 'All dependencies resolved. Hospital consultation trip is committed.';
  };

  const handleCardClick = (nodeId: string) => {
    const nextId = nodeId === selectedNodeId ? null : nodeId;
    setInternalSelectedNodeId(nextId);
    onPlayHaptic?.(520, 680);

    if (nextId) {
      const allNodes = Object.values(activeData);
      const node = allNodes.find(n => n.id === nextId);
      if (node) {
        onNodeSelect?.(node);
      }
    } else {
      onNodeSelect?.(null);
    }
  };

  // Node data for Wedding
  const weddingNodes = {
    root: {
      id: 'wedding-need',
      kind: 'NEED' as const,
      label: 'NEED',
      value: 'Wedding next month',
      status: 'COMMITTED' as const,
      metadata: {
        'Domain': 'Social Event / Ceremony',
        'Target Date': 'Next Month, 24th',
        'Expected Guests': '350 People'
      },
      actionChoices: [
        { label: 'তারিখ পরিবর্তন করো', action: 'CHANGE_DATE' },
        { label: 'নতুন অতিথি সংখ্যা যুক্ত করো', action: 'UPDATE_GUESTS' }
      ]
    },
    left: {
      id: 'wedding-parte',
      kind: 'PARTE' as const,
      label: 'PARTE',
      value: weddingState.parteStatus === 'ACCEPTED' ? '✓ Accepted' : 'waiting',
      status: weddingState.parteStatus,
      metadata: {
        'Role': 'Primary Parties & Families',
        'State': weddingState.parteStatus === 'ACCEPTED' ? 'Signed & Mutually Agreed' : 'Awaiting confirmation'
      },
      actionChoices: [
        { 
          label: weddingState.parteStatus === 'ACCEPTED' ? 'Unconfirm Parte' : 'Confirm Parte (✓ Accepted)', 
          action: 'TOGGLE_PARTE' 
        }
      ]
    },
    right: {
      id: 'wedding-venue',
      kind: 'VENUE' as const,
      label: 'VENUE',
      value: weddingState.venueStatus === 'COMMITTED' ? 'committed' : 'waiting',
      status: weddingState.venueStatus,
      metadata: {
        'Location': 'Sena Malancha Convention Hall',
        'Status': weddingState.venueStatus === 'COMMITTED' ? 'Deposit Paid & Reserved' : 'Pending booking'
      },
      actionChoices: [
        { 
          label: weddingState.venueStatus === 'COMMITTED' ? 'Release Venue' : 'Commit Venue (committed)', 
          action: 'TOGGLE_VENUE' 
        }
      ]
    },
    sub: {
      id: 'wedding-catering',
      kind: 'CATERING' as const,
      label: 'CATERING',
      value: weddingState.cateringStatus === 'ACCEPTED' 
        ? '✓ Accepted' 
        : weddingState.cateringStatus === 'COMMITTED' 
        ? 'committed' 
        : 'waiting',
      status: weddingState.cateringStatus,
      isUnresolved: weddingState.cateringStatus === 'WAITING',
      metadata: {
        'Menu Type': 'Mughlai Traditional Kacchi & Dessert',
        'Vendor Selected': 'Iqbal Caterers (Gulshan)',
        'Fulfillment': weddingState.cateringStatus === 'WAITING' ? 'Menu proposal sent, waiting for sign-off' : 'Confirmed'
      },
      actionChoices: [
        { label: 'Catering কনফার্ম করো (committed)', action: 'COMMIT_CATERING' },
        { label: 'অন্য ক্যাটারিং খুঁজব', action: 'FIND_CATERER' }
      ]
    }
  };

  // Node data for Rice Consignment (Current Causal Reality)
  const riceNodes = {
    root: {
      id: 'rice-need',
      kind: 'NEED' as const,
      label: 'NEED',
      value: '50 kg Rice Consignment',
      status: isRealitySettled ? ('SETTLED' as const) : ('COMMITTED' as const),
      metadata: {
        'Desire': '50 kg Nazirshail Quality Grain',
        'Destination': 'Uttara Supershop Hub',
        'Window': 'Tomorrow 10:00 AM'
      },
      actionChoices: isRealitySettled ? [] : [
        { label: 'Rahim Foods-কে জিজ্ঞেস করো', action: 'ASK_RAHIM' }
      ]
    },
    left: {
      id: 'rice-supplier',
      kind: 'SUPPLIER' as const,
      label: 'SUPPLIER',
      value: hasSupplierCommitted ? '✓ Accepted' : 'waiting',
      status: hasSupplierCommitted ? ('ACCEPTED' as const) : ('WAITING' as const),
      metadata: {
        'Actor': 'Rahim Foods (Gazipur Mill)',
        'Capability': '50kg Bagged, Packaged',
        'Status': hasSupplierCommitted ? 'Stock verified & ready' : 'Awaiting answer'
      },
      actionChoices: hasSupplierCommitted ? [] : [
        { label: 'ওদের জিজ্ঞেস করো', action: 'ASK_RAHIM' }
      ]
    },
    right: {
      id: 'rice-transport',
      kind: 'TRANSPORT' as const,
      label: 'TRANSPORT',
      value: isDriverAssigned ? 'committed' : 'waiting',
      status: isDriverAssigned ? ('COMMITTED' as const) : ('GAP' as const),
      metadata: {
        'Driver': isDriverAssigned ? 'Tariq M. (HiAce #DHK-4421)' : 'Unassigned',
        'Route': isDriverAssigned ? 'Airport Road -> Uttara' : 'Blocked on gap',
        'Status': isDriverAssigned ? 'Dispatched to pickup' : 'Waiting for driver'
      },
      actionChoices: !isDriverAssigned ? [
        { label: 'নতুন Driver তারিককে পাঠাই', action: 'ASSIGN_TARIQ' }
      ] : []
    },
    sub: {
      id: 'rice-scale',
      kind: 'PROOF' as const,
      label: 'DIGITAL SCALE',
      value: isScaleVerified ? '✓ Verified (50kg)' : (isDriverAssigned ? 'waiting' : 'pending'),
      status: isScaleVerified ? ('ACCEPTED' as const) : ('WAITING' as const),
      isUnresolved: !isScaleVerified,
      metadata: {
        'Target Reading': '50.0 kg (+/- 0.5kg)',
        'Proof Method': 'Digital Scale Reading + Visual Stamp',
        'Status': isScaleVerified ? '50.0kg Certified ✓' : 'Awaiting weigh-in at Uttara gate'
      },
      actionChoices: isScaleVerified ? (isRealitySettled ? [] : [
        { label: 'রিসিভ কনফার্ম করো', action: 'CONFIRM_RECEIPT' }
      ]) : [
        { label: 'স্কেল প্রুফ সাবমিট করো', action: 'SUBMIT_SCALE' }
      ]
    }
  };

  // Node data for Hospital Visit (User's direct scenario: "আমার বাবাকে কাল হাসপাতালে নিয়ে যেতে হবে")
  const hospitalNodes = {
    root: {
      id: 'hospital-need',
      kind: 'NEED' as const,
      label: 'NEED',
      value: 'Father to Hospital',
      status: (hospitalState?.appointmentStatus === 'COMMITTED' && hospitalState?.transportStatus === 'COMMITTED') ? ('COMMITTED' as const) : ('WAITING' as const),
      metadata: {
        'Desire': 'Take Father for Specialist Consultation',
        'Hospital': 'Apollo Hospital (Evercare Dhaka)',
        'Target Window': 'Tomorrow Morning'
      },
      actionChoices: [
        { label: 'Appointment আছে?', action: 'CHECK_APPOINTMENT' },
        { label: 'Find one tomorrow morning', action: 'FIND_APPOINTMENT' }
      ]
    },
    left: {
      id: 'hospital-appointment',
      kind: 'APPOINTMENT' as const,
      label: 'APPOINTMENT',
      value: hospitalState?.appointmentStatus === 'COMMITTED' 
        ? `✓ Confirmed (${hospitalState.appointmentSlot || '9:30 AM'})` 
        : 'waiting',
      status: hospitalState?.appointmentStatus === 'COMMITTED' ? ('ACCEPTED' as const) : ('WAITING' as const),
      metadata: {
        'Doctor': 'Dr. Shamsul Alam (Cardiologist)',
        'Slot': hospitalState?.appointmentSlot || 'Available: 9:30 AM / 11:00 AM',
        'Status': hospitalState?.appointmentStatus === 'COMMITTED' ? 'Booked & Confirmed ✓' : 'Awaiting appointment'
      },
      actionChoices: hospitalState?.appointmentStatus === 'COMMITTED' ? [
        { label: 'হাসপাতালে পৌঁছানোর জন্য transport দরকার', action: 'NEED_TRANSPORT' }
      ] : [
        { label: 'Find one tomorrow morning', action: 'FIND_APPOINTMENT' },
        { label: '9:30 AM', action: 'CHOOSE_930' },
        { label: '11:00 AM', action: 'CHOOSE_1100' }
      ]
    },
    right: {
      id: 'hospital-transport',
      kind: 'TRANSPORT' as const,
      label: 'TRANSPORT',
      value: hospitalState?.transportStatus === 'COMMITTED' 
        ? `committed (${hospitalState.driverName || 'Toyota Car'})` 
        : 'waiting',
      status: hospitalState?.transportStatus === 'COMMITTED' ? ('COMMITTED' as const) : ('GAP' as const),
      metadata: {
        'Vehicle': 'Wheelchair accessible car / Driver',
        'Route': 'Home -> Evercare Hospital',
        'Status': hospitalState?.transportStatus === 'COMMITTED' ? 'Driver assigned' : 'Need driver for hospital trip'
      },
      actionChoices: hospitalState?.transportStatus === 'COMMITTED' ? [] : [
        { label: 'Driver নিয়োগ করো', action: 'ASSIGN_HOSPITAL_DRIVER' },
        { label: 'আমি নিজে নিয়ে যাব', action: 'SELF_DRIVE' }
      ]
    },
    sub: {
      id: 'hospital-prescriptions',
      kind: 'PROOF' as const,
      label: 'MEDICAL DOCS',
      value: hospitalState?.accompanyStatus === 'ACCEPTED' ? '✓ Prepared' : 'pending',
      status: hospitalState?.accompanyStatus === 'ACCEPTED' ? ('ACCEPTED' as const) : ('WAITING' as const),
      isUnresolved: hospitalState?.accompanyStatus !== 'ACCEPTED',
      metadata: {
        'Requirements': 'Previous ECG + Prescription file',
        'Caregiver': 'Accompanied by family member',
        'Status': hospitalState?.accompanyStatus === 'ACCEPTED' ? 'All records ready ✓' : 'Awaiting documents readiness'
      },
      actionChoices: [
        { label: 'কাগজপত্র প্রস্তুত আছে', action: 'DOCS_READY' }
      ]
    }
  };

  const activeData = scenario === 'WEDDING' 
    ? weddingNodes 
    : scenario === 'HOSPITAL_VISIT'
    ? hospitalNodes
    : riceNodes;

  const currentUnresolved = scenario === 'WEDDING' 
    ? getWeddingUnresolvedDependency() 
    : scenario === 'HOSPITAL_VISIT'
    ? getHospitalUnresolvedDependency()
    : getRiceUnresolvedDependency();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const rootCardRef = React.useRef<HTMLDivElement>(null);
  const leftCardRef = React.useRef<HTMLDivElement>(null);
  const rightCardRef = React.useRef<HTMLDivElement>(null);
  const subCardRef = React.useRef<HTMLDivElement>(null);

  const [anchors, setAnchors] = useState<{
    width: number;
    height: number;
    rootBottom: { x: number; y: number };
    leftTop: { x: number; y: number };
    leftBottom: { x: number; y: number };
    rightTop: { x: number; y: number };
    rightBottom: { x: number; y: number };
    subTop: { x: number; y: number };
  } | null>(null);

  const recalculateAnchors = React.useCallback(() => {
    if (
      !containerRef.current || 
      !rootCardRef.current || 
      !leftCardRef.current || 
      !rightCardRef.current || 
      !subCardRef.current
    ) {
      return;
    }
    const c = containerRef.current.getBoundingClientRect();
    const r = rootCardRef.current.getBoundingClientRect();
    const l = leftCardRef.current.getBoundingClientRect();
    const rt = rightCardRef.current.getBoundingClientRect();
    const s = subCardRef.current.getBoundingClientRect();

    setAnchors({
      width: c.width,
      height: c.height,
      rootBottom: {
        x: r.left - c.left + r.width / 2,
        y: r.bottom - c.top
      },
      leftTop: {
        x: l.left - c.left + l.width / 2,
        y: l.top - c.top
      },
      leftBottom: {
        x: l.left - c.left + l.width / 2,
        y: l.bottom - c.top
      },
      rightTop: {
        x: rt.left - c.left + rt.width / 2,
        y: rt.top - c.top
      },
      rightBottom: {
        x: rt.left - c.left + rt.width / 2,
        y: rt.bottom - c.top
      },
      subTop: {
        x: s.left - c.left + s.width / 2,
        y: s.top - c.top
      }
    });
  }, []);

  React.useEffect(() => {
    // Initial measurement
    const timer = setTimeout(recalculateAnchors, 40);
    const observer = new ResizeObserver(() => {
      recalculateAnchors();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (rootCardRef.current) observer.observe(rootCardRef.current);
    if (leftCardRef.current) observer.observe(leftCardRef.current);
    if (rightCardRef.current) observer.observe(rightCardRef.current);
    if (subCardRef.current) observer.observe(subCardRef.current);

    window.addEventListener('resize', recalculateAnchors);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', recalculateAnchors);
    };
  }, [scenario, weddingState, isScaleVerified, isDriverAssigned, isRealitySettled, recalculateAnchors]);

  // Handle wedding action toggles
  const handleActionExecute = (actionText: string) => {
    if (actionText === 'TOGGLE_PARTE') {
      setWeddingState(prev => ({
        ...prev,
        parteStatus: prev.parteStatus === 'ACCEPTED' ? 'WAITING' : 'ACCEPTED'
      }));
      onPlayHaptic?.(560, 720);
      return;
    }
    if (actionText === 'TOGGLE_VENUE') {
      setWeddingState(prev => ({
        ...prev,
        venueStatus: prev.venueStatus === 'COMMITTED' ? 'WAITING' : 'COMMITTED'
      }));
      onPlayHaptic?.(560, 720);
      return;
    }
    if (actionText === 'COMMIT_CATERING') {
      setWeddingState(prev => ({
        ...prev,
        cateringStatus: 'COMMITTED'
      }));
      onPlayHaptic?.(600, 800);
      return;
    }
    
    // Default: pass to conversation / runtime
    onSelectAction(actionText);
    setInternalSelectedNodeId(null);
    onNodeSelect?.(null);
  };

  // Split Y between root bottom and children tops
  const minChildTop = anchors ? Math.min(anchors.leftTop.y, anchors.rightTop.y) : 178;
  const splitY = anchors ? anchors.rootBottom.y + (minChildTop - anchors.rootBottom.y) * 0.45 : 140;
  const radius = 14;

  const isStacked = anchors ? Math.abs(anchors.leftTop.x - anchors.rightTop.x) < 30 : false;

  let leftBranchPath = '';
  let rightBranchPath = '';
  let subVerticalPath = '';

  if (anchors) {
    if (isStacked) {
      // Small screen vertical layout
      leftBranchPath = `M ${anchors.rootBottom.x} ${anchors.rootBottom.y} L ${anchors.leftTop.x} ${anchors.leftTop.y}`;
      rightBranchPath = `M ${anchors.leftBottom.x} ${anchors.leftBottom.y} L ${anchors.rightTop.x} ${anchors.rightTop.y}`;
      subVerticalPath = `M ${anchors.rightBottom.x} ${anchors.rightBottom.y} L ${anchors.subTop.x} ${anchors.subTop.y}`;
    } else {
      // Pristine branched T-fork layout (exact match to IMG_0359.JPG)
      const r = Math.min(radius, Math.abs(anchors.rootBottom.x - anchors.leftTop.x) / 2);
      leftBranchPath = `
        M ${anchors.rootBottom.x} ${anchors.rootBottom.y}
        L ${anchors.rootBottom.x} ${splitY - r}
        Q ${anchors.rootBottom.x} ${splitY} ${anchors.rootBottom.x - r} ${splitY}
        L ${anchors.leftTop.x + r} ${splitY}
        Q ${anchors.leftTop.x} ${splitY} ${anchors.leftTop.x} ${splitY + r}
        L ${anchors.leftTop.x} ${anchors.leftTop.y}
      `;

      rightBranchPath = `
        M ${anchors.rootBottom.x} ${anchors.rootBottom.y}
        L ${anchors.rootBottom.x} ${splitY - r}
        Q ${anchors.rootBottom.x} ${splitY} ${anchors.rootBottom.x + r} ${splitY}
        L ${anchors.rightTop.x - r} ${splitY}
        Q ${anchors.rightTop.x} ${splitY} ${anchors.rightTop.x} ${splitY + r}
        L ${anchors.rightTop.x} ${anchors.rightTop.y}
      `;

      subVerticalPath = `
        M ${anchors.rightBottom.x} ${anchors.rightBottom.y}
        L ${anchors.subTop.x} ${anchors.subTop.y}
      `;
    }
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* Subtle Scenario Bar (Allows switching to the exact Wedding view from the user's screenshot or Rice Consignment) */}
      <div className="flex items-center justify-between w-full max-w-2xl px-2 py-1.5 mb-1 text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase tracking-wider text-[10px] text-neutral-500">
            Spatial Projection
          </span>
          <span className="text-neutral-300">•</span>
          <span className="font-medium text-neutral-600">
            {scenario === 'WEDDING' 
              ? 'Wedding Model' 
              : scenario === 'HOSPITAL_VISIT'
              ? 'Hospital Care Protocol'
              : 'Rice Consignment Protocol'}
          </span>
        </div>

        <div className="flex items-center bg-neutral-200/50 p-0.5 rounded-full text-[10px]">
          <button
            onClick={() => {
              handleSetScenario('RICE_CONSIGNMENT');
              onPlayHaptic?.(500, 600);
            }}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              scenario === 'RICE_CONSIGNMENT' 
                ? 'bg-white text-neutral-900 shadow-xs font-medium' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Rice
          </button>
          <button
            onClick={() => {
              handleSetScenario('HOSPITAL_VISIT');
              onPlayHaptic?.(500, 600);
            }}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              scenario === 'HOSPITAL_VISIT' 
                ? 'bg-white text-neutral-900 shadow-xs font-medium' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Hospital
          </button>
          <button
            onClick={() => {
              handleSetScenario('WEDDING');
              onPlayHaptic?.(500, 600);
            }}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              scenario === 'WEDDING' 
                ? 'bg-white text-neutral-900 shadow-xs font-medium' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Wedding
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* THE PRISTINE SPATIAL TREE CANVAS (EXACT MATCH TO IMG_0359)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div 
        ref={containerRef}
        className="w-full max-w-3xl relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px] overflow-visible py-4"
      >
        
        {/* Dynamic Responsive SVG Wiring Layer */}
        {anchors && (
          <svg 
            className="absolute inset-0 pointer-events-none z-0 overflow-visible" 
            style={{ width: anchors.width || '100%', height: anchors.height || '100%' }}
          >
            {/* Stem & Left Branch */}
            {leftBranchPath && (
              <path
                d={leftBranchPath}
                fill="none"
                stroke="#D6D3CD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Right Branch */}
            {rightBranchPath && (
              <path
                d={rightBranchPath}
                fill="none"
                stroke="#D6D3CD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Vertical line from Right child to Sub child */}
            {subVerticalPath && (
              <path
                d={subVerticalPath}
                fill="none"
                stroke="#D6D3CD"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Connection anchor terminal dots for physical precision */}
            <circle cx={anchors.rootBottom.x} cy={anchors.rootBottom.y} r="2.5" fill="#D6D3CD" />
            <circle cx={anchors.leftTop.x} cy={anchors.leftTop.y} r="2.5" fill="#D6D3CD" />
            <circle cx={anchors.rightTop.x} cy={anchors.rightTop.y} r="2.5" fill="#D6D3CD" />
            <circle cx={anchors.rightBottom.x} cy={anchors.rightBottom.y} r="2.5" fill="#D6D3CD" />
            <circle cx={anchors.subTop.x} cy={anchors.subTop.y} r="2.5" fill="#D6D3CD" />
          </svg>
        )}

        {/* ── Level 1: Root Card (NEED) ── */}
        <div ref={rootCardRef} className="flex flex-col items-center z-10 mb-8 sm:mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleCardClick(activeData.root.id)}
            className={`w-[220px] sm:w-[240px] px-6 py-4 rounded-2xl bg-white text-left transition-all duration-200 cursor-pointer shadow-[0_10px_28px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] border ${
              selectedNodeId === activeData.root.id
                ? 'border-neutral-900 ring-2 ring-neutral-400/30'
                : 'border-neutral-100/90 hover:border-neutral-300'
            }`}
          >
            <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 font-sans">
              {activeData.root.label}
            </div>
            <div className="text-[15px] sm:text-[16px] text-neutral-800 font-normal mt-1 leading-snug">
              {activeData.root.value}
            </div>
          </motion.div>
        </div>

        {/* ── Level 2: Children Cards (Left: PARTE / SUPPLIER, Right: VENUE / TRANSPORT) ── */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-28 z-10">
          
          {/* Left Child: PARTE / SUPPLIER */}
          <div ref={leftCardRef} className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleCardClick(activeData.left.id)}
              className={`w-[160px] sm:w-[170px] px-5 py-3.5 rounded-2xl bg-white text-left transition-all duration-200 cursor-pointer shadow-[0_10px_28px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] border ${
                selectedNodeId === activeData.left.id
                  ? 'border-neutral-900 ring-2 ring-neutral-400/30'
                  : 'border-neutral-100/90 hover:border-neutral-300'
              }`}
            >
              <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 font-sans">
                {activeData.left.label}
              </div>
              <div className="text-[15px] text-neutral-800 font-normal mt-1 flex items-center gap-1.5 leading-tight">
                {activeData.left.value.startsWith('✓') ? (
                  <>
                    <span className="text-neutral-800 font-medium">✓</span>
                    <span>{activeData.left.value.replace('✓', '').trim()}</span>
                  </>
                ) : (
                  <span>{activeData.left.value}</span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: VENUE / TRANSPORT + Sub-child CATERING / PROOF */}
          <div className="flex flex-col items-center relative">
            
            {/* Right Child: VENUE / TRANSPORT */}
            <div ref={rightCardRef}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCardClick(activeData.right.id)}
                className={`w-[160px] sm:w-[170px] px-5 py-3.5 rounded-2xl bg-white text-left transition-all duration-200 cursor-pointer shadow-[0_10px_28px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] border ${
                  selectedNodeId === activeData.right.id
                    ? 'border-neutral-900 ring-2 ring-neutral-400/30'
                    : 'border-neutral-100/90 hover:border-neutral-300'
                }`}
              >
                <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 font-sans">
                  {activeData.right.label}
                </div>
                <div className="text-[15px] text-neutral-800 font-normal mt-1 leading-tight">
                  {activeData.right.value}
                </div>
              </motion.div>
            </div>

            {/* Vertical spacing between Right Child and Sub-child */}
            <div className="w-0.5 h-8 sm:h-12 my-0" />

            {/* Sub-child: CATERING / PROOF + Transient Attention Star ✦ */}
            <div ref={subCardRef} className="flex flex-col sm:flex-row items-center sm:items-center relative">
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCardClick(activeData.sub.id)}
                className={`w-[160px] sm:w-[170px] px-5 py-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer shadow-[0_10px_28px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] border ${
                  activeData.sub.isUnresolved
                    ? 'bg-[#FAF6EF] border-[#EFE5D6] text-neutral-900' // Soft warm creamy biscuit highlight from the photo
                    : 'bg-white border-neutral-100/90 text-neutral-800'
                } ${
                  selectedNodeId === activeData.sub.id
                    ? 'border-neutral-900 ring-2 ring-neutral-400/30'
                    : 'hover:border-neutral-300'
                }`}
              >
                <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 font-sans">
                  {activeData.sub.label}
                </div>
                <div className="text-[15px] text-neutral-800 font-normal mt-1 leading-tight flex items-center gap-1.5">
                  {activeData.sub.value.startsWith('✓') ? (
                    <>
                      <span className="text-neutral-800 font-medium">✓</span>
                      <span>{activeData.sub.value.replace('✓', '').trim()}</span>
                    </>
                  ) : (
                    <span>{activeData.sub.value}</span>
                  )}
                </div>
              </motion.div>

              {/* ✦ Transient AI Attention Pointer (Exact match to IMG_0359.JPG) */}
              <motion.div 
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 sm:mt-0 sm:absolute sm:left-[190px] w-max max-w-[240px] flex items-center gap-2 text-neutral-700 text-[13px] sm:text-[14px] font-normal tracking-tight whitespace-nowrap"
              >
                <span className="text-neutral-800 text-sm font-serif">✦</span>
                <span className="text-neutral-600">
                  {currentUnresolved}
                </span>
              </motion.div>

            </div>

          </div>

        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Node Inspector Sheet (Fallback if not docked to composer)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!onNodeSelect && selectedNodeId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full max-w-xl mt-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 shadow-lg text-left space-y-3 relative z-30"
          >
            {(() => {
              const allNodes = Object.values(activeData);
              const node = allNodes.find(n => n.id === selectedNodeId);
              if (!node) return null;

              return (
                <>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-mono font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                        {node.kind}
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {node.value}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setInternalSelectedNodeId(null);
                        onNodeSelect?.(null);
                      }}
                      className="text-xs text-neutral-400 hover:text-neutral-900 cursor-pointer px-1 py-0.5"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Metadata entries */}
                  {node.metadata && (
                    <div className="bg-[#FAF8F5] rounded-xl p-3 space-y-1.5 text-xs">
                      {Object.entries(node.metadata).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-[11.5px]">
                          <span className="text-neutral-500">{k}:</span>
                          <span className="font-medium text-neutral-900">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Semantic Actions */}
                  {node.actionChoices && node.actionChoices.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5 font-semibold">
                        Semantic Actions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {node.actionChoices.map((choice, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionExecute(choice.action || choice.label)}
                            className="text-xs font-medium bg-neutral-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                          >
                            <span>[{choice.label}]</span>
                            <Send size={11} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
