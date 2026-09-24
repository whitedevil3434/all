import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Link2,
  Check,
  Copy,
  PackageCheck,
  QrCode,
  Wheat,
  Scale,
  Fuel,
  Navigation,
  Camera,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Send,
  AlertCircle,
  Truck,
  User,
} from 'lucide-react';
import { ScenarioPreset } from '../data/journeyScenarios';
import { causalAudio } from '../lib/causalAudio';

export interface ExternalActorCausalSurfaceProps {
  key?: string;
  actorType: 'karim' | 'tariq';
  scenario: ScenarioPreset;
  lang: 'bn' | 'en';
  onBackToLive: () => void;
  onSyncRealityEvent: (eventDescription: string) => void;
  // Shared persistent sub-task status
  karimSubTasks: {
    sacksSealed: boolean;
    moistureTested: boolean;
    pickupReady: boolean;
  };
  setKarimSubTasks: React.Dispatch<
    React.SetStateAction<{
      sacksSealed: boolean;
      moistureTested: boolean;
      pickupReady: boolean;
    }>
  >;
  tariqSubTasks: {
    fuelAdvanceRequested: boolean;
    gpsReported: boolean;
    weighSlipUploaded: boolean;
  };
  setTariqSubTasks: React.Dispatch<
    React.SetStateAction<{
      tariqSubTasks?: any;
      fuelAdvanceRequested: boolean;
      gpsReported: boolean;
      weighSlipUploaded: boolean;
    }>
  >;
}

