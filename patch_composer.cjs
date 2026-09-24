const fs = require('fs');

const code = `
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, X, CheckCircle2 } from 'lucide-react';
import { SemanticAction, RealityContext } from '../types';

interface CopilotComposerProps {
  currentReality?: RealityContext;
  onSemanticAction: (action: SemanticAction) => void;
  isEmbedded?: boolean;
}

type ComposerState = 'IDLE' | 'LISTENING' | 'INTERPRETING' | 'PROJECTING' | 'PROPOSING' | 'ACTING' | 'SETTLING';

export function CopilotComposer({ currentReality, onSemanticAction, isEmbedded = false }: CopilotComposerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [composerState, setComposerState] = useState<ComposerState>('IDLE');
  const [transientMessage, setTransientMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const simulateAI = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    setComposerState('INTERPRETING');
    setTransientMessage('✦ interpreting...');

    setTimeout(() => {
      // Litmus Test Logic
      if (lowerInput.includes('50') || lowerInput.includes('চাল')) {
        setComposerState('PROJECTING');
        setTransientMessage('✦ materializing requirement');
        onSemanticAction({ type: 'CREATE_WANT', payload: { title: '50kg Rice', quantity: 50, unit: 'kg' } });
        finishSim('✓ Reality updated');
      } 
      else if (lowerInput.includes('rahim') || lowerInput.includes('30')) {
        setComposerState('PROJECTING');
        setTransientMessage('✦ discovering capability');
        onSemanticAction({ type: 'DISCOVER_ACTOR', targetActorName: 'Rahim', payload: { quantity: 30, unit: 'kg' } });
        finishSim('✓ Rahim capability added');
      }
      else if (lowerInput.includes('open') || lowerInput.includes('20')) {
        setComposerState('PROJECTING');
        setTransientMessage('✦ calculating gap');
        onSemanticAction({ type: 'IDENTIFY_GAP', payload: { title: '20kg still open', quantity: 20, unit: 'kg' } });
        finishSim('✓ Gap identified');
      }
      else if (lowerInput.includes('karim') && lowerInput.includes('mina')) {
        setComposerState('PROJECTING');
        setTransientMessage('✦ searching for candidates...');
        setTimeout(() => {
           onSemanticAction({ 
             type: 'FIND_CANDIDATES', 
             payload: {
               candidates: [
                 { name: 'Karim', quantity: 20, unit: 'kg', state: 'POSSIBLE', message: 'Karim may cover 20kg' },
                 { name: 'Mina', quantity: 15, unit: 'kg', state: 'UNKNOWN', message: 'Mina may cover 15kg' }
               ]
             } 
           });
           finishSim('✓ 2 actors found');
        }, 800);
      }
      else if (lowerInput.includes('ask') && lowerInput.includes('karim')) {
        setComposerState('ACTING');
        setTransientMessage('✦ asking Karim...');
        // Let App.tsx handle the actual asynchronous Ask -> Offer flow, we just dispatch the Ask action
        // Actually, it's better if we dispatch Ask here, and then dispatch Offer here as well to simulate the actor.
        onSemanticAction({ type: 'ASK_ACTOR', targetActorName: 'Karim' }); // App.tsx will need to find the ID by name or something. Let's just pass targetActorName
        
        setTimeout(() => {
          onSemanticAction({ type: 'TRANSFORM', targetActorName: 'Karim', payload: { state: 'OFFERED', aiTransientMessage: 'Karim offered 20kg', availableActions: ['Accept', 'Decline'] } });
          finishSim('✓ Karim replied');
        }, 2000);
      }
      else if (lowerInput.includes('accept') || lowerInput.includes('অ্যাকসেপ্ট')) {
        setComposerState('ACTING');
        setTransientMessage('✦ finalizing commitment...');
        onSemanticAction({ type: 'ACCEPT_COMMITMENT', targetActorName: 'Karim' });
        finishSim('✓ Commitment secured');
      }
      else if (lowerInput.includes('show') || lowerInput.includes('happen')) {
        setComposerState('PROJECTING');
        setTransientMessage('✦ reframing surface...');
        onSemanticAction({ type: 'SHOW_NEXT' });
        finishSim('✓ Focus shifted to unresolved execution');
      }
      else {
        finishSim('✦ I do not understand this context yet.');
      }
    }, 800);
  };

  const finishSim = (msg: string) => {
    setComposerState('SETTLED');
    setTransientMessage(msg);
    setTimeout(() => {
      setComposerState('IDLE');
      setTransientMessage('');
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || composerState !== 'IDLE') return;
    const userMsg = inputValue.trim();
    setInputValue('');
    setComposerState('LISTENING');
    setTransientMessage('● Listening...');
    
    // Fallback to local simulation for the Litmus test
    setTimeout(() => {
      simulateAI(userMsg);
    }, 400);
  };

  if (!isEmbedded && !isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 bg-gray-900 text-white rounded-full px-6 shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform z-50 group"
      >
        <Sparkles className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
        <span className="font-bold text-[14px]">Reality Composer</span>
      </motion.button>
    );
  }

  return (
    <>
      {!isEmbedded && isOpen && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsOpen(false)} />
      )}
      <AnimatePresence>
        {(isEmbedded || isOpen) && (
          <motion.div
            initial={isEmbedded ? {} : { y: '100%', opacity: 0 }}
            animate={isEmbedded ? {} : { y: 0, opacity: 1 }}
            exit={isEmbedded ? {} : { y: '100%', opacity: 0 }}
            className={isEmbedded ? 'w-full' : 'fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-50'}
          >
            <div className="bg-white/95 backdrop-blur-2xl shadow-2xl rounded-2xl border border-black/5 overflow-hidden ring-1 ring-black/5">
              <div className="h-1 bg-gray-100 w-full relative overflow-hidden">
                {composerState !== 'IDLE' && composerState !== 'SETTLED' && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1/3 bg-indigo-500 rounded-full"
                  />
                )}
                {composerState === 'SETTLED' && (
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-green-500" />
                )}
              </div>
              <div className="px-5 py-4">
                {!isEmbedded && (
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Composer</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="relative">
                  <AnimatePresence mode="wait">
                    {composerState === 'IDLE' ? (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Tell C-Link... (e.g. 'আমার 50kg চাল দরকার')"
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900 placeholder:text-gray-400 py-1"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim()}
                          className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shrink-0"
                        >
                          <ArrowUp className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3 py-1.5"
                      >
                        {composerState === 'SETTLED' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                        )}
                        <span className={"text-[14px] font-bold " + (composerState === 'SETTLED' ? 'text-green-600' : 'text-indigo-600')}>
                          {transientMessage}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
`

fs.writeFileSync('src/components/CopilotComposer.tsx', code);
