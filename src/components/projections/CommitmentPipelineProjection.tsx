import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowDown, Sparkles, Mic, CheckCircle2 } from 'lucide-react';

interface CommitmentPipelineProjectionProps {
  title?: string;
  agreedAmount?: string;
  actorName?: string;
  doingStatus?: string;
  proofStatus?: 'Pending' | 'Verified' | 'Submitted';
  doneStatus?: string;
  onSelectProof?: () => void;
  onBackToWork: () => void;
  onComposerSubmit?: (text: string) => void | Promise<void>;
  aiNote?: string;
  isProcessing?: boolean;
}

export const CommitmentPipelineProjection: React.FC<CommitmentPipelineProjectionProps> = ({
  title = "50 KG RICE",
  agreedAmount = "50kg",
  actorName = "Rahim Foods",
  doingStatus = "Preparing",
  proofStatus = "Pending",
  doneStatus = "—",
  onSelectProof,
  onBackToWork,
  onComposerSubmit,
  aiNote = "Commitment is active. Proof is still open.",
  isProcessing = false
}) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const txt = inputText.trim();
    setInputText("");
    if (onComposerSubmit) onComposerSubmit(txt);
  };

  const isProofPending = proofStatus === 'Pending';
  const isProofVerified = proofStatus === 'Verified' || proofStatus === 'Submitted';

  return (
    <div className="h-[100dvh] w-full bg-[#FAF9F6] text-[#1A1A1A] font-sans flex flex-col justify-between p-6 sm:p-8 select-none relative overflow-y-auto no-scrollbar">
      {/* Top Header matching IMG_0406.jpeg */}
      <header className="flex items-center justify-between shrink-0 pt-4 w-full max-w-md mx-auto relative">
        <button
          onClick={onBackToWork}
          className="text-neutral-500 hover:text-neutral-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Work</span>
        </button>

        <span className="text-neutral-800 text-[14px] font-semibold tracking-[0.35em] uppercase pointer-events-none absolute left-1/2 -translate-x-1/2">
          C - L I N K
        </span>

        <div className="w-12" /> {/* Balancing Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-6">
        {/* Title Block */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-[36px] font-serif font-normal text-neutral-900 tracking-tight leading-tight">
            {title}
          </h1>
          <h2 className="text-2xl sm:text-[28px] font-serif font-light text-neutral-400 tracking-tight mt-0.5">
            Commitment
          </h2>
        </div>

        {/* Vertical Causal Sequence */}
        <div className="flex flex-col items-center w-full">
          {/* 1. AGREED */}
          <div className="w-full bg-white rounded-2xl p-4 border border-neutral-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-1">
              AGREED
            </div>
            <div className="text-[17px] font-normal text-neutral-800">
              {agreedAmount}
            </div>
          </div>

          <ArrowDown size={14} className="text-neutral-300 my-2 stroke-[1.5]" />

          {/* 2. WHO */}
          <div className="w-full bg-white rounded-2xl p-4 border border-neutral-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-1">
              WHO
            </div>
            <div className="text-[17px] font-normal text-neutral-800">
              {actorName}
            </div>
          </div>

          <ArrowDown size={14} className="text-neutral-300 my-2 stroke-[1.5]" />

          {/* 3. DOING */}
          <div className="w-full bg-white rounded-2xl p-4 border border-neutral-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-1">
              DOING
            </div>
            <div className="text-[17px] font-normal text-neutral-800">
              {doingStatus}
            </div>
          </div>

          <ArrowDown size={14} className="text-neutral-300 my-2 stroke-[1.5]" />

          {/* 4. PROOF (Current Frontier - Highlighted with Warm Ivory/Beige semantic gravity) */}
          <motion.div
            layout
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSelectProof}
            className={`w-full ${isProofPending ? 'bg-[#FAF6F0] border-[#EADBCE]' : 'bg-white border-neutral-200/60'} border rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-center cursor-pointer transition-all hover:shadow-md relative`}
          >
            <div className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500 uppercase mb-1">
              PROOF
            </div>
            <div className="text-[17px] font-normal text-neutral-800 flex items-center justify-center gap-1.5">
              <span>{isProofVerified ? 'Verified ✓' : proofStatus}</span>
            </div>
            {isProofPending && (
              <div className="text-[11px] text-neutral-500 font-normal italic mt-1">
                Current frontier: Proof is the next required step
              </div>
            )}
          </motion.div>

          <ArrowDown size={14} className="text-neutral-300 my-2 stroke-[1.5]" />

          {/* 5. DONE */}
          <div className="w-full bg-white/70 rounded-2xl p-4 border border-neutral-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-center">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-1">
              DONE
            </div>
            <div className="text-[17px] font-normal text-neutral-600">
              {isProofVerified ? 'Resolved' : doneStatus}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Transient AI & Composer Layer */}
      <footer className="w-full max-w-md mx-auto shrink-0 pb-2 flex flex-col items-center">
        {/* AI Transient Note */}
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-600 font-normal self-start pl-2">
          <Sparkles size={14} className="text-neutral-400 shrink-0" />
          <span>{isProofVerified ? '✦ Proof submitted. Commitment reached resolution.' : aiNote}</span>
        </div>

        {/* Composer Pill */}
        <form 
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-full border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] px-5 py-3 flex items-center gap-3"
        >
          <Sparkles size={16} className="text-neutral-400 shrink-0" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tell C-Link..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-neutral-800 placeholder:text-neutral-400 font-normal"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <Mic size={14} />
          </button>
        </form>
      </footer>
    </div>
  );
};
