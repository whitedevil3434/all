import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowDown,
  Hash,
  Sparkles,
  GitBranch,
  Bot
} from 'lucide-react';
import { AgentDecisionTrace } from '../../engine/agent/ActorAgentEngine';

interface AgentWhyInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trace: AgentDecisionTrace | null;
  lang?: 'bn' | 'en';
}

export const AgentWhyInspectorModal: React.FC<AgentWhyInspectorModalProps> = ({
  isOpen,
  onClose,
  trace,
  lang = 'bn'
}) => {
  if (!isOpen || !trace) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-neutral-200/80 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#121214] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  {lang === 'bn' ? 'কার্যকারণ সূত্র ও অডিট বিবরণী (Inspectable Provenance)' : 'Inspectable Action Provenance'}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  {trace.agentTitle} • {trace.timestamp}
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

          {/* Constitutional Rule */}
          <div className="px-6 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2 text-[10.5px] text-amber-400 font-mono">
            <span>✦ Constitutional Axiom:</span>
            <span className="text-neutral-300">Every consequential Agent action has inspectable provenance.</span>
          </div>

          {/* Causal Chain Explanation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Action Statement */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                {lang === 'bn' ? 'গৃহীত পদক্ষেপ (Agent Action Result)' : 'Agent Action Result'}
              </span>
              <div className="text-sm font-medium leading-snug">{trace.actionTaken}</div>
              <div className="text-xs text-emerald-400 pt-1 font-mono">{trace.outputResult}</div>
            </div>

            {/* Explanatory Formula Breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                {lang === 'bn' ? 'সম্পূর্ণ কজাল চেইন (Request → Reality → Policy → Authority → Action)' : 'Causal Provenance Chain'}
              </div>

              {/* Step 1: Request */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block mb-0.5">
                  1. Request (বহিরাগত অনুরোধ)
                </span>
                <div className="text-xs font-medium text-neutral-900">{trace.inputReceived}</div>
                <div className="text-[10.5px] text-neutral-500 mt-0.5">
                  Counter-party: {trace.counterPartyAgent}
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <ArrowDown className="w-3.5 h-3.5 text-neutral-300" />
              </div>

              {/* Step 2: Current Reality */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block mb-0.5">
                  2. Current Reality (বর্তমান বাস্তবতা)
                </span>
                <div className="text-xs font-medium text-neutral-900">
                  {trace.reasoning.stockOrNeed}
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <ArrowDown className="w-3.5 h-3.5 text-neutral-300" />
              </div>

              {/* Step 3: Relevant Policy & Boundaries */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block mb-0.5">
                  3. Relevant Policy & Floor/Ceiling (নীতিমালা ও দর সীমা)
                </span>
                <div className="text-xs font-medium text-neutral-900">
                  {trace.reasoning.priceFloorOrCeiling}
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <ArrowDown className="w-3.5 h-3.5 text-neutral-300" />
              </div>

              {/* Step 4: Authority Check */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-amber-800 uppercase font-mono block mb-0.5 font-semibold">
                  4. Authority Verification (অনুমোদন যাচাই)
                </span>
                <div className="text-xs font-semibold text-neutral-900">
                  {trace.reasoning.appliedPolicy}
                </div>
                <div className="text-[11px] text-neutral-700 mt-0.5">
                  Calculation: {trace.reasoning.calculation}
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <ArrowDown className="w-3.5 h-3.5 text-neutral-300" />
              </div>

              {/* Step 5: Agent Action & Result */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-800 uppercase font-mono block mb-0.5 font-semibold">
                  5. Action & Canonical Outcome (ফলাফল ও নিষ্পত্তি)
                </span>
                <div className="text-xs font-semibold text-emerald-950">
                  {trace.outputResult}
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Provenance */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-neutral-400" />
                Audit Hash:
              </span>
              <span className="text-neutral-700">{trace.provenanceHash}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-sm transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'বুঝেছি' : 'Close Explanation'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
