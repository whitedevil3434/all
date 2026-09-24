import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, QrCode, Download, Printer, X, ShieldCheck, ExternalLink } from 'lucide-react';
import { ScenarioPreset } from '../data/journeyScenarios';

interface SettlementCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioPreset;
  lang: 'bn' | 'en';
}

export function SettlementCertificateModal({
  isOpen,
  onClose,
  scenario,
  lang,
}: SettlementCertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {lang === 'bn' ? 'কজাল নিষ্পত্তি সনদপত্র' : 'C-Link Settlement Certificate'}
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">
                Protocol Proof #CLINK-2026-0912
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

        {/* Certificate Card Printable Area */}
        <div className="my-4 p-5 rounded-2xl bg-[#FCFAF5] border-2 border-[#E8E4D8] flex flex-col gap-4 text-center relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none text-9xl font-black text-black select-none">
            C-LINK
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest text-[#8C826F] uppercase">
              UNIVERSAL CAUSAL SETTLEMENT CERTIFICATE
            </span>
            <h2 className="text-xl font-black text-gray-900 mt-1">
              {lang === 'bn' ? 'বাস্তবতা সফলভাবে নিষ্পত্তি হয়েছে' : 'Reality Verified & Closed'}
            </h2>
            <p className="text-xs text-gray-600 mt-1 max-w-sm">
              {lang === 'bn'
                ? `সকল পক্ষের দায়িত্ব ও প্রতিশ্রুতি সন্তোষজনকভাবে সম্পন্ন হওয়ার প্রমাণ সাপেক্ষে এই ডিজিটাল সনদ প্রদান করা হলো।`
                : `This certifies that the causal chain for ${scenario.name} has satisfied all conditions and physical proofs.`}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-neo-bg rounded-xl p-3.5 border border-[#E8E4D8] text-xs text-left flex flex-col gap-2 font-mono">
            <div className="flex justify-between border-b border-white/50 pb-1.5">
              <span className="text-gray-500">Item & Quantity:</span>
              <span className="font-bold text-gray-900">{scenario.totalQuantity} {scenario.item}</span>
            </div>
            <div className="flex justify-between border-b border-white/50 pb-1.5">
              <span className="text-gray-500">Destination:</span>
              <span className="font-bold text-gray-900">{scenario.destination}</span>
            </div>
            <div className="flex justify-between border-b border-white/50 pb-1.5">
              <span className="text-gray-500">Actors Compensated:</span>
              <span className="font-bold text-gray-900">
                {scenario.primaryActor.name} + {scenario.candidates[0].name} + {scenario.driver.name}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/50 pb-1.5">
              <span className="text-gray-500">Total Escrow Disbursed:</span>
              <span className="font-bold text-emerald-700">৳{scenario.escrowTotal.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cryptographic Root:</span>
              <span className="text-[10px] text-gray-400">0x7f48b9281a9cd4...</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E4D8]">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-neo-bg rounded-lg border border-white/40 flex items-center justify-center p-1">
                <QrCode className="w-10 h-10 text-gray-800" />
              </div>
              <div className="text-left text-[10px] text-gray-500 font-mono">
                <span className="block text-gray-800 font-bold">VERIFIABLE QR</span>
                <span>Scan for chain audit</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">C-Link Automated Notary</span>
              <span className="text-xs font-serif italic text-gray-800 font-bold">C-Link Autonomous Protocol</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 mt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-[#1C1C1A] hover:bg-black text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-neo-down-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সনদ প্রিন্ট / সেভ করুন' : 'Print Certificate'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neo-bg hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
