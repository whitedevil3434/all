import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  LayoutGrid,
  CheckSquare,
  CreditCard,
  MessageSquare,
  Folder,
  Briefcase,
  Users,
  DollarSign,
  Layers,
  Sparkles,
  Search,
  Bell,
  Share2,
  MoreHorizontal,
  X,
  Plus,
  Minus,
  Maximize2,
  Compass,
  MapPin,
  Truck,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Send,
  Paperclip,
  Mic,
  Smile,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  AlertCircle,
  ExternalLink,
  FileText,
  RotateCcw,
  Phone,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { PARTICIPANTS } from '../data/clinkData';
import { useCausalState } from '../engine/causalStore';
import { DocumentViewerModal, OperationalDocument } from './DocumentViewerModal';
import { CreateRealityModal } from './CreateRealityModal';
import { SupplyChainWorkspace } from './Workspaces/SupplyChainWorkspace';
import { FinanceWorkspace } from './Workspaces/FinanceWorkspace';
import { HRWorkspace } from './Workspaces/HRWorkspace';
import { ProjectsWorkspace } from './Workspaces/ProjectsWorkspace';
import { LivingSurface } from './LivingSurface';

interface DesktopWorkspaceProps {
  onSwitchToMobile?: () => void;
  onSelectMobileScreen?: (screenNumber: number) => void;
}

