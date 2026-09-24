import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  AlertTriangle,
  HelpCircle,
  Truck,
  CreditCard,
  Layers,
  Search,
  MoreVertical,
  RotateCw,
  Send,
  Paperclip,
  Mic,
  Smile,
  Home,
  CheckSquare,
  CreditCard as CardsIcon,
  Menu,
  Clock,
  ArrowDown,
  ShieldCheck,
  User,
  X,
  Phone,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  RotateCcw,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { PARTICIPANTS } from '../data/clinkData';
import { useCausalState } from '../engine/causalStore';

interface MobileWorkspaceProps {
  initialScreen?: number;
  onSwitchToDesktop?: () => void;
}

export function MobileWorkspace({ onSwitchToDesktop }: MobileWorkspaceProps) {
  const {
    state,
    setSelectedNode,
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
  } = useCausalState();

  // Mobile App Navigation State
  const [mobileTab, setMobileTab] = useState<'board' | 'tree' | 'timeline' | 'tasks' | 'chat'>('board');
  const [activeSheet, setActiveSheet] = useState<'none' | 'karim' | 'transport' | 'payment' | 'scenarios'>('none');
  const [mobileChatInput, setMobileChatInput] = useState<string>('');
  const [isFullScreenPhone, setIsFullScreenPhone] = useState<boolean>(false);
  const [tasksList, setTasksList] = useState([
    { id: 't1', title: 'Confirm Karim 20kg Rice supply', done: false },
    { id: 't2', title: 'Book covered van for 4:30 PM pickup', done: false },
    { id: 't3', title: 'Collect weighbridge certified slip', done: false },
    { id: 't4', title: 'Disburse bKash payment to suppliers', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasksList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    showToast('✦ Task status updated');
  };

  const handleSendMobileChat = () => {
    if (!mobileChatInput.trim()) return;
    sendChatMessage(mobileChatInput);
    setMobileChatInput('');
  };

  const isKarimCommitted = state.actors.karim.status === 'COMMITTED';
  const isKarimDeclined = state.actors.karim.status === 'DECLINED';
  const isKarimOffered = state.actors.karim.status === 'OFFERED';
  const isKarimAsking = state.actors.karim.status === 'ASKING';

  const isTransportScheduled = state.dependencies.transport.status === 'SCHEDULED';
  const isTransportBlocked = state.dependencies.transport.status === 'BLOCKED';

  const isDeliveryCompleted = state.dependencies.delivery.status === 'DELIVERED';
  const isPaymentPaid = state.dependencies.payment.status === 'PAID';

  return (
    <div className="w-full min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-start py-2 sm:py-4 px-1 sm:px-4 font-sans select-none text-[#1E293B]">
      {/* Toast Notification */}
      <AnimatePresence>
        {state.toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>{state.toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Mobile Control Bar (Desktop view controls) */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-2.5 shadow-xs mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            C
          </div>
          <div>
            <span className="font-extrabold text-xs text-gray-900 block">
              C-Link Live Mobile App
            </span>
            <span className="text-[10px] text-gray-500">
              {state.coverage.isFullyCovered ? '100% Rice Covered' : '20kg Pending • 1 Blocker'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Scenario Picker */}
          <button
            onClick={() => setActiveSheet('scenarios')}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-indigo-200"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Scenarios</span>
          </button>

          {/* Reset button */}
          <button
            onClick={resetAll}
            title="Reset Reality"
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Switch to Desktop */}
          {onSwitchToDesktop && (
            <button
              onClick={onSwitchToDesktop}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Desktop
            </button>
          )}

          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullScreenPhone(!isFullScreenPhone)}
            title="Toggle Device Frame"
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg cursor-pointer hidden sm:block"
          >
            {isFullScreenPhone ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DEVICE CONTAINER */}
      <div
        className={`w-full bg-white flex flex-col relative transition-all duration-300 ${
          isFullScreenPhone
            ? 'max-w-xl min-h-[92vh] rounded-3xl shadow-2xl border-4 border-gray-800'
            : 'max-w-md min-h-[844px] h-[90vh] sm:rounded-[44px] shadow-2xl sm:border-[8px] sm:border-gray-900 overflow-hidden'
        }`}
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="h-10 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0 z-30 select-none">
          <span className="text-xs font-bold text-gray-800">9:41</span>
          {/* Hardware pill */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700">
            <span>5G</span>
            <div className="w-4 h-2 rounded-xs border border-gray-700 flex items-center p-0.5">
              <div className="w-2.5 h-full bg-gray-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <header className="px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-gray-900 leading-tight">
                  Rice Delivery (Today)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] text-gray-500 leading-none">
                50kg Rice • Office • Today, 6:00 PM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSheet('scenarios')}
              className="p-1.5 hover:bg-gray-100 rounded-full text-indigo-600 cursor-pointer"
              title="Jump to Scenario"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <div className="relative">
              <img
                src={PARTICIPANTS[3].avatar}
                alt="Sabbir"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-100"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-1 ring-white" />
            </div>
          </div>
        </header>

        {/* Dynamic Attention Alert Banner */}
        <div
          onClick={() => {
            if (isTransportBlocked) {
              setActiveSheet('transport');
            } else if (!isKarimCommitted) {
              setActiveSheet('karim');
            } else if (!isPaymentPaid) {
              setActiveSheet('payment');
            }
          }}
          className={`px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
            state.coverage.isFullyCovered && isTransportScheduled && isPaymentPaid
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
              : 'bg-amber-50 text-amber-900 border-b border-amber-200/70'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate text-[11px]">
              {state.coverage.isFullyCovered && isTransportScheduled && isPaymentPaid
                ? '✓ All requirements completed & paid!'
                : isTransportBlocked
                ? '✦ Delivery is blocked (driver required)'
                : !isKarimCommitted
                ? '✦ Karim offer 20kg awaiting acceptance'
                : '✦ Settle ৳12,500 pending payment'}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        </div>

        {/* Mobile Sub Tabs */}
        <div className="flex items-center justify-between px-3 pt-2 bg-white border-b border-gray-100 text-xs font-bold text-gray-500 shrink-0">
          <button
            onClick={() => setMobileTab('board')}
            className={`pb-2 px-2 transition-all relative cursor-pointer ${
              mobileTab === 'board' ? 'text-blue-600' : 'hover:text-gray-900'
            }`}
          >
            <span>Living Board</span>
            {mobileTab === 'board' && (
              <motion.div
                layoutId="mobileTabIndicator"
                className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
              />
            )}
          </button>

          <button
            onClick={() => setMobileTab('tree')}
            className={`pb-2 px-2 transition-all relative cursor-pointer ${
              mobileTab === 'tree' ? 'text-blue-600' : 'hover:text-gray-900'
            }`}
          >
            <span>Causal Tree</span>
            {mobileTab === 'tree' && (
              <motion.div
                layoutId="mobileTabIndicator"
                className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
              />
            )}
          </button>

          <button
            onClick={() => setMobileTab('timeline')}
            className={`pb-2 px-2 transition-all relative cursor-pointer ${
              mobileTab === 'timeline' ? 'text-blue-600' : 'hover:text-gray-900'
            }`}
          >
            <span>Timeline</span>
            {mobileTab === 'timeline' && (
              <motion.div
                layoutId="mobileTabIndicator"
                className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
              />
            )}
          </button>

          <button
            onClick={() => setMobileTab('tasks')}
            className={`pb-2 px-2 transition-all relative cursor-pointer ${
              mobileTab === 'tasks' ? 'text-blue-600' : 'hover:text-gray-900'
            }`}
          >
            <span>Tasks</span>
            {mobileTab === 'tasks' && (
              <motion.div
                layoutId="mobileTabIndicator"
                className="h-0.5 w-full bg-blue-600 absolute bottom-0 left-0"
              />
            )}
          </button>
        </div>

        {/* MAIN MOBILE SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-3 space-y-3 pb-44">
          {/* TAB 1: LIVING BOARD */}
          {mobileTab === 'board' && (
            <>
              {/* Today's Work Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Today's Requirement
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Due: 6:00 PM
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-black text-gray-900">
                    50kg Rice (Office)
                  </h3>
                  <span className="text-xs font-extrabold text-blue-600">
                    {state.coverage.covered}kg / {state.coverage.total}kg ({state.coverage.isFullyCovered ? '100%' : '60%'})
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                  {/* Rahim portion */}
                  <div style={{ width: '60%' }} className="h-full bg-emerald-500" title="Rahim (30kg Committed)" />
                  {/* Karim portion */}
                  {isKarimCommitted ? (
                    <div style={{ width: '40%' }} className="h-full bg-emerald-500" title="Karim (20kg Committed)" />
                  ) : isKarimDeclined ? (
                    <div style={{ width: '40%' }} className="h-full bg-rose-400" title="Karim Declined (20kg Gap)" />
                  ) : (
                    <div style={{ width: '40%' }} className="h-full bg-blue-400 animate-pulse" title="Karim (20kg Offered)" />
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <span>● Rahim 30kg (Committed)</span>
                  <span>
                    {isKarimCommitted
                      ? '● Karim 20kg (Committed)'
                      : isKarimDeclined
                      ? '● 20kg Gap (Reopened)'
                      : '● Karim 20kg (Offered)'}
                  </span>
                </div>
              </div>

              {/* ACTIVE CARDS LIST */}
              <div className="space-y-2.5">
                {/* 1. RAHIM CARD */}
                <div
                  onClick={() => showToast('✦ Rahim 30kg committed. Agreement valid.')}
                  className="bg-white rounded-2xl border border-emerald-200 p-3.5 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={PARTICIPANTS[1].avatar}
                      alt="Rahim"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Rahim</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          COMMITTED
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-gray-900 mt-0.5">
                        30kg Rice • ৳ 3,600
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Ready for pickup at farmer point
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>

                {/* 2. KARIM CARD (CRITICAL INTERACTIVE CARD) */}
                <div
                  className={`bg-white rounded-2xl border p-3.5 shadow-xs transition-all ${
                    isKarimCommitted
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : isKarimDeclined
                      ? 'border-rose-200 bg-rose-50/10'
                      : 'border-blue-300 ring-2 ring-blue-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={PARTICIPANTS[0].avatar}
                        alt="Karim"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">Karim</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isKarimCommitted
                                ? 'bg-emerald-50 text-emerald-700'
                                : isKarimDeclined
                                ? 'bg-rose-50 text-rose-700'
                                : isKarimAsking
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {isKarimCommitted
                              ? 'COMMITTED'
                              : isKarimDeclined
                              ? 'DECLINED'
                              : isKarimAsking
                              ? 'ASKING...'
                              : 'OFFERED'}
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-gray-900 mt-0.5">
                          20kg Rice • ৳ 2,400
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {isKarimCommitted
                            ? 'Committed to today 6:00 PM delivery'
                            : isKarimDeclined
                            ? 'Declined delivery terms'
                            : 'Mill No. 4, Mirpur • Pickup ready'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveSheet('karim')}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1-Tap Action buttons */}
                  {!isKarimCommitted && !isKarimDeclined && (
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
                      <button
                        onClick={acceptKarim}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept 20kg</span>
                      </button>
                      <button
                        onClick={askKarim}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Ask
                      </button>
                      <button
                        onClick={() => setActiveSheet('karim')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  )}

                  {isKarimCommitted && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mt-2 pt-2 border-t border-emerald-100">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Commitment Signed
                      </span>
                      <button
                        onClick={() => setActiveSheet('karim')}
                        className="text-[11px] text-emerald-800 underline cursor-pointer font-semibold"
                      >
                        View Agreement
                      </button>
                    </div>
                  )}

                  {isKarimDeclined && (
                    <div className="flex items-center justify-between text-xs text-rose-700 font-bold mt-2 pt-2 border-t border-rose-100">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        20kg Gap Reopened
                      </span>
                      <button
                        onClick={() => {
                          showToast('✦ Inviting backup Mina (15kg)');
                        }}
                        className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        + Invite Mina (15kg)
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. TRANSPORT CARD (DEPENDENCY) */}
                <div
                  className={`bg-white rounded-2xl border p-3.5 shadow-xs transition-all ${
                    isTransportBlocked
                      ? 'border-rose-200 bg-rose-50/10'
                      : 'border-emerald-200 bg-emerald-50/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isTransportBlocked ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">Transport</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isTransportBlocked
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isTransportBlocked ? 'BLOCKED ⚠️' : 'SCHEDULED ✓'}
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-gray-900 mt-0.5">
                          {isTransportScheduled
                            ? `Driver Tariq (${state.dependencies.transport.driver?.cost})`
                            : 'Driver not confirmed'}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {isTransportScheduled
                            ? 'Covered Van • Pickup scheduled at 4:30 PM'
                            : 'Required by 4:00 PM for on-time delivery'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveSheet('transport')}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {isTransportBlocked && (
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
                      <button
                        onClick={() => assignDriver('Tariq', '৳ 800')}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>⚡ Assign Tariq (৳ 800)</span>
                      </button>
                      <button
                        onClick={() => setActiveSheet('transport')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Options
                      </button>
                    </div>
                  )}

                  {isTransportScheduled && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mt-2 pt-2 border-t border-emerald-100">
                      <span>✓ Driver en route for pickup</span>
                      <a
                        href="tel:01712482910"
                        className="flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Driver</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. DELIVERY & PROOF CARD */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Delivery</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDeliveryCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isDeliveryCompleted ? 'DELIVERED' : 'PENDING'}
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-gray-900 mt-0.5">
                        Gulshan 2 Office
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {isDeliveryCompleted ? 'Verified at Security Gate' : 'Expected: 6:00 PM'}
                      </div>
                    </div>
                  </div>

                  {!isDeliveryCompleted && isTransportScheduled && (
                    <button
                      onClick={confirmDelivery}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Confirm Received
                    </button>
                  )}
                  {isDeliveryCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>

                {/* 5. PAYMENT CARD */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isPaymentPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Total Payment</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaymentPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isPaymentPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                      <div className="text-xs font-black text-gray-900 mt-0.5">
                        ৳ 12,500
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Rahim (৳3.6k) + Karim (৳2.4k) + Van (৳800)
                      </div>
                    </div>
                  </div>

                  {!isPaymentPaid ? (
                    <button
                      onClick={processPayment}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Pay via bKash
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600">✓ Settled</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CAUSAL TREE VIEW */}
          {mobileTab === 'tree' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col items-center gap-3">
              <div className="text-center pb-2 border-b border-gray-100 w-full">
                <span className="text-xs font-bold text-gray-900">
                  Full Causal Projection Tree
                </span>
                <p className="text-[11px] text-gray-500">
                  Living hierarchy from Want to Physical Reality
                </p>
              </div>

              {/* Node: WANT */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 w-full text-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase">WANT ✦</span>
                <h4 className="text-sm font-black text-gray-900">50kg Rice (Office)</h4>
                <span className="text-[10px] text-gray-500">Due: Today, 6:00 PM</span>
              </div>

              <ArrowDown className="w-4 h-4 text-gray-400" />

              {/* Node: ACTORS */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase">Rahim (30kg)</span>
                  <div className="text-xs font-extrabold text-gray-900">Committed</div>
                  <span className="text-[10px] text-emerald-600">✓ Ready</span>
                </div>

                <div
                  className={`rounded-xl p-2.5 text-center border ${
                    isKarimCommitted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : isKarimDeclined
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase">Karim (20kg)</span>
                  <div className="text-xs font-extrabold text-gray-900">{state.actors.karim.status}</div>
                  <span className="text-[10px]">
                    {isKarimCommitted ? '✓ Signed' : isKarimDeclined ? '⚠️ Gap' : 'Offered'}
                  </span>
                </div>
              </div>

              <ArrowDown className="w-4 h-4 text-gray-400" />

              {/* Node: COVERAGE */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 w-full text-center">
                <span className="text-[10px] font-bold text-gray-500">COVERAGE</span>
                <div className="text-sm font-extrabold text-gray-900">
                  {state.coverage.covered}kg / {state.coverage.total}kg ({state.coverage.isFullyCovered ? '100%' : '60%'})
                </div>
              </div>

              <ArrowDown className="w-4 h-4 text-gray-400" />

              {/* Node: DEPENDENCIES */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div
                  className={`rounded-xl p-2.5 text-center border ${
                    isTransportBlocked
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase">Transport</span>
                  <div className="text-xs font-bold text-gray-900">{state.dependencies.transport.status}</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Delivery</span>
                  <div className="text-xs font-bold text-gray-900">
                    {state.dependencies.delivery.status}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {mobileTab === 'timeline' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Causal Event Timeline
              </span>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-200">
                {state.timelineEvents.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-3 relative pl-6">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white absolute left-0 ring-2 ring-white text-[10px] ${
                        evt.type === 'commit' || evt.type === 'verified'
                          ? 'bg-emerald-500'
                          : evt.type === 'offer'
                          ? 'bg-blue-500'
                          : evt.type === 'blocked'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    >
                      {evt.type === 'commit' ? <Check className="w-3 h-3" /> : '✦'}
                    </div>
                    <div className="flex-1 bg-gray-50 p-2.5 rounded-xl text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{evt.title}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{evt.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{evt.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TASKS CHECKLIST */}
          {mobileTab === 'tasks' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900">
                  Execution Checklist
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {tasksList.filter((t) => t.done).length} / {tasksList.length} Done
                </span>
              </div>

              <div className="space-y-2">
                {tasksList.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        t.done
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {t.done && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs ${
                        t.done ? 'line-through text-gray-400' : 'text-gray-800 font-medium'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* INTEGRATED BOTTOM ACTION DOCK (Above Bottom Nav) */}
        <div className="absolute bottom-11 inset-x-0 z-30 pointer-events-none flex flex-col justify-end">
          <div className="px-3 pb-2 pt-2 space-y-2 pointer-events-auto bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent">
            {/* AI Transient Status Pill */}
            {state.aiTransient.active && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-1 bg-gray-900/95 backdrop-blur-md text-white rounded-xl text-[11px] font-semibold flex items-center gap-1.5 shadow-md w-fit max-w-full"
              >
                <Sparkles className="w-3 h-3 text-indigo-400 animate-spin shrink-0" />
                <span className="truncate">{state.aiTransient.text}</span>
              </motion.div>
            )}

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => sendChatMessage('আজকের important কাজের কী অবস্থা?')}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-semibold text-gray-700 shadow-xs shrink-0 hover:bg-gray-50 cursor-pointer active:scale-95"
              >
                🌾 কাজের কী অবস্থা?
              </button>
              {!isKarimCommitted && (
                <button
                  onClick={() => acceptKarim()}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-full text-[11px] font-bold shadow-xs shrink-0 hover:bg-blue-700 cursor-pointer active:scale-95"
                >
                  ✓ Karim 20kg গ্রহণ করো
                </button>
              )}
              {isTransportBlocked && (
                <button
                  onClick={() => assignDriver('Tariq', '৳ 800')}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded-full text-[11px] font-bold shadow-xs shrink-0 hover:bg-indigo-700 cursor-pointer active:scale-95"
                >
                  ⚡ ড্রাইভার তারিক বুক করো
                </button>
              )}
              {!isPaymentPaid && (
                <button
                  onClick={() => processPayment()}
                  className="px-2.5 py-1 bg-amber-600 text-white rounded-full text-[11px] font-bold shadow-xs shrink-0 hover:bg-amber-700 cursor-pointer active:scale-95"
                >
                  ৳ পেমেন্ট পরিশোধ
                </button>
              )}
            </div>

            {/* Bottom Chat Composer Input Pill */}
            <div className="bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
              <button
                onClick={() => showToast('✦ Attachment supported')}
                className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              <input
                type="text"
                value={mobileChatInput}
                onChange={(e) => setMobileChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMobileChat()}
                placeholder="Tell C-Link... (e.g. 'Karim কে গ্রহণ করো')"
                className="flex-1 text-xs text-gray-900 outline-none placeholder-gray-400 font-medium"
              />

              <button
                onClick={() => {
                  setMobileChatInput('Karim কে ২০ কেজি চাল পাঠাতে বলো');
                  showToast('✦ Voice input transcribed');
                }}
                className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleSendMobileChat}
                className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* iOS Native Bottom Navigation Bar */}
        <nav className="h-11 bg-white border-t border-gray-200 px-6 flex items-center justify-between shrink-0 z-30 select-none">
          <button
            onClick={() => setMobileTab('board')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              mobileTab === 'board' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-bold">Living</span>
          </button>

          <button
            onClick={() => setMobileTab('tree')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              mobileTab === 'tree' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[9px] font-medium">Tree</span>
          </button>

          <button
            onClick={() => setMobileTab('timeline')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              mobileTab === 'timeline' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[9px] font-medium">Timeline</span>
          </button>

          <button
            onClick={() => setMobileTab('tasks')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              mobileTab === 'tasks' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[9px] font-medium">Tasks</span>
          </button>
        </nav>

        {/* BOTTOM SHEET 1: KARIM PROFILE & COMMITMENT MODAL */}
        <AnimatePresence>
          {activeSheet === 'karim' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs z-40 flex flex-col justify-end"
              onClick={() => setActiveSheet('none')}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-3xl p-5 max-h-[85%] overflow-y-auto space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={PARTICIPANTS[0].avatar}
                      alt="Karim"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900">
                        Karim (Local Mill Supplier)
                      </h3>
                      <span className="text-[11px] text-gray-500">
                        Mill No. 4, Mirpur • Trust Score: 98%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSheet('none')}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stated Offer:</span>
                    <span className="font-extrabold text-blue-900">20kg Miniket Rice</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Offered Price:</span>
                    <span className="font-extrabold text-gray-900">৳ 2,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-semibold text-emerald-700">Today, 4:30 PM Pickup</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <span className="font-bold text-blue-700">{state.actors.karim.status}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  {!isKarimCommitted ? (
                    <button
                      onClick={() => {
                        acceptKarim();
                        setActiveSheet('none');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept 20kg & Commit</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
                      ✓ Karim is Committed (Signed)
                    </div>
                  )}

                  <button
                    onClick={() => {
                      askKarim();
                      setActiveSheet('none');
                    }}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Ask Karim Questions
                  </button>

                  <button
                    onClick={() => {
                      declineKarim();
                      setActiveSheet('none');
                    }}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Decline Offer (Reopen Gap)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM SHEET 2: TRANSPORT RESOLUTION MODAL */}
        <AnimatePresence>
          {activeSheet === 'transport' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs z-40 flex flex-col justify-end"
              onClick={() => setActiveSheet('none')}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-3xl p-5 max-h-[85%] overflow-y-auto space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">
                      Transport Logistics Resolution
                    </h3>
                    <span className="text-[11px] text-gray-500">
                      Required for pickup from Rahim and Karim
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveSheet('none')}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => {
                      assignDriver('Tariq', '৳ 800');
                      setActiveSheet('none');
                    }}
                    className="p-3 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        T
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          Tariq (Covered Van)
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Available now • Rating 4.9 ★ • ৳ 800
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold">
                      Select
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      assignDriver('Belal', '৳ 900');
                      setActiveSheet('none');
                    }}
                    className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-600 text-white flex items-center justify-center font-bold text-xs">
                        B
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          Belal (Pickup 1 Ton)
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Available 5:00 PM • ৳ 900
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold">
                      Select
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM SHEET 3: QUICK CANONICAL SCENARIOS JUMP */}
        <AnimatePresence>
          {activeSheet === 'scenarios' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs z-40 flex flex-col justify-end"
              onClick={() => setActiveSheet('none')}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-3xl p-5 max-h-[85%] overflow-y-auto space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />

                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">
                      Causal States Fast-Forward
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Jump to any of the 15 canonical operational moments
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSheet('none')}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      applyScenario(1);
                      setActiveSheet('none');
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left font-semibold text-gray-800"
                  >
                    1. Initial Living Board
                  </button>
                  <button
                    onClick={() => {
                      applyScenario(3);
                      setActiveSheet('none');
                    }}
                    className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-left font-semibold text-indigo-900"
                  >
                    3. AI Interpreting
                  </button>
                  <button
                    onClick={() => {
                      applyScenario(8);
                      setActiveSheet('none');
                    }}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left font-semibold text-blue-900"
                  >
                    8. Karim Offered 20kg
                  </button>
                  <button
                    onClick={() => {
                      applyScenario(10);
                      setActiveSheet('none');
                    }}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left font-semibold text-emerald-900"
                  >
                    10. 100% Committed
                  </button>
                  <button
                    onClick={() => {
                      applyScenario(11);
                      setActiveSheet('none');
                    }}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left font-semibold text-amber-900"
                  >
                    11. Transport Unblock
                  </button>
                  <button
                    onClick={() => {
                      applyScenario(14);
                      setActiveSheet('none');
                    }}
                    className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-left font-semibold text-rose-900"
                  >
                    14. Karim Decline (Gap)
                  </button>
                  <button
                    onClick={() => {
                      applyScenario(15);
                      setActiveSheet('none');
                    }}
                    className="col-span-2 p-2.5 rounded-xl border border-emerald-300 bg-emerald-100 hover:bg-emerald-200 text-center font-black text-emerald-900"
                  >
                    15. Fully Delivered & Paid (Complete State)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
