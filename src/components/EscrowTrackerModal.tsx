import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  X,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  Flame,
  Send,
  Copy,
  Check,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { ScenarioPreset } from '../data/journeyScenarios';
import { causalAudio } from '../lib/causalAudio';

interface EscrowTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioPreset;
  realityStage: string;
  lang: 'bn' | 'en';
  onReleaseEscrow?: () => void;
}

export function EscrowTrackerModal({
  isOpen,
  onClose,
  scenario,
  realityStage,
  lang,
}: EscrowTrackerModalProps) {
  const [fuelAdvanceGiven, setFuelAdvanceGiven] = useState(false);
  const [isDisputed, setIsDisputed] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);

  // Simulated bKash Direct Checkout State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [bkashPin, setBkashPin] = useState('');
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);
  const [depositCompleted, setDepositCompleted] = useState(true); // default true for flow, but can re-trigger

  if (!isOpen) return null;

  const isSettled = realityStage === 'settled';
  const isTransportActive = realityStage === 'transport_active';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTrx(id);
    causalAudio.playTick();
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const handleSendFuelAdvance = () => {
    causalAudio.playCommitChord();
    setFuelAdvanceGiven(true);
  };

  const handleToggleDispute = () => {
    causalAudio.playTick();
    setIsDisputed((prev) => !prev);
    setShowDisputeInput(false);
  };

  const handleSimulatedBkashDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingDeposit(true);
    causalAudio.playTick();
    setTimeout(() => {
      setIsProcessingDeposit(false);
      setDepositCompleted(true);
      setIsDepositModalOpen(false);
      causalAudio.playCommitChord();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-neo-bg w-full max-w-lg rounded-3xl p-6 shadow-neo-up-xl border border-black/[0.06] relative flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDisputed
                  ? 'bg-rose-100 text-rose-800 animate-pulse'
                  : isSettled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isDisputed ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : isSettled ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {lang === 'bn' ? 'কজাল এসক্রো ওয়ালেট ও বিকাশ গেটওয়ে' : 'Causal Escrow & MFS Gateway'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-bold">
                  bKash / Nagad
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                Trust A/C: 01711-ESCROW-882 · BB Auth #0921
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-neo-bg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dispute Warning Banner (if triggered) */}
        {isDisputed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">
                {lang === 'bn' ? '⚠️ এসক্রো সাময়িক স্থগিত (Dispute Freeze Active)' : '⚠️ Escrow Frozen on Dispute'}
              </span>
              <span className="text-[11px] text-rose-700">
                {lang === 'bn'
                  ? 'ব্যবহারকারীর আপত্তির কারণে চূড়ান্ত অর্থ ছাড় সাময়িকভাবে আটকে রাখা হয়েছে। গুণগত মান পরীক্ষা না হওয়া পর্যন্ত স্বয়ংক্রিয় ছাড় স্থগিত।'
                  : 'Automatic payout paused upon user flag until quality tolerance is re-audited.'}
              </span>
            </div>
            <button
              onClick={handleToggleDispute}
              className="px-2.5 py-1 bg-rose-200 hover:bg-rose-300 text-rose-900 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
            >
              {lang === 'bn' ? 'স্থগিতাদেশ প্রত্যাহার' : 'Lift Freeze'}
            </button>
          </motion.div>
        )}

        {/* Status Pill & Total Vault Balance */}
        <div className="my-4 p-4 rounded-2xl bg-neo-bg border border-black/[0.04] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {lang === 'bn' ? 'মোট সংরক্ষিত বাজেট (Total In Vault)' : 'Total Escrow Allocation'}
            </span>
            <span className="text-2xl font-black text-gray-900 font-mono">
              ৳{scenario.escrowTotal.toLocaleString()}
            </span>
            {fuelAdvanceGiven && (
              <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                {lang === 'bn' ? '✓ জ্বালানি বাবদ ৳২০০ ইতোমধ্যে ছাড়কৃত' : '✓ ৳200 Fuel advance already disbursed'}
              </span>
            )}
          </div>

          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              isDisputed
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : isSettled
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
            }`}
          >
            {isDisputed ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'স্থগিত (Frozen)' : 'Disputed / Frozen'}
              </>
            ) : isSettled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'টাকা ছাড় সম্পন্ন' : 'Released to Actors'}
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'লকড / সুরক্ষিত' : 'Locked in Escrow'}
              </>
            )}
          </span>
        </div>

        {/* Breakdown by Actor with MFS Details */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {lang === 'bn' ? 'অংশীজনদের অর্থ বরাদ্দ ও MFS গেটওয়ে' : 'Distribution per Actor & Gateways'}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">B2C Split-API v2</span>
          </div>

          {/* Actor 1: Primary Supplier (bKash) */}
          <div className="p-3.5 rounded-2xl border border-white/50 bg-neo-bg flex items-center justify-between hover:border-white/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200/80 text-pink-700 flex items-center justify-center font-black text-xs">
                bK
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-gray-900">
                    {lang === 'bn' ? scenario.primaryActor.nameBn : scenario.primaryActor.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">01711-923841</span>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  {scenario.primaryActor.quantity} @ {scenario.primaryActor.ratePerUnit}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-gray-900 block">
                ৳{scenario.escrowBreakdown.primary.toLocaleString()}
              </span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {isSettled ? '✓ Paid via bKash' : 'Locked in Trust'}
                </span>
                <button
                  onClick={() => handleCopy('TRX-BK-992014', 'a1')}
                  title="Copy bKash TrxID"
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {copiedTrx === 'a1' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Actor 2: Secondary Supplier (Nagad) */}
          <div className="p-3.5 rounded-2xl border border-white/50 bg-neo-bg flex items-center justify-between hover:border-white/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center font-black text-xs">
                নগদ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-gray-900">
                    {lang === 'bn' ? scenario.candidates[0].nameBn : scenario.candidates[0].name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">01822-491022</span>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  {scenario.gapQuantity} @ ৳{scenario.candidates[0].ratePerUnit}/unit
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-gray-900 block">
                ৳{scenario.escrowBreakdown.secondary.toLocaleString()}
              </span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="text-[10px] text-blue-600 font-semibold">
                  {isSettled ? '✓ Paid via Nagad' : realityStage === 'gap_open' ? 'Reserved' : 'Locked'}
                </span>
                <button
                  onClick={() => handleCopy('TRX-NG-381902', 'a2')}
                  title="Copy Nagad TrxID"
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {copiedTrx === 'a2' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Actor 3: Logistics Driver (Fuel & Wage) */}
          <div className="p-3.5 rounded-2xl border border-white/50 bg-neo-bg flex items-center justify-between hover:border-white/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center font-black text-xs">
                Upay
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-gray-900">
                    {lang === 'bn' ? scenario.driver.nameBn : scenario.driver.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">01712-482910</span>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  {scenario.driver.vehicle} · ৳৮০০ মোট ভাড়া
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-gray-900 block">
                ৳{scenario.escrowBreakdown.logistics.toLocaleString()}
              </span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="text-[10px] text-amber-700 font-semibold">
                  {isSettled
                    ? '✓ Settled in Full'
                    : fuelAdvanceGiven
                    ? '৳200 Paid · ৳600 Locked'
                    : isTransportActive
                    ? 'In Transit'
                    : 'Reserved'}
                </span>
                <button
                  onClick={() => handleCopy('TRX-UP-719302', 'tr')}
                  title="Copy Driver TrxID"
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {copiedTrx === 'tr' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE USER CONTROLS SECTION (Interactive Features) */}
        <div className="mt-4 pt-3.5 border-t border-white/50 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {lang === 'bn' ? 'ব্যবহারকারীর তাৎক্ষণিক এসক্রো নিয়ন্ত্রণ' : 'Active Escrow Controls'}
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* 1. Send Fuel Advance to Driver */}
            <button
              onClick={handleSendFuelAdvance}
              disabled={fuelAdvanceGiven || isSettled}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1 cursor-pointer ${
                fuelAdvanceGiven
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-default'
                  : 'bg-neo-bg hover:bg-amber-50/50 border-white/40 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'জ্বালানি অগ্রিম' : 'Fuel Advance'}
                </span>
                {fuelAdvanceGiven && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <span className="text-[10px] text-gray-600 font-normal">
                {fuelAdvanceGiven
                  ? (lang === 'bn' ? '✓ ৳২০০ বিকাশ ছাড় হয়েছে' : '✓ ৳200 sent to driver')
                  : (lang === 'bn' ? 'চালকের ওয়ালেটে ৳২০০ দিন' : 'Disburse ৳200 to Driver')}
              </span>
            </button>

            {/* 2. Freeze / Dispute Toggle */}
            <button
              onClick={() => {
                if (isDisputed) {
                  handleToggleDispute();
                } else {
                  setShowDisputeInput((prev) => !prev);
                }
              }}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1 cursor-pointer ${
                isDisputed
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-neo-bg hover:bg-rose-50/40 border-white/40 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1 text-[11px] text-rose-600 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'কোয়ালিটি আপত্তি' : 'Dispute / Hold'}
                </span>
                {isDisputed && <span className="text-[9px] bg-rose-200 px-1 rounded font-bold">LOCKED</span>}
              </div>
              <span className="text-[10px] text-gray-600 font-normal">
                {isDisputed
                  ? (lang === 'bn' ? 'স্থগিতাদেশ তুলুন' : 'Click to unfreeze')
                  : (lang === 'bn' ? 'টাকা সাময়িক আটকে রাখুন' : 'Freeze auto-release')}
              </span>
            </button>
          </div>

          {/* Dispute Input Drawer */}
          <AnimatePresence>
            {showDisputeInput && !isDisputed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 flex flex-col gap-2"
              >
                <span className="text-[11px] font-bold text-rose-900">
                  {lang === 'bn' ? 'আপত্তির কারণ নির্বাচন বা টাইপ করুন:' : 'State reason for freezing escrow:'}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {['আর্দ্রতা বেশি (>১৪%)', 'চাল ভাঙা বেশি', 'ওজনে গরমিল', 'ডেলিভারিতে বিলম্ব'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setDisputeReason(r)}
                      className={`px-2 py-0.5 rounded-md text-[10px] border cursor-pointer ${
                        disputeReason === r
                          ? 'bg-rose-700 text-white border-rose-700'
                          : 'bg-neo-bg text-rose-800 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleToggleDispute}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {lang === 'bn' ? 'নিশ্চিত করুন: এসক্রো ফ্রিজ করুন' : 'Confirm Escrow Freeze'}
                  </button>
                  <button
                    onClick={() => setShowDisputeInput(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs cursor-pointer"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Causal Protocol Guarantee Note */}
        <div className="mt-4 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <span>
            {lang === 'bn'
              ? 'কজাল আর্কিটেকচার নীতি: টাকা সরাসরি কোনো ব্যক্তির হাতে যায় না। পণ্য ডেলিভারি, ওজন স্লিপ এবং জিপিএস সিল পাওয়ার সাথে সাথেই বাংলাদেশ ব্যাংক সমর্থিত MFS গেটওয়ের মাধ্যমে স্বয়ংক্রিয় স্প্লিট পেমেন্ট কার্যকর হয়।'
              : 'Causal Architecture Rule: Funds are held in a programmable multi-party trust account. Upon weighbridge receipt proof, funds instantly split to all 3 actors simultaneously.'}
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-[#1C1C1A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
        >
          {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
        </button>
      </motion.div>
    </div>
  );
}

