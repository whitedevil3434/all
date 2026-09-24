import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Eye,
  ArrowRight,
  User,
  Activity,
  RotateCcw,
  Sparkles,
  X,
  FileCheck,
} from 'lucide-react';
import { causalAudio } from '../lib/causalAudio';

interface DesktopExecutionSurfaceProps {
  onBackToLivingSurface?: () => void;
}

interface NodeData {
  id: string;
  name: string;
  role: string;
  category: 'HUMAN' | 'AI_AGENT' | 'SYSTEM' | 'OUTCOME';
  status: 'VERIFIED' | 'IN_PROGRESS' | 'ACTIVE' | 'SUCCESS';
  statusLabel: string;
  avatarText: string;
  avatarBg: string;
  proof: {
    label: string;
    verifiedBy: string;
    time: string;
  };
  details: string;
}

export function DesktopExecutionSurface({ onBackToLivingSurface }: DesktopExecutionSurfaceProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-alex');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('Coordinate a cross-team product launch');
  const [proofLogModal, setProofLogModal] = useState<NodeData | null>(null);

  // Execution Flow Nodes State
  const [nodes, setNodes] = useState<NodeData[]>([
    {
      id: 'node-maya',
      name: 'Maya Patel',
      role: 'Coordinator',
      category: 'HUMAN',
      status: 'VERIFIED',
      statusLabel: 'Coordinated',
      avatarText: 'MP',
      avatarBg: 'bg-blue-100 text-blue-800',
      proof: {
        label: 'Launch Brief Verified',
        verifiedBy: 'System Hash 0x9f..2a',
        time: '09:30 AM',
      },
      details: 'Defined launch objectives, stakeholder sign-offs, and critical path timeline.',
    },
    {
      id: 'node-alex',
      name: 'Alex Chen',
      role: 'Executor',
      category: 'HUMAN',
      status: 'IN_PROGRESS',
      statusLabel: 'In Progress',
      avatarText: 'AC',
      avatarBg: 'bg-blue-600 text-white',
      proof: {
        label: 'Awaiting Code Freeze Signoff',
        verifiedBy: 'Pending Verifier',
        time: 'Active Now',
      },
      details: 'Implementing release candidate deployment to staging and production rollout scripts.',
    },
    {
      id: 'node-agent',
      name: 'Launch AI Agent',
      role: 'Service',
      category: 'AI_AGENT',
      status: 'ACTIVE',
      statusLabel: 'Ready to Execute',
      avatarText: '✦',
      avatarBg: 'bg-indigo-100 text-indigo-700',
      proof: {
        label: 'Synthesized Verification Matrix',
        verifiedBy: 'Model Gemini 2.5',
        time: '10:15 AM',
      },
      details: 'Autonomous verification agent tracking telemetry, error budgets, and load testing latency.',
    },
    {
      id: 'node-priya',
      name: 'Priya Shah',
      role: 'Verifier',
      category: 'HUMAN',
      status: 'VERIFIED',
      statusLabel: 'Verified',
      avatarText: 'PS',
      avatarBg: 'bg-purple-100 text-purple-700',
      proof: {
        label: 'QA Signoff Verified',
        verifiedBy: 'Certified QA Lead',
        time: '11:00 AM',
      },
      details: 'Executed end-to-end regression tests and verified zero P0/P1 blockers on production build.',
    },
    {
      id: 'node-sync',
      name: 'Data Sync Service',
      role: 'Service',
      category: 'SYSTEM',
      status: 'ACTIVE',
      statusLabel: 'Syncing',
      avatarText: 'DS',
      avatarBg: 'bg-amber-100 text-amber-800',
      proof: {
        label: 'Database Schema Migration 042',
        verifiedBy: 'Cloud SQL Migration Engine',
        time: '11:20 AM',
      },
      details: 'Replicating transactional states across read replicas with sub-second replication lag.',
    },
    {
      id: 'node-outcome',
      name: 'Outcome Successful',
      role: 'Outcome',
      category: 'OUTCOME',
      status: 'SUCCESS',
      statusLabel: 'Successful',
      avatarText: '✓',
      avatarBg: 'bg-emerald-600 text-white',
      proof: {
        label: 'All Signoffs Committed',
        verifiedBy: 'Consensus Proof Protocol',
        time: '11:45 AM',
      },
      details: 'Product launch successfully completed across all global edge zones.',
    },
  ]);

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  const handleAdvanceNode = (nodeId: string) => {
    causalAudio.playCommitChord();
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          if (node.id === 'node-alex') {
            return {
              ...node,
              status: 'VERIFIED',
              statusLabel: 'Code Frozen',
              proof: {
                label: 'Code Freeze Signed by Alex Chen',
                verifiedBy: 'GPG Key 0x4bc1..e90',
                time: 'Just now',
              },
            };
          }
          if (node.id === 'node-agent') {
            return {
              ...node,
              status: 'VERIFIED',
              statusLabel: 'Telemetry Verified',
              proof: {
                label: 'Zero Error Budget Violations',
                verifiedBy: 'Continuous Agent Verifier',
                time: 'Just now',
              },
            };
          }
        }
        return node;
      })
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] text-[#1E293B] flex flex-col font-sans antialiased select-none">
      {/* Top Protocol Header */}
      <header className="w-full px-6 py-3.5 bg-white border-b border-gray-200/80 flex items-center justify-between shadow-2xs">
        {/* Left: Clink Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-[0.25em] text-gray-900 uppercase">
              Clink
            </span>
            <span className="hidden md:inline-block text-[11px] text-gray-400 font-normal">
              Universal Execution Coordination Protocol
            </span>
          </div>

          {/* Quick back to Living Causal Surface */}
          {onBackToLivingSurface && (
            <button
              onClick={() => {
                causalAudio.playTick();
                onBackToLivingSurface();
              }}
              className="ml-3 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              ← Living Surface
            </button>
          )}
        </div>

        {/* Center: Search / Causal Goal Input */}
        <div className="flex-1 max-w-md mx-6 hidden sm:flex items-center gap-2 bg-[#F6F7F9] border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-700">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-gray-800 placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Right: Status Pill & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Execution Active</span>
          </div>

          <button
            onClick={() => {
              causalAudio.playTick();
              setFocusMode(!focusMode);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              focusMode
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Focus Mode</span>
          </button>
        </div>
      </header>

      {/* Subheader: Canvas Label & Decomposition Steps */}
      <div className="px-8 py-4 bg-white/60 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-tight">
            Execution Surface
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Visualizing actors, dependencies, and proof across the execution path.
          </p>
        </div>

        {/* 5-Step Decomposition Rail */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-500">Decomposition:</span>
          {['Capability', 'Responsibility', 'Execution', 'Proof', 'Outcome'].map((step, idx) => (
            <div key={step} className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                  idx <= 2
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {step}
              </span>
              {idx < 4 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Execution Canvas (Horizontal Spatial Topology) */}
      <main className="flex-1 p-6 md:p-8 overflow-x-auto flex flex-col justify-between">
        {/* The Node Sequence Flow */}
        <div className="w-full flex items-center justify-start gap-4 min-w-[960px] py-8">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <motion.div
                  layout
                  onClick={() => {
                    causalAudio.playTick();
                    setSelectedNodeId(node.id);
                  }}
                  className={`w-52 bg-white rounded-2xl p-4 border transition-all cursor-pointer select-none relative ${
                    isSelected
                      ? 'border-blue-600 shadow-[0_8px_30px_rgba(37,99,235,0.12)] ring-2 ring-blue-500/20'
                      : 'border-gray-200/90 shadow-2xs hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top: Avatar & Role */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${node.avatarBg}`}
                    >
                      {node.avatarText}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-gray-900 block truncate">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-gray-500 block truncate">
                        {node.role}
                      </span>
                    </div>
                  </div>

                  {/* Status & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        node.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : node.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : node.status === 'VERIFIED'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {node.statusLabel}
                    </span>
                    <span className="text-[9px] font-semibold text-gray-400">
                      Step {index + 1}
                    </span>
                  </div>

                  {/* Proof Signoff Badge */}
                  <div className="bg-[#F8F9FA] rounded-xl p-2 border border-gray-100 flex items-start gap-1.5 mt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-gray-800 block truncate leading-tight">
                        {node.proof.label}
                      </span>
                      <span className="text-[8px] text-gray-400 block truncate">
                        {node.proof.time}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Connector Arrow between Nodes */}
                {index < nodes.length - 1 && (
                  <div className="flex items-center shrink-0 px-1">
                    <div className="w-6 h-[2px] bg-gray-300 relative flex items-center justify-end">
                      <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-gray-400 rotate-45" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Inspection Panel for Selected Node */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start justify-between gap-6 mt-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {activeNode.role} Scope
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-semibold text-gray-700">{activeNode.name}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-1">
                {activeNode.details}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Proof authority: {activeNode.proof.verifiedBy}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {activeNode.id === 'node-alex' && activeNode.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleAdvanceNode('node-alex')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Sign Code Freeze</span>
                </button>
              )}

              {activeNode.id === 'node-agent' && activeNode.status === 'ACTIVE' && (
                <button
                  onClick={() => handleAdvanceNode('node-agent')}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Verification</span>
                </button>
              )}

              <button
                onClick={() => {
                  causalAudio.playTick();
                  setProofLogModal(activeNode);
                }}
                className="px-3.5 py-1.5 bg-[#1E293B] hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Inspect Proof Log
              </button>

              <button
                onClick={() => {
                  causalAudio.playTick();
                  if (onBackToLivingSurface) onBackToLivingSurface();
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Switch to Living Surface
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Proof Log Modal (Zero alert()) */}
      <AnimatePresence>
        {proofLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm text-gray-900">
                    Proof Log: {proofLogModal.name}
                  </span>
                </div>
                <button
                  onClick={() => setProofLogModal(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-4 flex flex-col gap-3 text-xs text-gray-600">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Signoff Label:</span>
                    <span className="font-bold text-gray-900">{proofLogModal.proof.label}</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Verified By:</span>
                    <span className="font-mono text-gray-900">{proofLogModal.proof.verifiedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Timestamp:</span>
                    <span className="font-mono text-gray-700">{proofLogModal.proof.time}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-xs leading-relaxed">
                  {proofLogModal.details}
                </p>
              </div>

              <button
                onClick={() => setProofLogModal(null)}
                className="w-full py-2.5 bg-[#1C1C1A] text-white hover:bg-black rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
