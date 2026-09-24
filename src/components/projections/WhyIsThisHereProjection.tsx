import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Truck, User, Flag, Store, AlertTriangle, ArrowDown, Sparkles, Mic, Check } from 'lucide-react';

interface WhyIsThisHereProjectionProps {
  title?: string;
  subtitle?: string;
  deliveryDueText?: string;
  scheduledVanStatus?: string;
  replacementStatus?: string;
  frontierText?: string;
  workName?: string;
  ownerName?: string;
  impactText?: string;
  onResolveFrontier?: () => void | Promise<void>;
  onBackToHome: () => void;
  onComposerSubmit?: (text: string) => void | Promise<void>;
  aiNote?: string;
  isProcessing?: boolean;
}

export const WhyIsThisHereProjection: React.FC<WhyIsThisHereProjectionProps> = ({
  title = "WHY IS THIS HERE?",
  subtitle = "Transport driver needed",
  deliveryDueText = "1 hour",
  scheduledVanStatus = "cancelled",
  replacementStatus = "No replacement assigned",
  frontierText = "Find replacement driver",
  workName = "Uttara Supershop (#42)",
  ownerName = "Alim Farms",
  impactText = "Delivery at risk",
  onResolveFrontier,
  onBackToHome,
  onComposerSubmit,
  aiNote = "This condition is blocking the delivery outcome.",
  isProcessing = false
}) => {
  const [inputText, setInputText] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  const handleFrontierClick = async () => {
    setIsResolved(true);
    if (onResolveFrontier) {
      await onResolveFrontier();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const txt = inputText.trim();
    setInputText("");
    if (onComposerSubmit) onComposerSubmit(txt);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAF9F6] text-[#1A1A1A] font-sans flex flex-col justify-between p-6 sm:p-8 select-none relative overflow-y-auto no-scrollbar">
      {/* Top Header matching IMG_0409.jpeg */}
      <header className="flex items-center justify-between shrink-0 pt-4 w-full max-w-md mx-auto">
        <button
          onClick={onBackToHome}
          className="text-neutral-500 hover:text-neutral-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Home</span>
        </button>

        <span className="text-neutral-800 text-[14px] font-semibold tracking-[0.35em] uppercase pointer-events-none">
          C - L I N K
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-6">
        {/* Title Block */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-[34px] font-bold text-neutral-900 tracking-tight leading-tight uppercase font-sans">
            {title}
          </h1>
          <h2 className="text-base sm:text-[18px] text-neutral-600 font-normal mt-1">
            {subtitle}
          </h2>
        </div>

        {/* Primary Causal Provenance Chain Card matching IMG_0409.jpeg */}
        <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-neutral-200/70 shadow-[0_6px_24px_rgba(0,0,0,0.03)] flex flex-col mb-4">
          {/* Step 1: Delivery Due */}
          <div className="flex items-center gap-3.5 py-1">
            <div className="w-8 h-8 rounded-full border border-neutral-200/80 flex items-center justify-center shrink-0 text-neutral-600">
              <Clock size={16} strokeWidth={1.75} />
            </div>
            <div className="text-[15px] text-neutral-800">
              Delivery due: <span className="text-neutral-400 font-normal">{deliveryDueText}</span>
            </div>
          </div>

          <div className="flex justify-start pl-4 py-1">
            <ArrowDown size={14} className="text-neutral-300 stroke-[1.5]" />
          </div>

          {/* Step 2: Scheduled Van */}
          <div className="flex items-center gap-3.5 py-1">
            <div className="w-8 h-8 rounded-full border border-neutral-200/80 flex items-center justify-center shrink-0 text-neutral-600">
              <Truck size={16} strokeWidth={1.75} />
            </div>
            <div className="text-[15px] text-neutral-800">
              Scheduled van: <span className="text-neutral-400 font-normal">{scheduledVanStatus}</span>
            </div>
          </div>

          <div className="flex justify-start pl-4 py-1">
            <ArrowDown size={14} className="text-neutral-300 stroke-[1.5]" />
          </div>

          {/* Step 3: Replacement */}
          <div className="flex items-center gap-3.5 py-1">
            <div className="w-8 h-8 rounded-full border border-neutral-200/80 flex items-center justify-center shrink-0 text-neutral-600">
              <User size={16} strokeWidth={1.75} />
            </div>
            <div className="text-[15px] text-neutral-800">
              {isResolved ? 'Replacement driver assigned: Tariq (Covered Van)' : replacementStatus}
            </div>
          </div>

          <div className="flex justify-start pl-4 py-1">
            <ArrowDown size={14} className="text-neutral-300 stroke-[1.5]" />
          </div>

          {/* Step 4: Current Frontier */}
          <div 
            onClick={!isResolved ? handleFrontierClick : undefined}
            className={`flex items-start gap-3.5 pt-2 ${!isResolved ? 'cursor-pointer group' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full border ${isResolved ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-neutral-200/80 text-neutral-600 group-hover:border-neutral-800'} flex items-center justify-center shrink-0 transition-colors`}>
              {isResolved ? <Check size={16} /> : <Flag size={16} strokeWidth={1.75} />}
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-neutral-900">
                {isResolved ? 'Frontier unblocked' : 'Current frontier'}
              </span>
              <span className={`text-[14px] ${isResolved ? 'text-emerald-700' : 'text-neutral-500 group-hover:text-neutral-900'} transition-colors`}>
                {isResolved ? 'Tariq Transport committed for 4:30 PM' : frontierText}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Context Card matching IMG_0409.jpeg */}
        <div className="bg-white/80 rounded-[22px] p-5 border border-neutral-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col gap-2.5 text-[13px] text-neutral-700">
          <div className="flex items-center gap-3">
            <Store size={16} className="text-neutral-400 stroke-[1.6]" />
            <span>Work: <strong className="font-medium text-neutral-900">{workName}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <Flag size={16} className="text-neutral-400 stroke-[1.6]" />
            <span>Owner: <strong className="font-medium text-neutral-900">{ownerName}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className={isResolved ? "text-emerald-600 stroke-[1.6]" : "text-neutral-500 stroke-[1.6]"} />
            <span>
              Impact: <strong className={isResolved ? "text-emerald-700 font-medium" : "text-neutral-900 font-medium"}>
                {isResolved ? 'Risk mitigated · On track' : impactText}
              </strong>
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Transient AI & Composer Layer */}
      <footer className="w-full max-w-md mx-auto shrink-0 pb-2 flex flex-col items-center">
        {/* AI Transient Note */}
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-600 font-normal self-start pl-2">
          <Sparkles size={14} className="text-neutral-400 shrink-0" />
          <span>{isResolved ? '✦ Gap resolved. Van dispatched to delivery frontier.' : aiNote}</span>
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
