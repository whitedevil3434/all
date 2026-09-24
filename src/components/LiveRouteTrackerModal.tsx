import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, MapPin, Phone, MessageSquare, Clock, Check, X, Shield, Navigation } from 'lucide-react';
import { ScenarioPreset } from '../data/journeyScenarios';

interface LiveRouteTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioPreset;
  lang: 'bn' | 'en';
  realityStage: string;
}

export function LiveRouteTrackerModal({
  isOpen,
  onClose,
  scenario,
  lang,
  realityStage,
}: LiveRouteTrackerModalProps) {
  const [messageSent, setMessageSent] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen) return null;

  const isSettled = realityStage === 'settled';

  const milestones = [
    {
      id: 1,
      name: lang === 'bn' ? `${scenario.primaryActor.location} (পিকআপ ১)` : `${scenario.primaryActor.location} (Pickup 1)`,
      detail: `${scenario.primaryActor.quantity} ${scenario.item} loaded`,
      status: 'completed',
      time: '08:45 AM',
    },
    {
      id: 2,
      name: lang === 'bn' ? `${scenario.candidates[0].locationBn} (পিকআপ ২)` : `${scenario.candidates[0].location} (Pickup 2)`,
      detail: `${scenario.gapQuantity} ${scenario.item} loaded`,
      status: 'completed',
      time: '09:20 AM',
    },
    {
      id: 3,
      name: lang === 'bn' ? 'মহাখালী এক্সপ্রেসওয়ে (চলমান)' : 'Mohakhali Expressway (En Route)',
      detail: lang === 'bn' ? 'যানবাহন গতি: ৪২ কিমি/ঘণ্টা • দূরত্ব বাকি ৩.২ কিমি' : 'Speed: 42 km/h • Remaining: 3.2 km',
      status: isSettled ? 'completed' : 'current',
      time: isSettled ? '09:42 AM' : 'LIVE NOW',
    },
    {
      id: 4,
      name: lang === 'bn' ? scenario.destinationBn : scenario.destination,
      detail: lang === 'bn' ? 'চূড়ান্ত গন্তব্য • রিসিভিং ডক' : 'Final Destination • Receiving Dock',
      status: isSettled ? 'completed' : 'upcoming',
      time: scenario.dueTime,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    setMessageSent(true);
    setCustomMsg('');
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-neo-bg w-full max-w-md rounded-3xl p-6 shadow-neo-up-xl border border-black/[0.06] relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {lang === 'bn' ? 'লাইভ লজিস্টিকস ও রুট ট্র্যাকিং' : 'Live Logistics & Route Tracking'}
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">
                {scenario.driver.vehicle}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-neo-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Driver Contact Box */}
        <div className="my-4 p-4 rounded-2xl bg-neo-bg border border-black/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#1C1C1A] text-white flex items-center justify-center font-bold text-sm">
              TA
            </div>
            <div>
              <span className="font-bold text-sm text-gray-900 block">
                {lang === 'bn' ? scenario.driver.nameBn : scenario.driver.name}
              </span>
              <span className="text-[11px] text-gray-500">
                {scenario.driver.phone} • {scenario.driver.cost}
              </span>
            </div>
          </div>

          <a
            href={`tel:${scenario.driver.phone.replace(/[^0-9]/g, '')}`}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-neo-down-sm transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'কল করুন' : 'Call'}</span>
          </a>
        </div>

        {/* Milestones Trail */}
        <div className="flex flex-col gap-3 my-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {lang === 'bn' ? 'যাত্রার ধাপসমূহ' : 'Route Milestones'}
          </span>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {milestones.map((m) => (
              <div key={m.id} className="relative">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    m.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : m.status === 'current'
                      ? 'bg-blue-600 ring-4 ring-blue-100 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                >
                  {m.status === 'completed' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      m.status === 'current'
                        ? 'text-blue-700'
                        : m.status === 'completed'
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {m.name}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">{m.time}</span>
                </div>
                <span className="text-[11px] text-gray-500 block mt-0.5">{m.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Message Form */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/50 flex flex-col gap-2">
          <label className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>{lang === 'bn' ? 'ড্রাইভারকে বার্তা পাঠান' : 'Direct Dispatch Ping'}</span>
            {messageSent && (
              <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> {lang === 'bn' ? 'বার্তা পৌঁছেছে' : 'Sent'}
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'উদা: গেট ২ দিয়ে গাড়ি প্রবেশ করান...'
                  : 'e.g. Enter through Gate 2 at dock...'
              }
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/40 focus:outline-hidden focus:border-black"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1C1C1A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
            >
              {lang === 'bn' ? 'পাঠান' : 'Send'}
            </button>
          </div>
        </form>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-neo-bg text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
        >
          {lang === 'bn' ? 'বন্ধ করুন' : 'Close Tracker'}
        </button>
      </motion.div>
    </div>
  );
}
