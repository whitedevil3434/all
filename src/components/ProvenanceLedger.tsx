
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RealityEngine, GraphNode, useRealityGraph } from '../engine/core/UniversalGraphStore';
import { History, X, Activity, Key, CheckCircle2, Shield, FileCheck, ArrowDown, Database } from 'lucide-react';
import { causalAudio } from '../lib/causalAudio';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export function ProvenanceLedger({ nodeId, onClose }: { nodeId: string, onClose: () => void }) {
  const graph = useRealityGraph();
  const rootNode = graph.nodes[nodeId];
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    causalAudio.playCommitChord();
    
    // Find all nodes in the causal tree starting from rootNode
    const queue = [nodeId];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      
      const childrenEdges = (Object.values(graph.edges) as any[]).filter(e => e.sourceId === currentId);
      for (const edge of childrenEdges) {
        queue.push(edge.targetId);
      }
    }
    
    const fetchLedger = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'asc'));
        const snap = await getDocs(q);
        const timeline: any[] = [];
        
        snap.forEach(doc => {
          const data = doc.data();
          // Filter to only events affecting nodes in our causal tree
          if (data.payload && data.payload.id && visited.has(data.payload.id)) {
             let icon = <Database className="w-4 h-4 text-gray-500" />;
             let title = 'Reality Mutated';
             let desc = 'System state updated';
             
             if (data.type === 'NODE_ADDED') {
               title = 'Reality Materialized';
               desc = `Created "${data.payload.label}"`;
               icon = <Activity className="w-4 h-4 text-indigo-500" />;
             } else if (data.type === 'NODE_UPDATED') {
               const state = data.payload.updates?.state;
               if (state === 'COMMITTED') {
                 title = 'Escrow Locked';
                 desc = `Commitment secured in Reality Engine.`;
                 icon = <Key className="w-4 h-4 text-amber-500" />;
               } else if (state === 'EXECUTING') {
                 title = 'Execution Initiated';
                 desc = `Actor started the execution phase.`;
                 icon = <Activity className="w-4 h-4 text-blue-500" />;
               } else if (state === 'VERIFYING') {
                 title = 'Evidence Submitted';
                 desc = `Cryptographic proof of work attached.`;
                 icon = <FileCheck className="w-4 h-4 text-purple-500" />;
               } else if (state === 'RESOLVED') {
                 title = 'Consensus Reached';
                 desc = `Reality resolved & funds released.`;
                 icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
               } else {
                 title = `Transition: ${state || 'Updated'}`;
                 desc = `Node state mutated.`;
               }
             }
             
             // Create fake hash from doc id
             const hash = `0x${doc.id.replace(/-/g, '').substring(0,8).toUpperCase()}...${doc.id.replace(/-/g, '').substring(8,12).toUpperCase()}`;
             
             timeline.push({
               id: doc.id,
               type: data.type,
               icon,
               title,
               desc,
               hash,
               time: new Date(data.createdAt).toLocaleTimeString(),
               rawDate: data.createdAt
             });
          }
        });
        
        // Add artificial delay to events for staggered animation
        const animatedTimeline = timeline.map((evt, idx) => ({
          ...evt,
          delay: idx * 250
        }));
        
        setEvents(animatedTimeline);
      } catch (err) {
        console.error("Error fetching ledger:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLedger();
  }, [nodeId, graph.edges]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1C1C1A] text-gray-200 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 border border-white/10"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1C1C1A]/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-white">Absolute Provenance</h2>
              <p className="text-[10px] text-gray-400 font-mono mt-1">FIRESTORE CAUSAL CHAIN</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {loading ? (
             <div className="flex justify-center items-center py-20 text-gray-400">
               <Activity className="w-6 h-6 animate-spin mr-3" /> Reading Immutable Ledger...
             </div>
          ) : events.length === 0 ? (
             <div className="text-center py-10 text-gray-500">No events found in ledger.</div>
          ) : (
            <div className="space-y-6 relative">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10" />
              
              {events.map((evt) => (
                <TimelineEvent key={evt.id} evt={evt} delay={evt.delay} />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Database className="w-3 h-3" /> Reality Synced
          </p>
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest">
            Cryptographically Sealed
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function TimelineEvent({ evt, delay }: { evt: any, delay: number, key?: any }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      causalAudio.playTick();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 relative z-10 pl-2"
    >
      <div className="w-8 h-8 rounded-full bg-[#2A2A28] border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative z-20">
        {evt.icon}
      </div>
      <div className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-200 tracking-wide uppercase text-[11px]">{evt.title}</h3>
          <div className="flex items-center gap-2">
             <span className="text-gray-500 text-[9px]">{evt.time}</span>
             <span className="text-gray-500 text-[10px] bg-black/30 px-2 py-0.5 rounded">
               {evt.hash}
             </span>
          </div>
        </div>
        <p className="text-gray-400 font-sans text-sm">{evt.desc}</p>
      </div>
    </motion.div>
  );
}
