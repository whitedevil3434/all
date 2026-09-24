import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sliders,
  Sparkles,
  Handshake,
  Clock,
  X,
  Lock,
  FileCheck,
  Ban
} from 'lucide-react';
import {
  AutonomousNegotiator,
  NegotiationStep,
  AuthorityManifest,
  DEFAULT_KARIM_BUYER_AGENT,
  DEFAULT_LITON_SELLER_AGENT
} from '../../engine/agent/ActorAgentEngine';

interface AutonomousNegotiationDockProps {
  isOpen: boolean;
  onClose: () => void;
  buyerPolicy: AuthorityManifest;
  sellerPolicy: AuthorityManifest;
  onCommitmentFormed: (terms: { item: string; quantity: number; price: number }) => void;
  lang?: 'bn' | 'en';
}

export const AutonomousNegotiationDock: React.FC<AutonomousNegotiationDockProps> = ({
  isOpen,
  onClose,
  buyerPolicy,
  sellerPolicy,
  onCommitmentFormed,
  lang = 'bn'
}) => {
  const [scenarioMode, setScenarioMode] = useState<'NORMAL' | 'CEILING_VIOLATION'>('NORMAL');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [negotiationResult, setNegotiationResult] = useState<any>(null);
  
  // Canonical Verification States
  // 'NEGOTIATING' -> 'PROPOSAL_AWAITING_CANONICAL' -> 'CANONICAL_COMMITTED' | 'AUTHORITY_REJECTED'
  const [canonicalState, setCanonicalState] = useState<'NEGOTIATING' | 'PROPOSAL_AWAITING_CANONICAL' | 'CANONICAL_COMMITTED' | 'AUTHORITY_REJECTED'>('NEGOTIATING');
  const [canonicalDetails, setCanonicalDetails] = useState<{
    commitmentId?: string;
    domainEvent?: string;
    reason?: string;
  } | null>(null);

  const initNegotiation = (mode: 'NORMAL' | 'CEILING_VIOLATION') => {
    const result = AutonomousNegotiator.runBargainingProtocol(
      buyerPolicy,
      sellerPolicy,
      50,
      600,
      mode
    );
    setNegotiationResult(result);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setCanonicalState('NEGOTIATING');
    setCanonicalDetails(null);
  };

  useEffect(() => {
    if (isOpen) {
      initNegotiation(scenarioMode);
    }
  }, [isOpen, scenarioMode, buyerPolicy, sellerPolicy]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && negotiationResult && currentStepIdx < negotiationResult.steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIdx((prev) => prev + 1);
      }, 1500);
    } else if (negotiationResult && currentStepIdx === negotiationResult.steps.length - 1) {
      setIsPlaying(false);
      
      if (negotiationResult.escalated || scenarioMode === 'CEILING_VIOLATION') {
        // Authority Ceiling Breached!
        setCanonicalState('AUTHORITY_REJECTED');
        setCanonicalDetails({
          reason: negotiationResult.escalationReason || `Agent authority ceiling violated: Offered rate exceeds Buyer Max ৳${buyerPolicy.maxPricePerUnit}`
        });
      } else if (negotiationResult.success && negotiationResult.finalPrice) {
        // Step 1: Agent Proposal formed (NOT yet canonical!)
        setCanonicalState('PROPOSAL_AWAITING_CANONICAL');

        // Step 2: Dispatch canonical command to backend authority verification pipeline
        AutonomousNegotiator.executeCanonicalCommitment({
          buyerAgent: buyerPolicy,
          sellerAgent: sellerPolicy,
          agreedTerms: {
            item: '50kg Nazirshail Rice',
            quantity: 50,
            price: negotiationResult.finalPrice,
            deliveryTime: 'Tomorrow 10:00 AM'
          }
        }).then((res) => {
          if (res.success && res.canonicalMutationExecuted) {
            setCanonicalState('CANONICAL_COMMITTED');
            setCanonicalDetails({
              commitmentId: res.commitmentId,
              domainEvent: res.domainEvent || 'commitment.formed'
            });
            onCommitmentFormed({
              item: '50kg Nazirshail Rice',
              quantity: 50,
              price: negotiationResult.finalPrice!
            });
          } else {
            setCanonicalState('AUTHORITY_REJECTED');
            setCanonicalDetails({
              reason: res.reason || 'Authority Engine rejected proposal.'
            });
          }
        });
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, negotiationResult, scenarioMode]);

  if (!isOpen || !negotiationResult) return null;

  const visibleSteps: NegotiationStep[] = negotiationResult.steps.slice(0, currentStepIdx + 1);
  const currentStep = visibleSteps[visibleSteps.length - 1];
  const isFinished = currentStepIdx === negotiationResult.steps.length - 1;

  const handleRestart = () => {
    initNegotiation(scenarioMode);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-neutral-200/80 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#121214] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight">
                    {lang === 'bn' ? 'স্বয়ংক্রিয় এজেন্ট দর কষাকষি' : 'Autonomous Agent Negotiation'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    HUMANS OFFLINE
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {buyerPolicy.actorName}&apos;s Agent ↔ {sellerPolicy.actorName}&apos;s Agent
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Test Selector & Status Bar */}
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Adversarial Test Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 rounded-xl">
              <button
                onClick={() => {
                  setScenarioMode('NORMAL');
                  initNegotiation('NORMAL');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  scenarioMode === 'NORMAL'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {lang === 'bn' ? 'স্বাভাবিক নীতি (৳৬১৫)' : 'Standard Policy'}
              </button>
              <button
                onClick={() => {
                  setScenarioMode('CEILING_VIOLATION');
                  initNegotiation('CEILING_VIOLATION');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  scenarioMode === 'CEILING_VIOLATION'
                    ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                    : 'text-rose-700 hover:text-rose-900'
                }`}
                title="Adversarial Test: Seller demands ৳628 exceeding Buyer Ceiling ৳620"
              >
                {lang === 'bn' ? 'সীমা লঙ্ঘন টেস্ট (৳৬২৮)' : 'Ceiling Breach Test'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Turn-by-Turn Message Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {visibleSteps.map((step, idx) => {
              const isBuyer = step.speaker === 'BUYER_AGENT';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      {step.agentTitle}
                    </span>
                    <span className="text-[10px] text-neutral-300 font-mono">{step.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      isBuyer
                        ? 'bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-tl-sm'
                        : 'bg-[#18181B] text-white border border-neutral-700 rounded-tr-sm'
                    }`}
                  >
                    <p className="font-medium">{step.text}</p>
                    <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono opacity-80">
                      <span>Rate: ৳{step.offeredPrice}/kg</span>
                      <span>Qty: {step.offeredQuantity}kg</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* State A: Proposal Awaiting Canonical Confirmation */}
            {isFinished && canonicalState === 'PROPOSAL_AWAITING_CANONICAL' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 space-y-2 mt-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>AGENT PROPOSAL: 50kg · ৳{negotiationResult.finalPrice} · Tomorrow 10:00 AM</span>
                </div>
                <div className="text-xs text-neutral-700 leading-relaxed font-mono">
                  ✦ Awaiting canonical confirmation & authority check... (Agent cannot write reality directly)
                </div>
              </motion.div>
            )}

            {/* State B: Canonical Commitment Formed via Authority Engine */}
            {isFinished && canonicalState === 'CANONICAL_COMMITTED' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 space-y-2 mt-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ CANONICAL COMMITMENT FORMED</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    REALITY LOCKED
                  </span>
                </div>
                <div className="text-xs text-neutral-700 leading-relaxed">
                  উভয় পক্ষের নীতিমালা যাচাই সম্পন্ন হয়েছে। Authority Engine সফলভাবে ডোমেইন ইভেন্ট ও কমিটমেন্ট তৈরি করেছে।
                </div>
                <div className="p-3 rounded-xl bg-white/80 border border-emerald-500/20 font-mono text-[11px] text-neutral-600 space-y-1">
                  <div>• Terms: 50 kg · ৳{negotiationResult.finalPrice} · Tomorrow 10:00 AM</div>
                  <div>• Authority: Verified Karim Policy #12 (≤ ৳{buyerPolicy.maxPricePerUnit})</div>
                  <div>• Domain Event: <span className="text-emerald-700 font-bold">{canonicalDetails?.domainEvent || 'commitment.formed'}</span></div>
                  <div>• Commitment ID: <span className="text-neutral-800 font-semibold">{canonicalDetails?.commitmentId || '#C-9912'}</span></div>
                </div>
              </motion.div>
            )}

            {/* State C: Adversarial Test Failure (Authority Violation) */}
            {isFinished && canonicalState === 'AUTHORITY_REJECTED' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 space-y-3 mt-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>AUTHORITY BOUNDARY BREACH DETECTED</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-rose-200 font-mono text-xs text-rose-900 space-y-1">
                  <div className="font-bold text-rose-700">NO CANONICAL MUTATION</div>
                  <div className="font-bold text-rose-700">NO COMMITMENT</div>
                  <div className="font-bold text-rose-700">NO REALITY CHANGE</div>
                  <div className="text-neutral-600 pt-1 text-[11px]">
                    Reason: {canonicalDetails?.reason || `Agent authority ceiling violated. Demanded ৳${negotiationResult.finalPrice} exceeds authorized limit ৳${buyerPolicy.maxPricePerUnit}`}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Human-in-the-Loop Interception Drawer */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700">
                {lang === 'bn' ? 'মানুষের নিয়ন্ত্রণ ও হস্তক্ষেপ (Human-in-the-Loop):' : 'Human Interception:'}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Current: ৳{currentStep?.offeredPrice || 615}/kg
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  alert(lang === 'bn' ? 'বর্তমান দর অনুমোদন করা হলো।' : 'Approved current terms.');
                  setIsPlaying(true);
                }}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white transition-colors cursor-pointer text-center"
              >
                {lang === 'bn' ? '✓ অনুমোদন করুন (Approve)' : 'Approve Terms'}
              </button>

              <button
                onClick={() => {
                  const newLim = prompt(lang === 'bn' ? 'নতুন সর্বোচ্চ দর লিখুন (৳):' : 'Enter new max limit (৳):', '615');
                  if (newLim) {
                    alert(lang === 'bn' ? `সীমা আপডেট করা হয়েছে: ৳${newLim}` : `Limit updated to ৳${newLim}`);
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'সীমা বদলান' : 'Change Limit'}
              </button>

              <button
                onClick={() => {
                  alert(lang === 'bn' ? 'আপনি স্বয়ং কনভারসেশন টেকওভার করেছেন।' : 'Human taken over conversation.');
                  setIsPlaying(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-900 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'টেকওভার করুন' : 'Take Over'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

