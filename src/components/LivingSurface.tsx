import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowDown, Layers } from 'lucide-react';
import { RealityGraph, RealityObject } from '../types';
import { RealityObjectCard } from './RealityObjectCard';

interface LivingSurfaceProps {
  graph: RealityGraph;
  onAction?: (action: string, objectId: string) => void;
  focusedObjectId?: string | null;
  onFocusObject?: (objectId: string) => void;
}

export function LivingSurface({
  graph,
  onAction,
  focusedObjectId,
  onFocusObject,
}: LivingSurfaceProps) {
  // Find roots: objects that have no incoming relations
  const incomingTargetIds = new Set(
    graph.relations.filter((r) => r.visibility !== 'hidden').map((r) => r.toId)
  );

  let rootNodes = graph.objects.filter((o) => !incomingTargetIds.has(o.id));

  // Fallback: if all nodes somehow have incoming relations, fallback to WANT objects
  if (rootNodes.length === 0) {
    rootNodes = graph.objects.filter((o) => o.kind === 'WANT');
  }
  // If still empty, take first object
  if (rootNodes.length === 0 && graph.objects.length > 0) {
    rootNodes = [graph.objects[0]];
  }

  // Deduplicate roots by unique id
  const uniqueRoots = Array.from(new Map(rootNodes.map((n) => [n.id, n])).values());

  const globalVisited = new Set<string>();

  return (
    <div className="flex-1 w-full h-full relative overflow-x-auto overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Living Board Status Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-6 z-10 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Living Reality Projection
          </span>
          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            {graph.objects.length} Active Objects
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span className="hidden sm:inline">Semantic Gravity Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span>Real-time AI Synchronized</span>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 pb-36 pt-2 relative z-10">
        <AnimatePresence mode="popLayout">
          {uniqueRoots.map((want) => (
            <NodeTree
              key={want.id}
              node={want}
              graph={graph}
              onAction={onAction}
              focusedObjectId={focusedObjectId}
              onFocusObject={onFocusObject}
              level={0}
              visitedIds={globalVisited}
            />
          ))}
        </AnimatePresence>

        {/* Any orphan or additional detached nodes */}
        {(() => {
          const unrendered = graph.objects.filter((o) => !globalVisited.has(o.id));
          if (unrendered.length === 0) return null;
          return (
            <div className="w-full mt-6 pt-6 border-t border-gray-200/80 flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-4">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>Associated Reality Dependencies</span>
              </div>
              <div className="flex flex-wrap items-start justify-center gap-4 w-full">
                {unrendered.map((item) => (
                  <div key={item.id} className="min-w-[200px] max-w-[260px]">
                    <RealityObjectCard
                      node={item}
                      onAction={onAction}
                      onCardClick={onFocusObject}
                      isFocused={focusedObjectId === item.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function NodeTree({
  node,
  graph,
  onAction,
  focusedObjectId,
  onFocusObject,
  level,
  visitedIds,
}: {
  key?: React.Key;
  node: RealityObject;
  graph: RealityGraph;
  onAction?: (action: string, objectId: string) => void;
  focusedObjectId?: string | null;
  onFocusObject?: (objectId: string) => void;
  level: number;
  visitedIds: Set<string>;
}) {
  visitedIds.add(node.id);

  const outEdges = graph.relations.filter(
    (r) => r.fromId === node.id && r.visibility !== 'hidden'
  );
  const rawChildren = outEdges
    .map((e) => graph.objects.find((o) => o.id === e.toId))
    .filter(Boolean) as RealityObject[];

  // Filter out children already visited in the tree to prevent cycle / duplicate
  const children = rawChildren.filter((c) => !visitedIds.has(c.id));

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      className="flex flex-col items-center w-full"
    >
      <RealityObjectCard
        node={node}
        onAction={onAction}
        onCardClick={onFocusObject}
        isFocused={focusedObjectId === node.id}
      />

      {children.length > 0 && (
        <div className="flex flex-col items-center w-full mt-2">
          {/* Main vertical connector line */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 24 }}
            className="w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 rounded-full"
          />

          {/* Children horizontal branch container - compact and responsive */}
          <div className="flex flex-row flex-wrap sm:flex-nowrap justify-center items-start gap-3 sm:gap-5 relative w-full max-w-full px-2">
            {children.map((child, index) => {
              const edge = outEdges.find((e) => e.toId === child.id);
              const isFirst = index === 0;
              const isLast = index === children.length - 1;
              const isOnlyChild = children.length === 1;

              const strokeType = edge?.kind === 'candidate' ? 'border-dashed' : 'border-solid';
              const edgeColor =
                child.state === 'COMMITTED' || child.state === 'DONE'
                  ? 'border-emerald-400'
                  : 'border-gray-300';

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center relative flex-1 min-w-[185px] max-w-[240px]"
                >
                  {/* Branching horizontal lines */}
                  {!isOnlyChild && (
                    <div className="absolute top-0 w-full h-px hidden sm:flex items-center">
                      <div
                        className={`flex-1 h-px border-t-2 ${
                          isFirst ? 'border-transparent' : edgeColor
                        } ${strokeType}`}
                      />
                      <div
                        className={`flex-1 h-px border-t-2 ${
                          isLast ? 'border-transparent' : edgeColor
                        } ${strokeType}`}
                      />
                    </div>
                  )}

                  {/* Vertical drop line to child */}
                  {!isOnlyChild && (
                    <div
                      className={`w-0.5 h-5 border-l-2 ${edgeColor} ${strokeType} bg-transparent hidden sm:block`}
                    />
                  )}

                  {/* Semantic Edge Label Pill */}
                  {edge && edge.kind !== 'candidate' && (
                    <div className="bg-[#F5F5F7] px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-500 z-10 uppercase tracking-wider border border-gray-200 shadow-2xs mb-1">
                      {edge.kind.replace('_', ' ')}
                    </div>
                  )}

                  <NodeTree
                    node={child}
                    graph={graph}
                    onAction={onAction}
                    focusedObjectId={focusedObjectId}
                    onFocusObject={onFocusObject}
                    level={level + 1}
                    visitedIds={visitedIds}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
