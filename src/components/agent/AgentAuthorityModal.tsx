import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  X,
  Sliders,
  Check,
  AlertTriangle,
  Lock,
  Sparkles,
  Bot,
  User,
  Building,
  Cpu,
  Save,
  RotateCcw
} from 'lucide-react';
import { AuthorityManifest, DEFAULT_KARIM_BUYER_AGENT } from '../../engine/agent/ActorAgentEngine';

interface AgentAuthorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifest: AuthorityManifest;
  onSaveManifest: (updated: AuthorityManifest) => void;
  lang?: 'bn' | 'en';
}

export const AgentAuthorityModal: React.FC<AgentAuthorityModalProps> = ({
  isOpen,
  onClose,
  manifest,
  onSaveManifest,
  lang = 'bn'
}) => {
  const [formData, setFormData] = useState<AuthorityManifest>({ ...manifest });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveManifest(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_KARIM_BUYER_AGENT });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-neutral-200/80 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#121214] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight">Your OathLink Agent</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    BOUND REPRESENTATIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {lang === 'bn'
                    ? 'আপনার পক্ষ থেকে দরদাম ও সিদ্ধান্ত নেওয়ার স্পষ্ট ক্ষমতা ও সীমারেখা'
                    : 'Explicit capability & authority boundaries for autonomous representation'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Identity & Distinction */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
              <Bot className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-700 leading-relaxed">
                <span className="font-semibold text-neutral-900 block mb-0.5">
                  Constitutional Rule: Agent ≠ Actor
                </span>
                {lang === 'bn'
                  ? 'আপনার এজেন্ট কখনো "আমি করিম" বলবে না; সে বলবে "করিমের এজেন্ট হিসেবে বলছি"। প্রতিটি চুক্তি আপনার নির্দিষ্ট সীমার ভেতরেই সম্পন্ন হবে।'
                  : 'Your agent will never pretend to be you; it acts strictly as "Acting on behalf of Karim" within authorized limits.'}
              </div>
            </div>

            {/* Price Boundaries */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                  {lang === 'bn' ? 'দরদাম ও মূল্যের সীমারেখা (Price Limits)' : 'Price Authority Boundaries'}
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">Currency: ৳ BDT / kg</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500 font-medium mb-1">
                    {lang === 'bn' ? 'স্বয়ংক্রিয় অনুমোদন সীমা (Auto-Accept)' : 'Auto-Accept Ceiling'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">≤ ৳</span>
                    <input
                      type="number"
                      value={formData.autoAcceptPriceMax || 610}
                      onChange={(e) =>
                        setFormData({ ...formData, autoAcceptPriceMax: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-sm font-mono font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    {lang === 'bn' ? 'এই দরে পেলে এজেন্ট কাউকে না জিজ্ঞেস করেই লক করবে' : 'Autonomous accept without prompting'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500 font-medium mb-1">
                    {lang === 'bn' ? 'সর্বোচ্চ অনুমোদিত সীমা (Hard Ceiling)' : 'Hard Maximum Price'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">≤ ৳</span>
                    <input
                      type="number"
                      value={formData.maxPricePerUnit || 620}
                      onChange={(e) =>
                        setFormData({ ...formData, maxPricePerUnit: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-sm font-mono font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    {lang === 'bn' ? 'এর বেশি চাইলে সাথে সাথে আপনার হস্তক্ষেপ চাইবে' : 'Escalate to human if exceeded'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Boundary */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-800">
                  {lang === 'bn' ? 'একক চালানে সর্বোচ্চ পরিমাণ' : 'Max Authorized Quantity'}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-900">
                  {formData.maxQuantity} kg
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={formData.maxQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, maxQuantity: Number(e.target.value) })
                }
                className="w-full accent-neutral-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>20 kg</span>
                <span>500 kg</span>
                <span>1000 kg</span>
              </div>
            </div>

            {/* Permitted Capabilities */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                {lang === 'bn' ? 'অনুমোদিত ক্ষমতা (What Agent CAN Do)' : 'Authorized Capabilities'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    key: 'canDiscoverSuppliers',
                    title: lang === 'bn' ? 'সাপ্লায়ার ও মিল অনুসন্ধান' : 'Discover Suppliers & Mills',
                    desc: lang === 'bn' ? 'ঘাটতি পূরণে উপযুক্ত বিক্রেতাদের সাথে নিজে থেকে যোগাযোগ করবে' : 'Inquire with verified mills'
                  },
                  {
                    key: 'canNegotiatePrice',
                    title: lang === 'bn' ? 'স্বয়ংক্রিয় দরদাম (Bargaining)' : 'Autonomous Price Bargaining',
                    desc: lang === 'bn' ? 'কাউন্টার-অফার ও মার্জিন বিশ্লেষণ করে দর কষাকষি করবে' : 'Submit counter-offers within policy'
                  },
                  {
                    key: 'canAutoCommit',
                    title: lang === 'bn' ? 'শর্ত মিললে সরাসরি চুক্তি (Auto-Commit)' : 'Auto-Form Canonical Commitment',
                    desc: lang === 'bn' ? 'মূল্য ও গুণগত মান সন্তোষজনক হলে চুক্তি চূড়ান্ত করবে' : 'Lock commitment when terms match'
                  }
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(formData as any)[item.key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [item.key]: e.target.checked })
                      }
                      className="w-4 h-4 rounded-md accent-neutral-900 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">{item.title}</div>
                      <div className="text-[11px] text-neutral-500">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Prohibited Boundaries (Constitutional Guardrails) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'কঠোর নিষেধাজ্ঞা (What Agent CANNOT Do)' : 'Strict Constitutional Limits'}
              </label>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-900">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{lang === 'bn' ? 'নির্ধারিত সর্বোচ্চ দর (৳' + formData.maxPricePerUnit + ') এর এক পয়সাও বেশি দেওয়া যাবে না' : 'Cannot exceed max price limit'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-900">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{lang === 'bn' ? 'ডেলিভারি লোকেশন ও গন্তব্য পরিবর্তন করার কোনো অধিকার নেই' : 'Cannot change delivery destination'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-900">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{lang === 'bn' ? 'কোনো প্রকার ঋণ, বাকী বা অনুমোদনহীন আর্থিক ঝুঁকি নেওয়া নিষিদ্ধ' : 'Cannot borrow money or take financial credit'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-mono transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'রিসেট' : 'Reset'}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-sm transition-all cursor-pointer"
              >
                {isSavedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'সংরক্ষিত!' : 'Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'নীতিমালা সংরক্ষণ করুন' : 'Save Policy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
