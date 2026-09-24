import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Truck,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useCausalState } from '../../engine/causalStore';

export const SupplyChainWorkspace: React.FC = () => {
  const { showToast, sendChatMessage, setActiveWorkspace } = useCausalState();
  const [filter, setFilter] = useState<'all' | 'active' | 'standby'>('all');
  const [search, setSearch] = useState('');

  const VENDORS = [
    {
      id: 'rahim-agri',
      name: 'Rahim Uddin (Farmer)',
      category: 'Grains & Rice',
      location: 'Sherpur Paddy Belt',
      capacity: '1,500 kg / week',
      rate: 'Miniket ৳120/kg',
      status: 'Active Contract',
      reliability: '98%',
      phone: '01711-234567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      activeAssignment: '30kg Rice to Gulshan-2 (Committed)',
    },
    {
      id: 'karim-mill',
      name: 'Karim Mill No. 4',
      category: 'Milling & Processing',
      location: 'Mirpur Industrial Zone',
      capacity: '5,000 kg / day',
      rate: 'Nazirshail ৳120/kg',
      status: 'Offered / Review',
      reliability: '92%',
      phone: '01819-876543',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      activeAssignment: '20kg Rice (Offered, Waiting Accept)',
    },
    {
      id: 'mina-traders',
      name: 'Mina Sourcing Hub',
      category: 'Grains & Emergency Stock',
      location: 'Kawran Bazar Wholesale',
      capacity: '2,000 kg buffer',
      rate: 'Chinigura ৳120/kg',
      status: 'Standby Backup',
      reliability: '89%',
      phone: '01912-345678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      activeAssignment: 'Standby reserve (15kg buffer)',
    },
    {
      id: 'akram-oil',
      name: 'Akram Agro Mills',
      category: 'Edible Oils & Seeds',
      location: 'Demra River Terminal',
      capacity: '3,000 L / week',
      rate: 'Mustard ৳200/L',
      status: 'Active Contract',
      reliability: '96%',
      phone: '01712-445566',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      activeAssignment: 'Contract Ready (100L Sourcing ready)',
    },
    {
      id: 'jamal-traders',
      name: 'Jamal Oil & Grains',
      category: 'Direct Imports',
      location: 'Khatunganj Chittagong',
      capacity: '10,000 L monthly',
      rate: 'Soybean ৳185/L',
      status: 'Standby Backup',
      reliability: '91%',
      phone: '01811-992233',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      activeAssignment: 'Secondary candidate for Canteen',
    },
  ];

  const filtered = VENDORS.filter((v) => {
    if (filter === 'active' && !v.status.includes('Active')) return false;
    if (filter === 'standby' && !v.status.includes('Standby')) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-gray-900">Supply Chain & Vendor Matrix</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              5 Verified Nodes
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time supplier capacities, contractual readiness, and epistemic reliability scores.
          </p>
        </div>

        <button
          onClick={() => setActiveWorkspace('operations')}
          className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <span>← Back to Daily Operations</span>
        </button>
      </div>

      {/* Top Controls & Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Contracted Sourcing
          </span>
          <div className="text-xl font-black text-gray-900 mt-1">50kg Rice</div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>100% Ready today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Avg Reliability Index
          </span>
          <div className="text-xl font-black text-blue-600 mt-1">94.8%</div>
          <div className="text-xs text-gray-500 font-medium mt-1">Based on 142 dispatch events</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Active Blockers
          </span>
          <div className="text-xl font-black text-rose-600 mt-1">1 Blocker</div>
          <div className="text-xs text-rose-600 font-medium mt-1">Transport driver unassigned</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Buffer Stock
          </span>
          <div className="text-xl font-black text-amber-600 mt-1">15kg</div>
          <div className="text-xs text-gray-500 font-medium mt-1">Held by Mina (Standby)</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Vendors
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'active' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Contracts
          </button>
          <button
            onClick={() => setFilter('standby')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'standby' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Standby / Reserves
          </button>
        </div>

        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers, mills, commodities..."
            className="w-72 bg-white border border-gray-200 focus:border-blue-500 rounded-xl py-1.5 pl-8 pr-3 text-xs text-gray-800 outline-none"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={v.avatar}
                    alt={v.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{v.name}</h3>
                    <span className="text-[11px] text-gray-500">{v.category}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status.includes('Active')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : v.status.includes('Review')
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="font-medium text-gray-800">{v.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Weekly Capacity:</span>
                  <span className="font-mono font-semibold text-gray-900">{v.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Benchmark Rate:</span>
                  <span className="font-mono font-bold text-gray-900">{v.rate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Reliability Score:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {v.reliability}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-700 font-medium">
                <span className="font-bold text-gray-500 block text-[10px] uppercase">Active Reality Link:</span>
                {v.activeAssignment}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  showToast(`✦ Calling ${v.name} (${v.phone})...`);
                  sendChatMessage(`${v.name}-এর সাথে সরাসরি ফোনে যোগাযোগ স্থাপন করা হচ্ছে`);
                }}
                className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-gray-600" />
                <span>Call {v.phone}</span>
              </button>
              <button
                onClick={() => {
                  sendChatMessage(`${v.name}-কে সরাসরি ইনকোয়ারি মেসেজ পাঠাও`);
                  showToast(`✦ Opened direct inquiry channel with ${v.name}`);
                }}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors cursor-pointer"
                title="Direct Message"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
