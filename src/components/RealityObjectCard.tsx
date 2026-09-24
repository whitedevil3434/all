import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  User,
  AlertCircle,
  Activity,
  Check,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Search,
  MessageSquare,
  X,
  Layers,
  HelpCircle,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { RealityObject, EpistemicState } from '../types';

interface RealityObjectCardProps {
  node: RealityObject;
  onAction?: (actionName: string, objectId: string) => void;
  onCardClick?: (objectId: string) => void;
  isFocused?: boolean;
  isCompact?: boolean;
}

export function RealityObjectCard({
  node,
  onAction,
  onCardClick,
  isFocused = false,
  isCompact = false,
}: RealityObjectCardProps) {
  const getEpistemicVisuals = (state: EpistemicState) => {
    switch (state) {
      case 'UNKNOWN':
        return {
          border: 'border-dashed border-gray-300',
          bg: 'bg-white',
          text: 'text-gray-600',
          pillBg: 'bg-gray-100 text-gray-700',
          glow: '',
        };
      case 'POSSIBLE':
        return {
          border: 'border-blue-200',
          bg: 'bg-gradient-to-b from-white to-blue-50/40',
          text: 'text-blue-800',
          pillBg: 'bg-blue-100 text-blue-800',
          glow: 'shadow-[0_4px_16px_rgba(59,130,246,0.1)]',
        };
      case 'OFFERED':
        return {
          border: 'border-amber-200',
          bg: 'bg-gradient-to-b from-white to-amber-50/50',
          text: 'text-amber-800',
          pillBg: 'bg-amber-100 text-amber-800',
          glow: 'shadow-[0_4px_16px_rgba(245,158,11,0.12)]',
        };
      case 'COMMITTED':
        return {
          border: 'border-emerald-300',
          bg: 'bg-gradient-to-b from-emerald-50/60 to-emerald-100/30',
          text: 'text-emerald-900',
          pillBg: 'bg-emerald-100 text-emerald-800 font-bold',
          glow: 'shadow-[0_4px_16px_rgba(16,185,129,0.15)] ring-1 ring-emerald-300',
        };
      case 'ASKING':
        return {
          border: 'border-indigo-300',
          bg: 'bg-indigo-50/60',
          text: 'text-indigo-800',
          pillBg: 'bg-indigo-100 text-indigo-800 font-bold',
          glow: 'shadow-[0_4px_20px_rgba(99,102,241,0.18)] ring-2 ring-indigo-200',
        };
      case 'EXECUTING':
        return {
          border: 'border-orange-300',
          bg: 'bg-orange-50',
          text: 'text-orange-900',
          pillBg: 'bg-orange-100 text-orange-800',
          glow: 'shadow-[0_4px_16px_rgba(249,115,22,0.15)]',
        };
      case 'PROVEN':
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-50',
          text: 'text-emerald-900',
          pillBg: 'bg-emerald-200 text-emerald-900',
          glow: 'shadow-[0_4px_20px_rgba(16,185,129,0.2)]',
        };
      case 'DONE':
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          pillBg: 'bg-gray-200 text-gray-700',
          glow: 'shadow-sm',
        };
      case 'BLOCKED':
        return {
          border: 'border-rose-300',
          bg: 'bg-rose-50',
          text: 'text-rose-900',
          pillBg: 'bg-rose-100 text-rose-800',
          glow: 'shadow-[0_4px_16px_rgba(244,63,94,0.15)] ring-2 ring-rose-200',
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-white',
          text: 'text-gray-800',
          pillBg: 'bg-gray-100 text-gray-700',
          glow: 'shadow-sm',
        };
    }
  };

  const visuals = getEpistemicVisuals(node.state);

  const getShortcutIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('find') || act.includes('search')) return <Search className="w-3 h-3 text-blue-600" />;
    if (act.includes('ask')) return <MessageSquare className="w-3 h-3 text-indigo-600" />;
    if (act.includes('accept')) return <Check className="w-3 h-3 text-emerald-600" />;
    if (act.includes('decline') || act.includes('reject')) return <X className="w-3 h-3 text-rose-500" />;
    if (act.includes('assign') || act.includes('driver')) return <UserCheck className="w-3 h-3 text-purple-600" />;
    if (act.includes('breakdown')) return <Layers className="w-3 h-3 text-amber-600" />;
    if (act.includes('why')) return <HelpCircle className="w-3 h-3 text-gray-600" />;
    return <Activity className="w-3 h-3 text-indigo-500" />;
  };

  const attention = node.attentionScore ?? 50;
  const isDimmed = !isCompact && attention < 40;

  return (
    <motion.div
      id={`reality-node-${node.id}`}
      layout="position"
      onClick={() => onCardClick?.(node.id)}
      className={`relative flex flex-col items-center w-full transition-all duration-300 ${
        isCompact ? 'max-w-full' : 'max-w-[230px] sm:max-w-[250px]'
      }`}
      animate={{
        opacity: isDimmed ? 0.6 : 1,
        scale: isFocused ? 1.03 : 1,
      }}
      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
    >
      {/* AI Semantic Cursor (✦) */}
      <AnimatePresence>
        {!isCompact && node.aiTransientMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -4 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 z-30 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-indigo-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="text-[11px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {node.aiTransientMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Node Card Body */}
      <div
        className={`w-full rounded-2xl border flex flex-col transition-all duration-300 relative overflow-hidden text-left cursor-pointer select-none ${
          isCompact ? 'p-3 gap-2' : 'p-3.5 sm:p-4 gap-2.5'
        } ${visuals.border} ${visuals.bg} ${visuals.glow} ${
          isFocused
            ? 'ring-3 ring-indigo-500 ring-offset-2 ring-offset-[#F5F5F7] border-indigo-400 shadow-lg'
            : 'hover:border-indigo-300 hover:shadow-md'
        }`}
      >
        {/* Top Header: Kind + State Pill */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                node.kind === 'GAP'
                  ? 'bg-rose-500 animate-pulse'
                  : node.kind === 'ACTOR'
                  ? 'bg-blue-500'
                  : node.kind === 'WANT'
                  ? 'bg-indigo-600'
                  : 'bg-amber-500'
              }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">
              {node.kind}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {node.state !== 'UNKNOWN' && (
              <span
                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-1 ${visuals.pillBg}`}
              >
                {node.state === 'COMMITTED' || node.state === 'DONE' ? (
                  <Check className="w-2.5 h-2.5" />
                ) : node.state === 'ASKING' ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : node.state === 'BLOCKED' ? (
                  <AlertTriangle className="w-2.5 h-2.5" />
                ) : null}
                {node.state}
              </span>
            )}

            <div className="p-1 bg-white shadow-xs border border-gray-100 rounded-md text-gray-500 shrink-0">
              {node.kind === 'ACTOR' ? (
                <User className="w-3 h-3" />
              ) : node.kind === 'GAP' ? (
                <AlertCircle className="w-3 h-3 text-rose-500" />
              ) : (
                <Activity className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>

        {/* Center: Title & Quantity */}
        <div className="flex flex-col">
          <span
            className={`text-[14px] sm:text-[15px] font-extrabold tracking-tight leading-snug line-clamp-1 ${
              visuals.text
            } ${isDimmed ? 'text-gray-500' : ''}`}
          >
            {node.title}
          </span>
          {node.subtitle && (
            <span className="text-[11px] font-medium text-gray-500 mt-0.5 line-clamp-1">
              {node.subtitle}
            </span>
          )}
        </div>

        {/* Numeric Quantity Hero Banner */}
        {node.quantity !== undefined && (
          <div className="flex items-baseline gap-1 py-0.5">
            <span className="font-mono text-2xl font-black text-gray-950 tracking-tight">
              {node.quantity}
            </span>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {node.unit}
            </span>
          </div>
        )}

        {/* Provenance Footer */}
        {node.provenance && (
          <div className="text-[9px] font-medium text-gray-400 flex items-center justify-between pt-1 border-t border-black/5">
            <span>Source:</span>
            <span className="text-gray-600 font-semibold truncate max-w-[120px]">
              {node.provenance.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Contextual Action Shortcuts (iOS Style Action Runner) */}
        {node.availableActions && node.availableActions.length > 0 && !isDimmed && (
          <div className="flex gap-1.5 mt-1 pt-1.5 border-t border-black/5 flex-wrap">
            {node.availableActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.(action, node.id);
                }}
                className="flex-1 min-w-[55px] bg-white hover:bg-indigo-50 border border-gray-200/80 hover:border-indigo-300 text-gray-800 hover:text-indigo-700 text-[10px] font-bold py-1 px-2 rounded-lg transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                {getShortcutIcon(action)}
                <span className="truncate">{action}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
