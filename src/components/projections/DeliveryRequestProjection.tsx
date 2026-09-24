import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Home, ShoppingBag, Clock, Mic, Sparkles, Check, X } from 'lucide-react';

interface DeliveryRequestProjectionProps {
  title?: string;
  subtitle?: string;
  fromName?: string;
  toName?: string;
  dueText?: string;
  actionPrompt?: string;
  onAccept: () => void | Promise<void>;
  onDecline: () => void | Promise<void>;
  onComposerSubmit?: (text: string) => void | Promise<void>;
  onBack?: () => void;
  aiNote?: string;
  isProcessing?: boolean;
}

export const DeliveryRequestProjection: React.FC<DeliveryRequestProjectionProps> = ({
  title = "50kg Rice",
  subtitle = "Delivery request",
  fromName = "Alim Farms",
  toName = "Uttara Supershop",
  dueText = "Today · 10 AM",
  actionPrompt = "Confirm you can accept this delivery.",
  onAccept,
  onDecline,
  onComposerSubmit,
  onBack,
  aiNote = "You have been asked to confirm this delivery.",
  isProcessing = false
}) => {
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  const handleAcceptClick = async () => {
    setStatus('accepted');
    await onAccept();
  };

  const handleDeclineClick = async () => {
    setStatus('declined');
    await onDecline();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const txt = inputText.trim();
    setInputText("");
    if (onComposerSubmit) onComposerSubmit(txt);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAF9F6] text-[#1A1A1A] font-sans flex flex-col justify-between p-6 sm:p-8 select-none relative overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between shrink-0 pt-4">
        <span 
          onClick={onBack}
          className="text-neutral-800 text-[15px] sm:text-[16px] font-semibold tracking-[0.3em] uppercase cursor-pointer"
        >
          C - L I N K
        </span>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-200/80 bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-xs text-neutral-600 font-medium">
          <Share2 size={13} className="text-neutral-500" />
          <span>Shared with you</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-6">
        {/* Title Block */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-[42px] font-serif font-normal text-neutral-900 tracking-tight leading-none mb-1">
            {title}
          </h1>
          <h2 className="text-2xl sm:text-[28px] font-serif font-light text-neutral-600 tracking-tight">
            {subtitle}
          </h2>

          {/* Details List */}
          <div className="mt-6 flex flex-col gap-3.5 text-[14px] text-neutral-700">
            <div className="flex items-center gap-3">
              <Home size={18} className="text-neutral-400 stroke-[1.6]" />
              <span>From: <strong className="font-medium text-neutral-900">{fromName}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} className="text-neutral-400 stroke-[1.6]" />
              <span>To: <strong className="font-medium text-neutral-900">{toName}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-neutral-400 stroke-[1.6]" />
              <span>Due: <span className="text-neutral-800">{dueText}</span></span>
            </div>
          </div>
        </div>

        {/* Action Card matching IMG_0408.jpeg */}
        <motion.div 
          layout
          className="bg-white rounded-[24px] p-6 sm:p-7 border border-neutral-200/70 shadow-[0_6px_24px_rgba(0,0,0,0.03)] flex flex-col"
        >
          <div className="text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-2">
            YOUR ACTION
          </div>

          <div className="text-[17px] font-normal text-neutral-800 leading-snug mb-6">
            {status === 'accepted' ? (
              <span className="text-neutral-900 font-medium flex items-center gap-2">
                <Check size={18} className="text-neutral-800" />
                Delivery confirmed and accepted.
              </span>
            ) : status === 'declined' ? (
              <span className="text-neutral-500 flex items-center gap-2">
                <X size={18} className="text-neutral-400" />
                Delivery declined.
              </span>
            ) : (
              actionPrompt
            )}
          </div>

          {status === 'pending' && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleAcceptClick}
                disabled={isProcessing}
                className="bg-[#1C1C1C] hover:bg-black text-white px-7 py-3 rounded-2xl text-[14px] font-medium transition-all shadow-sm active:scale-95"
              >
                Accept
              </button>
              <button
                onClick={handleDeclineClick}
                disabled={isProcessing}
                className="bg-white hover:bg-neutral-50 border border-neutral-200/80 text-neutral-700 px-7 py-3 rounded-2xl text-[14px] font-medium transition-all active:scale-95"
              >
                Decline
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom Transient AI & Composer Layer */}
      <footer className="w-full max-w-md mx-auto shrink-0 pb-2 flex flex-col items-center">
        {/* AI Transient Note */}
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-600 font-normal self-start pl-2">
          <Sparkles size={14} className="text-neutral-400 shrink-0" />
          <span>{status === 'accepted' ? '✦ Delivery accepted. Pipeline advancing.' : aiNote}</span>
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
