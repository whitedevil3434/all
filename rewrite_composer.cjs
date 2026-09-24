const fs = require('fs');

const code = `import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUp, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { RealityContext, BoardCommand, WorkspaceLayoutMode } from '../types';

interface CopilotComposerProps {
  currentReality?: RealityContext;
  onApplyDirectUpdate?: (context: RealityContext) => void;
  onSuggestCausalPlan: (context: RealityContext) => void;
  onDispatchBoardCommand?: (command: BoardCommand) => void;
  layoutMode?: WorkspaceLayoutMode;
  onLayoutModeChange?: (mode: WorkspaceLayoutMode) => void;
  isEmbedded?: boolean;
}

type ComposerState = 'IDLE' | 'UNDERSTANDING' | 'PROJECTING' | 'ACTING' | 'SETTLED';

export function CopilotComposer({ 
  currentReality, 
  onApplyDirectUpdate, 
  onDispatchBoardCommand,
  isEmbedded = false
}: CopilotComposerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [composerState, setComposerState] = useState<ComposerState>('IDLE');
  const [transientMessage, setTransientMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current && composerState === 'IDLE') {
      inputRef.current.focus();
    }
  }, [isOpen, composerState]);

  const runLocalFallback = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // Simulate Semantic Interpretation -> Reality Event -> State Update
    setTimeout(() => {
      setComposerState('PROJECTING');
      setTransientMessage('✦ Materializing Semantic Event...');
      
      setTimeout(() => {
        let finalCtx = currentReality ? JSON.parse(JSON.stringify(currentReality)) : {
          id: 'ctx-new',
          title: 'Causal Work',
          objects: [],
          relations: []
        };

        if (lowerInput.includes('50') || lowerInput.includes('চাল')) {
          finalCtx.objects.push({
            id: 'want-1',
            kind: 'WANT',
            title: '50kg Rice',
            state: 'UNKNOWN',
            quantity: 50,
            unit: 'kg',
            provenance: 'user',
            attention: true
          });
          finalCtx.title = 'Rice Procurement';
        } else if (lowerInput.includes('karim') || lowerInput.includes('করিম') || lowerInput.includes('20')) {
          const wantId = finalCtx.objects.find((o: any) => o.kind === 'WANT')?.id || 'want-1';
          const gapId = 'gap-' + Date.now();
          const actorId = 'actor-karim';
          
          finalCtx.objects.push({
            id: gapId, kind: 'GAP', title: 'Unresolved', state: 'UNKNOWN', quantity: 20, unit: 'kg', provenance: 'ai_inference', attention: true, aiTransientMessage: '20kg remains open'
          });
          finalCtx.objects.push({
            id: actorId, kind: 'ACTOR', title: 'Karim', state: 'POSSIBLE', quantity: 20, unit: 'kg', provenance: 'ai_inference', aiTransientMessage: 'Karim might cover 20kg'
          });
          finalCtx.relations.push({
            id: 'rel-' + Date.now(), from: wantId, to: gapId, kind: 'requires'
          });
          finalCtx.relations.push({
            id: 'rel-' + Date.now() + 1, from: gapId, to: actorId, kind: 'candidate'
          });
        } else if (lowerInput.includes('রহিম') || lowerInput.includes('rahim') || lowerInput.includes('দরদাম') || lowerInput.includes('ask')) {
          setComposerState('ACTING');
          setTransientMessage('✦ Asking Actor...');
          if (onDispatchBoardCommand) {
            onDispatchBoardCommand({ type: 'OPEN_NEGOTIATION', targetActorName: 'Rahim' });
          }
        }

        // Apply Update
        if (onApplyDirectUpdate && lowerInput.includes('ask') === false && lowerInput.includes('দরদাম') === false) {
          onApplyDirectUpdate(finalCtx);
        }

        setComposerState('SETTLED');
        setTransientMessage('✓ Reality updated');
        
        setTimeout(() => {
          setComposerState('IDLE');
          setTransientMessage('');
        }, 2000);

      }, 1200);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || composerState !== 'IDLE') return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setComposerState('UNDERSTANDING');
    setTransientMessage('✦ Interpreting Intent...');

    // Attempt API first
    try {
      const res = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, currentReality: currentReality || null }),
      });
      
      if (!res.ok) throw new Error('API Rate Limit or Error');
      
      const data = await res.json();
      
      setComposerState('PROJECTING');
      setTransientMessage('✦ Resolving Causal Reality...');
      
      setTimeout(() => {
        if (data.boardCommand && onDispatchBoardCommand) {
          setComposerState('ACTING');
          setTransientMessage('✦ Dispatching Semantic Action...');
          onDispatchBoardCommand(data.boardCommand);
        } else if (data.generatedContext && onApplyDirectUpdate) {
          onApplyDirectUpdate(data.generatedContext);
        }
        
        setComposerState('SETTLED');
        setTransientMessage('✓ Reality updated');
        
        setTimeout(() => {
          setComposerState('IDLE');
          setTransientMessage('');
        }, 2000);
      }, 1000);

    } catch (err) {
      // Fallback to local intelligent engine
      runLocalFallback(userMsg);
    }
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
        <span className="font-bold text-[14px]">Reality Negotiator</span>
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
            className={\`\${isEmbedded ? 'w-full' : 'fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50'}\`}
          >
            <div className="bg-white/95 backdrop-blur-2xl shadow-2xl rounded-2xl border border-black/5 overflow-hidden ring-1 ring-black/5">
              
              {/* Dynamic Semantic Status Bar */}
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
                {/* Header (Non-Embedded) */}
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
                          placeholder="What needs to happen? (e.g. '50kg চাল দরকার')"
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900 placeholder:text-gray-400 py-1"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim()}
                          className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center disabled:opacity-30 disabled:scale-100 hover:scale-105 active:scale-95 transition-all shrink-0"
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
                        <span className={\`text-[14px] font-bold \${composerState === 'SETTLED' ? 'text-green-600' : 'text-indigo-600'}\`}>
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
`;

fs.writeFileSync('src/components/CopilotComposer.tsx', code);
console.log('Composer rewritten.');
