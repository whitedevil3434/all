import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Phone,
  MessageSquare,
  Truck,
  Shield,
  Star,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { useCausalState } from '../../engine/causalStore';

export const HRWorkspace: React.FC = () => {
  const { state, assignDriver, showToast, setActiveWorkspace } = useCausalState();
  const isDriverAssigned = state.dependencies.transport.status === 'SCHEDULED';

  const PERSONNEL = [
    {
      id: 'driver-tariq',
      name: 'Tariq Al-Amin',
      role: 'Logistics Driver & Vehicle Operator',
      type: 'Driver',
      vehicle: 'Covered Van (1.5 Ton) • DHAKA-METRO-TA 11-4029',
      phone: '01611-998877',
      experience: '7 years in Dhaka North Corridor',
      rating: 4.9,
      status: isDriverAssigned ? 'Assigned to Rice Transport' : 'Available on Standby',
      fitnessExpiry: 'Valid till Nov 2026',
      assignedToday: isDriverAssigned,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'supplier-rahim',
      name: 'Rahim Uddin',
      role: 'Contracted Agricultural Producer',
      type: 'Supplier Partner',
      vehicle: 'Direct Pickup from Farm Shed',
      phone: '01711-234567',
      experience: 'Primary Miniket Rice Cultivator',
      rating: 5.0,
      status: 'Committed (30kg Ready)',
      fitnessExpiry: 'National ID Verified',
      assignedToday: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'supplier-karim',
      name: 'Karim Ahmed',
      role: 'Mill Operator & Sourcing Point',
      type: 'Supplier Partner',
      vehicle: 'Mill Depot Gate No. 4',
      phone: '01819-876543',
      experience: 'Mirpur Wholesale Rice Cluster',
      rating: 4.7,
      status: 'Offer Under Review (20kg)',
      fitnessExpiry: 'Trade License Verified',
      assignedToday: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'guard-monir',
      name: 'Monir Hossain',
      role: 'Gulshan Gate Receiving Inspector',
      type: 'Receiving Staff',
      vehicle: 'Stationary Checkpoint Guard',
      phone: '01911-334455',
      experience: '4 years with Security Operations',
      rating: 4.8,
      status: 'On Duty (Shift ends 8:00 PM)',
      fitnessExpiry: 'Security Clearance Valid',
      assignedToday: true,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-gray-900">Personnel, Drivers & Vendor Directory</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              4 Active Roles
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Verified driver licenses, compliance credentials, and field contact access.
          </p>
        </div>

        <button
          onClick={() => setActiveWorkspace('operations')}
          className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <span>← Back to Daily Operations</span>
        </button>
      </div>

      {/* Grid of Personnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSONNEL.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                    <span className="text-xs text-gray-500 block">{p.role}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mt-0.5">
                      {p.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{p.rating}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Assignment:</span>
                  <span className="font-semibold text-gray-800">{p.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vehicle / Gate:</span>
                  <span className="font-mono text-gray-800">{p.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Compliance:</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    {p.fitnessExpiry}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => showToast(`✦ Dialing ${p.name} at ${p.phone}`)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-gray-600" />
                <span>Call {p.phone}</span>
              </button>

              {p.type === 'Driver' && !isDriverAssigned && (
                <button
                  onClick={() => {
                    assignDriver('Tariq', '৳ 800');
                    showToast('✦ Driver Tariq assigned to Transport node!');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Book for ৳800</span>
                </button>
              )}

              {p.type === 'Driver' && isDriverAssigned && (
                <div className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Booked</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