export function ExternalActorCausalSurface({
  actorType,
  scenario,
  lang,
  onBackToLive,
  onSyncRealityEvent,
  karimSubTasks,
  setKarimSubTasks,
  tariqSubTasks,
  setTariqSubTasks,
}: ExternalActorCausalSurfaceProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePhotoUpload, setActivePhotoUpload] = useState(false);

  const actorUrl =
    actorType === 'karim'
      ? `https://clink.so/act/karim-${scenario.id}-gap`
      : `https://clink.so/act/tariq-logistics-${scenario.id}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(actorUrl);
    setCopiedLink(true);
    causalAudio.playTick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Karim Sub-Action Handlers
  const handleSealSacks = () => {
    causalAudio.playCommitChord();
    setKarimSubTasks((prev) => ({ ...prev, sacksSealed: true }));
    onSyncRealityEvent(
      lang === 'bn'
        ? '✦ কৃষক করিম খামারে পাটের বস্তায় ডিজিটাল কিউআর সিল সম্পন্ন করেছে!'
        : '✦ Farmer Karim sealed 2x jute sacks with QR tag in Sherpur!'
    );
  };

  const handleMoistureTest = () => {
    causalAudio.playCommitChord();
    setKarimSubTasks((prev) => ({ ...prev, moistureTested: true }));
    onSyncRealityEvent(
      lang === 'bn'
        ? '✦ কৃষক করিম আর্দ্রতা টেস্ট নিশ্চিত করেছে: ১১.৪% (নিরাপদ খাদ্য গ্রেড)'
        : '✦ Farmer Karim verified moisture test: 11.4% (Food Grade Pass)'
    );
  };

  const handlePickupReady = () => {
    causalAudio.playCommitChord();
    setKarimSubTasks((prev) => ({ ...prev, pickupReady: true }));
    onSyncRealityEvent(
      lang === 'bn'
        ? '✦ করিমের খামারে চালক তারিকের পিকআপের জন্য মাল প্রস্তুত রাখা হয়েছে।'
        : '✦ Karim confirmed goods are staged for Driver Tariq pickup.'
    );
  };

  // Tariq Sub-Action Handlers
  const handleFuelAdvance = () => {
    causalAudio.playCommitChord();
    setTariqSubTasks((prev) => ({ ...prev, fuelAdvanceRequested: true }));
    onSyncRealityEvent(
      lang === 'bn'
        ? '✦ চালক তারিক গাজীপুর পাম্প থেকে ডিজেলের জন্য ৳২০০ বিকাশ অগ্রিম পেয়েছে।'
        : '✦ Driver Tariq received ৳200 bKash fuel advance at Gazipur fuel pump.'
    );
  };

  const handleGpsReport = () => {
    causalAudio.playCommitChord();
    setTariqSubTasks((prev) => ({ ...prev, gpsReported: true }));
    onSyncRealityEvent(
      lang === 'bn'
        ? '✦ চালক তারিক লাইভ জিপিএস পিং পাঠিয়েছে: মহাখালী ফ্লাইওভার পার হচ্ছে (ETA ১৫ মিনিট)।'
        : '✦ Driver Tariq broadcasted GPS ping: Crossing Mohakhali (ETA 15m).'
    );
  };

  const handleWeighSlipUpload = () => {
    causalAudio.playCommitChord();
    setTariqSubTasks((prev) => ({ ...prev, weighSlipUploaded: true }));
    setActivePhotoUpload(false);
    onSyncRealityEvent(
      lang === 'bn'
        ? '✦ চালক তারিক তেজগাঁও স্কেলের ডিজিটাল ওজন স্লিপ (৫০.০২ কেজি) আপলোড করেছে।'
        : '✦ Driver Tariq uploaded digital weighbridge receipt (50.02kg verified).'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -8 }}
      className="w-full max-w-[360px] sm:max-w-[420px] bg-neo-bg rounded-[28px] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.07)] border-2 border-emerald-400/80 flex flex-col relative"
    >
      {/* Top Banner: Indicating this is an External Participant C-Link Session */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/50">
        <button
          onClick={onBackToLive}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'ঢাকার সার্বিক ভিউ' : 'Live Dhaka View'}</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {lang === 'bn' ? '🔗 বহিরাগত কজাল লিংক সক্রিয়' : '🔗 C-Link Active'}
          </span>
        </div>
      </div>

      {/* C-Link URL Ribbon */}
      <div className="mt-3 p-2.5 rounded-xl bg-neo-bg border border-white/40/80 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Link2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px] font-mono text-gray-600 truncate">{actorUrl}</span>
        </div>
        <button
          onClick={handleCopyLink}
          className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 rounded-md transition-colors cursor-pointer shrink-0"
          title="Copy Link"
        >
          {copiedLink ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* KARIM'S FRACTAL REALITY SURFACE (FARMER SCOPE)            */}
      {/* ========================================================= */}
      {actorType === 'karim' && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Karim's Core Delegated Responsibility (His Main WANT) */}
          <div className="p-3.5 rounded-2xl bg-neo-bg border border-black/[0.05]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {lang === 'bn' ? 'গৃহীত দায়িত্ব (Delegated Responsibility)' : 'Accepted Responsibility'}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {lang === 'bn' ? '৳২,৩০০ সংরক্ষিত' : '৳2,300 Escrowed'}
              </span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              {lang === 'bn'
                ? `২০ কেজি ${scenario.itemBn} সরবরাহ`
                : `Supply 20kg ${scenario.item}`}
            </h3>
            <span className="text-xs text-gray-500 block">
              {lang === 'bn'
                ? 'শেরপুর খামার থেকে উত্তোলন · চালক তারিকের ভ্যানে হস্তান্তর'
                : 'Pickup from Sherpur Farm · Handover to Driver Tariq'}
            </span>
          </div>

          {/* THE FRACTAL REALITY LOOP: Karim's Sub-Needs / Sub-Wants */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {lang === 'bn'
                  ? 'দায়িত্ব পূরণে করিমের নিজস্ব সাব-নিড লুপ (Internal Needs)'
                  : "Karim's Internal Recursive Sub-Gaps"}
              </span>
              <span className="text-[10px] font-mono text-gray-400">Loop v1.2</span>
            </div>

            {/* Sub-Need 1: Jute Sack Packaging & QR Sealing */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                karimSubTasks.sacksSealed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-neo-bg border-white/40 text-gray-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      karimSubTasks.sacksSealed
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {lang === 'bn' ? '১. বস্তা প্যাকেজিং ও কজাল কিউআর সিল' : '1. Packaging & QR Tag'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {karimSubTasks.sacksSealed
                        ? (lang === 'bn' ? '✓ সিল #QR-SR-8821 জেনারেট সম্পন্ন' : '✓ QR Seal #QR-SR-8821 attached')
                        : (lang === 'bn' ? '২টি ১০ কেজির পাটের বস্তায় সিল বাকি' : '2x 10kg sacks pending seal')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSealSacks}
                  disabled={karimSubTasks.sacksSealed}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    karimSubTasks.sacksSealed
                      ? 'bg-emerald-200 text-emerald-800 cursor-default'
                      : 'bg-black text-white hover:bg-gray-800 shadow-2xs'
                  }`}
                >
                  {karimSubTasks.sacksSealed
                    ? (lang === 'bn' ? 'সম্পন্ন ✓' : 'Sealed ✓')
                    : (lang === 'bn' ? 'কিউআর সিল দিন' : 'Seal QR')}
                </button>
              </div>
            </div>

            {/* Sub-Need 2: Grain Moisture & Quality Testing */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                karimSubTasks.moistureTested
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-neo-bg border-white/40 text-gray-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      karimSubTasks.moistureTested
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {lang === 'bn' ? '২. আর্দ্রতা ও ফুড গ্রেড টেস্ট' : '2. Moisture & Quality Pass'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {karimSubTasks.moistureTested
                        ? (lang === 'bn' ? '✓ আর্দ্রতা ১১.৪% (পাস - আর্দ্রতার সীমা <১২%)' : '✓ 11.4% verified moisture')
                        : (lang === 'bn' ? 'ল্যাব আর্দ্রতা পরীক্ষা প্রয়োজন' : 'Moisture test required')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleMoistureTest}
                  disabled={karimSubTasks.moistureTested}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    karimSubTasks.moistureTested
                      ? 'bg-emerald-200 text-emerald-800 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                  }`}
                >
                  {karimSubTasks.moistureTested
                    ? (lang === 'bn' ? 'পাস ✓' : 'Passed ✓')
                    : (lang === 'bn' ? 'টেস্ট নিশ্চিত করুন' : 'Verify')}
                </button>
              </div>
            </div>

            {/* Sub-Need 3: Ready for Tariq Handover */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                karimSubTasks.pickupReady
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-neo-bg border-white/40 text-gray-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      karimSubTasks.pickupReady
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {lang === 'bn' ? '৩. গেটে মাল প্রস্তুত ও নোটিফিকেশন' : '3. Gate Handover Ready'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {karimSubTasks.pickupReady
                        ? (lang === 'bn' ? '✓ চালক তারিককে রেডি সিগন্যাল পাঠানো হয়েছে' : '✓ Ready signal sent to driver')
                        : (lang === 'bn' ? 'তারিকের ভ্যান আসার অপেক্ষা' : 'Awaiting driver arrival')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePickupReady}
                  disabled={karimSubTasks.pickupReady}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    karimSubTasks.pickupReady
                      ? 'bg-emerald-200 text-emerald-800 cursor-default'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-2xs'
                  }`}
                >
                  {karimSubTasks.pickupReady
                    ? (lang === 'bn' ? 'প্রস্তুত ✓' : 'Ready ✓')
                    : (lang === 'bn' ? 'সিগন্যাল পাঠান' : 'Signal')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TARIQ'S FRACTAL REALITY SURFACE (DRIVER SCOPE)             */}
      {/* ========================================================= */}
      {actorType === 'tariq' && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Tariq's Core Delegated Responsibility */}
          <div className="p-3.5 rounded-2xl bg-neo-bg border border-black/[0.05]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {lang === 'bn' ? 'লজিস্টিক দায়িত্ব (Driver Manifest)' : 'Logistics Manifest'}
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                ভ্যান #DHK-4821
              </span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              {lang === 'bn'
                ? `৫০ কেজি পরিবহন · গুলশান অফিস`
                : `Transport 50kg to Gulshan`}
            </h3>
            <span className="text-xs text-gray-500 block">
              {lang === 'bn'
                ? 'শেরপুর (রহিম ৩০ কেজি) + মিরপুর (করিম ২০ কেজি)'
                : 'Sherpur (Rahim 30kg) + Mirpur (Karim 20kg)'}
            </span>
          </div>

          {/* Tariq's Sub-Needs / Sub-Gaps */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {lang === 'bn'
                  ? 'পরিবহন সম্পন্ন করতে তারিকের সাব-নিড লুপ'
                  : "Tariq's Internal Logistics Sub-Gaps"}
              </span>
              <span className="text-[10px] font-mono text-gray-400">Trip v2.0</span>
            </div>

            {/* Sub-Need 1: Fuel Advance Request */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                tariqSubTasks.fuelAdvanceRequested
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-neo-bg border-white/40 text-gray-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tariqSubTasks.fuelAdvanceRequested
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {lang === 'bn' ? '১. জরুরি জ্বালানি তেল অগ্রিম' : '1. Fuel Advance (৳200)'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {tariqSubTasks.fuelAdvanceRequested
                        ? (lang === 'bn' ? '✓ ৳২০০ বিকাশ ছাড় গৃহীত' : '✓ ৳200 received in bKash')
                        : (lang === 'bn' ? 'গাজীপুর পাম্পে তেলের জন্য অগ্রিম প্রয়োজন' : 'Request fuel advance for diesel')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleFuelAdvance}
                  disabled={tariqSubTasks.fuelAdvanceRequested}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    tariqSubTasks.fuelAdvanceRequested
                      ? 'bg-emerald-200 text-emerald-800 cursor-default'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-2xs'
                  }`}
                >
                  {tariqSubTasks.fuelAdvanceRequested
                    ? (lang === 'bn' ? 'প্রাপ্ত ✓' : 'Received ✓')
                    : (lang === 'bn' ? 'অগ্রিম দাবি' : 'Request')}
                </button>
              </div>
            </div>

            {/* Sub-Need 2: Live GPS Ping & Traffic Update */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                tariqSubTasks.gpsReported
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-neo-bg border-white/40 text-gray-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tariqSubTasks.gpsReported
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {lang === 'bn' ? '২. লাইভ অবস্থান ও ট্রাফিক রিপোর্ট' : '2. Live Location Ping'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {tariqSubTasks.gpsReported
                        ? (lang === 'bn' ? '✓ মহাখালী পার হচ্ছে (১৫ মিনিটে পৌঁছাবে)' : '✓ Mohakhali reported (ETA 15m)')
                        : (lang === 'bn' ? 'জিপিএস পিং পাঠানো হয়নি' : 'Ping location to Dhaka')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGpsReport}
                  disabled={tariqSubTasks.gpsReported}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    tariqSubTasks.gpsReported
                      ? 'bg-emerald-200 text-emerald-800 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                  }`}
                >
                  {tariqSubTasks.gpsReported
                    ? (lang === 'bn' ? 'আপডেটেড ✓' : 'Sent ✓')
                    : (lang === 'bn' ? 'লোকেশন পাঠান' : 'Send Ping')}
                </button>
              </div>
            </div>

            {/* Sub-Need 3: Digital Weighbridge Slip & Photo Upload */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                tariqSubTasks.weighSlipUploaded
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-neo-bg border-white/40 text-gray-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tariqSubTasks.weighSlipUploaded
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {lang === 'bn' ? '৩. ডিজিটাল ওজন স্লিপ ও ফটো প্রমাণ' : '3. Weigh Slip & Photo Proof'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {tariqSubTasks.weighSlipUploaded
                        ? (lang === 'bn' ? '✓ ৫০.০২ কেজি ওজন স্লিপ ভেরিফাইড' : '✓ 50.02kg slip cryptographically sealed')
                        : (lang === 'bn' ? 'স্কেলের ওজন স্লিপ আপলোড বাকি' : 'Upload weighbridge slip photo')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleWeighSlipUpload}
                  disabled={tariqSubTasks.weighSlipUploaded}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    tariqSubTasks.weighSlipUploaded
                      ? 'bg-emerald-200 text-emerald-800 cursor-default'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {tariqSubTasks.weighSlipUploaded
                    ? (lang === 'bn' ? 'যাচাইকৃত ✓' : 'Uploaded ✓')
                    : (lang === 'bn' ? 'ছবি তুলুন' : 'Upload')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Causal Feedback Note */}
      <div className="mt-4 p-2.5 rounded-xl bg-neo-bg border border-black/[0.04] text-[10px] text-gray-500 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          {lang === 'bn'
            ? 'সি-লিঙ্ক নীতি: এখানে নেওয়া প্রতিটি সাব-অ্যাকশন তাৎক্ষণিকভাবে ঢাকার সার্বিক বাস্তবতায় (Initiator View) প্রতিফলিত হয়।'
            : 'Causal Sync: Actions taken on this autonomous C-Link surface instantly propagate back to the live Dhaka canvas.'}
        </span>
      </div>

      {/* Return to Live Reality Button */}
      <button
        onClick={onBackToLive}
        className="mt-4 w-full py-2.5 bg-[#1C1C1A] text-white hover:bg-black rounded-xl text-xs font-bold transition-all cursor-pointer shadow-neo-down-sm"
      >
        {lang === 'bn' ? 'সার্বিক বাস্তবতায় (ঢাকার ভিউ) ফেরত যান →' : 'Return to Dhaka Live View →'}
      </button>
    </motion.div>
  );
}
