import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRealityGraph, RealityEngine, GraphNode } from '../engine/core/UniversalGraphStore';
import { causalAudio } from '../lib/causalAudio';
import { getContextualActors, getContextualEvidence } from '../lib/mockGenerators';
import { Shield, Play, Sparkles, CheckCircle2, User, Package, AlertTriangle, HelpCircle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText, ChevronDown, ChevronUp, MessageSquare, X, Link, Edit2, Trash2, Archive } from 'lucide-react';
import { ProvenanceLedger } from './ProvenanceLedger';
import { ActorDiscoveryDrawer } from './ActorDiscoveryDrawer';
import { useUniversalCompose } from '../engine/universal/useUniversalCompose';

export function DynamicRealitySurface() {
  const graph = useRealityGraph();
  const [inputText, setInputText] = useState('');
  const [clarificationText, setClarificationText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { submitIntent, isComposing, hypothesis, clearHypothesis } = useUniversalCompose();
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [provenanceNodeId, setProvenanceNodeId] = useState<string | null>(null);
  const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const [poppedNodeId, setPoppedNodeId] = useState<string | null>(null);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [discoveryTargetId, setDiscoveryTargetId] = useState<string | null>(null);
  const [discoveryTargetLabel, setDiscoveryTargetLabel] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  useEffect(() => {
    const handleOpenDiscovery = (e: any) => {
      setDiscoveryTargetId(e.detail.id);
      setDiscoveryTargetLabel(e.detail.label);
      setDiscoveryOpen(true);
    };
    window.addEventListener("OPEN_DISCOVERY", handleOpenDiscovery);
    return () => window.removeEventListener("OPEN_DISCOVERY", handleOpenDiscovery);
  }, []);

  const [currentProjection, setCurrentProjection] = useState<string>('owner');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string, role: 'user' | 'ai', text: string, nodeIds: string[], actionOptions?: any[] }>>([]);
  const [chatNodes, setChatNodes] = useState<Set<string>>(new Set());
  const chatMessagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isChatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);
  
  // Attention Engine: Find the next unresolved reality
  const nodes: GraphNode[] = Object.values(graph.nodes) as GraphNode[];
  // Attention Engine: Find the next unresolved reality (Current Frontier)
  // Attention Engine: Find the next unresolved reality (Current Frontier)
  const currentFrontierId = nodes.find(n => 
    (n.state === 'UNKNOWN' || n.type === 'GAP' || n.state === 'ASKING' || n.state === 'OFFERED' || n.state === 'POSSIBLE') && 
    !['RESOLVED', 'COMMITTED', 'FAILED', 'EXECUTING'].includes(n.state)
  )?.id;
  
    useEffect(() => {
    if (hypothesis) {
      causalAudio.playSettleHarmony();
      if (hypothesis.inferredMeaning) setToastMessage(hypothesis.inferredMeaning);
      
      let parentId = pendingContextId;
      const newlyCreatedNodeIds: string[] = [];

      // Process mutations first
      if (hypothesis.mutations && hypothesis.mutations.length > 0) {
        hypothesis.mutations.forEach(mut => {
          if (mut.type === 'UPDATE_STATE' && mut.nodeId) {
            if (RealityEngine.getGraph().nodes[mut.nodeId]) {
              RealityEngine.updateNode(mut.nodeId, { state: mut.state as any });
              // DO NOT add to newlyCreatedNodeIds to avoid pulling existing nodes off the board
            }
          } else if (mut.type === 'ADD_NODE' && mut.nodeId) {
            const newNodeId = RealityEngine.addNode({
              type: mut.nodeType as any || 'DEPENDENCY',
              label: mut.label || 'New Requirement',
              state: 'UNKNOWN',
              data: { rationale: mut.rationale }
            });
            RealityEngine.addEdge(mut.nodeId, newNodeId, 'unresolved');
            newlyCreatedNodeIds.push(newNodeId);
          }
        });
      }

      // Add proposed dependencies if provided
      if (hypothesis.proposedDependencies && hypothesis.proposedDependencies.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
          newlyCreatedNodeIds.push(parentId);
        }
        hypothesis.proposedDependencies.forEach(dep => {
          const depId = RealityEngine.addNode({
            type: 'DEPENDENCY',
            label: dep.label,
            state: 'UNKNOWN',
            data: { 
              rationale: dep.rationale,
              contextualDetails: dep.contextualDetails || '',
              unknowns: dep.clarificationQuestions || []
            }
          });
          if (parentId) RealityEngine.addEdge(parentId, depId, 'requires');
          newlyCreatedNodeIds.push(depId);
        });
      }

      // 3. Convert unknowns into GAPs
      if (hypothesis.unknowns && hypothesis.unknowns.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
          newlyCreatedNodeIds.push(parentId);
        }
        hypothesis.unknowns.forEach(u => {
           const uId = RealityEngine.addNode({
             type: 'GAP',
             label: u,
             state: 'UNKNOWN',
             data: { isClarification: true }
           });
           if (parentId) RealityEngine.addEdge(parentId, uId, 'unresolved');
           newlyCreatedNodeIds.push(uId);
        });
      }

      if (newlyCreatedNodeIds.length > 0) {
        setChatNodes(prev => new Set([...prev, ...newlyCreatedNodeIds]));
      }

      setMessages(prev => [...prev, {
         id: Date.now().toString(),
         role: 'ai',
         text: hypothesis.inferredMeaning || "Reality updated.",
         nodeIds: newlyCreatedNodeIds,
         actionOptions: hypothesis.actionOptions
      }]);

      clearHypothesis();
      setPendingContextId(null);
    }
  }, [hypothesis]);

  
  useEffect(() => {
    const handleCustomSubmit = (e: any) => {
      setPendingContextId(e.detail.parentId);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: e.detail.prompt, nodeIds: [] }]);
      setIsChatOpen(true);
      submitIntent(e.detail.prompt);
    };
    window.addEventListener('CLINK_SUBMIT_INTENT', handleCustomSubmit);
    const handlePop = (e: any) => {
      if (navigator.vibrate) navigator.vibrate([50]);
      setPoppedNodeId(e.detail.id);
    };
    window.addEventListener('CLINK_POP_NODE', handlePop);
    const handleOutsideClick = (e: MouseEvent) => {
      // If we have a popped node and we click, let's just dismiss it (unless we click inside the menu, which we can stopPropagation on)
      setPoppedNodeId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('CLINK_SUBMIT_INTENT', handleCustomSubmit);
      window.removeEventListener('CLINK_POP_NODE', handlePop);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [submitIntent]);

  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;

  const committedActors = nodes.filter(n => n.type === 'ACTOR' && n.state === 'COMMITTED');
  
  let projectedRoots: GraphNode[] = [];
  if (currentProjection === 'owner') {
    projectedRoots = nodes.filter(n => n.type === 'WANT');
  } else {
    const actorEdges = (Object.values(graph.edges) as any[]).filter(e => e.targetId === currentProjection);
    const parentDepIds = actorEdges.map(e => e.sourceId);
    projectedRoots = parentDepIds.map(id => graph.nodes[id]).filter(Boolean);
    projectedRoots = Array.from(new Map(projectedRoots.map(n => [n.id, n])).values());
  }
  const boardRoots = projectedRoots.filter(r => !chatNodes.has(r.id));
  const settledNodes = nodes.filter(n => (n.state === 'COMMITTED' || n.state === 'RESOLVED') && !chatNodes.has(n.id));

  const handleInput = async (e: React.FormEvent | { preventDefault: ()=>void }, textOverride?: string) => {
    e.preventDefault();
    const textToSubmit = textOverride || inputText;
    if (!textToSubmit.trim()) return;
    setIsProcessing(true);
    causalAudio.playTick();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: textToSubmit, nodeIds: [] }]);
    setIsChatOpen(true);
    try {
      const effectiveContextId = activeContextId || (currentProjection !== 'owner' ? currentProjection : null);
      setPendingContextId(effectiveContextId);
      await submitIntent(textToSubmit, {});
      setInputText('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto pb-40 surface-container ${poppedNodeId ? 'is-popping' : ''}`}>
      <style>{`
        .is-popping .card-content {
          filter: blur(2px) grayscale(20%);
          opacity: 0.5;
          transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-popping .popped-node .card-content {
          filter: none;
          opacity: 1;
        }
        .is-popping .causal-thread-v,
        .is-popping .causal-thread-h {
          opacity: 0.15;
          transition: opacity 0.4s ease;
        }
        .card-content {
          transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      <header className="py-6 px-8 flex justify-between items-center mb-8 relative z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="text-black font-black font-serif text-xl tracking-tighter flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-lg">C</div>
            <span className="hidden sm:inline">LINK</span>
          </button>
          <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-bold tracking-widest text-emerald-600 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE REALITY
          </div>
        </div>
      </header>

      
      {/* History Vault (Provenance Stack) */}
      {settledNodes.length > 0 && (
        <div className="px-8 mb-8 z-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-xl p-3 rounded-2xl border border-gray-200/60 shadow-sm"
          >
            <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-gray-100/50 px-3 py-1.5 rounded-full border border-gray-200/50 shrink-0">
              <Archive className="w-3.5 h-3.5" />
              <span>Resolved Reality</span>
            </div>
            
            <div className="flex flex-wrap items-center -space-x-3 pr-2" style={{ direction: "rtl" }}>
              <AnimatePresence>
                {settledNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    layoutId={`node-${node.id}`}
                    className="w-10 h-10 rounded-full bg-white shadow-sm ring-[3px] ring-white flex items-center justify-center relative group cursor-pointer"
                    style={{ zIndex: settledNodes.length - i, direction: "ltr" }}
                    onClick={() => setProvenanceNodeId(node.id)}
                    whileHover={{ y: -6, zIndex: 100, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span className="scale-[0.8] opacity-80 group-hover:opacity-100 transition-opacity">
                      {node.type === 'WANT' ? <Target className="w-5 h-5 text-gray-700" /> : 
                       node.type === 'GAP' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                       node.type === 'ACTOR' ? <User className="w-5 h-5 text-emerald-600" /> :
                       node.type === 'DEPENDENCY' ? <Package className="w-5 h-5 text-amber-600" /> :
                       <FileCheck className="w-5 h-5 text-purple-600" />}
                    </span>
                    <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-opacity shadow-lg">
                      {node.type} Settled
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}


      {/* The main tree rendering */}
      <div className="px-8 mt-4 flex flex-col gap-6">
        <AnimatePresence>
          {boardRoots.map(root => (
            <NodeRenderer key={root.id} node={root} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={setProvenanceNodeId} currentFrontierId={currentFrontierId} chatNodes={chatNodes} />
          ))}
        </AnimatePresence>
      </div>

      
      {/* Floating Chat Trigger / Minimal Input when Chat is closed */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
          >
             <button 
                onClick={() => setIsChatOpen(true)}
                className="shadow-2xl ring-1 ring-black/5 rounded-full bg-white px-6 py-4 flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors"
             >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">Compose Reality...</span>
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple-grade Fluid Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            layoutId="chat-drawer"
            initial={{ opacity: 0, x: -400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -400, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-full sm:w-[400px] bg-white/90 backdrop-blur-3xl shadow-[20px_0_60px_rgba(0,0,0,0.1)] border-r border-white/20 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
               <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-black text-white rounded-md flex items-center justify-center text-xs font-black font-serif">C</div>
                 <span className="font-bold text-sm tracking-tight">Causal Composer</span>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                 <X className="w-4 h-4 text-gray-600" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
               {messages.map(msg => (
                 <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                       {msg.text}
                    </div>
                    {/* Render Action Options as chips in the chat */}
                    {msg.actionOptions && msg.actionOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.actionOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const text = typeof opt === 'string' ? opt : opt.label;
                              handleInput({ preventDefault: () => {} } as any, text);
                            }}
                            className="text-xs bg-white border border-gray-200 shadow-sm text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {typeof opt === 'string' ? opt : opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Render newly created nodes inside the chat if they are in chatNodes */}
                    {msg.nodeIds && msg.nodeIds.length > 0 && (
                      <div className="flex flex-col gap-3 w-full mt-2">
                         {msg.nodeIds.map(id => {
                            if (!chatNodes.has(id)) return null;
                            const node = graph.nodes[id];
                            if (!node) return null;
                            
                            // Check if this node has a parent that is ALSO in this same msg.nodeIds array
                            const edges = Object.values(graph.edges) as any[];
                            const hasParentInMsg = edges.some(e => e.targetId === id && msg.nodeIds.includes(e.sourceId) && chatNodes.has(e.sourceId));
                            if (hasParentInMsg) return null; // Let the parent render it recursively

                            return (
                              <div key={id} className="w-full relative group">
                                 <div className="absolute -top-3 right-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-sm">
                                   Hold to place on board
                                 </div>
                                 <NodeRenderer 
                                   node={node} 
                                   activeContextId={activeContextId} 
                                   setActiveContextId={setActiveContextId} 
                                   currentProjection={currentProjection} 
                                   onOpenProvenance={setProvenanceNodeId} 
                                   currentFrontierId={currentFrontierId}
                                   chatNodes={chatNodes}
                                   onLongPress={(dragId) => {
                                      causalAudio.playSettleHarmony();
                                      
                                      const getAllDescendants = (id: string, edges: any[]): string[] => {
                                        const childrenIds = edges.filter(e => e.sourceId === id).map(e => e.targetId);
                                        let all = [...childrenIds];
                                        childrenIds.forEach(c => all = all.concat(getAllDescendants(c, edges)));
                                        return all;
                                      };
                                      const descendants = getAllDescendants(dragId, Object.values(graph.edges));
                                      
                                      setChatNodes(prev => {
                                        const next = new Set(prev);
                                        next.delete(dragId);
                                        descendants.forEach(d => next.delete(d));
                                        return next;
                                      });
                                   }}
                                 />
                              </div>
                            )
                         })}
                      </div>
                    )}
                 </div>
               ))}
               
               {isProcessing && (
                 <div className="flex items-start gap-2">
                    <div className="px-4 py-3 rounded-2xl bg-gray-50 text-gray-500 rounded-bl-sm text-xs font-medium flex items-center gap-2 border border-gray-100">
                       <Loader2 className="w-3 h-3 animate-spin" />
                       Computing reality...
                    </div>
                 </div>
               )}
               <div ref={chatMessagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <form onSubmit={handleInput} className="relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Ask C-Link..."
                  className="w-full bg-gray-100 rounded-full py-4 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium disabled:opacity-50 text-gray-700 placeholder:text-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isProcessing}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {provenanceNodeId && (
        <ProvenanceLedger 
          nodeId={provenanceNodeId} 
          onClose={() => setProvenanceNodeId(null)} 
        />
      )}

      <ActorDiscoveryDrawer 
        isOpen={discoveryOpen} 
        onClose={() => setDiscoveryOpen(false)} 
        targetNodeId={discoveryTargetId} 
        targetNodeLabel={discoveryTargetLabel} 
      />
    </div>
  );
}

function NodeRenderer({ node, activeContextId, setActiveContextId, currentProjection, onOpenProvenance, currentFrontierId, chatNodes, onLongPress, poppedNodeId, setPoppedNodeId }: {
  key?: any;
  chatNodes?: Set<string>;
  onLongPress?: (id: string) => void; 
  node: GraphNode; 
  activeContextId: string | null; 
  setActiveContextId: (id: string | null) => void;
  currentProjection: string;
  onOpenProvenance: (id: string) => void;
  currentFrontierId?: string;
  poppedNodeId?: string | null;
  setPoppedNodeId?: (id: string | null) => void;
}) {
  const isExpanded = activeContextId === node.id || (!activeContextId && node.id === currentFrontierId);
  const [evidenceInput, setEvidenceInput] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const touchRef = useRef(false);
  const isPopped = poppedNodeId === node.id;
  const isSettled = node.state === 'COMMITTED' || node.state === 'RESOLVED';
  const hasSemantics = !!(node.data?.rationale || node.data?.contextualDetails || node.data?.proposal || node.data?.proofOfReality || node.data?.summary || node.data?.unknowns);

  const graph = RealityEngine.getGraph();
  const childEdges = Object.values(graph.edges).filter(e => e.sourceId === node.id);
  let children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);
  children = Array.from(new Map(children.map(n => [n.id, n])).values());

  const getIcon = () => {
    switch (node.type) {
      case 'WANT': return <Target className="w-5 h-5 text-gray-700" />;
      case 'GAP' as any: return node.data?.isClarification ? <HelpCircle className="w-4 h-4 text-indigo-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'DEPENDENCY': return <Package className="w-4 h-4 text-amber-600" />;
      case 'ACTOR': return <User className="w-4 h-4 text-emerald-600" />;
      case 'EVIDENCE': return <FileCheck className="w-4 h-4 text-purple-600" />;
      default: return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  
  if (isSettled) {
    return (
      <AnimatePresence>
        {children.length > 0 && children.map(child => (
          <div key={child.id} className="relative w-full">
            <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} currentFrontierId={currentFrontierId} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId} />
          </div>
        ))}
      </AnimatePresence>
    );
  }

  const isCompact = node.type !== 'WANT' && node.type !== 'ACTOR';

  const isHollow = node.state === 'UNKNOWN';

  const getThreadClass = (state: string) => {
    switch (state) {
      case 'UNKNOWN': return 'border-gray-200/50 border-dashed';
      case 'POSSIBLE': return 'border-blue-300';
      case 'ASKING': return 'border-amber-300 border-dashed animate-pulse';
      case 'PROPOSED': return 'border-indigo-300 border-dashed';
      case 'OFFERED': return 'border-purple-300';
      case 'COMMITTED': return 'border-emerald-400 border-[1.5px]';
      case 'EXECUTING': return 'border-amber-400 border-[1.5px] border-dashed animate-pulse';
      case 'VERIFYING': return 'border-purple-400 border-[1.5px] border-dashed';
      case 'RESOLVED': return 'border-gray-800 border-[1.5px]';
      case 'FAILED': return 'border-red-300 border-dashed';
      default: return 'border-gray-200';
    }
  };

  const getAttentionClass = () => {
    if (activeContextId === node.id) return 'bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-4 my-2 z-20';
    if (node.id === currentFrontierId) return 'bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20 rounded-xl py-3 px-4 my-2 z-10';
    if (node.state === 'UNKNOWN') return 'bg-transparent opacity-70 py-1';
    if (node.state === 'OFFERED') return 'bg-indigo-50/50 shadow-sm ring-1 ring-indigo-300/40 rounded-xl py-3 px-4 border border-dashed border-indigo-200 opacity-90 my-2';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'bg-transparent opacity-40 py-1';
    return 'hover:bg-white/40 transition-all duration-300 rounded-lg bg-transparent py-1 px-2 opacity-80';
  };

  let baseClass = `w-full flex flex-col gap-2 transition-all ${getAttentionClass()}`;
  const morphProps = node.type === 'WANT' ? { layoutId: "morph-intent-card" } : {};

  if (isHollow) {
    baseClass += ' border-l-2 border-dashed border-gray-300/50 relative overflow-hidden reality-void pl-4 ml-1';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className="w-full flex flex-col"
    >
      <motion.div 
      layoutId={`node-${node.id}`}
      animate={isPopped ? { scale: 1.05, zIndex: 50, boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" } : isPressing ? { scale: 0.97 } : { scale: 1, zIndex: (isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING') ? 10 : 0, boxShadow: "none" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`node-wrapper relative ${isPopped ? 'z-50 popped-node' : ''}`}
      onPointerDown={() => {
        if (onLongPress) {
          const t = setTimeout(() => onLongPress(node.id), 400);
          const clear = () => clearTimeout(t);
          window.addEventListener('pointerup', clear, { once: true });
          window.addEventListener('pointercancel', clear, { once: true });
        } else {
          setIsPressing(true);
          touchRef.current = false;
          const t = setTimeout(() => {
            touchRef.current = true;
            window.dispatchEvent(new CustomEvent('CLINK_POP_NODE', { detail: { id: node.id } }));
            setIsPressing(false);
          }, 400);
          const clear = () => { 
            clearTimeout(t); 
            setIsPressing(false); 
            setTimeout(() => touchRef.current = false, 100); 
          };
          window.addEventListener('pointerup', clear, { once: true });
          window.addEventListener('pointercancel', clear, { once: true });
        }
      }}
    >
        <div className={baseClass + ' cursor-pointer card-content'} onClick={(e) => {
          if (touchRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          setActiveContextId(activeContextId === node.id ? null : node.id);
        }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 relative">
              {node.id === currentFrontierId && (
                <div className="absolute -left-48 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-[11px] tracking-widest uppercase flex items-center gap-2 animate-pulse bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                  <span>✦ CURRENT FRONTIER</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
              <div className={`${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gray-100/50 flex items-center justify-center shrink-0`}>
                {getIcon()}
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">
                  {node.type}
                </span>
                <span className={`font-bold text-gray-900 leading-tight ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {node.label}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {node.type === 'ACTOR' && ['COMMITTED', 'EXECUTING', 'VERIFYING'].includes(node.state) && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full  animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Escrow Locked</span>
                </div>
              )}
              {node.type === 'ACTOR' && node.state === 'RESOLVED' && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full ">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <Unlock className="w-3 h-3 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Funds Released</span>
                </div>
              )}
              <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1 border
              ${node.state === 'UNKNOWN' ? 'bg-gray-50 text-gray-500 border-gray-200' : ''}
              ${node.state === 'POSSIBLE' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
              ${node.state === 'ASKING' ? 'bg-amber-50 text-amber-600 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : ''}
              ${node.state === 'OFFERED' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
              ${node.state === 'COMMITTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
              ${node.state === 'EXECUTING' ? 'bg-amber-50 text-amber-600 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : ''}
              ${node.state === 'VERIFYING' ? 'bg-purple-50 text-purple-600 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : ''}
              ${node.state === 'RESOLVED' ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : ''}
              ${node.state === 'FAILED' ? 'bg-red-50 text-red-600 border-red-200' : ''}
            `}>
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
          
          {hasSemantics && isExpanded && (
            <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-500 font-medium">
              {node.data?.rationale && <div><span className="text-gray-400">Context:</span> {node.data.rationale}</div>}
              {node.type === 'ACTOR' && node.data?.proofOfReality && (
                <div className="mt-1 flex gap-3 text-emerald-600">
                   <span>RES: {node.data.proofOfReality.totalResolutions}</span>
                   <span>GRV: {node.data.proofOfReality.gravityScore}</span>
                </div>
              )}
            </div>
          )}
          
          

          {node.state === 'OFFERED' && node.type === 'ACTOR' && (
            <div className="mt-2 flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); 
                  causalAudio.playCommitChord();
                  RealityEngine.updateNode(node.id, { state: 'COMMITTED' }, true);
                  
                  // Also mark the parent DEPENDENCY as COMMITTED if this actor committed
                  const edges = Object.values(RealityEngine.getGraph().edges);
                  const parentEdge = edges.find(e => e.targetId === node.id);
                  if (parentEdge) {
                    RealityEngine.updateNode(parentEdge.sourceId, { state: 'COMMITTED' }, true);
                    // Collapse other siblings
                    const siblingEdges = edges.filter(e => e.sourceId === parentEdge.sourceId && e.targetId !== node.id);
                    siblingEdges.forEach(e => {
                      RealityEngine.updateNode(e.targetId, { state: 'FAILED' }); // or "DISCARDED"
                    });
                  }
                }}
                className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-700 transition-colors bg-transparent border border-emerald-200/50 rounded-full px-3 py-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Commit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); 
                  causalAudio.playTick();
                  RealityEngine.updateNode(node.id, { state: 'FAILED' });
                }}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-gray-600 transition-colors bg-transparent border border-gray-200/50 rounded-full px-3 py-1"
              >
                Reject
              </button>
            </div>
          )}

          
          {node.state === 'COMMITTED' && node.type === 'ACTOR' && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">Payment Assurance Locked</div>
                    <div className="text-xs font-semibold">{node.data?.cost || 'Amount Reserved'}</div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium bg-emerald-100/50 px-2 py-1 rounded">
                  ESCROW
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    causalAudio.playTick();
                    RealityEngine.updateNode(node.id, { state: 'EXECUTING' });
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  Begin Execution
                </button>
                <button 
                  onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
                  className={`${activeContextId === node.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 text-[10px] font-bold py-2 px-3 rounded-lg transition-colors`}
                >
                  {activeContextId === node.id ? <X className="w-4 h-4"/> : <Activity className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          )}
          
          {node.state === 'EXECUTING' && node.type === 'ACTOR' && (
            <div className="mt-3 flex flex-col gap-2">
               <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                 <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-3">
                   <span>Execution in Progress</span>
                   <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Live</span>
                 </div>
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     causalAudio.playSettleHarmony();
                     
                     // 1. Create Evidence Node
                     const evidenceId = RealityEngine.addNode({
                       type: 'EVIDENCE',
                       label: 'Delivery Confirmation Receipt',
                       state: 'VERIFYING',
                       data: { 
                         fileType: 'JPEG Image',
                         size: '2.4 MB',
                         timestamp: new Date().toLocaleTimeString()
                       }
                     });
                     RealityEngine.addEdge(node.id, evidenceId, 'provides');
                     
                     // 2. Move Actor to VERIFYING
                     RealityEngine.updateNode(node.id, { state: 'VERIFYING' });
                   }}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                   <FileCheck className="w-3.5 h-3.5" />
                   Submit Evidence (Simulate)
                 </button>
               </div>
            </div>
          )}
          
          {node.state === 'VERIFYING' && node.type === 'ACTOR' && (
            <div className="mt-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
               <div className="text-[10px] text-purple-700 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                 <FileCheck className="w-3.5 h-3.5" /> Evidence Review
               </div>
               <p className="text-xs text-purple-600 mb-3 font-medium">Review the attached evidence to release the escrow payment.</p>
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   causalAudio.playCommitChord();
                   
                   // Move actor to RESOLVED
                   RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                   
                   // Resolve child evidence
                   const edges = Object.values(RealityEngine.getGraph().edges);
                   const childEdges = edges.filter(ed => ed.sourceId === node.id);
                   childEdges.forEach(ed => {
                     const child = RealityEngine.getGraph().nodes[ed.targetId];
                     if (child && child.type === 'EVIDENCE') {
                       RealityEngine.updateNode(ed.targetId, { state: 'RESOLVED' });
                     }
                   });
                   // Resolve parent dependency
                   const parentEdge = edges.find(ed => ed.targetId === node.id);
                   if (parentEdge) {
                     RealityEngine.updateNode(parentEdge.sourceId, { state: 'RESOLVED' });
                   }
                 }}
                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
               >
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 Verify & Release Payment
               </button>
            </div>
          )}

          {node.state === 'RESOLVED' && (
            <div className="mt-3 flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  causalAudio.playSettleHarmony();
                  onOpenProvenance(node.id);
                }}
                className="w-full border border-gray-800 hover:bg-gray-900 hover:text-white text-gray-800 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                View Cryptographic Provenance
              </button>
            </div>
          )}



          
          {node.type === 'GAP' && node.data?.isClarification && (
            <div className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Answer..."
                  className="w-full bg-transparent rounded-lg py-2 pl-3 pr-8 text-xs border-none  focus:-md focus:outline-none transition-all text-gray-700"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        const refinementPrompt = `Original Intent: ${node.data.parentRationale || ''}
Clarifying: ${node.label}
User Answer: ${val}

Please update the reality based on this answer.`;
                        e.currentTarget.value = '';
                        RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                        // submitIntent is not directly available here, so we could dispatch an event or pass it down.
                        // For now we can dispatch a custom event.
                        window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: refinementPrompt, parentId: node.id } }));
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Dynamic Contextual Actions on Frontier/Active Node */}
          {(node.id === currentFrontierId || activeContextId === node.id) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {node.type === 'GAP' && !node.data?.isClarification && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Find someone to resolve this", parentId: node.id } })); }} className="text-[11px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">Find actor</button>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Change this requirement", parentId: node.id } })); }} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Change requirement</button>
                </>
              )}
              {node.type === 'DEPENDENCY' && node.state === 'UNKNOWN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Find capability", parentId: node.id } })); }} className="text-[11px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">Find capability</button>
                </>
              )}
              {node.type === 'WANT' && node.state === 'UNKNOWN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Break this down into steps", parentId: node.id } })); }} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Breakdown</button>
                </>
              )}
              {node.state === 'ASKING' && (
                <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Simulate actor response", parentId: node.id } })); }} className="text-[11px] bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium">Simulate Response</button>
              )}
              {node.state === 'OFFERED' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Accept the offer", parentId: node.id } })); }} className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors font-medium">Accept</button>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Negotiate the offer", parentId: node.id } })); }} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Negotiate</button>
                </>
              )}
            </div>
          )}

          

          
          </div>
          {/* Haptic Context Menu */}
          {isPopped && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
              className="absolute top-full left-0 mt-3 w-52 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-1.5 z-[100] flex flex-col gap-0.5 overflow-hidden"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
              >
                <Link className="w-4 h-4 text-gray-500" />
                Copy Reality Link
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenProvenance(node.id); setPoppedNodeId?.(null); }}
                className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
              >
                <History className="w-4 h-4 text-gray-500" />
                View Provenance
              </button>
              
              <div className="h-px bg-gray-200/60 my-1 mx-2" />

              {node.type === 'ACTOR' && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    Message Actor
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left w-full"
                  >
                    <X className="w-4 h-4 text-rose-500" />
                    Revoke Offer
                  </button>
                </>
              )}
              
              {(node.type === 'DEPENDENCY' || node.type === 'GAP') && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-black/5 rounded-xl transition-colors text-left w-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                    Edit Requirement
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPoppedNodeId?.(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left w-full"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    Archive
                  </button>
                </>
              )}
            </motion.div>
          )}
      </motion.div>
         
      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">
          {/* Main vertical stem */}
          <div className="causal-thread-v" style={{ left: "15px", top: "-10px", bottom: "30px" }} />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch reflecting the CHILD's precise state */}
                <div className={`causal-thread-h transition-all duration-500 ${getThreadClass(child.state)}`} style={{ left: "-17px", top: "24px", width: "17px" }} />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} currentFrontierId={currentFrontierId} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
