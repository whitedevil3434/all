import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Star, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PersonaMemory } from '../lib/vectorMemory';
import { RealityEngine } from '../engine/core/UniversalGraphStore';
import { causalAudio } from '../lib/causalAudio';

interface ActorDiscoveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetNodeId: string | null;
  targetNodeLabel: string;
}

export function ActorDiscoveryDrawer({ isOpen, onClose, targetNodeId, targetNodeLabel }: ActorDiscoveryDrawerProps) {
  const [personas, setPersonas] = useState<PersonaMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadPersonas();
    }
  }, [isOpen]);

  const loadPersonas = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'personas'));
      const loaded: PersonaMemory[] = [];
      snap.forEach(doc => {
        const data = doc.data() as PersonaMemory;
        loaded.push(data);
      });
      setPersonas(loaded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProposeActor = (actor: PersonaMemory) => {
    causalAudio.playSettleHarmony();
    
    if (targetNodeId) {
      const newNodeId = RealityEngine.addNode({
        type: 'ACTOR',
        label: actor.name,
        state: 'OFFERED',
        data: { 
          role: actor.historicalContext,
          rating: actor.rating,
          cost: "Requires Quote", // We can add an actual field later
          personaId: actor.personaId
        }
      });
      RealityEngine.addEdge(targetNodeId, newNodeId, 'candidate');
    }
    
    onClose();
  };

  const filtered = personas.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.historicalContext.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  Actor Discovery
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Finding candidates for: <span className="font-semibold text-gray-700">{targetNodeLabel}</span>
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search capabilities, roles, names..." 
                  className="w-full bg-gray-100 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No actors found matching this requirement.
                </div>
              ) : (
                filtered.map(actor => (
                  <div key={actor.personaId} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all group bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          {actor.name}
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
                            {actor.rating}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Zap className="w-3 h-3" />
                            Active
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleProposeActor(actor)}
                        className="text-xs font-bold bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Propose
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      {actor.historicalContext}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                      <span>Last: {actor.activeState.lastTransaction}</span>
                      <span>Due: {actor.activeState.pendingDue}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
