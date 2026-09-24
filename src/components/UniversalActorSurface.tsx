import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Link2,
  Check,
  Copy,
  User,
  Sparkles,
  Hourglass,
  CheckCircle2,
  ArrowRight,
  Mic,
  PackageCheck
} from 'lucide-react';
import { useUniversalCompose } from '../engine/universal/useUniversalCompose';
import { causalAudio } from '../lib/causalAudio';

export interface UniversalActorSurfaceProps {
  actorName: string;
  actorRole: string;
  primaryResponsibility: string;
  lang: 'bn' | 'en';
  onBackToLive: () => void;
}

export function UniversalActorSurface({
  actorName,
  actorRole,
  primaryResponsibility,
  lang,
  onBackToLive,
}: UniversalActorSurfaceProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();

  // Child Dynamic Reality (Recursive Work)
  const [childReality, setChildReality] = useState<{ active: boolean; nodes: any[] }>({
    active: false,
    nodes: [],
  });

  const actorUrl = `https://clink.so/act/${actorName.toLowerCase().replace(/\s+/g, '-')}-link`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(actorUrl);
    setCopiedLink(true);
    causalAudio.playTick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleComposerSubmit = (text: string) => {
    const raw = (text || inputValue).trim();
    if (!raw) return;
    setInputValue('');
    causalAudio.playTick();
    
    // We pass the actor's localized context to the Universal Composer
    submitIntent(raw, {
      currentActor: actorName,
      responsibility: primaryResponsibility,
      isSubTask: true
    });
  };

  const launchChildReality = () => {
    if (!hypothesis) return;
    causalAudio.playSettleHarmony();
    
    // Mocking finding actors instantly for the child reality for demonstration
    const resolvedNodes = hypothesis.proposedDependencies.map((d: any) => ({
      ...d,
      actor: { name: 'Auto-Assigned Local Vendor', status: 'COMMITTED' }
    }));

    setChildReality({
      active: true,
      nodes: resolvedNodes
    });
    clearHypothesis();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -8 }}
      className="w-full max-w-[360px] sm:max-w-[420px] bg-neo-bg rounded-[28px] p-5 shadow-neo-up-xl border border-white/40 flex flex-col relative z-20"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.04]">
        <button
          onClick={onBackToLive}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'প্রধান ভিউ-তে ফিরুন' : 'Back to Main View'}</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {lang === 'bn' ? '🔗 ফেস-২ কজাল লিংক' : '🔗 Phase-2 Sub-Link'}
          </span>
        </div>
      </div>

      {/* URL Ribbon */}
      <div className="mt-3 p-2.5 rounded-xl bg-neo-bg shadow-neo-down border border-transparent flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Link2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px] font-mono text-gray-600 truncate">{actorUrl}</span>
        </div>
        <button
          onClick={handleCopyLink}
          className="p-1 text-gray-500 hover:text-black hover:bg-black/[0.05] rounded-md transition-colors cursor-pointer shrink-0"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Core Responsibility Card */}
      <div className="mt-4 p-4 rounded-2xl bg-neo-bg shadow-neo-up border border-white/60 flex flex-col gap-1.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl pointer-events-none -mr-4 -mt-4" />
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
          <PackageCheck className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'আমার দায়িত্ব' : 'MY RESPONSIBILITY'}
        </span>
        <span className="text-lg font-black text-gray-900 leading-snug">
          {primaryResponsibility}
        </span>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
            Committed
          </span>
          <span className="text-xs text-gray-500 font-medium">{actorName} • {actorRole}</span>
        </div>
      </div>

      {/* Child Needs Section */}
      <div className="mt-5 mb-1 pb-1 border-b border-black/[0.04]">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          {lang === 'bn' ? 'সাব-ডিপেন্ডেন্সি (ফ্র্যাক্টাল ওয়ার্ক)' : 'Sub-Dependencies (Recursive Work)'}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-h-[150px] justify-center items-center">
        {!hypothesis && !childReality.active && (
          <div className="text-center px-4 flex flex-col items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-neo-bg shadow-neo-down flex items-center justify-center">
               <Sparkles className="w-4 h-4 text-gray-400" />
             </div>
             <p className="text-xs text-gray-500 font-medium leading-relaxed">
               {lang === 'bn' 
                  ? 'এই কাজ সম্পন্ন করতে কি আরও কোনো সাপোর্ট বা ডিপেন্ডেন্সি প্রয়োজন? সি-লিঙ্ককে বলুন।' 
                  : 'Do you need any additional support or dependencies to complete this? Tell C-Link.'}
             </p>
          </div>
        )}

        {isComposing && (
          <div className="w-full py-6 flex flex-col items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-blue-600 animate-pulse uppercase tracking-widest">
              Processing Context...
            </span>
          </div>
        )}

        {/* AI Proposal Card */}
        {hypothesis && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-neo-bg rounded-2xl p-4 shadow-neo-up-lg border border-white/40 mt-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-bold text-indigo-500 uppercase">Child Causal Hypothesis</span>
            </div>
            
            <p className="text-xs text-gray-700 font-medium mb-4 bg-black/[0.02] p-2 rounded-lg">
              {hypothesis.inferredMeaning}
            </p>

            <div className="flex flex-col gap-2">
              {hypothesis.proposedDependencies.map((dep: any, i: number) => (
                <div key={i} className="flex flex-col gap-1 p-2.5 rounded-xl bg-neo-bg shadow-neo-down border-l-2 border-amber-400">
                  <span className="text-[11px] font-bold text-gray-900">{dep.label}</span>
                  <span className="text-[10px] text-gray-500">{dep.rationale}</span>
                </div>
              ))}
            </div>

            <button
              onClick={launchChildReality}
              className="w-full mt-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all"
            >
              Confirm Sub-Dependencies
            </button>
          </motion.div>
        )}

        {/* Child Reality Live */}
        {childReality.active && (
          <div className="w-full flex flex-col mt-3 gap-2">
            {childReality.nodes.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-3.5 bg-neo-bg rounded-xl shadow-neo-up border border-white/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-900">{node.label}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{node.actor.name}</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Actor Composer */}
      <div className="mt-4 pt-3 border-t border-black/[0.04]">
        <div className="w-full h-11 bg-neo-bg rounded-full shadow-neo-down border border-transparent flex items-center px-1.5 focus-within:shadow-neo-down-active focus-within:border-black/5 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleComposerSubmit(inputValue);
            }}
            placeholder={lang === 'bn' ? 'সাব-ডিপেন্ডেন্সি জানান...' : 'Tell C-Link what you need...'}
            className="flex-1 bg-transparent border-none outline-none px-3 text-xs text-[#1C1C1A] placeholder:text-gray-400"
          />
          {inputValue.trim() ? (
            <button
              onClick={() => handleComposerSubmit(inputValue)}
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button className="w-8 h-8 rounded-full text-gray-400 flex items-center justify-center hover:bg-black/5 transition-colors">
              <Mic className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
