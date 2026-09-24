import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Inbox,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  Bot,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { WhileAwayRecord, AgentDecisionTrace } from '../../engine/agent/ActorAgentEngine';

interface WhileAwayInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhyInspector: (trace: AgentDecisionTrace) => void;
  onReviewCommitment: () => void;
  lang?: 'bn' | 'en';
}

export const WhileAwayInboxModal: React.FC<WhileAwayInboxModalProps> = ({
  isOpen,
  onClose,
  onOpenWhyInspector,
  onReviewCommitment,
  lang = 'bn'
}) => {
  if (!isOpen) return null;

  const mockAwayTraces: AgentDecisionTrace[] = [
    {
      id: 'trace-liton-nego',
      timestamp: 'Yesterday 10:18 PM',
      actorName: 'Karim (Uttara Kitchen)',
      agentTitle: "Karim's OathLink Agent",
      actionTaken: 'Completed Autonomous Bargaining & Formed Commitment',
      counterPartyAgent: "Liton Mia's Agent (Alim Farms)",
      inputReceived: "Counter-offer ৳615/kg for 50kg rice",
      reasoning: {
        priceFloorOrCeiling: 'Allowed Ceiling ≤ ৳620/kg (Agreed ৳615 is valid)',
        stockOrNeed: 'Target quantity: 50.0kg Nazirshail',
        appliedPolicy: 'Authority Rule #4: Auto-accept terms below ceiling margin',
        calculation: '৳615 * 50 = ৳30,750 escrow allocation'
      },
      outputResult: 'Accepted 50kg @ ৳615. Canonical Commitment #C-4912 created.',
      isEscalatedToHuman: false,
      provenanceHash: '0x39a1f...hash'
    },
    {
      id: 'trace-truck-eta',
      timestamp: 'Today 7:42 AM',
      actorName: 'Covered Van (Tariq Ahmed)',
      agentTitle: 'Vehicle Telemetry Agent #4421',
      actionTaken: 'Detected Transit Risk & Updated Causal State',
      counterPartyAgent: "Karim's OathLink Agent",
      inputReceived: 'GPS Telemetry: Tongi Flyover Congestion (Speed 8 km/h)',
      reasoning: {
        priceFloorOrCeiling: 'N/A (Transit Sensor)',
        stockOrNeed: 'Estimated arrival was 10:00 AM; updated to 10:18 AM (+18 mins)',
        appliedPolicy: 'Autonomous Execution Protocol: Notify receiver on ETA drift > 15m',
        calculation: 'Traffic density factor 1.4x applied'
      },
      outputResult: 'Alerted Receiver Agent. Reality Surface updated without disturbing user sleep.',
      isEscalatedToHuman: false,
      provenanceHash: '0x88b72...sensor'
    },
    {
      id: 'trace-scale-proof',
      timestamp: 'Today 9:15 AM',
      actorName: 'IoT Certified Weighbridge',
      agentTitle: 'Hardware Scale Agent (SC-8921)',
      actionTaken: 'Certified Physical Weight & Cryptographic Hash',
      counterPartyAgent: "Karim's OathLink Agent",
      inputReceived: 'Hardware Load Cell Measurement: 50.02 kg',
      reasoning: {
        priceFloorOrCeiling: 'N/A (Sensor)',
        stockOrNeed: 'Contract spec: 50.00 kg (Tolerance ±0.5kg)',
        appliedPolicy: 'Dual-Key Epistemic Certification: Hardware cryptographic signature attached',
        calculation: 'Delta +0.02kg within acceptable moisture allowance'
      },
      outputResult: 'Physical proof verified. Escrow vault unblocked for final settlement.',
      isEscalatedToHuman: false,
      provenanceHash: '0x9924c...weigh'
    }
  ];

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
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight">While You Were Away</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                    3 ACTIONS RESOLVED
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {lang === 'bn'
                    ? 'আপনি অফলাইনে থাকার সময় আপনার এজেন্ট বাস্তবতায় যা যা সম্পন্ন করেছে'
                    : 'Actions and autonomous negotiations resolved by your Agent'}
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

          {/* List of Away Events */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Top Highlight Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 leading-relaxed">
                <span className="font-semibold block mb-0.5">
                  {lang === 'bn' ? 'সফল বোঝাপড়া ও চুক্তি তৈরি হয়েছে' : 'Successful Autonomous Agreement Reached'}
                </span>
                {lang === 'bn'
                  ? 'আপনার এজেন্ট ও লিটনের এজেন্টের মধ্যে ৩ দফা দর কষাকষির পর ৬১৫ টাকা দরে ৫০ কেজি চালের চূড়ান্ত কমিটমেন্ট কার্যকর হয়েছে।'
                  : "Your Agent and Liton's Agent negotiated 3 turns and settled on 50kg @ ৳615 within your approved policy."}
              </div>
            </div>

            {/* Event 1: Liton Negotiation */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-3 hover:border-neutral-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      {lang === 'bn' ? 'লিটনের এজেন্টের সঙ্গে স্বয়ংক্রিয় দর কষাকষি' : "Negotiation with Liton's Agent"}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">10:14 PM – 10:19 PM</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium font-mono">
                  AGREED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/90 font-mono text-xs text-neutral-800 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Reality Changed (ক্যানোনিকাল পরিবর্তন)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Expectation:</span>
                  <span className="font-semibold text-neutral-900">→ Commitment created</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Actor:</span>
                  <span className="font-semibold text-neutral-900">→ Liton Mia (Alim Farms)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Terms:</span>
                  <span className="font-semibold text-neutral-900">→ 50 kg · ৳615 · Tomorrow 10:00 AM</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Authority:</span>
                  <span className="font-semibold text-neutral-900">→ Karim Agent policy #12 (≤ ৳620)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Domain Event:</span>
                  <span className="font-semibold text-emerald-700">→ commitment.formed</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onOpenWhyInspector(mockAwayTraces[0])}
                  className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'এজেন্ট কেন ৬১৫ বলল? (Why?)' : 'Why did my Agent say that?'}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onReviewCommitment();
                  }}
                  className="flex items-center gap-1 text-xs text-neutral-900 hover:text-black font-semibold transition-colors cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'চুক্তি দেখুন' : 'Review Commitment'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Event 2: Vehicle Telemetry */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-3 hover:border-neutral-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      {lang === 'bn' ? 'কাভার্ড ভ্যান টেলিম্যাটিক্স রিপোর্ট' : 'Covered Van Sensor Update'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Today 7:42 AM</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium font-mono">
                  +18m DRIFT
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/90 font-mono text-xs text-neutral-800 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-widest text-blue-800 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-blue-600" />
                  <span>Reality Changed (ক্যানোনিকাল পরিবর্তন)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">State:</span>
                  <span className="font-semibold text-neutral-900">→ In Transit (Tongi Flyover)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Actor:</span>
                  <span className="font-semibold text-neutral-900">→ Covered Van (Tariq Ahmed)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Telemetry:</span>
                  <span className="font-semibold text-neutral-900">→ Speed 8 km/h · ETA +18 mins (10:18 AM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Domain Event:</span>
                  <span className="font-semibold text-blue-700">→ execution.drift_reported</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onOpenWhyInspector(mockAwayTraces[1])}
                  className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-medium transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সেন্সর ডেটা ট্রেস দেখুন' : 'Inspect Telemetry Reason'}</span>
                </button>
              </div>
            </div>

            {/* Event 3: IoT Scale Certification */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-3 hover:border-neutral-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      {lang === 'bn' ? 'ডিজিটাল ওজন স্কেল সাক্ষ্য গ্রহণ' : 'IoT Digital Scale Telemetry'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Today 9:15 AM</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium font-mono">
                  50.02 kg VERIFIED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/90 font-mono text-xs text-neutral-800 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Reality Changed (ক্যানোনিকাল পরিবর্তন)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">State:</span>
                  <span className="font-semibold text-neutral-900">→ Physical Proof Certified</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Sensor:</span>
                  <span className="font-semibold text-neutral-900">→ IoT Dual-Key Weighbridge (SC-8921)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500">Telemetry:</span>
                  <span className="font-semibold text-neutral-900">→ 50.02 kg (Delta +0.02kg within tolerance)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Domain Event:</span>
                  <span className="font-semibold text-emerald-700">→ evidence.verified</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onOpenWhyInspector(mockAwayTraces[2])}
                  className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-medium transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'প্রুফ হ্যাশ ও অডিট সনদ' : 'View Proof Hash & Chain'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-sm transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'ইনবক্স বন্ধ করুন' : 'Dismiss Inbox'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
