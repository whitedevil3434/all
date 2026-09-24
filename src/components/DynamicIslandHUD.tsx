import React from 'react';
import { motion } from 'motion/react';
import { Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface DynamicIslandHUDProps {
  message: string;
  submessage?: string;
  status: 'running' | 'success' | 'alert' | 'idle';
  onDismiss?: () => void;
}

export function DynamicIslandHUD({ message, submessage, status, onDismiss }: DynamicIslandHUDProps) {
  if (status === 'idle') return null;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      onClick={onDismiss}
      className="absolute top-3 inset-x-3 mx-auto max-w-[390px] z-50 cursor-pointer"
    >
      <div className="bg-black text-white rounded-[28px] px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center justify-between border border-white/10 backdrop-blur-3xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            {status === 'running' && (
              <Loader2 className="w-4 h-4 text-[#0A84FF] animate-spin" />
            )}
            {status === 'success' && (
              <Check className="w-4 h-4 text-[#30D158]" strokeWidth={3} />
            )}
            {status === 'alert' && (
              <AlertCircle className="w-4 h-4 text-[#FF9F0A]" strokeWidth={2.5} />
            )}
          </div>
          <div className="min-w-0 pr-2">
            <div className="text-[14px] font-semibold tracking-tight truncate leading-tight text-white">
              {message}
            </div>
            {submessage && (
              <div className="text-[12px] text-gray-400 truncate leading-tight mt-0.5 font-medium">
                {submessage}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {status === 'running' && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
          {status === 'success' && (
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Done</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
