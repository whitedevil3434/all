import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUp,
  X,
  User,
  Trash2,
  ChevronDown,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { SemanticAction, RealityContext, RealityObject } from '../types';
import { RealityObjectCard } from './RealityObjectCard';

interface CopilotComposerProps {
  currentReality?: RealityContext;
  onSemanticAction: (action: SemanticAction) => RealityObject | undefined;
  onActionClick?: (actionName: string, objectId: string) => void;
  onFocusObject?: (objectId: string) => void;
  isEmbedded?: boolean;
  onTransientObservation?: (observation: string) => void;
}

interface DialogueMessage {
  id: string;
  sender: 'user' | 'composer';
  text: string;
  observation?: string;
  actionType?: string;
  objectId?: string;
  associatedObject?: RealityObject;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  { label: '🌾 50kg চাল দরকার', prompt: 'আমার 50kg চাল দরকার' },
  { label: '👤 Rahim 30kg দিতে পারবে', prompt: 'Rahim 30kg দিতে পারবে' },
  { label: '⚠️ 20kg open gap', prompt: '20kg এখনও open' },
  { label: '🔍 করিম ও মিনাকে খোঁজো', prompt: 'Find Karim and Mina' },
  { label: '💬 করিমকে জিজ্ঞেস করো', prompt: 'Karim কে জিজ্ঞেস করো' },
  { label: '✅ করিমকে অ্যাকসেপ্ট করো', prompt: 'Accept Karim' },
  { label: '✨ পরবর্তী ধাপ দেখাও', prompt: 'পরবর্তী ধাপ কী হবে দেখাও' },
];

