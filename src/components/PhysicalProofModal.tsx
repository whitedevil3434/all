import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileCheck, CheckCircle2, X, Camera, Scale, Award, QrCode } from 'lucide-react';
import { ScenarioPreset } from '../data/journeyScenarios';

interface PhysicalProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioPreset;
  lang: 'bn' | 'en';
  realityStage: string;
  onVerifyAndSettle?: () => void;
}

export function PhysicalProofModal({
  isOpen,
  onClose,
  scenario,
  lang,
  realityStage,
  onVerifyAndSettle,
}: PhysicalProofModalProps) {
  if (!isOpen) return null;

  const isSettled = realityStage === 'settled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-neo-bg w-full max-w-md rounded-3xl p-6 shadow-neo-up-xl border border-black/[0.06] relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {lang === 'bn' ? 'ডিজিটাল প্রমাণ ও গুণমান যাচাই' : 'Physical Proof & Quality Slip'}
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">
                Seal #WB-849102-BD
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-neo-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Weighbridge Slip */}
        <div className="my-4 p-4 rounded-2xl bg-neo-bg border border-black/[0.06] flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Scale className="w-4 h-4 text-gray-600" />
              <span>TEJGAON CENTRAL WEIGHBRIDGE</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
              CERTIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 block">Vehicle Tare Wt:</span>
              <span className="font-bold text-gray-800">1,399.8 kg</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Gross Loaded Wt:</span>
              <span className="font-bold text-gray-800">1,450.0 kg</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Net Product Wt:</span>
              <span className="font-bold text-emerald-700 text-sm">
                50.2 kg (Pass 100.4%)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Moisture Ratio:</span>
              <span className="font-bold text-gray-800">12.8% (Target &lt;14%)</span>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 pt-2 border-t border-dashed border-gray-300 flex justify-between">
            <span>Timestamp: 09:38:12 AM BST</span>
            <span>Operator: Enamul Haque</span>
          </div>
        </div>

        {/* Photo Evidence & Visual Inspection */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-gray-500" />
            {lang === 'bn' ? 'আনলোডিং ফটো প্রমাণপত্র' : 'Unloading Photo Geostamp'}
          </span>

          <div className="relative rounded-2xl overflow-hidden border border-white/40 bg-gray-900 text-white p-4 h-32 flex flex-col justify-between shadow-inner">
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full font-mono">
                GPS: 23.7925° N, 90.4078° E (Gulshan-2)
              </span>
              <span className="text-[10px] bg-emerald-500/80 px-2 py-0.5 rounded-full font-bold">
                ✓ Sacks Inspected
              </span>
            </div>

            {/* Mock Visual representation of sacks in dock */}
            <div className="flex items-center justify-center gap-3 opacity-90 my-auto">
              <div className="w-10 h-12 bg-amber-100 rounded-md border border-amber-300 flex flex-col items-center justify-center text-amber-900 text-[9px] font-bold shadow-neo-up-md">
                <span>🌾</span>
                <span>25kg</span>
              </div>
              <div className="w-10 h-12 bg-amber-100 rounded-md border border-amber-300 flex flex-col items-center justify-center text-amber-900 text-[9px] font-bold shadow-neo-up-md">
                <span>🌾</span>
                <span>25kg</span>
              </div>
              <div className="text-xs text-gray-300 font-sans">
                <span className="font-bold text-white block">2x 25kg Sacks</span>
                <span className="text-[10px] text-emerald-400">Tamper Seal Intact</span>
              </div>
            </div>

            <div className="flex justify-between items-end z-10 text-[9px] font-mono text-gray-400">
              <span>Security Officer: M. Rafiq</span>
              <span>SHA-256: 8f4c...91b2</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isSettled ? (
          <button
            onClick={() => {
              if (onVerifyAndSettle) {
                onVerifyAndSettle();
              }
              onClose();
            }}
            className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-neo-up-md cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {lang === 'bn' ? 'প্রমাণপত্র নিশ্চিত ও চূড়ান্ত নিষ্পত্তি করুন' : 'Confirm Proof & Settle Reality'}
            </span>
          </button>
        ) : (
          <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'বাস্তবতা সম্পূর্ণ প্রমাণিত ও নিষ্পত্তিপ্রাপ্ত' : 'Reality Fully Proven & Settled'}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
