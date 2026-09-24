const fs = require('fs');

const code = `
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Check, Play, ShieldCheck, Loader2, User, AlertCircle, AlertTriangle, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { RealityObject, RealityGraph, EpistemicState } from '../types';
import { cn } from '../lib/utils';

interface LivingSurfaceProps {
  graph: RealityGraph;
  onAction?: (action: string, objectId: string) => void;
}

export function LivingSurface({ graph, onAction }: LivingSurfaceProps) {
  // Find roots (WANT or objects with no incoming relations)
  const wantNodes = graph.objects.filter(o => o.kind === 'WANT' || o.kind === 'DEPENDENCY');

  return (
    <div className="flex-1 w-full h-full bg-[#F5F5F7] relative overflow-x-hidden overflow-y-auto p-4 sm:p-12 flex flex-col items-center">
      {/* Subtle Dot Grid Background for Spatial Feel */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-12 pb-40 pt-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {wantNodes.map(want => (
            <NodeTree key={want.id} node={want} graph={graph} onAction={onAction} level={0} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NodeTree({ node, graph, onAction, level }: { key?: React.Key, node: RealityObject, graph: RealityGraph, onAction?: any, level: number }) {
  const outEdges = graph.relations.filter(r => r.fromId === node.id && r.visibility !== 'hidden');
  const children = outEdges.map(e => graph.objects.find(o => o.id === e.toId)).filter(Boolean) as RealityObject[];

  return (
    <motion.div 
      layout="position"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      className="flex flex-col items-center w-full"
    >
      <RealityNodeCard node={node} onAction={onAction} />
      
      {children.length > 0 && (
        <div className="flex flex-col items-center w-full mt-4">
          {/* Main vertical connector dropping down */}
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 32 }} 
            className="w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 rounded-full" 
          />
          
          <div className="flex flex-row justify-center items-start gap-8 relative w-full">
            {children.map((child, index) => {
              const edge = outEdges.find(e => e.toId === child.id);
              const isFirst = index === 0;
              const isLast = index === children.length - 1;
              const isOnlyChild = children.length === 1;
              
              let strokeType = edge?.kind === 'candidate' ? "dashed" : "solid";
              let edgeColor = child.state === 'COMMITTED' || child.state === 'DONE' ? "border-green-400" : "border-gray-300";

              return (
                <div key={child.id} className="flex flex-col items-center relative flex-1 min-w-[280px] max-w-[340px]">
                  
                  {/* Branching horizontal lines */}
                  {!isOnlyChild && (
                    <div className="absolute top-0 w-full h-px flex items-center"> 
                       <div className={cn("flex-1 h-px border-t-2", isFirst ? "border-transparent" : edgeColor, strokeType === 'dashed' && !isFirst ? 'border-dashed' : '')} />
                       <div className={cn("flex-1 h-px border-t-2", isLast ? "border-transparent" : edgeColor, strokeType === 'dashed' && !isLast ? 'border-dashed' : '')} />
                    </div>
                  )}
                  
                  {/* Vertical drop to child */}
                  {!isOnlyChild && (
                    <div className={cn("w-0.5 h-8 border-l-2", edgeColor, strokeType === 'dashed' ? 'border-dashed bg-transparent' : 'border-solid bg-transparent')} />
                  )}

                  {/* Semantic Edge Label */}
                  {edge && edge.kind !== 'candidate' && (
                     <div className="absolute top-3 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-400 z-10 uppercase tracking-widest border border-gray-200 shadow-sm translate-y-2">
                       {edge.kind.replace('_', ' ')}
                     </div>
                  )}

                  <NodeTree node={child} graph={graph} onAction={onAction} level={level + 1} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function RealityNodeCard({ node, onAction }: { node: RealityObject; onAction?: (action: string, objectId: string) => void }) {
  const getEpistemicVisuals = (state: EpistemicState) => {
    switch (state) {
      case 'UNKNOWN': return { border: 'border-dashed border-gray-300', bg: 'bg-white', text: 'text-gray-500', glow: '' };
      case 'POSSIBLE': return { border: 'border-blue-200', bg: 'bg-gradient-to-b from-white to-blue-50/30', text: 'text-blue-700', glow: 'shadow-[0_8px_30px_rgba(59,130,246,0.12)]' };
      case 'OFFERED': return { border: 'border-orange-200', bg: 'bg-gradient-to-b from-white to-orange-50/50', text: 'text-orange-700', glow: 'shadow-[0_8px_30px_rgba(249,115,22,0.12)]' };
      case 'COMMITTED': return { border: 'border-green-200', bg: 'bg-gradient-to-b from-green-50/50 to-green-100/30', text: 'text-green-800', glow: 'shadow-[0_8px_30px_rgba(34,197,94,0.15)]' };
      case 'ASKING': return { border: 'border-indigo-300', bg: 'bg-indigo-50/50', text: 'text-indigo-700', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-2 ring-indigo-200' };
      case 'DOING': return { border: 'border-orange-400', bg: 'bg-orange-50', text: 'text-orange-800', glow: 'shadow-[0_8px_30px_rgba(249,115,22,0.2)]' };
      case 'PROVEN': return { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-900', glow: 'shadow-[0_8px_30px_rgba(34,197,94,0.3)]' };
      case 'DONE': return { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-600', glow: 'shadow-sm' };
      case 'BLOCKED': return { border: 'border-red-400', bg: 'bg-red-50', text: 'text-red-700', glow: 'shadow-[0_8px_30px_rgba(239,68,68,0.2)] ring-2 ring-red-100' };
      default: return { border: 'border-gray-200', bg: 'bg-white', text: 'text-gray-800', glow: 'shadow-[0_8px_30px_rgba(0,0,0,0.04)]' };
    }
  };

  const visuals = getEpistemicVisuals(node.state);
  
  const attention = node.attentionScore ?? 50;
  const isDimmed = attention < 40;
  const isFocused = attention > 80;

  return (
    <motion.div
      layout
      className="relative flex flex-col items-center w-full max-w-[320px]"
      animate={{ opacity: isDimmed ? 0.5 : 1, scale: isDimmed ? 0.9 : (isFocused ? 1.02 : 1) }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
    >
      {/* AI Semantic Cursor (✦) */}
      <AnimatePresence>
        {node.aiTransientMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 z-30 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-indigo-100"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {node.aiTransientMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Node Card */}
      <div 
        className={cn(
          "w-full rounded-[24px] border p-5 flex flex-col gap-3 transition-all duration-500 relative overflow-hidden",
          visuals.border,
          visuals.bg,
          visuals.glow,
          isFocused && node.state !== 'DONE' && node.state !== 'COMMITTED' ? "ring-4 ring-indigo-500/20 border-indigo-400" : ""
        )}
      >
        {/* Top Header: Kind + Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", 
              node.kind === 'GAP' ? "bg-red-500" : 
              node.kind === 'ACTOR' ? "bg-blue-500" : 
              node.kind === 'WANT' ? "bg-indigo-500" : "bg-gray-400"
            )} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{node.kind}</span>
          </div>
          <div className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-gray-600">
            {node.kind === 'ACTOR' ? <User className="w-4 h-4" /> : 
             node.kind === 'GAP' ? <AlertCircle className="w-4 h-4 text-red-500" /> : 
             <Activity className="w-4 h-4" />}
          </div>
        </div>

        {/* Center: Title & Quantity */}
        <div className="flex flex-col mt-1">
          <span className={cn("text-[18px] font-extrabold tracking-tight leading-tight", visuals.text, isDimmed ? "text-gray-500" : "")}>
            {node.title}
          </span>
          {node.subtitle && (
            <span className="text-[13px] font-medium text-gray-500 mt-0.5">{node.subtitle}</span>
          )}
        </div>

        {node.quantity !== undefined && (
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-3xl font-black text-gray-900 tracking-tighter">{node.quantity}</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">{node.unit}</span>
          </div>
        )}

        {/* Bottom Metadata: State & Provenance */}
        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-black/5">
          {node.state !== 'UNKNOWN' && (
            <div className={cn("flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest", visuals.text)}>
              {node.state === 'COMMITTED' || node.state === 'DONE' ? <Check className="w-4 h-4" /> :
               node.state === 'ASKING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
               node.state === 'BLOCKED' ? <AlertTriangle className="w-4 h-4" /> :
               <ChevronRight className="w-4 h-4" />}
              {node.state}
            </div>
          )}

          {node.provenance && (
            <div className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
              Source: <span className="text-gray-600 font-semibold">{node.provenance.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Contextual Actions (iOS Shortcuts Style) */}
        <AnimatePresence>
          {node.availableActions && node.availableActions.length > 0 && !isDimmed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 mt-3 flex-wrap"
            >
              {node.availableActions.map(action => (
                <button
                  key={action}
                  onClick={() => onAction?.(action, node.id)}
                  className="flex-1 min-w-[70px] bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 text-[11px] font-bold uppercase py-2.5 px-3 rounded-[12px] transition-all shadow-sm active:scale-95 flex items-center justify-center"
                >
                  {action}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
`

fs.writeFileSync('src/components/LivingSurface.tsx', code);