export function DesktopWorkspace({ onSwitchToMobile, onSelectMobileScreen }: DesktopWorkspaceProps) {
  const {
    state,
    setSelectedNode,
    setActiveTab,
    setActiveWorkspace,
    setSearchQuery,
    showToast,
    askKarim,
    acceptKarim,
    declineKarim,
    assignDriver,
    confirmDelivery,
    processPayment,
    sendChatMessage,
    applyScenario,
    resetAll,
    createOperation,
    switchOperation,
    downloadDocument,
    dispatchSemanticAction,
    handleCardAction,
  } = useCausalState();

  const [canvasViewMode, setCanvasViewMode] = useState<'living' | 'pipeline'>('living');
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'history' | 'actions' | 'related'>('overview');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isAiCardCollapsed, setIsAiCardCollapsed] = useState<boolean>(false);
  const [isFocusCardCollapsed, setIsFocusCardCollapsed] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatOpen, setChatOpen] = useState<boolean>(true);
  const [timelineFilter, setTimelineFilter] = useState<'today' | '7days' | 'all'>('today');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [activeViewerDoc, setActiveViewerDoc] = useState<OperationalDocument | null>(null);
  const [isOpMenuOpen, setIsOpMenuOpen] = useState<boolean>(false);
  const [notesText, setNotesText] = useState<string>(
    '# চাল সরবরাহ সংক্রান্ত নোটস (Rice Delivery Operations)\n\n- রহিম ভাই ৩০ কেজি চাল রেডি করেছেন। বস্তা সাইজ: ১৫ কেজি x ২।\n- করিম ভাই মিরপুর মিল নং ৪ থেকে ২০ কেজি চালের নিশ্চয়তা দিয়েছেন।\n- পিকআপের জন্য কাভার্ড ভ্যান প্রয়োজন। ড্রাইভার তারিক উপলব্ধ।\n- ডেলিভারি লোকেশন: গুলশান ২, প্রধান অফিস সিকিউরিটি গেট।'
  );

  const selectedNodeId = state.selectedNodeId;

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  const isKarimCommitted = state.actors.karim.status === 'COMMITTED';
  const isKarimDeclined = state.actors.karim.status === 'DECLINED';
  const isKarimOffered = state.actors.karim.status === 'OFFERED';
  const isKarimAsking = state.actors.karim.status === 'ASKING';

  const isTransportScheduled = state.dependencies.transport.status === 'SCHEDULED';
  const isTransportBlocked = state.dependencies.transport.status === 'BLOCKED';

  const isDeliveryCompleted = state.dependencies.delivery.status === 'DELIVERED';
  const isPaymentPaid = state.dependencies.payment.status === 'PAID';

  const isSearchActive = !!state.searchQuery.trim();
  const searchNormalized = state.searchQuery.toLowerCase().trim();
  const nodeMatches = (keywords: string[]) => {
    if (!isSearchActive) return true;
    return keywords.some((k) => k.toLowerCase().includes(searchNormalized));
  };

  const isWantMatch = nodeMatches(['want', 'rice', '50kg', 'office', state.want.title, state.want.target]);
  const isRahimMatch = nodeMatches(['rahim', 'farmer', '30kg', '3600', 'rice', 'ready', 'committed']);
  const isKarimMatch = nodeMatches(['karim', 'mill', '20kg', '2400', 'rice', 'offer', 'commitment']);
  const isMinaMatch = nodeMatches(['mina', 'backup', '15kg', 'candidate', 'sourcing', 'possible']);
  const isCoverageMatch = nodeMatches(['coverage', '50kg', 'requirement', 'covered']);
  const isTransportMatch = nodeMatches(['transport', 'driver', 'tariq', 'belal', 'van', 'vehicle', '800']);
  const isDeliveryMatch = nodeMatches(['delivery', 'office', 'gulshan', 'received', '6:00']);
  const isProofMatch = nodeMatches(['proof', 'slip', 'weighbridge', 'photo', 'challan']);
  const isPaymentMatch = nodeMatches(['payment', 'bkash', '12500', 'taka', 'escrow', 'paid']);

  const totalMatchingNodes = [
    isWantMatch, isRahimMatch, isKarimMatch, isMinaMatch,
    isCoverageMatch, isTransportMatch, isDeliveryMatch, isProofMatch, isPaymentMatch
  ].filter(Boolean).length;

  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);

  const attentionTarget = useMemo(() => {
    if (state.aiTransient.active) {
      const text = (state.aiTransient.text || '').toLowerCase();
      if (text.includes('karim') || text.includes('20kg') || text.includes('mill') || isKarimAsking) return 'karim';
      if (text.includes('transport') || text.includes('driver') || text.includes('tariq') || text.includes('van')) return 'transport';
      if (text.includes('payment') || text.includes('bkash') || text.includes('12,500') || text.includes('settle') || text.includes('pay')) return 'payment';
      if (text.includes('delivery') || text.includes('received') || text.includes('office') || text.includes('delivered')) return 'delivery';
      if (text.includes('rahim') || text.includes('30kg')) return 'rahim';
      if (text.includes('want') || text.includes('gap') || text.includes('requirement')) return 'want';
    }
    if (isKarimAsking) return 'karim';
    return selectedNodeId;
  }, [state.aiTransient.active, state.aiTransient.text, isKarimAsking, selectedNodeId]);

  const handleVoiceIntent = () => {
    setIsVoiceRecording(true);
    showToast('✦ Voice intent: Listening to conversation...');
    setTimeout(() => {
      setIsVoiceRecording(false);
      sendChatMessage('আজকের important কাজের কী অবস্থা? করিম ও ট্রান্সপোর্টের কি অবস্থা?');
    }, 1800);
  };

  return (
    <div className="w-full h-screen bg-[#F8F9FA] flex flex-col font-sans select-none overflow-hidden text-[#1E293B]">
      {/* Top Notification Toast */}
      <AnimatePresence>
        {state.toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>{state.toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <button
            onClick={() => setActiveWorkspace('operations')}
            className="hover:text-gray-800 cursor-pointer font-medium"
          >
            Workspaces
          </button>
          <span>›</span>
          <button
            onClick={() => setActiveWorkspace('operations')}
            className="hover:text-gray-800 cursor-pointer font-medium capitalize"
          >
            {state.activeWorkspace === 'operations' ? 'Daily Operations' : state.activeWorkspace.replace('-', ' ')}
          </button>
          <span>›</span>

          {/* Operation Selector with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpMenuOpen(!isOpMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold cursor-pointer transition-colors"
            >
              <span>{state.want.title}</span>
              <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                ● Active
              </span>
              <span className="text-gray-400 text-[10px]">▼</span>
            </button>

            {isOpMenuOpen && (
              <div className="absolute left-0 top-8 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Switch Causal Reality
                </div>
                {state.operations.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => {
                      switchOperation(op.id);
                      setIsOpMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      state.activeOperationId === op.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div>
                      <span className="block font-semibold">{op.title}</span>
                      <span className="text-[10px] text-gray-400 block">{op.target}</span>
                    </div>
                    {state.activeOperationId === op.id && (
                      <span className="text-blue-600 font-bold text-xs">✓</span>
                    )}
                  </button>
                ))}

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsOpMenuOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Create New Operation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Search & Profile */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes, actors, drivers, amounts..."
              className="w-64 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white rounded-full py-1.5 pl-8 pr-7 text-xs text-gray-700 placeholder-gray-400 outline-none transition-all"
            />
            {state.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* New Operation button in header */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New WANT</span>
          </button>

          {/* Reset Reality Button */}
          <button
            onClick={resetAll}
            title="Reset Workspace Reality"
            className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-gray-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Integrated Workspace Mode Switcher */}
          {onSwitchToMobile && (
            <div className="flex items-center p-0.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-semibold">
              <span className="px-2.5 py-1 bg-white text-blue-700 shadow-xs rounded-full font-bold flex items-center gap-1">
                <span>🖥️</span>
                <span className="hidden sm:inline">Desktop</span>
              </span>
              <button
                onClick={onSwitchToMobile}
                className="px-2.5 py-1 text-gray-600 hover:text-gray-900 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                title="Switch to Mobile View"
              >
                <span>📱</span>
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          )}

          {/* Notifications */}
          <button
            onClick={() => showToast('✦ 2 unread notifications from Karim and Dispatch')}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* AI Sparkle action */}
          <button
            onClick={() => showToast('✦ C-Link Cognitive Engine Online')}
            className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center cursor-pointer border border-indigo-200"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* User Avatar */}
          <div className="relative">
            <img
              src={PARTICIPANTS[3].avatar}
              alt="User"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white" />
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col justify-between py-4 px-3 shrink-0 z-20">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                C
              </div>
              <span className="font-extrabold text-base tracking-tight text-gray-900">
                C-Link
              </span>
            </div>

            {/* Main Navigation */}
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveTab('living');
                  showToast('✦ Switched to Home Dashboard');
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
              >
                <Home className="w-4 h-4 text-gray-400" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setActiveTab('living')}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                  state.activeTab === 'living'
                    ? 'bg-blue-50/80 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>Living Board</span>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  state.activeTab === 'timeline'
                    ? 'bg-blue-50/80 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Timeline & Log</span>
              </button>
              <button
                onClick={() => {
                  setSelectedNode('payment');
                  showToast('✦ Focused Payment Card');
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span>Finance & Cards</span>
              </button>
              <button
                onClick={() => {
                  setChatOpen(true);
                  showToast('✦ Chat drawer opened');
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span>Direct Messages</span>
              </button>
            </nav>

            {/* Workspaces Section */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Workspaces
                </span>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Create New Reality (WANT)"
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveWorkspace('operations');
                  setActiveTab('living');
                }}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  state.activeWorkspace === 'operations'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 text-left'
                }`}
              >
                <Briefcase className={`w-3.5 h-3.5 ${state.activeWorkspace === 'operations' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Daily Operations</span>
              </button>

              <button
                onClick={() => setActiveWorkspace('supply-chain')}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  state.activeWorkspace === 'supply-chain'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 text-left'
                }`}
              >
                <Folder className={`w-3.5 h-3.5 ${state.activeWorkspace === 'supply-chain' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Supply Chain</span>
              </button>

              <button
                onClick={() => setActiveWorkspace('hr')}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  state.activeWorkspace === 'hr'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 text-left'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${state.activeWorkspace === 'hr' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>HR & People</span>
              </button>

              <button
                onClick={() => setActiveWorkspace('finance')}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  state.activeWorkspace === 'finance'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 text-left'
                }`}
              >
                <DollarSign className={`w-3.5 h-3.5 ${state.activeWorkspace === 'finance' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Finance</span>
              </button>

              <button
                onClick={() => setActiveWorkspace('projects')}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  state.activeWorkspace === 'projects'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 text-left'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${state.activeWorkspace === 'projects' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Projects</span>
              </button>
            </div>

            {/* Quick Scenario Jumps for Testers */}
            <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-3 mb-1">
                Causal State Fast-Forward
              </span>
              <div className="grid grid-cols-2 gap-1 px-2">
                <button
                  onClick={() => applyScenario(1)}
                  className="px-2 py-1 text-[10px] font-medium bg-gray-50 hover:bg-gray-100 rounded text-gray-700 text-left"
                >
                  1. Initial Want
                </button>
                <button
                  onClick={() => applyScenario(8)}
                  className="px-2 py-1 text-[10px] font-medium bg-gray-50 hover:bg-gray-100 rounded text-gray-700 text-left"
                >
                  8. Karim Offer
                </button>
                <button
                  onClick={() => applyScenario(10)}
                  className="px-2 py-1 text-[10px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-left"
                >
                  10. Committed
                </button>
                <button
                  onClick={() => applyScenario(14)}
                  className="px-2 py-1 text-[10px] font-medium bg-rose-50 hover:bg-rose-100 text-rose-800 rounded font-semibold text-left"
                >
                  14. Decline (Gap)
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Agent Card */}
          <div className="p-3 bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-100 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-gray-900">C-Link Agent</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              {state.coverage.isFullyCovered
                ? '50kg Rice is 100% covered. Focus on transport.'
                : '20kg Rice pending from Karim. Transport blocked.'}
            </p>
          </div>
        </aside>

        {/* Center Main Workspace or Dedicated Domain Workspace */}
        {state.activeWorkspace === 'supply-chain' ? (
          <SupplyChainWorkspace />
        ) : state.activeWorkspace === 'finance' ? (
          <FinanceWorkspace />
        ) : state.activeWorkspace === 'hr' ? (
          <HRWorkspace />
        ) : state.activeWorkspace === 'projects' ? (
          <ProjectsWorkspace />
        ) : (
          <>
            <main className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
              {/* Header Bar */}
              <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-0 flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-extrabold text-gray-900">
                          {state.want.title}
                        </h1>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-xs text-gray-500">
                        {state.want.target} • Coverage:{' '}
                        <strong className="text-gray-800">
                          {state.coverage.covered}kg / {state.coverage.total}kg ({state.coverage.isFullyCovered ? '100%' : '60%'})
                        </strong>
                      </p>
                    </div>
                  </div>

              {/* Participants & Share */}
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  {PARTICIPANTS.map((p) => (
                    <img
                      key={p.id}
                      src={p.avatar}
                      alt={p.name}
                      title={`${p.name} (${p.role})`}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-500">4 participants</span>

                <button
                  onClick={() => showToast('✦ Workspace link copied to clipboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-6 text-xs font-semibold text-gray-500 border-b border-transparent">
              <button
                onClick={() => setActiveTab('living')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  state.activeTab === 'living' ? 'text-blue-600' : 'hover:text-gray-900'
                }`}
              >
                <span>Living Board</span>
                {state.activeTab === 'living' && (
                  <motion.div
                    layoutId="desktopTabIndicator"
                    className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  state.activeTab === 'timeline' ? 'text-blue-600' : 'hover:text-gray-900'
                }`}
              >
                <span>Timeline</span>
                {state.activeTab === 'timeline' && (
                  <motion.div
                    layoutId="desktopTabIndicator"
                    className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  state.activeTab === 'history' ? 'text-blue-600' : 'hover:text-gray-900'
                }`}
              >
                <span>History</span>
                {state.activeTab === 'history' && (
                  <motion.div
                    layoutId="desktopTabIndicator"
                    className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('files')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  state.activeTab === 'files' ? 'text-blue-600' : 'hover:text-gray-900'
                }`}
              >
                <span>Files</span>
                {state.activeTab === 'files' && (
                  <motion.div
                    layoutId="desktopTabIndicator"
                    className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  state.activeTab === 'notes' ? 'text-blue-600' : 'hover:text-gray-900'
                }`}
              >
                <span>Notes</span>
                {state.activeTab === 'notes' && (
                  <motion.div
                    layoutId="desktopTabIndicator"
                    className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
                  />
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: LIVING BOARD */}
          {state.activeTab === 'living' && (
            <div className="flex-1 relative overflow-auto bg-[#F4F6F9] p-6">
              {/* Subtle Dot Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Top-Left Floating AI Attention Card (Collapsible) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-100 p-3 shadow-sm max-w-xs flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setIsAiCardCollapsed(!isAiCardCollapsed)}
                    className="flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-bold text-gray-900">C-Link AI</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full font-semibold">
                      Live
                    </span>
                  </button>
                  <button
                    onClick={() => setIsAiCardCollapsed(!isAiCardCollapsed)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 text-xs font-bold"
                    title={isAiCardCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {isAiCardCollapsed ? '+' : '−'}
                  </button>
                </div>

                {!isAiCardCollapsed && (
                  <>
                    <div className="text-xs font-semibold text-gray-800">
                      {state.coverage.isFullyCovered && isTransportScheduled
                        ? '🎉 Everything is on track for delivery today!'
                        : 'Attention needed today:'}
                    </div>
                    <ul className="text-[11px] text-gray-600 space-y-1 list-disc pl-4">
                      {isTransportBlocked && (
                        <li>
                          <span className="text-rose-600 font-semibold">Delivery is blocked</span> (no driver confirmed)
                        </li>
                      )}
                      {isTransportScheduled && (
                        <li>
                          <span className="text-emerald-600 font-medium">Driver Tariq assigned</span> (pickup 4:30 PM)
                        </li>
                      )}
                      {!state.coverage.isFullyCovered && (
                        <li>
                          <span className="text-amber-600 font-medium">Karim offer 20kg</span> pending acceptance
                        </li>
                      )}
                      {state.coverage.isFullyCovered && (
                        <li>
                          <span className="text-emerald-600 font-medium">50kg Rice requirement</span> 100% committed
                        </li>
                      )}
                      <li>
                        <span className="text-gray-900 font-medium">
                          Payment {isPaymentPaid ? 'Settled (৳12,500)' : 'Pending'}
                        </span>
                      </li>
                    </ul>
                  </>
                )}
              </motion.div>

              {/* Top-Right Floating "Today's Focus" Widget (Collapsible) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-3 shadow-sm w-56 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Today's Focus</span>
                  <button
                    onClick={() => setIsFocusCardCollapsed(!isFocusCardCollapsed)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 text-xs font-bold"
                    title={isFocusCardCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {isFocusCardCollapsed ? '+' : '−'}
                  </button>
                </div>

                {!isFocusCardCollapsed && (
                  <div className="flex flex-col gap-1.5">
                    <div
                      onClick={() => setSelectedNode('transport')}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className={`w-3.5 h-3.5 ${isTransportBlocked ? 'text-rose-500' : 'text-emerald-500'}`} />
                        <span className="text-xs font-medium text-gray-800">Transport</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isTransportBlocked
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isTransportBlocked ? 'Blocked' : 'Scheduled'}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedNode('payment')}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className={`w-3.5 h-3.5 ${isPaymentPaid ? 'text-emerald-500' : 'text-amber-500'}`} />
                        <span className="text-xs font-medium text-gray-800">Payment</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaymentPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isPaymentPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedNode('karim')}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-gray-800">Rice Supply</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          state.coverage.isFullyCovered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {state.coverage.isFullyCovered ? '100% covered' : 'Offered'}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Scalable Causal Reality Graph Canvas */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center 40px' }}
                className="transition-transform duration-200 flex flex-col items-center pt-8 pb-32 max-w-4xl mx-auto w-full"
              >
                {/* Active Search Highlight Banner */}
                {isSearchActive && (
                  <div className="mb-5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in duration-200">
                    <Search className="w-4 h-4 text-blue-200" />
                    <span className="text-xs font-semibold">
                      Search Filtering: <strong>"{state.searchQuery}"</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">
                      {totalMatchingNodes} matching node{totalMatchingNodes !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-white/80 hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* View Mode Toggle: Living Board vs Operational Pipeline */}
                <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-5 px-2">
                  <div className="flex items-center gap-1.5 bg-white/95 border border-indigo-100 p-1.5 rounded-2xl shadow-xs backdrop-blur-md">
                    <button
                      onClick={() => setCanvasViewMode('living')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        canvasViewMode === 'living'
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm ring-1 ring-indigo-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Living Board (AI Mutating Graph)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </button>
                    <button
                      onClick={() => setCanvasViewMode('pipeline')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        canvasViewMode === 'pipeline'
                          ? 'bg-gray-900 text-white shadow-sm ring-1 ring-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      <span>Operational Pipeline</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-medium text-gray-500 hidden sm:inline">
                    {canvasViewMode === 'living'
                      ? '✦ Dynamic Causal Graph'
                      : '☷ Structured Pipeline'}
                  </span>
                </div>

                {canvasViewMode === 'living' ? (
                  <div className="w-full flex flex-col items-center">
                    <LivingSurface
                      graph={state.graph}
                      onAction={handleCardAction}
                      focusedObjectId={selectedNodeId}
                      onFocusObject={(id) => setSelectedNode(id)}
                    />
                  </div>
                ) : (
                  <>
                    {/* ROOT NODE: WANT */}
                    <div
                      onClick={() => setSelectedNode('want')}
                  className={`bg-white rounded-2xl border p-4 shadow-sm w-72 flex flex-col gap-2 cursor-pointer transition-all ${
                    selectedNodeId === 'want'
                      ? 'border-blue-600 ring-4 ring-blue-500/10'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    isSearchActive && !isWantMatch
                      ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                      : ''
                  } ${
                    isSearchActive && isWantMatch
                      ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-gray-900">WANT ✦</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● Active
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-gray-900">
                    {state.want.title}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{state.want.target}</span>
                    <img
                      src={PARTICIPANTS[3].avatar}
                      alt="Owner"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Visual Causal Relations: Branching from WANT to Actors */}
                <div className={`w-full max-w-xl flex flex-col items-center my-0.5 pointer-events-none transition-opacity ${
                  isSearchActive && !isWantMatch ? 'opacity-25' : ''
                }`}>
                  <div className="w-0.5 h-4 bg-blue-400" />
                  <div className="w-full relative h-4">
                    {/* Horizontal Branch Bar */}
                    <div className="absolute top-0 left-[22%] right-[22%] h-0.5 bg-blue-300 rounded-full" />
                    {/* Rahim Drop */}
                    <div className="absolute top-0 left-[22%] w-0.5 h-4 bg-emerald-400" />
                    {/* Karim Center Drop */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-blue-400" />
                    {/* Mina Drop */}
                    <div className="absolute top-0 right-[22%] w-0.5 h-4 bg-gray-300 border-l border-dashed border-gray-400" />
                  </div>
                </div>

                {/* HORIZONTAL ACTOR BRANCHES */}
                <div className="flex items-start justify-center gap-5 w-full relative">
                  {/* ACTOR 1: Rahim (COMMITTED) */}
                  <div
                    onClick={() => setSelectedNode('rahim')}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm w-56 flex flex-col gap-2 cursor-pointer transition-all ${
                      selectedNodeId === 'rahim'
                        ? 'border-emerald-600 ring-4 ring-emerald-500/10'
                        : 'border-emerald-200/80 hover:border-emerald-300'
                    } ${
                      isSearchActive && !isRahimMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isRahimMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={PARTICIPANTS[1].avatar}
                          alt="Rahim"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-gray-900">Rahim</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Committed
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-extrabold text-gray-900">30kg</span>
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Ready
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-100 pt-1.5">
                      <span>Rice Supply ✦</span>
                      <span>৳ 3,600</span>
                    </div>
                  </div>

                  {/* ACTOR 2: Karim (OFFERED / COMMITTED / DECLINED) */}
                  <div
                    onClick={() => setSelectedNode('karim')}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm w-56 flex flex-col gap-2 cursor-pointer transition-all relative ${
                      selectedNodeId === 'karim' || attentionTarget === 'karim'
                        ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-md'
                        : isKarimCommitted
                        ? 'border-emerald-300 hover:border-emerald-400'
                        : isKarimDeclined
                        ? 'border-rose-300 hover:border-rose-400 bg-rose-50/20'
                        : 'border-blue-200 hover:border-blue-300'
                    } ${
                      isSearchActive && !isKarimMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isKarimMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    {/* Live Conversation Dialogue Bubble on Karim Card */}
                    <AnimatePresence>
                      {(isKarimAsking || attentionTarget === 'karim' || selectedNodeId === 'karim') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 bg-gray-950 text-white p-2.5 rounded-2xl shadow-2xl border border-indigo-500/40 z-30 pointer-events-auto"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={PARTICIPANTS[0].avatar}
                                alt="Karim"
                                className="w-4 h-4 rounded-full object-cover ring-1 ring-white/40"
                              />
                              <span className="text-[10px] font-bold text-indigo-300">Karim (Actor Voice)</span>
                            </div>
                            <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              LIVE
                            </span>
                          </div>
                          <p className="text-[11px] leading-tight text-gray-100 font-medium">
                            {isKarimCommitted
                              ? '✓ "আমি ২০ কেজি চাল নিশ্চিত করেছি। ৪:৩০ এ পিকআপ রেডি থাকবে।"'
                              : isKarimDeclined
                              ? '⚠️ "ভাই, আজকের মধ্যে ২০ কেজি চাল দেওয়া সম্ভব হচ্ছে না।"'
                              : isKarimAsking
                              ? '✦ "ভাই, কথা বলছি... মিরপুর মিল থেকে ২০ কেজি মিনিকেট চাল ৪:৩০ এ পিকআপ করতে পারেন (৳ ২,৪০০)।"'
                              : '"ভাই, ২০ কেজি চাল রেডি আছে। বিকেল ৪:৩০ এর মধ্যে পিকআপ পাঠালে পৌঁছানো সম্ভব। দর ৳২,৪০০।"'}
                          </p>
                          {!isKarimCommitted && !isKarimDeclined && (
                            <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  acceptKarim();
                                }}
                                className="flex-1 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                              >
                                ✓ Accept 20kg
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  askKarim();
                                }}
                                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-medium cursor-pointer"
                              >
                                💬 Ask Again
                              </button>
                            </div>
                          )}
                          {/* Triangle speech pointer */}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-950 rotate-45 border-r border-b border-indigo-500/40" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Cursor ✦ on Karim */}
                    {attentionTarget === 'karim' && (
                      <motion.div
                        initial={{ scale: 0, y: -8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -8 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg border border-indigo-400/50 flex items-center gap-1.5 whitespace-nowrap z-20"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                        <span>✦ {state.aiTransient.active ? state.aiTransient.text : 'Karim: 20kg Offered'}</span>
                      </motion.div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={PARTICIPANTS[0].avatar}
                          alt="Karim"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-gray-900">Karim</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isKarimCommitted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isKarimDeclined
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isKarimAsking
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {isKarimCommitted
                          ? 'Committed'
                          : isKarimDeclined
                          ? 'Declined'
                          : isKarimAsking
                          ? 'Asking...'
                          : 'OFFERED'}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-extrabold text-gray-900">20kg</span>
                      <span className="text-[11px] font-medium text-gray-600">
                        {isKarimCommitted ? '৳ 2,400 (Signed)' : '৳ 2,400 (Offered)'}
                      </span>
                    </div>

                    {/* Quick 1-click action buttons on card */}
                    {!isKarimCommitted && !isKarimDeclined && (
                      <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptKarim();
                          }}
                          className="flex-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Accept 20kg
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            askKarim();
                          }}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-medium cursor-pointer"
                        >
                          Ask
                        </button>
                      </div>
                    )}

                    {isKarimCommitted && (
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 border-t border-gray-100 pt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Committed to delivery</span>
                      </div>
                    )}

                    {isKarimDeclined && (
                      <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 border-t border-gray-100 pt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Gap reopened (20kg)</span>
                      </div>
                    )}
                  </div>

                  {/* ACTOR 3: Mina (CANDIDATE) */}
                  <div
                    onClick={() => setSelectedNode('mina')}
                    className={`bg-white/80 rounded-2xl border-2 border-dashed p-3.5 w-52 flex flex-col gap-2 cursor-pointer transition-all ${
                      selectedNodeId === 'mina'
                        ? 'border-indigo-400 ring-4 ring-indigo-500/10'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${
                      isSearchActive && !isMinaMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isMinaMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={PARTICIPANTS[2].avatar}
                          alt="Mina"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover opacity-80"
                        />
                        <span className="text-xs font-semibold text-gray-700">Mina</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        Possible
                      </span>
                    </div>
                    <div className="text-sm font-bold text-gray-700">
                      15kg
                    </div>
                    <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-1">
                      Backup candidate
                    </div>
                  </div>
                </div>

                {/* Visual Causal Relations: Converging from Actors to Coverage */}
                <div className="w-full max-w-xl flex flex-col items-center my-0.5 pointer-events-none">
                  <div className="w-full relative h-4">
                    {/* Rahim Rise */}
                    <div className="absolute bottom-0 left-[22%] w-0.5 h-4 bg-emerald-400" />
                    {/* Karim Center Rise */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-blue-400" />
                    {/* Mina Rise */}
                    <div className="absolute bottom-0 right-[22%] w-0.5 h-4 bg-gray-300 border-l border-dashed border-gray-400" />
                    {/* Horizontal Collector Bar */}
                    <div className="absolute bottom-0 left-[22%] right-[22%] h-0.5 bg-blue-300 rounded-full" />
                  </div>
                  <div className="w-0.5 h-4 bg-blue-400" />
                </div>

                {/* MERGER NODE: COVERAGE */}
                <div
                  onClick={() => setSelectedNode('coverage')}
                  className={`bg-white rounded-2xl border p-3.5 shadow-sm w-72 flex items-center justify-between cursor-pointer transition-all ${
                    selectedNodeId === 'coverage'
                      ? 'border-blue-600 ring-4 ring-blue-500/10'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    isSearchActive && !isCoverageMatch
                      ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                      : ''
                  } ${
                    isSearchActive && isCoverageMatch
                      ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                      : ''
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      Coverage: {state.coverage.covered}kg / {state.coverage.total}kg
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {state.coverage.isFullyCovered
                        ? 'Requirement 100% satisfied'
                        : '20kg pending acceptance'}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      state.coverage.isFullyCovered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {state.coverage.isFullyCovered ? '100% covered' : '60% covered'}
                  </span>
                </div>

                {/* Visual Causal Relations: Branching from Coverage to Dependencies */}
                <div className="w-full max-w-3xl flex flex-col items-center my-0.5 pointer-events-none">
                  <div className="w-0.5 h-4 bg-blue-400" />
                  <div className="w-full relative h-4 hidden md:block">
                    {/* Crossbar spanning the 4 columns */}
                    <div className="absolute top-0 left-[12.5%] right-[12.5%] h-0.5 bg-blue-300/80 rounded-full" />
                    {/* Column 1: Transport */}
                    <div className="absolute top-0 left-[12.5%] w-0.5 h-4 bg-emerald-400" />
                    {/* Column 2: Certified Slip */}
                    <div className="absolute top-0 left-[37.5%] w-0.5 h-4 bg-blue-400" />
                    {/* Column 3: Payment */}
                    <div className="absolute top-0 left-[62.5%] w-0.5 h-4 bg-amber-400" />
                    {/* Column 4: Delivery Office */}
                    <div className="absolute top-0 right-[12.5%] w-0.5 h-4 bg-gray-300" />
                  </div>
                </div>

                {/* DEPENDENCIES GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {/* 1. Transport */}
                  <div
                    onClick={() => setSelectedNode('transport')}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm cursor-pointer transition-all flex flex-col justify-between relative ${
                      selectedNodeId === 'transport' || attentionTarget === 'transport'
                        ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-md'
                        : isTransportBlocked
                        ? 'border-rose-200 hover:border-rose-300'
                        : 'border-emerald-200 hover:border-emerald-300'
                    } ${
                      isSearchActive && !isTransportMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isTransportMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    {/* Live Conversation Dialogue Bubble on Transport */}
                    <AnimatePresence>
                      {(selectedNodeId === 'transport' || attentionTarget === 'transport') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute -top-28 left-1/2 -translate-x-1/2 w-64 bg-gray-950 text-white p-2.5 rounded-2xl shadow-2xl border border-blue-500/40 z-30 pointer-events-auto"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-[10px] font-bold text-blue-300">Driver Tariq (Voice)</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">01611-998877</span>
                          </div>
                          <p className="text-[11px] leading-tight text-gray-100 font-medium">
                            {isTransportScheduled
                              ? '✓ "কাভার্ড ভ্যান রওনা হয়েছে। ৪:৩০ এ চাল তুলে ৬টার আগেই গুলশান অফিসে পৌঁছে দেব।"'
                              : '"কাভার্ড ভ্যান রেডি আছে। ৳৮০০ ভাড়ায় বিকেল ৪:৩০ এ চাল পিকআপ শুরু করতে পারি।"'}
                          </p>
                          {isTransportBlocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                assignDriver('Tariq', '৳ 800');
                              }}
                              className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              ⚡ Assign Driver Tariq (৳800)
                            </button>
                          )}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-950 rotate-45 border-r border-b border-blue-500/40" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Cursor ✦ on Transport */}
                    {attentionTarget === 'transport' && (
                      <motion.div
                        initial={{ scale: 0, y: -8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -8 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg border border-blue-400/50 flex items-center gap-1.5 whitespace-nowrap z-20"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                        <span>✦ {isTransportScheduled ? 'Driver Tariq Assigned' : 'Routing Covered Van Tariq'}</span>
                      </motion.div>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Truck className={`w-3.5 h-3.5 ${isTransportBlocked ? 'text-rose-500' : 'text-emerald-500'}`} />
                          <span className="text-xs font-bold text-gray-900">Transport</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isTransportBlocked
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isTransportBlocked ? 'BLOCKED' : 'SCHEDULED'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 mt-2">
                        {isTransportScheduled
                          ? `Driver: ${state.dependencies.transport.driver?.name}`
                          : 'Driver not confirmed'}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {isTransportScheduled
                          ? state.dependencies.transport.driver?.cost
                          : 'Required by: 4:00 PM'}
                      </div>
                    </div>

                    {isTransportBlocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          assignDriver('Tariq', '৳ 800');
                        }}
                        className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        ⚡ Assign Tariq (৳800)
                      </button>
                    )}
                  </div>

                  {/* 2. Delivery */}
                  <div
                    onClick={() => setSelectedNode('delivery')}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm cursor-pointer transition-all flex flex-col justify-between ${
                      selectedNodeId === 'delivery'
                        ? 'border-blue-600 ring-4 ring-blue-500/10'
                        : isDeliveryCompleted
                        ? 'border-emerald-200 hover:border-emerald-300'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      isSearchActive && !isDeliveryMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isDeliveryMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-bold text-gray-900">Delivery</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isDeliveryCompleted
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isDeliveryCompleted ? 'DELIVERED' : 'PENDING'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 mt-2">
                        50kg • Office
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Expected: 6:00 PM
                      </div>
                    </div>

                    {!isDeliveryCompleted && isTransportScheduled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelivery();
                        }}
                        className="mt-2 w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Confirm Received
                      </button>
                    )}
                  </div>

                  {/* 3. Proof */}
                  <div
                    onClick={() => setSelectedNode('proof')}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm cursor-pointer transition-all ${
                      selectedNodeId === 'proof'
                        ? 'border-blue-600 ring-4 ring-blue-500/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      isSearchActive && !isProofMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isProofMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs font-bold text-gray-900">Proof</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          state.dependencies.proof.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {state.dependencies.proof.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-2">
                      Delivery Confirmation
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Photo + Weighing Slip
                    </div>
                  </div>

                  {/* 4. Payment */}
                  <div
                    onClick={() => setSelectedNode('payment')}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm cursor-pointer transition-all flex flex-col justify-between relative ${
                      selectedNodeId === 'payment' || attentionTarget === 'payment'
                        ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-md'
                        : isPaymentPaid
                        ? 'border-emerald-300 bg-emerald-50/10'
                        : 'border-amber-200 hover:border-amber-300'
                    } ${
                      isSearchActive && !isPaymentMatch
                        ? 'opacity-25 blur-[0.5px] scale-95 pointer-events-none'
                        : ''
                    } ${
                      isSearchActive && isPaymentMatch
                        ? 'ring-4 ring-blue-500 shadow-xl scale-102'
                        : ''
                    }`}
                  >
                    {/* Live Conversation Dialogue Bubble on Payment */}
                    <AnimatePresence>
                      {(selectedNodeId === 'payment' || attentionTarget === 'payment') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute -top-28 left-1/2 -translate-x-1/2 w-64 bg-gray-950 text-white p-2.5 rounded-2xl shadow-2xl border border-amber-500/40 z-30 pointer-events-auto"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-[10px] font-bold text-amber-300">bKash Corporate Escrow</span>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-mono">READY</span>
                          </div>
                          <p className="text-[11px] leading-tight text-gray-100 font-medium">
                            {isPaymentPaid
                              ? '✓ "৳১২,৫০০ বিতরণ সম্পন্ন হয়েছে। কৃষক রহিম ও ড্রাইভার তারিকের অ্যাকাউন্টে ক্রেডিট হয়েছে।"'
                              : '"সব পক্ষের বিল সমন্বিত: রহিম ৳৩,৬০০ + করিম ৳২,৪০০ + পরিবহন ৳৮০০ = মোট ৳১২,৫০০ প্রস্তুত।"'}
                          </p>
                          {!isPaymentPaid && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                processPayment();
                              }}
                              className="mt-2 w-full py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              💳 Pay ৳ 12,500 via bKash
                            </button>
                          )}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-950 rotate-45 border-r border-b border-amber-500/40" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Cursor ✦ on Payment */}
                    {attentionTarget === 'payment' && (
                      <motion.div
                        initial={{ scale: 0, y: -8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -8 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg border border-amber-400/50 flex items-center gap-1.5 whitespace-nowrap z-20"
                      >
                        <Sparkles className="w-3 h-3 text-amber-200 animate-spin" />
                        <span>✦ {isPaymentPaid ? 'Settled via bKash' : 'Escrow Ready: ৳ 12,500'}</span>
                      </motion.div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-bold text-gray-900">Payment</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isPaymentPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isPaymentPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                      <div className="text-sm font-black text-gray-900 mt-1.5">
                        ৳ 12,500
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Rahim + Karim + Transport
                      </div>
                    </div>

                    {!isPaymentPaid && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          processPayment();
                        }}
                        className="mt-2 w-full py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Pay via bKash
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

                {/* Living C-Link Conversation Bar & Semantic Action Composer */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-indigo-200/80 p-4 shadow-xl max-w-2xl w-full mt-6 flex flex-col gap-3 relative overflow-hidden backdrop-blur-md"
                >
                  {/* Subtle AI gradient accent on top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

                  {/* Header with Live AI Observer status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">C-Link Live Reality Composer</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {isVoiceRecording ? '🎙️ Listening to your voice intent...' : 'Conversational semantic interface connected to visual canvas'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        ✦ Focus: {attentionTarget.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contextual conversation guidance message */}
                  <div className="bg-indigo-50/60 rounded-xl p-2.5 border border-indigo-100 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold text-xs mt-0.5">✦</span>
                    <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                      {state.aiTransient.active ? (
                        <span className="text-indigo-700 font-bold animate-pulse">
                          {state.aiTransient.text}
                        </span>
                      ) : isKarimAsking ? (
                        'করিমের সাথে সরাসরি যোগাযোগ হচ্ছে। মিরপুর মিল থেকে ২০ কেজি চাল গ্রহণের জন্য নির্দেশ দিন।'
                      ) : !isKarimCommitted ? (
                        'করিম ভাই ২০ কেজি চাল অফার করেছেন (৳২,৪০০)। আপনি এখানে কথা বলে দরদাম করতে পারেন অথবা সরাসরি গ্রহণ করতে পারেন।'
                      ) : isTransportBlocked ? (
                        'চাল প্রস্তুত আছে। পরবর্তী পদক্ষেপ হিসেবে কাভার্ড ভ্যান ড্রাইভার তারিক (৳৮০০) কে অ্যাসাইন করুন।'
                      ) : !isPaymentPaid ? (
                        'পরিবহন বুকিং সম্পন্ন। bKash কর্পোরেট এসক্রো থেকে মোট ৳১২,৫০০ বিতরণ কনফার্ম করুন।'
                      ) : (
                        '✓ আজকের সকল প্রয়োজনীয়তা ও সরবরাহ সফলভাবে নিশ্চিত হয়েছে!'
                      )}
                    </p>
                  </div>

                  {/* Direct Text Input & Voice Mic directly on Canvas */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                          !isKarimCommitted
                            ? "বাংলা বা ইংরেজিতে লিখুন (e.g. 'Karim accept koro', 'Ar discount hobe?')..."
                            : isTransportBlocked
                            ? "e.g. 'Driver Tariq ke assign koro', 'Transport status ki?'..."
                            : "e.g. 'Payment confirm koro', 'Delivery status ki?'..."
                        }
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleVoiceIntent}
                      title="Speak Voice Intent"
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                        isVoiceRecording
                          ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleSendChat}
                      disabled={!chatInput.trim()}
                      className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        chatInput.trim()
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Semantic Action Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 no-scrollbar">
                    <span className="text-[10px] font-bold text-gray-400 shrink-0">Semantic Action:</span>
                    <button
                      onClick={() =>
                        dispatchSemanticAction({
                          type: 'CREATE_WANT',
                          payload: { title: '৫০ কেজি সুগন্ধি চাল', quantity: 50, unit: 'kg' },
                        })
                      }
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>🌾 ৫০ কেজি চালের চাহিদা</span>
                    </button>
                    <button
                      onClick={() =>
                        dispatchSemanticAction({
                          type: 'FIND_CANDIDATES',
                          payload: {
                            candidates: [
                              { name: 'Karim', quantity: 20, unit: 'kg', state: 'POSSIBLE' },
                              { name: 'Mina', quantity: 15, unit: 'kg', state: 'UNKNOWN' },
                            ],
                          },
                        })
                      }
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>🔍 করিম ও মিনাকে খোঁজো</span>
                    </button>
                    {!isKarimCommitted && (
                      <button
                        onClick={acceptKarim}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95"
                      >
                        ⚡ Accept Karim (20kg)
                      </button>
                    )}
                    {!isKarimCommitted && !isKarimDeclined && (
                      <button
                        onClick={declineKarim}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95"
                      >
                        ✕ Decline Karim
                      </button>
                    )}
                    {!isKarimCommitted && (
                      <button
                        onClick={askKarim}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-medium whitespace-nowrap cursor-pointer"
                      >
                        💬 Ask Karim
                      </button>
                    )}
                    {isKarimCommitted && isTransportBlocked && (
                      <button
                        onClick={() => assignDriver('Tariq', '৳ 800')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95"
                      >
                        🚚 Assign Driver Tariq (৳800)
                      </button>
                    )}
                    {isKarimCommitted && !isPaymentPaid && (
                      <button
                        onClick={processPayment}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95"
                      >
                        💳 Pay ৳ 12,500 via bKash
                      </button>
                    )}
                    {isKarimCommitted && !isDeliveryCompleted && isTransportScheduled && (
                      <button
                        onClick={confirmDelivery}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95"
                      >
                        ✓ Confirm Received
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Right Canvas Zoom & Nav Controls */}
              <div className="absolute bottom-5 right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 px-3 py-1.5 shadow-md flex items-center gap-2.5 text-xs text-gray-600">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  className="hover:text-gray-900 cursor-pointer p-0.5"
                  title="Zoom Out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-gray-700 w-9 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="hover:text-gray-900 cursor-pointer p-0.5"
                  title="Zoom In"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-gray-200" />
                <button
                  onClick={() => setZoomLevel(100)}
                  title="Reset Zoom"
                  className="hover:text-gray-900 cursor-pointer p-0.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedNode('want');
                    showToast('✦ Centered on Want');
                  }}
                  title="Center View"
                  className="hover:text-gray-900 cursor-pointer p-0.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Interactive Chat Drawer */}
              <div className="absolute bottom-4 inset-x-6 z-20 max-w-3xl mx-auto flex flex-col gap-2">
                {chatOpen && (
                  <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-3 shadow-md space-y-2 max-h-40 overflow-y-auto">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider pb-1 border-b border-gray-100">
                      <span>Live Cognitive Conversation</span>
                      <button
                        onClick={() => setChatOpen(false)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {state.chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-2 text-xs">
                        {msg.sender === 'user' ? (
                          <img
                            src={PARTICIPANTS[3].avatar}
                            alt="You"
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                        ) : msg.sender === 'karim' ? (
                          <img
                            src={PARTICIPANTS[0].avatar}
                            alt="Karim"
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                            AI
                          </div>
                        )}
                        <div className="flex-1 text-gray-800 whitespace-pre-line font-medium">
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{msg.time}</span>
                      </div>
                    ))}

                    {state.aiTransient.active && (
                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px] animate-pulse">
                          ✦
                        </div>
                        <div className="flex-1 text-indigo-700 italic font-semibold">
                          {state.aiTransient.text}
                        </div>
                        <span className="text-[10px] text-indigo-400">now</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Chat Input Pill */}
                <div className="bg-white border border-gray-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
                  <button
                    onClick={() => showToast('✦ File attachment supported (Photos/PDFs)')}
                    title="Attach file"
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask C-Link... (e.g. 'Karim কে গ্রহণ করো' or 'আজকের কাজের অবস্থা?')"
                    className="flex-1 text-xs text-gray-900 outline-none placeholder-gray-400 font-medium"
                  />

                  <div className="flex items-center gap-2 text-gray-400">
                    <button
                      onClick={() => {
                        setChatInput('আজকের important কাজের কী অবস্থা?');
                        showToast('✦ Voice input transcribed');
                      }}
                      title="Voice input"
                      className="hover:text-gray-600 cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSendChat}
                      className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {state.activeTab === 'timeline' && (
            <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">
                    Causal Timeline
                  </h2>
                  <p className="text-xs text-gray-500">
                    Chronological audit of state mutations, actor offers, and commitments
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setTimelineFilter('today')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      timelineFilter === 'today' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setTimelineFilter('7days')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      timelineFilter === '7days' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimelineFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      timelineFilter === 'all' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    All Events
                  </button>
                </div>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
                {state.timelineEvents.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-4 relative pl-8">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white absolute left-0 ring-4 ring-[#F8F9FA] ${
                        evt.type === 'commit' || evt.type === 'verified'
                          ? 'bg-emerald-500'
                          : evt.type === 'offer'
                          ? 'bg-blue-500'
                          : evt.type === 'blocked'
                          ? 'bg-rose-500'
                          : evt.type === 'paid'
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                    >
                      {evt.type === 'commit' || evt.type === 'verified' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : evt.type === 'blocked' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">
                          {evt.title}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {evt.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{evt.subtitle}</p>
                      {evt.provenance && (
                        <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 border-t border-gray-100 pt-1.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Provenance: {evt.provenance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY & AUDIT LOG */}
          {state.activeTab === 'history' && (
            <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 max-w-4xl mx-auto w-full">
              <h2 className="text-base font-extrabold text-gray-900 mb-2">
                Reality Event Provenance & Signatures
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Cryptographically verifiable causal links between commitments, actors, and physical outcomes.
              </p>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Actor / Entity</th>
                      <th className="p-3.5">Semantic Action</th>
                      <th className="p-3.5">Causal State</th>
                      <th className="p-3.5">Verification Source</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="p-3.5 font-semibold text-gray-900">Rahim</td>
                      <td className="p-3.5">Supply Commitment (30kg)</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          COMMITTED
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-500">Digital Agreement #DAG-391</td>
                      <td className="p-3.5 font-mono text-gray-400">09:24 AM</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-gray-900">Karim</td>
                      <td className="p-3.5">Supply Offer (20kg @ ৳2,400)</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {state.actors.karim.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-500">Direct Chat (Mill No. 4)</td>
                      <td className="p-3.5 font-mono text-gray-400">{state.actors.karim.lastUpdate}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-gray-900">Transport Node</td>
                      <td className="p-3.5">Carrier Assignment</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isTransportScheduled
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {state.dependencies.transport.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-500">C-Link Dispatch Engine</td>
                      <td className="p-3.5 font-mono text-gray-400">11:05 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FILES & DOCUMENTS */}
          {state.activeTab === 'files' && (
            <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-gray-900">
                  Operational Documents & Vouchers
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  4 Verified Artifacts
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Attached receipts, invoices, delivery challans, and weighbridge certifications with cryptographic hashes.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: 'challan-001',
                    title: 'Delivery Challan & Dispatch Gate Pass',
                    filename: 'Challan-Rice-Delivery-50kg.pdf',
                    category: 'challan' as const,
                    size: '248 KB',
                    date: '12 Sep 2026, 04:30 PM',
                    refNumber: 'CH-2026-DH-8841',
                    issuedBy: 'C-Link Dhaka Dispatch Terminal',
                    recipient: 'Gulshan 2 Operations Center',
                    items: [
                      { description: 'Miniket Rice - Farmer Grade A (Rahim)', qty: '30 kg', rate: '৳ 120/kg', total: '৳ 3,600' },
                      { description: 'Nazirshail Rice - Mill Reserve #4 (Karim)', qty: '20 kg', rate: '৳ 120/kg', total: '৳ 2,400' },
                      { description: 'Covered Transport Logistic Handling', qty: '1 Trip', rate: '৳ 800', total: '৳ 800' }
                    ],
                    totalAmount: '৳ 6,800',
                    verificationHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
                    notes: 'Seal #C-902 intact upon dispatch. Delivery confirmed by Driver Tariq.'
                  },
                  {
                    id: 'weighbridge-001',
                    title: 'Digital Weighbridge & Moisture Certificate',
                    filename: 'Weighbridge-Slip-Certified.pdf',
                    category: 'weighbridge' as const,
                    size: '182 KB',
                    date: '12 Sep 2026, 03:45 PM',
                    refNumber: 'WB-MIRPUR-2-9021',
                    issuedBy: 'Mirpur Digital Weight Station No. 2',
                    recipient: 'C-Link Verification Engine',
                    items: [
                      { description: 'Gross Vehicle Weight (Loaded Covered Van)', qty: '1 Unit', rate: 'Scale #2', total: '1,470.2 kg' },
                      { description: 'Tare Vehicle Weight (Empty DHAKA-METRO-TA-11)', qty: '1 Unit', rate: 'Scale #2', total: '1,420.0 kg' },
                      { description: 'Net Certified Cargo Weight', qty: 'Certified', rate: 'Calibrated', total: '50.2 kg' },
                      { description: 'Moisture Content Reading', qty: 'Probe 4', rate: '< 13.5%', total: '12.8% (Pass)' }
                    ],
                    totalAmount: 'Net Weight: 50.2 kg',
                    verificationHash: 'SHA256:3a10523c063e917fed973646e772f379221a25c6733a0caa35a7147ec91f533f',
                    notes: 'Calibrated by BSTI Inspector Monir Hossain. Certified tare & gross weights.'
                  },
                  {
                    id: 'payment-001',
                    title: 'bKash Merchant Escrow Settlement Voucher',
                    filename: 'Payment-Receipt-bKash-Corporate.pdf',
                    category: 'payment' as const,
                    size: '154 KB',
                    date: '12 Sep 2026, 05:15 PM',
                    refNumber: 'TRX-BK-9182746190',
                    issuedBy: 'bKash Corporate Gateway & Escrow Smart Vault',
                    recipient: 'Dhaka Regional Rice Consortium',
                    items: [
                      { description: 'Rahim Khan (01711-XXXXXX) Rice Supply', qty: '30 kg', rate: 'Direct Wallet', total: '৳ 3,600' },
                      { description: 'Karim Mollah (01812-XXXXXX) Rice Supply', qty: '20 kg', rate: 'Direct Wallet', total: '৳ 2,400' },
                      { description: 'Driver Tariq (01913-XXXXXX) Transport Allowance', qty: '1 Trip', rate: 'Instant Disburse', total: '৳ 800' }
                    ],
                    totalAmount: '৳ 6,800',
                    verificationHash: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    notes: 'Settled instantly via API authorization. Multi-party instant disbursement.'
                  },
                  {
                    id: 'trippass-001',
                    title: 'Logistics Trip Pass & Route Clearance',
                    filename: 'Logistics-Trip-Pass-Covered-Van.pdf',
                    category: 'trip-pass' as const,
                    size: '196 KB',
                    date: '12 Sep 2026, 02:00 PM',
                    refNumber: 'TP-LOG-2026-551',
                    issuedBy: 'Dhaka Metropolitan Route Authority / C-Link',
                    recipient: 'Driver Tariqul Islam (DHAKA-METRO-TA 11-4029)',
                    items: [
                      { description: 'Route Clearance: Mirpur Mill #4 to Gulshan-2 Office', qty: '1 Route', rate: 'VIP Cargo', total: 'Clear' },
                      { description: 'Checkpost Clearance Pass (Mohakhali Flyover)', qty: '1 Transit', rate: 'Pre-verified', total: 'Valid' },
                      { description: 'Cargo Inspection & Temperature Check', qty: 'Ambient', rate: 'Optimal', total: 'Passed' }
                    ],
                    totalAmount: 'Authorized Transit',
                    verificationHash: 'SHA256:c5d2b1f8b4a2e49c7198108c4e09e25d259e83f0f7f32f3f9f9b5c2a1e0d3b4a',
                    notes: 'Emergency contact dispatcher: 01700-000000. GPS geofence enabled.'
                  }
                ].map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        doc.category === 'challan' ? 'bg-blue-50 text-blue-600' :
                        doc.category === 'weighbridge' ? 'bg-emerald-50 text-emerald-600' :
                        doc.category === 'payment' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {doc.category === 'weighbridge' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                          {doc.filename} • {doc.size}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">
                          REF: {doc.refNumber}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveViewerDoc(doc)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                      >
                        <span>View Document</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => downloadDocument(doc)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
                      >
                        Download File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LIVE OPERATIONAL NOTES */}
          {state.activeTab === 'notes' && (
            <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 max-w-4xl mx-auto w-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">
                    Shared Operational Scratchpad
                  </h2>
                  <p className="text-xs text-gray-500">
                    Collaborative real-time notes synchronized across all participants.
                  </p>
                </div>
                <button
                  onClick={() => showToast('✓ Notes saved to C-Link reality')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Notes
                </button>
              </div>

              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full flex-1 min-h-[350px] bg-white border border-gray-200 rounded-2xl p-5 text-xs text-gray-800 font-mono outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          )}
        </main>

        {/* Right Inspector Panel */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col justify-between py-4 px-5 shrink-0 z-20 overflow-y-auto">
          <div className="flex flex-col gap-5">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {selectedNodeId === 'karim' ? (
                  <img
                    src={PARTICIPANTS[0].avatar}
                    alt="Karim"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : selectedNodeId === 'rahim' ? (
                  <img
                    src={PARTICIPANTS[1].avatar}
                    alt="Rahim"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : selectedNodeId === 'transport' ? (
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                ) : selectedNodeId === 'payment' ? (
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    {selectedNodeId === 'karim'
                      ? '20kg (Karim)'
                      : selectedNodeId === 'rahim'
                      ? '30kg (Rahim)'
                      : selectedNodeId === 'transport'
                      ? 'Transport Node'
                      : selectedNodeId === 'payment'
                      ? 'Payment (৳ 12,500)'
                      : '50kg Rice Requirement'}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      selectedNodeId === 'karim'
                        ? isKarimCommitted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                        : selectedNodeId === 'transport'
                        ? isTransportBlocked
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-emerald-50 text-emerald-700'
                        : selectedNodeId === 'payment'
                        ? isPaymentPaid
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {selectedNodeId === 'karim'
                      ? state.actors.karim.status
                      : selectedNodeId === 'transport'
                      ? state.dependencies.transport.status
                      : selectedNodeId === 'payment'
                      ? state.dependencies.payment.status
                      : 'ACTIVE'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => showToast('✦ Inspector pinned')}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs in Inspector */}
            <div className="flex items-center justify-between border-b border-gray-100 text-[11px] font-bold text-gray-500">
              <button
                onClick={() => setInspectorTab('overview')}
                className={`pb-1.5 cursor-pointer ${
                  inspectorTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setInspectorTab('history')}
                className={`pb-1.5 cursor-pointer ${
                  inspectorTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-900'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setInspectorTab('actions')}
                className={`pb-1.5 cursor-pointer ${
                  inspectorTab === 'actions' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-900'
                }`}
              >
                Actions
              </button>
              <button
                onClick={() => setInspectorTab('related')}
                className={`pb-1.5 cursor-pointer ${
                  inspectorTab === 'related' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-900'
                }`}
              >
                Related
              </button>
            </div>

            {/* DETAILS ACCORDION */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Details
              </span>

              {selectedNodeId === 'karim' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Actor:</span>
                    <span className="font-semibold text-gray-900">Karim (Local Mill)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Capability:</span>
                    <span className="font-semibold text-gray-900">Rice Supply ✦</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold text-gray-900">20kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Agreed Price:</span>
                    <span className="font-semibold text-gray-900">৳ 2,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Availability:</span>
                    <span className="font-semibold text-gray-900">Today, 4:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-bold text-blue-600">{state.actors.karim.status}</span>
                  </div>
                </div>
              )}

              {selectedNodeId === 'transport' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Entity:</span>
                    <span className="font-semibold text-gray-900">Transport Logistics</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-bold text-rose-600">{state.dependencies.transport.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Assigned Driver:</span>
                    <span className="font-semibold text-gray-900">
                      {state.dependencies.transport.driver?.name || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Required By:</span>
                    <span className="font-semibold text-gray-900">Today, 4:00 PM</span>
                  </div>
                </div>
              )}

              {selectedNodeId === 'payment' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Total Amount:</span>
                    <span className="font-bold text-gray-900">৳ 12,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Recipients:</span>
                    <span className="font-semibold text-gray-900">Rahim (৳3.6k) + Karim (৳2.4k) + Van (৳800)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-bold text-amber-600">{state.dependencies.payment.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* VERIFICATION SECTION */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Verification & Provenance
              </span>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Source:</span>
                  <span className="font-medium text-gray-900">Direct Chat Protocol</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Confidence:</span>
                  <span className="font-bold text-emerald-600">High (Verified)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Signed by:</span>
                  <span className="font-medium text-gray-900">Sabbir (Lead)</span>
                </div>
              </div>
            </div>

            {/* ACTIONS BUTTONS */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Semantic Actions
              </span>

              {selectedNodeId === 'karim' && (
                <div className="flex flex-col gap-1.5">
                  {!isKarimCommitted ? (
                    <button
                      onClick={acceptKarim}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Commitment (20kg)</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
                      ✓ Karim Committed (20kg)
                    </div>
                  )}

                  <button
                    onClick={askKarim}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2 px-3 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Karim</span>
                  </button>

                  <button
                    onClick={declineKarim}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl py-1.5 px-3 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Decline (Reopen Gap)
                  </button>
                </div>
              )}

              {selectedNodeId === 'transport' && (
                <div className="flex flex-col gap-1.5">
                  {isTransportBlocked ? (
                    <button
                      onClick={() => assignDriver('Tariq', '৳ 800')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Assign Driver Tariq (৳ 800)</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
                      ✓ Driver Tariq Scheduled
                    </div>
                  )}

                  <button
                    onClick={() => {
                      assignDriver('Belal', '৳ 900');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-1.5 px-3 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Assign Alternative Driver (Belal)
                  </button>
                </div>
              )}

              {selectedNodeId === 'payment' && (
                <div className="flex flex-col gap-1.5">
                  {!isPaymentPaid ? (
                    <button
                      onClick={processPayment}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay ৳ 12,500 via bKash</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
                      ✓ Paid via bKash
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
          </>
        )}
      </div>

      {/* Floating Composer & Messages Toggle Button (When drawer is closed) */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => {
            setChatOpen(true);
            showToast('✦ C-Link Composer & Messages opened');
          }}
          className="fixed bottom-5 right-6 z-40 bg-gray-950 hover:bg-black text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Composer & Messages</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </motion.button>
      )}

      {/* C-Link Composer & Semantic Direct Messages Slide-over Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed top-14 right-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-40 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="h-14 px-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>C-Link Composer</span>
                    <span className="text-[10px] text-indigo-300 font-mono">✦</span>
                  </div>
                  <div className="text-[10px] text-gray-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Live Causal Loop • Direct Messages</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Semantic Action Pills */}
            <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
                Intent:
              </span>
              <button
                onClick={() => sendChatMessage('Accept Karim 20kg')}
                className="px-2.5 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold cursor-pointer whitespace-nowrap transition-colors"
              >
                ⚡ Accept Karim
              </button>
              <button
                onClick={() => sendChatMessage('Assign driver Tariq for ৳800')}
                className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold cursor-pointer whitespace-nowrap transition-colors"
              >
                🚚 Assign Tariq
              </button>
              <button
                onClick={() => sendChatMessage('Pay ৳12,500 via bKash')}
                className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold cursor-pointer whitespace-nowrap transition-colors"
              >
                💳 Pay bKash
              </button>
              <button
                onClick={() => sendChatMessage('Current reality status overview')}
                className="px-2.5 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold cursor-pointer whitespace-nowrap transition-colors"
              >
                📊 Status
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8F9FA]">
              {state.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    {msg.sender === 'user' ? (
                      <>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                        <span className="text-[11px] font-bold text-gray-700">You (Sabbir)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span className="text-[11px] font-bold text-indigo-900">C-Link Composer ✦</span>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Transient AI Causal Reasoning Indicator */}
              {state.aiTransient.active && (
                <div className="flex items-center gap-2 p-2.5 bg-indigo-50 border border-indigo-200/80 rounded-2xl text-xs text-indigo-900 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span className="font-semibold">{state.aiTransient.text}</span>
                </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="p-3 bg-white border-t border-gray-200 flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-1.5 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type in English or বাংলা (e.g., 'Karim accept koro')..."
                  className="flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => {
                    showToast('✦ Voice recognition listening...');
                    setTimeout(() => {
                      sendChatMessage('Check reality status and show next action');
                    }, 1000);
                  }}
                  title="Voice Intent (Bangla/English)"
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer transition-colors"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    chatInput.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title="Execute Semantic Action"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between px-1 text-[10px] text-gray-400">
                <span>Semantic actions alter live reality directly</span>
                <span>Press Enter ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Reality (WANT) Modal */}
      <CreateRealityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(newOp) => {
          createOperation(newOp);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        document={activeViewerDoc}
        onClose={() => setActiveViewerDoc(null)}
        onDownload={(doc) => downloadDocument(doc)}
      />
    </div>
  );
}
