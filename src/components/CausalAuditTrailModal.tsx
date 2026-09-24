import React from 'react';
import { motion } from 'motion/react';
import { History, X, Check, ArrowRight, ShieldCheck, GitCommit } from 'lucide-react';
import { ScenarioPreset } from '../data/journeyScenarios';

interface CausalAuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioPreset;
  lang: 'bn' | 'en';
  realityStage: string;
}

export function CausalAuditTrailModal({
  isOpen,
  onClose,
  scenario,
  lang,
  realityStage,
}: CausalAuditTrailModalProps) {
  if (!isOpen) return null;

  const events = [
    {
      id: 'EV-01',
      hash: '0x1a8f9c',
      time: '09:00:12 AM',
      actor: 'Requester (You)',
      actorBn: 'অনুরোধকারী (আপনি)',
      action: 'Genesis of Want',
      actionBn: 'উদ্দেশ্যের উৎপত্তি (Want Genesis)',
      desc: `${scenario.totalQuantity} ${scenario.item} required at ${scenario.destination}`,
      status: 'settled',
    },
    {
      id: 'EV-02',
      hash: '0x3d4e7b',
      time: '09:04:45 AM',
      actor: scenario.primaryActor.name,
      actorBn: scenario.primaryActor.nameBn,
      action: 'Primary Commitment',
      actionBn: '১ম সরবরাহকারীর প্রতিশ্রুতি',
      desc: `${scenario.primaryActor.quantity} committed @ ${scenario.primaryActor.ratePerUnit}`,
      status: 'settled',
    },
    {
      id: 'EV-03',
      hash: '0x5c8a1e',
      time: '09:05:00 AM',
      actor: 'C-Link Protocol',
      actorBn: 'সি-লিঙ্ক প্রোটোকল',
      action: 'Gap Identification',
      actionBn: 'ঘাটতি উন্মোচন (Unmet Deficit)',
      desc: `${scenario.gapQuantity} deficit detected on causal frontier`,
      status: 'settled',
    },
    {
      id: 'EV-04',
      hash: '0x7b9d3f',
      time: '09:12:30 AM',
      actor: scenario.candidates[0].name,
      actorBn: scenario.candidates[0].nameBn,
      action: 'Secondary Commitment',
      actionBn: '২য় সরবরাহকারীর প্রস্তাব গ্রহণ',
      desc: `${scenario.gapQuantity} accepted @ ৳${scenario.candidates[0].ratePerUnit}/unit`,
      status: realityStage !== 'gap_open' && realityStage !== 'karim_asking' ? 'settled' : 'pending',
    },
    {
      id: 'EV-05',
      hash: '0x9e2a4c',
      time: '09:14:02 AM',
      actor: scenario.driver.name,
      actorBn: scenario.driver.nameBn,
      action: 'Logistics Assignment',
      actionBn: 'যানবাহন ও চালক নিয়োগ',
      desc: `Transit locked for dual-pickup route (${scenario.driver.cost})`,
      status: realityStage === 'transport_active' || realityStage === 'settled' ? 'settled' : 'pending',
    },
    {
      id: 'EV-06',
      hash: '0xbb4f8a',
      time: '09:38:12 AM',
      actor: 'Tejgaon Weighbridge',
      actorBn: 'তেজগাঁও ওয়েইব্রিজ',
      action: 'Physical Verification',
      actionBn: 'ডিজিটাল ওজন ও গুণমান যাচাই',
      desc: `Gross wt 1,450 kg verified. Moisture sensor 12.8% (Passed)`,
      status: realityStage === 'settled' ? 'settled' : 'pending',
    },
    {
      id: 'EV-07',
      hash: '0xdc7e2b',
      time: '09:40:00 AM',
      actor: 'C-Link Escrow Vault',
      actorBn: 'সি-লিঙ্ক এসক্রো ভল্ট',
      action: 'Settlement & Release',
      actionBn: 'চূড়ান্ত নিষ্পত্তি ও অর্থ ছাড়',
      desc: `৳${scenario.escrowTotal.toLocaleString()} BDT auto-disbursed across all parties`,
      status: realityStage === 'settled' ? 'settled' : 'pending',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-neo-bg w-full max-w-lg rounded-3xl p-6 shadow-neo-up-xl border border-black/[0.06] relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neo-bg border border-black/[0.06] flex items-center justify-center text-gray-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {lang === 'bn' ? 'কজাল অডিট ট্রেইল (ইতিহাস)' : 'Causal Audit Trail & Provenance'}
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">
                Chain of Truth • Verifiable Reality
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

        {/* Timeline list */}
        <div className="my-4 space-y-4">
          {events.map((ev, index) => {
            const isCompleted = ev.status === 'settled';
            return (
              <div
                key={ev.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-white/40 bg-neo-bg'
                    : 'border-dashed border-white/40 bg-neo-bg/70 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {ev.id}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {lang === 'bn' ? ev.actionBn : ev.action}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{ev.time}</span>
                </div>

                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{ev.desc}</p>

                <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-2 pt-2 border-t border-white/50">
                  <span>Actor: {lang === 'bn' ? ev.actorBn : ev.actor}</span>
                  <span>Hash: {ev.hash}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#1C1C1A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
        >
          {lang === 'bn' ? 'বন্ধ করুন' : 'Close Audit Trail'}
        </button>
      </motion.div>
    </div>
  );
}