export function CopilotComposer({
  currentReality,
  onSemanticAction,
  onActionClick,
  onFocusObject,
  isEmbedded = false,
  onTransientObservation,
}: CopilotComposerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transientStatus, setTransientStatus] = useState<string | null>(null);

  // Initialize with initial want object if already present
  const initialWant = currentReality?.graph?.objects.find((o) => o.kind === 'WANT');

  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 'welcome',
      sender: 'composer',
      text: 'স্বাগতম! আমি C-Link Reality Composer। আপনি কী করতে চান লিখুন (যেমন: "আমার 50kg চাল দরকার") অথবা নিচের কুইক অ্যাকশনগুলোতে ট্যাপ করুন।',
      observation: '✦ Reality Composer Ready',
      objectId: initialWant?.id,
      associatedObject: initialWant,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const executePrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMessageId = 'msg-' + Date.now();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append User Message
    const newMsg: DialogueMessage = {
      id: userMessageId,
      sender: 'user',
      text: promptText,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsLoading(true);
    setTransientStatus('✦ Interpreting causal intent...');
    if (onTransientObservation) onTransientObservation('✦ Interpreting causal intent...');

    try {
      const res = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, currentReality }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.response || 'চাহিদা অনুযায়ী রিয়ালিটি আপডেট সম্পন্ন হয়েছে।';
      const observation = data.transientObservation || '✦ Reality updated';

      setTransientStatus(observation);
      if (onTransientObservation) onTransientObservation(observation);

      // Apply Canonical Semantic Action to Reality Graph & get the mutated object
      let affectedObject: RealityObject | undefined;
      if (data.semanticAction) {
        affectedObject = onSemanticAction(data.semanticAction);
      }

      // Append Composer Response with the interactive card inside!
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'composer',
          text: responseText,
          observation: observation,
          actionType: data.semanticAction?.type,
          objectId: affectedObject?.id,
          associatedObject: affectedObject,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Composer request failed:', err);

      // Graceful local resilient response
      const fallbackResponse = `আমি "${promptText}" গ্রহণ করেছি এবং রিয়ালিটিতে প্রজেক্ট করেছি।`;
      const fallbackObs = `✦ Processed: ${promptText.slice(0, 25)}`;

      setTransientStatus(fallbackObs);
      if (onTransientObservation) onTransientObservation(fallbackObs);

      const affected = onSemanticAction({
        type: 'CREATE_WANT',
        payload: { title: promptText.slice(0, 30), quantity: 1, unit: 'unit' },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-fallback-' + Date.now(),
          sender: 'composer',
          text: fallbackResponse,
          observation: fallbackObs,
          actionType: 'CREATE_WANT',
          objectId: affected?.id,
          associatedObject: affected,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setTransientStatus(null);
      }, 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePrompt(inputValue);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'composer',
        text: 'কথোপকথন রিসেট করা হয়েছে। আপনি নতুন কোনো চাহিদা বা কমান্ড দিতে পারেন।',
        observation: '✦ Ready',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isEmbedded && !isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 h-13 bg-gray-900 text-white rounded-full px-4.5 shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all z-50 group border border-white/20 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
        <div className="flex flex-col text-left">
          <span className="font-bold text-[12px] leading-tight">Reality Composer</span>
          <span className="text-[10px] text-gray-400 leading-tight">✦ Conversation Active</span>
        </div>
      </motion.button>
    );
  }

  return (
    <>
      {!isEmbedded && isOpen && (
        <div
          className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        initial={isEmbedded ? {} : { y: 30, opacity: 0, scale: 0.98 }}
        animate={isEmbedded ? {} : { y: 0, opacity: 1, scale: 1 }}
        exit={isEmbedded ? {} : { y: 30, opacity: 0, scale: 0.98 }}
        className={
          isEmbedded
            ? 'w-full'
            : 'fixed bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-xl z-50'
        }
      >
        <div className="bg-white/95 backdrop-blur-2xl shadow-2xl rounded-3xl border border-black/10 overflow-hidden flex flex-col max-h-[70vh] ring-1 ring-black/5">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-gray-900 tracking-tight">
                    C-Link Composer
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {transientStatus || '✦ Living Semantic Reality Loop'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {!isEmbedded && (
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation History Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-[160px] max-h-[38vh] bg-[#FAFAFC]">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                // Look up live state of associated object from active graph if available
                const liveObject =
                  (msg.objectId
                    ? currentReality?.graph?.objects.find((o) => o.id === msg.objectId)
                    : null) || msg.associatedObject;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-2 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'composer' && (
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✦
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-[13px] leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-gray-900 text-white rounded-br-xs font-medium'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.observation && (
                        <div className="mt-1 pt-1 border-t border-gray-100 flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600">
                          <span>{msg.observation}</span>
                        </div>
                      )}

                      {/* Integrated Living Reality Card inside the AI Chat Bubble */}
                      {msg.sender === 'composer' && liveObject && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                            <span className="flex items-center gap-1 text-indigo-600 uppercase tracking-wider">
                              <Sparkles className="w-3 h-3 text-indigo-500" />
                              <span>Living Board Card</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => onFocusObject?.(liveObject.id)}
                              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>বোর্ডে দেখুন</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <RealityObjectCard
                            node={liveObject}
                            isCompact={true}
                            onAction={(actionName, objId) => {
                              onActionClick?.(actionName, objId);
                            }}
                            onCardClick={(objId) => {
                              onFocusObject?.(objId);
                            }}
                          />
                        </div>
                      )}

                      <div className="text-[9px] mt-1 text-right text-gray-400">
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-2xl w-fit text-[12px] font-medium shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>{transientStatus || '✦ Living Composer interpreting...'}</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3.5 py-1.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {QUICK_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => executePrompt(item.prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 rounded-full transition-colors border border-transparent hover:border-indigo-200 disabled:opacity-50 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Form Bar */}
          <div className="p-2.5 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tell C-Link... (e.g. 'আমার 50kg চাল দরকার' or 'Rahim 30kg দিতে পারবে')"
                disabled={isLoading}
                className="flex-1 bg-gray-100/80 border border-gray-200/60 rounded-full px-3.5 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center disabled:opacity-30 hover:bg-indigo-600 active:scale-95 transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
}
