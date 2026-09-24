import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, Scale, Sparkles, Mic, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProofSubmissionProjectionProps {
  title?: string;
  subtitle?: string;
  actorName?: string;
  onBackToCommitment: () => void;
  onSubmitProof: (evidence: { photoUrl?: string; weightKg?: number; description?: string }) => void | Promise<void>;
  onComposerSubmit?: (text: string) => void | Promise<void>;
  aiNote?: string;
  isProcessing?: boolean;
}

export const ProofSubmissionProjection: React.FC<ProofSubmissionProjectionProps> = ({
  title = "PROOF",
  subtitle = "50kg Rice",
  actorName = "Rahim Foods",
  onBackToCommitment,
  onSubmitProof,
  onComposerSubmit,
  aiNote = "Proof is required to close this commitment.",
  isProcessing = false
}) => {
  const [inputText, setInputText] = useState("");
  const [photoSubmitted, setPhotoSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [weightSubmitted, setWeightSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setPhotoSubmitted(true);
      setWeightSubmitted(true);
      onSubmitProof({
        photoUrl: url,
        weightKg: 50,
        description: 'Certified 50kg rice photo and weight verification'
      });
    }
  };

  const handleSimulatedProof = async () => {
    setIsUploading(true);
    setTimeout(async () => {
      setPhotoSubmitted(true);
      setWeightSubmitted(true);
      setIsUploading(false);
      await onSubmitProof({
        weightKg: 50,
        description: 'Verified 50kg Rice Quality Batch Proof'
      });
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const txt = inputText.trim();
    setInputText("");
    if (onComposerSubmit) onComposerSubmit(txt);
  };

  const isComplete = photoSubmitted && weightSubmitted;

  return (
    <div className="h-[100dvh] w-full bg-[#FAF9F6] text-[#1A1A1A] font-sans flex flex-col justify-between p-6 sm:p-8 select-none relative overflow-y-auto no-scrollbar">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Header matching IMG_0407.jpeg */}
      <header className="flex items-center justify-between shrink-0 pt-4 w-full max-w-md mx-auto">
        <button
          onClick={onBackToCommitment}
          className="text-neutral-500 hover:text-neutral-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Commitment</span>
        </button>

        <span className="text-neutral-800 text-[14px] font-semibold tracking-[0.35em] uppercase pointer-events-none">
          C - L I N K
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-6">
        {/* Title Block */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-[42px] font-serif font-normal text-neutral-900 tracking-tight leading-tight">
            {title}
          </h1>
          <h2 className="text-2xl sm:text-[28px] font-serif font-light text-neutral-600 tracking-tight mt-0.5">
            {subtitle}
          </h2>

          <div className="flex items-center gap-1.5 mt-2.5">
            <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
            <span className="text-[10px] tracking-[0.2em] font-medium text-neutral-400 uppercase">
              {isComplete ? 'VERIFIED' : 'REQUIRED'}
            </span>
          </div>
        </div>

        {/* Verification Card matching IMG_0407.jpeg */}
        <div className="bg-white rounded-[24px] p-6 border border-neutral-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col mb-4">
          {/* Row 1: Photo */}
          <div className="flex items-center gap-4 py-1">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F5F0] border border-neutral-200/60 overflow-hidden shrink-0 flex items-center justify-center relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Rice" className="w-full h-full object-cover" />
              ) : (
                /* Pure Minimalist Bowl of White Rice Graphic matching reference visual */
                <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
                  {/* Bowl */}
                  <path d="M12 28 C12 44, 52 44, 52 28 Z" fill="#EAE5DC" stroke="#D1CAC0" strokeWidth="1.5" />
                  {/* Rice pile in bowl */}
                  <ellipse cx="32" cy="27" rx="20" ry="9" fill="#FFFFFF" />
                  <ellipse cx="32" cy="25" rx="16" ry="6" fill="#FBFBF9" />
                  {/* Grains texture */}
                  <circle cx="28" cy="25" r="1" fill="#D6D1C7" />
                  <circle cx="34" cy="24" r="1" fill="#D6D1C7" />
                  <circle cx="31" cy="27" r="1" fill="#D6D1C7" />
                  <circle cx="38" cy="26" r="1" fill="#D6D1C7" />
                  <circle cx="25" cy="26" r="1" fill="#D6D1C7" />
                </svg>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[15px] font-normal text-neutral-800">Photo</span>
              <span className="text-[13px] text-neutral-400 mt-0.5">
                {photoSubmitted ? 'Verified photo submitted' : 'Not yet submitted'}
              </span>
            </div>

            {photoSubmitted && (
              <CheckCircle2 size={18} className="text-neutral-800 ml-auto" />
            )}
          </div>

          <div className="border-t border-neutral-100 my-4" />

          {/* Row 2: Weight */}
          <div className="flex items-center gap-4 py-1">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F5F0] border border-neutral-200/60 flex items-center justify-center shrink-0">
              <Scale size={24} className="text-neutral-400 stroke-[1.4]" />
            </div>

            <div className="flex flex-col">
              <span className="text-[15px] font-normal text-neutral-800">Weight</span>
              <span className="text-[13px] text-neutral-400 mt-0.5">
                {weightSubmitted ? '50 kg verified' : 'Not yet submitted'}
              </span>
            </div>

            {weightSubmitted && (
              <CheckCircle2 size={18} className="text-neutral-800 ml-auto" />
            )}
          </div>
        </div>

        {/* Upload Proof Button matching IMG_0407.jpeg */}
        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            } else {
              handleSimulatedProof();
            }
          }}
          disabled={isUploading}
          className="w-full bg-white hover:bg-neutral-50 active:scale-[0.99] border border-neutral-200/80 rounded-2xl py-4 px-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-center gap-2 text-neutral-800 font-medium text-[15px] transition-all mb-6"
        >
          <Upload size={17} className="text-neutral-600" />
          <span>{isUploading ? 'Verifying...' : '[ Upload Proof ]'}</span>
        </button>

        {/* Quick Simulation Fallback */}
        {!isComplete && (
          <div className="text-center mb-6">
            <button
              onClick={handleSimulatedProof}
              className="text-xs text-neutral-400 hover:text-neutral-700 underline tracking-wide"
            >
              Or verify instantly with demo receipt
            </button>
          </div>
        )}

        {/* Breadcrumb Path matching IMG_0407.jpeg */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-400 px-1">
          <span>From Commitment</span>
          <ChevronRight size={13} className="text-neutral-300" />
          <span>{actorName}</span>
          <ChevronRight size={13} className="text-neutral-300" />
          <span>Doing</span>
          <ChevronRight size={13} className="text-neutral-300" />
          <span className="text-neutral-900 font-medium">Proof</span>
        </div>
      </main>

      {/* Bottom Transient AI & Composer Layer */}
      <footer className="w-full max-w-md mx-auto shrink-0 pb-2 flex flex-col items-center">
        {/* AI Transient Note */}
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-600 font-normal self-start pl-2">
          <Sparkles size={14} className="text-neutral-400 shrink-0" />
          <span>{isComplete ? '✦ Proof submitted and verified. Returning to commitment...' : aiNote}</span>
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
