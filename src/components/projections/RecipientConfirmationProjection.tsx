import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Check, X, Sparkles, Mic, ArrowLeft } from 'lucide-react';

interface RecipientConfirmationProjectionProps {
  title?: string;
  subtitle?: string;
  statusText?: string;
  onConfirmReceived: () => void | Promise<void>;
  onNotReceived: () => void | Promise<void>;
  onBackToWork?: () => void;
  onComposerSubmit?: (text: string) => void | Promise<void>;
  aiNote?: string;
  isProcessing?: boolean;
}

export const RecipientConfirmationProjection: React.FC<RecipientConfirmationProjectionProps> = ({
  title = "50kg Rice",
  subtitle = "Expected delivery",
  statusText = "● PENDING · Today",
  onConfirmReceived,
  onNotReceived,
  onBackToWork,
  onComposerSubmit,
  aiNote = "Goods are on the way. Confirm when they arrive.",
  isProcessing = false
}) => {
  const [inputText, setInputText] = useState("");
  const [confirmationState, setConfirmationState] = useState<'pending' | 'received' | 'not_received'>('pending');

  const handleReceivedClick = async () => {
    setConfirmationState('received');
    await onConfirmReceived();
  };

  const handleNotReceivedClick = async () => {
    setConfirmationState('not_received');
    await onNotReceived();
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
      {/* Top Header matching IMG_0405.jpeg */}
      <header className="flex items-center justify-between shrink-0 pt-4 w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {onBackToWork && (
            <button
              onClick={onBackToWork}
              className="text-neutral-500 hover:text-neutral-900 text-xs font-medium mr-2"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <span className="text-neutral-800 text-[15px] sm:text-[16px] font-semibold tracking-[0.3em] uppercase">
            C - L I N K
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-200/80 bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-xs text-neutral-600 font-medium">
          <User size={13} className="text-neutral-500" />
          <span>You are Recipient</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-6">
        {/* Title Block */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-[44px] font-serif font-normal text-neutral-900 tracking-tight leading-none mb-1">
            {title}
          </h1>
          <h2 className="text-2xl sm:text-[28px] font-serif font-light text-neutral-500 tracking-tight">
            {subtitle}
          </h2>

          <div className="mt-3 text-xs text-neutral-400 font-medium tracking-wide flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${confirmationState === 'received' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
            <span>{confirmationState === 'received' ? 'CONFIRMED · Delivery Verified' : confirmationState === 'not_received' ? 'FLAGGED · Issue Reported' : statusText.replace('● ', '')}</span>
          </div>
        </div>

        {/* Card matching IMG_0405.jpeg */}
        <div className="bg-white rounded-[26px] p-7 border border-neutral-200/70 shadow-[0_6px_28px_rgba(0,0,0,0.03)] relative overflow-hidden mb-6">
          {/* Subtle Decorative Faint Radial Pattern */}
          <div className="absolute right-4 top-4 w-28 h-28 pointer-events-none opacity-25">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-neutral-400 fill-none" strokeDasharray="1,4">
              <circle cx="50" cy="50" r="15" />
              <circle cx="50" cy="50" r="28" />
              <circle cx="50" cy="50" r="42" />
            </svg>
          </div>

          <div className="text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-3">
            CONFIRM RECEIPT
          </div>

          <div className="text-[18px] font-normal text-neutral-800 leading-snug">
            {confirmationState === 'received' ? (
              <span className="text-neutral-900 font-medium">Receipt confirmed. Thank you!</span>
            ) : confirmationState === 'not_received' ? (
              <span className="text-neutral-800 font-medium">Recorded: Goods not received. Blocker opened.</span>
            ) : (
              "Did you receive the goods?"
            )}
          </div>
        </div>

        {/* Two Capsule Buttons matching IMG_0405.jpeg */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={handleReceivedClick}
            disabled={isProcessing || confirmationState === 'received'}
            className={`flex-1 py-3.5 px-6 rounded-full border text-[14px] font-medium flex items-center justify-center gap-2 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-95 ${
              confirmationState === 'received'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/80'
            }`}
          >
            <Check size={16} className={confirmationState === 'received' ? 'text-white' : 'text-neutral-700'} />
            <span>Received</span>
          </button>

          <button
            onClick={handleNotReceivedClick}
            disabled={isProcessing || confirmationState === 'not_received'}
            className={`flex-1 py-3.5 px-6 rounded-full border text-[14px] font-medium flex items-center justify-center gap-2 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-95 ${
              confirmationState === 'not_received'
                ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200/80'
            }`}
          >
            <X size={16} className="text-neutral-500" />
            <span>Not received</span>
          </button>
        </div>
      </main>

      {/* Bottom Transient AI & Composer Layer */}
      <footer className="w-full max-w-md mx-auto shrink-0 pb-2 flex flex-col items-center">
        {/* AI Transient Note */}
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-600 font-normal self-start pl-2">
          <Sparkles size={14} className="text-neutral-400 shrink-0" />
          <span>
            {confirmationState === 'received'
              ? '✦ Delivery confirmed by recipient. Outcome recorded.'
              : confirmationState === 'not_received'
              ? '✦ Condition flagged: investigating missing transit.'
              : aiNote}
          </span>
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
