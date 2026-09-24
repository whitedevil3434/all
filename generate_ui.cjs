const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';

const completeCode = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRealityGraph, RealityEngine, GraphNode } from '../engine/core/UniversalGraphStore';
import { causalAudio } from '../lib/causalAudio';
import { getContextualActors, getContextualEvidence } from '../lib/mockGenerators';
import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { ProvenanceLedger } from './ProvenanceLedger';
import { useUniversalCompose } from '../engine/universal/useUniversalCompose';

export function DynamicRealitySurface() {
  const graph = useRealityGraph();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [provenanceNodeId, setProvenanceNodeId] = useState<string | null>(null);
  const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const [currentProjection, setCurrentProjection] = useState<string>('owner');
  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;

  const nodes = Object.values(graph.nodes);
  
  const committedActors = nodes.filter(n => n.type === 'ACTOR' && n.state === 'COMMITTED');
  
  let projectedRoots = [];
  if (currentProjection === 'owner') {
    projectedRoots = nodes.filter(n => n.type === 'WANT');
  } else {
    const actorEdges = Object.values(graph.edges).filter(e => e.targetId === currentProjection);
    const parentDepIds = actorEdges.map(e => e.sourceId);
    projectedRoots = parentDepIds.map(id => graph.nodes[id]).filter(Boolean);
    projectedRoots = Array.from(new Map(projectedRoots.map(n => [n.id, n])).values());
  }

  const handleInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsProcessing(true);
    causalAudio.playTick();
    try {
      const effectiveContextId = activeContextId || (currentProjection !== 'owner' ? currentProjection : null);
      setPendingContextId(effectiveContextId);
      await submitIntent(inputText, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-40 surface-container">
      <header className="py-6 px-8 flex justify-between items-center mb-8 relative z-10 border-b border-black/5 bg-white/50 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold font-serif">
            C
          </div>
          <h1 className="font-bold text-xl tracking-tight">Causal Control</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={currentProjection}
            onChange={(e) => {
              setCurrentProjection(e.target.value);
              setActiveContextId(null);
            }}
            className="text-xs font-bold bg-white border border-black/10 rounded-full px-4 py-2 shadow-sm outline-none"
          >
            <option value="owner">System Owner</option>
            {committedActors.map(actor => (
              <option key={actor.id} value={actor.id}>{actor.label} Projection</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6 items-center pb-32 pt-10">
        <AnimatePresence>
          {nodes.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-400 mt-20">
              <Focus className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>State your intent to materialize reality.</p>
            </motion.div>
          )}

          {projectedRoots.map(root => (
            <NodeRenderer key={root.id} node={root} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={setProvenanceNodeId} />
          ))}
          
          {isComposing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center p-8 mt-10 text-indigo-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Materializing Logic...</p>
            </motion.div>
          )}

          {hypothesis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 shadow-neo-up-lg mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-indigo-900 text-lg">AI Structural Proposal</h3>
              </div>
              
              <p className="text-gray-700 text-sm mb-6 leading-relaxed">{hypothesis.inferredMeaning}</p>
              
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Proposed Dependencies</h4>
                {hypothesis.proposedDependencies.map((dep, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl shadow-2xs border border-black/5 flex items-start gap-3">
                    <Package className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-gray-800">{dep.label}</p>
                      <p className="text-xs text-gray-500">{dep.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => {
                    clearHypothesis();
                    setPendingContextId(null);
                    causalAudio.playSettleHarmony();
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-neo-down transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Materialize Reality
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice/Text Input bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
        <form onSubmit={handleInput} className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder={activeContextId ? "Type instructions for selected context..." : "What do you want to build or run?"}
            className="w-full bg-neo-bg rounded-full py-4 pl-6 pr-12 shadow-neo-down-lg border border-white/50 focus:outline-none focus:shadow-neo-down-md transition-all text-sm font-medium disabled:opacity-50 text-gray-700 placeholder:text-gray-400"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>

      <ProvenanceLedger 
        isOpen={!!provenanceNodeId} 
        onClose={() => setProvenanceNodeId(null)} 
        targetNodeId={provenanceNodeId} 
      />
    </div>
  );
}

function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance }: { node: GraphNode, activeContextId: string | null, setActiveContextId: (id: string | null) => void, currentProjection: string, onOpenProvenance: (id: string) => void }) {
  const graph = useRealityGraph();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasSemantics = node.data?.rationale || (node.data?.unknowns && node.data.unknowns.length > 0) || node.data?.proposal || node.data?.summary;
  
  const getThreadClass = (state: string) => {
    switch (state) {
      case 'UNKNOWN': return 'bg-gray-300 shadow-none';
      case 'POSSIBLE': return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]';
      case 'ASKING': 
      case 'EXECUTING': return 'thread-flowing shadow-[0_0_12px_rgba(251,191,36,1)]';
      case 'VERIFYING': return 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]';
      case 'COMMITTED':
      case 'RESOLVED': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'FAILED': return 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]';
      default: return 'bg-gray-300 shadow-none';
    }
  };

  const childEdges = Object.values(graph.edges).filter(e => e.sourceId === node.id);
  let children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);
  children = Array.from(new Map(children.map(n => [n.id, n])).values());

  const getIcon = () => {
    switch (node.type) {
      case 'WANT': return <Target className="w-4 h-4 text-indigo-600" />;
      case 'DEPENDENCY': return <Package className="w-4 h-4 text-amber-600" />;
      case 'ACTOR': return <User className="w-4 h-4 text-emerald-600" />;
      case 'EVIDENCE': return <FileCheck className="w-4 h-4 text-purple-600" />;
      default: return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  const isCompact = node.type !== 'WANT' && node.type !== 'ACTOR';
  const isHollow = node.state === 'UNKNOWN';

  const getAttentionClass = () => {
    if (activeContextId === node.id) return 'ring-2 ring-indigo-400/30 shadow-neo-up-xl scale-[1.02] bg-neo-bg';
    if (node.attention && node.attention > 80) return 'shadow-neo-up-xl scale-[1.02] bg-neo-bg';
    if (node.state === 'EXECUTING') return 'ring-1 ring-amber-400/50 shadow-neo-up-lg scale-[1.01] bg-neo-bg';
    if (node.state === 'VERIFYING') return 'ring-1 ring-purple-400/50 shadow-neo-up-lg scale-[1.01] bg-neo-bg';
    if (node.state === 'FAILED') return 'shadow-neo-down-lg scale-95 bg-neo-bg opacity-70 grayscale-[30%]';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'shadow-neo-down-md scale-95 opacity-90 bg-neo-bg';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl bg-neo-bg transition-all duration-300';
  };

  let baseClass = \`w-full rounded-3xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-gray-300/50 bg-neo-bg shadow-neo-down-lg relative overflow-hidden reality-void';
  } else {
    baseClass += \` border border-white/40 \${isCompact ? 'p-4' : 'p-6'}\`;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className="w-full flex flex-col"
    >
      <div className={\`node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}>
        <div className={baseClass}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={\`\${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white shadow-neo-down flex items-center justify-center shrink-0\`}>
                {getIcon()}
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">
                  {node.type}
                </span>
                <span className={\`font-bold text-gray-900 leading-tight \${isCompact ? 'text-sm' : 'text-base'}\`}>
                  {node.label}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {node.type === 'ACTOR' && ['COMMITTED', 'EXECUTING', 'VERIFYING'].includes(node.state) && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full shadow-neo-down animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Escrow Locked</span>
                </div>
              )}
              {node.type === 'ACTOR' && node.state === 'RESOLVED' && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full shadow-neo-down">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <Unlock className="w-3 h-3 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Funds Released</span>
                </div>
              )}
              <div className={\`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1 border
              \${node.state === 'UNKNOWN' ? 'bg-gray-50 text-gray-500 border-gray-200' : ''}
              \${node.state === 'POSSIBLE' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
              \${node.state === 'ASKING' ? 'bg-amber-50 text-amber-600 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : ''}
              \${node.state === 'OFFERED' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
              \${node.state === 'COMMITTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
              \${node.state === 'EXECUTING' ? 'bg-amber-50 text-amber-600 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : ''}
              \${node.state === 'VERIFYING' ? 'bg-purple-50 text-purple-600 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : ''}
              \${node.state === 'RESOLVED' ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : ''}
              \${node.state === 'FAILED' ? 'bg-red-50 text-red-600 border-red-200' : ''}
            \`}>
              {(node.state === 'ASKING' || node.state === 'EXECUTING' || node.state === 'VERIFYING') && <span className="text-current">✦</span>}
              {node.state}
            </div>
            </div>
          </div>
          
          {node.type === 'ACTOR' && node.data && (
            <div className="flex gap-3 text-[10px] text-gray-500 font-medium mt-1">
              <span className="truncate max-w-[120px]">{node.data.role}</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-500" />
                <span>{node.data.rating}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span>{node.data.cost}</span>
              </div>
            </div>
          )}

          {node.type === 'EVIDENCE' && node.data && (
            <div className="flex gap-3 text-[10px] text-gray-500 font-medium mt-1">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{node.data.fileType} • {node.data.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{node.data.timestamp}</span>
              </div>
            </div>
          )}
          
          {hasSemantics && (
            <div className="mt-3 flex flex-col gap-2">
              <div className={\`transition-all duration-500 overflow-hidden \${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-[42px] opacity-80'}\`}>
                {node.data?.rationale && (
                  <div className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-gray-600 leading-relaxed font-medium mb-2 break-words">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Causal Requirement</span>
                    <div className={isExpanded ? '' : 'line-clamp-1'}>{node.data.rationale}</div>
                  </div>
                )}
                
                {node.data?.unknowns && node.data.unknowns.length > 0 && (
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl shadow-inner text-xs text-indigo-700/80 leading-relaxed font-medium mb-2">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Open Clarifications</span>
                    {isExpanded ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {node.data.unknowns.map((u, idx) => <li key={idx} className="break-words">{u}</li>)}
                      </ul>
                    ) : (
                      <div className="line-clamp-1 text-[11px] opacity-80">{node.data.unknowns.join(' • ')}</div>
                    )}
                  </div>
                )}

                {node.data?.proposal && node.state !== 'FAILED' && node.state !== 'COMMITTED' && node.state !== 'EXECUTING' && node.state !== 'VERIFYING' && node.state !== 'RESOLVED' && (
                  <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl shadow-inner text-xs text-amber-800/80 leading-relaxed font-medium relative mb-2 break-words">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">Actor Proposal</span>
                    <div className={isExpanded ? '' : 'line-clamp-1'}>"{node.data.proposal}"</div>
                  </div>
                )}

                {node.data?.summary && (node.state === 'VERIFYING' || node.state === 'RESOLVED') && (
                  <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl shadow-inner text-xs text-blue-800/80 leading-relaxed font-medium mb-2 break-words">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-500 mb-1">Work Summary</span>
                    <div className={isExpanded ? '' : 'line-clamp-1'}>{node.data.summary}</div>
                    {isExpanded && (
                      <div className="mt-2 text-[9px] font-mono text-blue-400/80 bg-blue-100/50 px-2 py-1 rounded inline-block break-all">
                        Hash: {node.data.hash}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="flex items-center justify-center gap-1 py-1 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors w-full"
              >
                {isExpanded ? 'Collapse Data' : 'Expand Data'}
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          )}
          
          {node.type === 'WANT' && (
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => onOpenProvenance(node.id)}
                className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1.5 px-3 rounded hover:bg-gray-200 transition-colors flex items-center gap-1.5"
              >
                <Activity className="w-3 h-3" />
                Ledger
              </button>
            </div>
          )}

          {/* Action Handlers based on state (Phase controls) */}
          {node.state === 'POSSIBLE' && node.type === 'DEPENDENCY' && (
            <button 
              onClick={() => {
                causalAudio.playTick();
                // We don't auto-resolve here, user must click Ask
              }}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg mt-2 hover:bg-indigo-100 transition-colors self-start"
            >
              Analyze Options
            </button>
          )}

          {node.state === 'POSSIBLE' && node.type === 'ACTOR' && (
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => {
                  causalAudio.playTick();
                  RealityEngine.updateNode(node.id, { state: 'ASKING' });
                  setTimeout(() => {
                    causalAudio.playSettleHarmony();
                    RealityEngine.updateNode(node.id, { state: 'OFFERED' });
                  }, 1200);
                }}
                className="text-xs font-bold text-white bg-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-700 shadow-neo-down transition-colors"
              >
                Ask {node.label}
              </button>
            </div>
          )}

          {node.state === 'OFFERED' && node.type === 'ACTOR' && (
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => {
                  causalAudio.playCommitChord();
                  RealityEngine.updateNode(node.id, { state: 'COMMITTED' });
                  
                  // Also mark the parent DEPENDENCY as COMMITTED if this actor committed
                  const edges = Object.values(RealityEngine.getGraph().edges);
                  const parentEdge = edges.find(e => e.targetId === node.id);
                  if (parentEdge) {
                    RealityEngine.updateNode(parentEdge.sourceId, { state: 'COMMITTED' });
                    // Collapse other siblings
                    const siblingEdges = edges.filter(e => e.sourceId === parentEdge.sourceId && e.targetId !== node.id);
                    siblingEdges.forEach(e => {
                      RealityEngine.updateNode(e.targetId, { state: 'FAILED' }); // or "DISCARDED"
                    });
                  }
                }}
                className="text-xs font-bold text-white bg-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-700 shadow-neo-down transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Commit
              </button>
              <button 
                onClick={() => {
                  causalAudio.playTick();
                  RealityEngine.updateNode(node.id, { state: 'FAILED' });
                }}
                className="text-xs font-bold text-gray-500 bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {node.state === 'COMMITTED' && node.type === 'ACTOR' && (
            <div className="mt-3 flex flex-col gap-2 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/50">
              <button 
                onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
                className={\`text-[10px] font-bold py-1.5 px-3 rounded-md transition-colors \${activeContextId === node.id ? 'bg-indigo-600 text-white shadow-neo-down' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
              >
                {activeContextId === node.id ? 'Exit Actor Projection' : 'Enter Actor Projection'}
              </button>
              {activeContextId === node.id && (
                <button 
                  onClick={() => {
                    causalAudio.playTick();
                    RealityEngine.updateNode(node.id, { state: 'EXECUTING' });
                  }}
                  className="text-xs font-bold py-2 px-4 rounded-lg bg-amber-500 text-white hover:bg-amber-600 shadow-neo-down transition-colors"
                >
                  Trigger Execution
                </button>
              )}
            </div>
          )}

          {node.state === 'EXECUTING' && node.type === 'ACTOR' && (
             <div className="mt-3 flex flex-col gap-2">
               <div className="text-xs text-amber-600 font-bold mb-1 animate-pulse">Executing Responsibility...</div>
               {(currentProjection === node.id || activeContextId === node.id) && (
                 <button 
                   onClick={() => {
                     causalAudio.playSettleHarmony();
                     const generatedEvidence = getContextualEvidence(node.data?.role || '');
                     const evidenceId = RealityEngine.addNode({
                       type: 'EVIDENCE',
                       label: generatedEvidence.label,
                       state: 'VERIFYING',
                       data: {
                         fileType: generatedEvidence.fileType,
                         size: generatedEvidence.size,
                         summary: generatedEvidence.summary,
                         hash: generatedEvidence.hash,
                         timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                       }
                     });
                     RealityEngine.addEdge(node.id, evidenceId, 'provides');
                     RealityEngine.updateNode(node.id, { state: 'VERIFYING' });
                     
                     const edges = Object.values(RealityEngine.getGraph().edges);
                     const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                     if (parentEdge) {
                       RealityEngine.updateNode(parentEdge.sourceId, { state: 'VERIFYING' });
                     }
                   }}
                   className="text-xs font-bold py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors self-start shadow-neo-down"
                 >
                   Submit Proof / Evidence
                 </button>
               )}
            </div>
          )}

          {node.state === 'VERIFYING' && (node.type === 'ACTOR' || node.type === 'DEPENDENCY') && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="text-xs text-purple-600 font-bold mb-1">Awaiting Verification...</div>
              {(currentProjection === 'owner' || (currentProjection !== node.id && node.type === 'ACTOR')) && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      causalAudio.playCommitChord();
                      RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                      
                      if (node.type === 'ACTOR') {
                        const edges = Object.values(RealityEngine.getGraph().edges);
                        const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                        if (parentEdge) {
                          RealityEngine.updateNode(parentEdge.sourceId, { state: 'RESOLVED' });
                        }
                      }
                    }}
                    className="text-xs font-bold py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-neo-down flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify & Resolve
                  </button>
                  
                  <button 
                    onClick={() => {
                      RealityEngine.updateNode(node.id, { state: 'FAILED' });
                      if (node.type === 'ACTOR') {
                        const edges = Object.values(RealityEngine.getGraph().edges);
                        const parentEdge = edges.find(e => e.targetId === node.id && e.relation !== 'provides');
                        if (parentEdge) {
                          const parentId = parentEdge.sourceId;
                          setTimeout(() => {
                            causalAudio.playTick();
                            RealityEngine.updateNode(parentId, { state: 'ASKING' });
                            setTimeout(() => {
                              const parentNode = RealityEngine.getGraph().nodes[parentId];
                              const newCand = getContextualActors(parentNode?.label || '', 1)[0];
                              const newActorId = RealityEngine.addNode({
                                type: 'ACTOR',
                                label: newCand.label,
                                state: 'POSSIBLE',
                                attention: 100,
                                data: newCand.data
                              });
                              RealityEngine.addEdge(parentId, newActorId, 'candidate');
                              RealityEngine.updateNode(parentId, { state: 'POSSIBLE' });
                              causalAudio.playSettleHarmony();
                            }, 2500);
                          }, 1000);
                        }
                      }
                    }}
                    className="text-xs font-bold py-2 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-neo-down flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {node.state === 'VERIFYING' && node.type === 'EVIDENCE' && (
            <div className="mt-1 flex gap-2">
              <button 
                  onClick={() => {
                    causalAudio.playSettleHarmony();
                    RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                  }}
                  className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1 px-3 rounded hover:bg-gray-200 transition-colors"
              >
                View Document
              </button>
            </div>
          )}

          {node.state === 'UNKNOWN' && node.type === 'DEPENDENCY' && (
            <button 
              onClick={() => {
                causalAudio.playTick();
                RealityEngine.updateNode(node.id, { state: 'ASKING' });
                
                setTimeout(() => {
                  causalAudio.playSettleHarmony();
                  const candidates = getContextualActors(node.label, 2);
                  candidates.forEach(cand => {
                    const actorId = RealityEngine.addNode({
                      type: 'ACTOR',
                      label: cand.label,
                      state: 'POSSIBLE',
                      data: cand.data
                    });
                    RealityEngine.addEdge(node.id, actorId, 'candidate');
                  });
                  RealityEngine.updateNode(node.id, { state: 'POSSIBLE' });
                }, 1500);
              }}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg mt-2 hover:bg-indigo-100 transition-colors self-start shadow-sm"
            >
              Find {node.label}
            </button>
          )}

        </div>
      </div>
      
      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative z-0">
          {/* Main vertical stem */}
          <div className="absolute left-[15px] top-[-10px] bottom-[30px] w-[2px] bg-gradient-to-b from-gray-300 via-gray-200/50 to-transparent rounded-full" />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch reflecting the CHILD's precise state */}
                <div className={\`absolute left-[-17px] top-[24px] w-[17px] h-[2px] rounded-full transition-all duration-500 \${getThreadClass(child.state)}\`} />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
`;

fs.writeFileSync(path, completeCode);
console.log("Restored DynamicRealitySurface to absolute perfection.");
