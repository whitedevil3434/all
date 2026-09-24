import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Link2,
  Copy,
  Check,
  X,
  QrCode,
  Smartphone,
  Share2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { causalAudio } from '../lib/causalAudio';

interface ShareableCLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  actor: 'karim' | 'tariq';
  lang: 'bn' | 'en';
  onSimulateActorSession: () => void;
}

export function ShareableCLinkModal({
  isOpen,
  onClose,
  actor,
  lang,
  onSimulateActorSession,
}: ShareableCLinkModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const actorName = actor === 'karim' ? (lang === 'bn' ? 'কৃষক করিম' : 'Farmer Karim') : (lang === 'bn' ? 'চালক তারিক' : 'Driver Tariq');
  const linkUrl = actor === 'karim' ? 'https://clink.so/act/karim-20kg-miniket' : 'https://clink.so/act/tariq-logistics-dhk';

  const smsText =
    actor === 'karim'
      ? 'করিম ভাই, গুলশান অফিসের জন্য ২০ কেজি চাল প্রয়োজন (দর: ৳১২০/কেজি)। দায়িত্ব গ্রহণ ও বস্তা ট্র্যাকিংয়ের জন্য এই সি-লিঙ্কে চাপ দিন: clink.so/act/karim-20kg-miniket'
      : 'তারিক ভাই, শেরপুর ও মিরপুর থেকে ৫০ কেজি চাল গুলশানে পরিবহনের দায়িত্ব নিশ্চিত করতে এই সি-লিঙ্কে চাপ দিন: clink.so/act/tariq-logistics-dhk';

  const handleCopy = () => {
    navigator.clipboard?.writeText(linkUrl);
    setCopied(true);
    causalAudio.playTick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-neo-bg w-full max-w-md rounded-3xl p-6 shadow-neo-up-xl border border-black/[0.06] relative flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {lang === 'bn' ? `${actorName}-কে C-Link পাঠান` : `Send C-Link to ${actorName}`}
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Zero App Install · Fractal Loop</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-neo-bg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Link Box with Copy Button */}
        <div className="my-4 p-3.5 rounded-2xl bg-neo-bg border border-black/[0.05] flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {lang === 'bn' ? 'অংশীজনের একক কজাল লিংক' : 'Participant Actionable Link'}
          </span>
          <div className="flex items-center justify-between gap-2 bg-neo-bg px-3 py-2 rounded-xl border border-white/40">
            <span className="text-xs font-mono font-bold text-blue-700 truncate">{linkUrl}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-bold text-gray-700 hover:text-black cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* SMS / WhatsApp Preview */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {lang === 'bn' ? 'টেলকো এসএমএস / হোয়াটসঅ্যাপ বার্তা' : 'SMS / WhatsApp Payload'}
            </span>
            <span className="bg-emerald-200 px-1.5 py-0.2 rounded font-mono">160 Char</span>
          </div>
          <p className="text-xs font-medium text-emerald-900 leading-relaxed font-sans bg-neo-bg/70 p-2.5 rounded-xl border border-emerald-100">
            "{smsText}"
          </p>
        </div>

        {/* Causal Philosophy Explainer */}
        <div className="mt-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            {lang === 'bn'
              ? 'সি-লিঙ্কের ফ্র্যাক্টাল নীতি: করিম বা তারিক যখন এই লিঙ্কে ঢুকবে, তাদের কোনো অ্যাকাউন্ট খোলা লাগবে না। সরাসরি দায়িত্ব গ্রহণ করে তারা তাদের নিজস্ব সাব-নিড লুপ (বস্তা সিল, তেল অগ্রিম, ওজন প্রমাণ) সম্পূর্ণ করতে পারবে।'
              : 'Fractal Causal Principle: Outside actors open this zero-friction link to accept responsibility and immediately spawn their own recursive sub-need loop.'}
          </span>
        </div>

        {/* Direct Action: Test Simulation */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => {
              causalAudio.playCommitChord();
              onSimulateActorSession();
              onClose();
            }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-neo-down-sm flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>
              {lang === 'bn'
                ? `এই লিঙ্কে ঢুকে ${actorName}-এর লুপ পরীক্ষা করুন →`
                : `Open Link & Test ${actorName}'s Loop →`}
            </span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-neo-bg hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ' : 'Close'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
