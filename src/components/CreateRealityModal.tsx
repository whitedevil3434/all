import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus, Clock, MapPin, Check } from 'lucide-react';

interface CreateRealityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    quantity: number;
    unit: string;
    target: string;
    dueTime: string;
    actor1Name: string;
    actor1Qty: number;
    actor1Price: string;
    actor2Name?: string;
    actor2Qty?: number;
    actor2Price?: string;
    transportCost?: string;
  }) => void;
}

const PRESET_REALITIES = [
  {
    title: '100L Mustard Oil',
    quantity: 100,
    unit: 'L',
    target: 'Canteen Kitchen • Today, 8:00 PM',
    dueTime: 'Today, 8:00 PM',
    actor1Name: 'Akram Agro Mills',
    actor1Qty: 60,
    actor1Price: '৳ 12,000',
    actor2Name: 'Jamal Oil Traders',
    actor2Qty: 40,
    actor2Price: '৳ 8,400',
    transportCost: '৳ 1,200',
  },
  {
    title: '500 Dozen Organic Eggs',
    quantity: 500,
    unit: 'Dozen',
    target: 'Dhanmondi Branch • Tomorrow, 9:00 AM',
    dueTime: 'Tomorrow, 9:00 AM',
    actor1Name: 'Savar Poultry Cluster',
    actor1Qty: 350,
    actor1Price: '৳ 42,000',
    actor2Name: 'Gazipur Organic Farms',
    actor2Qty: 150,
    actor2Price: '৳ 18,500',
    transportCost: '৳ 2,500',
  },
  {
    title: '200 Bags Cement',
    quantity: 200,
    unit: 'Bags',
    target: 'Gulshan Project Site • Today, 5:00 PM',
    dueTime: 'Today, 5:00 PM',
    actor1Name: 'Premier Building Materials',
    actor1Qty: 150,
    actor1Price: '৳ 82,500',
    actor2Name: 'Shah Cement Depot',
    actor2Qty: 50,
    actor2Price: '৳ 28,000',
    transportCost: '৳ 3,000',
  },
];

export const CreateRealityModal: React.FC<CreateRealityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('kg');
  const [target, setTarget] = useState('Gulshan Office');
  const [dueTime, setDueTime] = useState('Today, 7:00 PM');
  const [actor1Name, setActor1Name] = useState('Primary Vendor');
  const [actor1Qty, setActor1Qty] = useState<number>(30);
  const [actor1Price, setActor1Price] = useState('৳ 4,500');
  const [actor2Name, setActor2Name] = useState('Secondary Vendor');
  const [actor2Qty, setActor2Qty] = useState<number>(20);
  const [actor2Price, setActor2Price] = useState('৳ 3,200');
  const [transportCost, setTransportCost] = useState('৳ 1,000');

  if (!isOpen) return null;

  const handleApplyPreset = (p: typeof PRESET_REALITIES[0]) => {
    setTitle(p.title);
    setQuantity(p.quantity);
    setUnit(p.unit);
    setTarget(p.target);
    setDueTime(p.dueTime);
    setActor1Name(p.actor1Name);
    setActor1Qty(p.actor1Qty);
    setActor1Price(p.actor1Price);
    setActor2Name(p.actor2Name);
    setActor2Qty(p.actor2Qty);
    setActor2Price(p.actor2Price);
    setTransportCost(p.transportCost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      quantity: Number(quantity) || 50,
      unit: unit || 'kg',
      target: target || 'Office',
      dueTime: dueTime || 'Today, 6:00 PM',
      actor1Name: actor1Name || 'Rahim',
      actor1Qty: Number(actor1Qty) || 30,
      actor1Price: actor1Price || '৳ 3,600',
      actor2Name: actor2Name || 'Karim',
      actor2Qty: Number(actor2Qty) || 20,
      actor2Price: actor2Price || '৳ 2,400',
      transportCost: transportCost || '৳ 800',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/60 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">
                  + Create New Causal Reality (WANT)
                </h3>
                <span className="text-[11px] text-blue-200">
                  Materialize a fresh requirement, suppliers & dependencies
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Quick Templates */}
            <div>
              <span className="text-gray-500 font-bold uppercase tracking-wider block mb-2 text-[10px]">
                Or Choose a Quick Template
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_REALITIES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-gray-900 block group-hover:text-blue-600 truncate">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {p.quantity} {p.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 1: Core Want */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <span className="text-gray-900 font-extrabold text-sm block">
                1. Core Requirement (The WANT)
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-gray-700 font-semibold block">Item / Commodity Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 100L Mustard Oil"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700 font-semibold block">Quantity & Unit</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-20 px-2.5 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs text-gray-900"
                    />
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="unit"
                      className="w-14 px-2 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-700 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>Destination Location</span>
                  </label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. Main Kitchen, Gulshan"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Due Time / Deadline</span>
                  </label>
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="e.g. Today, 6:30 PM"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Supply Actors */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <span className="text-gray-900 font-extrabold text-sm block">
                2. Potential Suppliers / Actors
              </span>

              {/* Actor 1 */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-3 gap-2 items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Primary Supplier</span>
                  <input
                    type="text"
                    value={actor1Name}
                    onChange={(e) => setActor1Name(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs font-semibold"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Offered Qty</span>
                  <input
                    type="number"
                    value={actor1Qty}
                    onChange={(e) => setActor1Qty(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Price (৳)</span>
                  <input
                    type="text"
                    value={actor1Price}
                    onChange={(e) => setActor1Price(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Actor 2 */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-3 gap-2 items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Secondary Supplier</span>
                  <input
                    type="text"
                    value={actor2Name}
                    onChange={(e) => setActor2Name(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs font-semibold"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Offered Qty</span>
                  <input
                    type="number"
                    value={actor2Qty}
                    onChange={(e) => setActor2Qty(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Price (৳)</span>
                  <input
                    type="text"
                    value={actor2Price}
                    onChange={(e) => setActor2Price(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Transport & Dependencies */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-gray-900 font-extrabold text-sm block">
                3. Logistics & Transport Dependency
              </span>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-gray-700 font-semibold block">Estimated Transport Budget</label>
                  <input
                    type="text"
                    value={transportCost}
                    onChange={(e) => setTransportCost(e.target.value)}
                    placeholder="৳ 1,200"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>
                <div className="flex-1 pt-4 text-[11px] text-gray-500">
                  <span>Transport will automatically lock as BLOCKED until driver Tariq or candidate is booked.</span>
                </div>
              </div>
            </div>

            {/* Footer submit */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Materialize Reality</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
