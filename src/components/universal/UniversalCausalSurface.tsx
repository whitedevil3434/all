import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, CircleDashed, Loader2, Maximize2 } from 'lucide-react';
import { useUniversalCompose } from '../../engine/universal/useUniversalCompose';
import { ProposedDependency } from '../../engine/universal/CausalProposal';

export function UniversalCausalSurface() {
  const { submitIntent, isComposing, hypothesis } = useUniversalCompose();
  const [inputValue, setInputValue] = useState('');

  const handleCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // For now, passing an empty context snapshot. 
    // In full Phase 1, we'd pass the actual filtered Reality Graph.
    submitIntent(inputValue, {
      currentActor: { id: 'user_1', name: 'Current User' },
      causalState: { outcomes: [], unresolvedDependencies: [], activeResponsibilities: [] }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans selection:bg-slate-200">
      {/* Soft Header */}
      <header className="px-6 py-8 md:py-12 max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-medium text-lg tracking-tight">C-Link Universal</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-32">
        {/* Intent Input */}
        <motion.div layout className="mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-900 mb-8">
            What needs to happen?
          </h2>
          <form onSubmit={handleCompose} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="E.g., আগামী শুক্রবার science project complete করতে হবে..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all placeholder:text-slate-400"
              disabled={isComposing}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isComposing}
              className="absolute right-3 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-500 transition-colors"
            >
              {isComposing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>

        {/* Reactive Skeleton (RSP) */}
        <AnimatePresence mode="popLayout">
          {hypothesis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12"
            >
              {/* AI Understanding / AI Cursor */}
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-lg text-slate-600 leading-relaxed font-light">
                  {hypothesis.inferredMeaning}
                </p>
              </div>

              {/* Proposed Causal Graph / Dependencies */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                  Causal Dependencies
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {hypothesis.proposedDependencies.map((dep, idx) => (
                    <DependencyNode key={idx} dependency={dep} index={idx} />
                  ))}
                </div>
              </div>

              {/* Unknowns / Clarifications */}
              {hypothesis.unknowns && hypothesis.unknowns.length > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                  <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <CircleDashed className="w-4 h-4 text-slate-400" />
                    Pending Clarifications
                  </h3>
                  <ul className="space-y-3">
                    {hypothesis.unknowns.map((unknown, idx) => (
                      <li key={idx} className="text-slate-600 flex gap-3 text-sm">
                        <span className="text-slate-300">—</span> {unknown}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const DependencyNode: React.FC<{ dependency: ProposedDependency; index: number }> = ({ dependency, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between min-h-[140px]"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-900">{dependency.label}</h4>
          <Maximize2 className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          {dependency.rationale}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Proposed
        </span>
        <button className="text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
          Find Actor
        </button>
      </div>
    </motion.div>
  );
}
