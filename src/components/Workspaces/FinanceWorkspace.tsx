import React from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  DollarSign,
  Download,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useCausalState } from '../../engine/causalStore';

export const FinanceWorkspace: React.FC = () => {
  const { state, processPayment, showToast, setActiveWorkspace } = useCausalState();
  const isPaid = state.dependencies.payment.status === 'PAID';

  const TRANSACTIONS = [
    {
      id: 'TXN-98214',
      recipient: 'Rahim Uddin (Farmer)',
      purpose: '30kg Miniket Rice Supply',
      amount: '৳ 3,600',
      method: 'bKash Merchant Disbursal',
      status: isPaid ? 'Settled' : 'Scheduled',
      date: 'Today, 11:30 AM',
      ref: 'BK-RHM-8841',
    },
    {
      id: 'TXN-98215',
      recipient: 'Karim Mill No. 4',
      purpose: '20kg Rice Batch Mill Settlement',
      amount: '৳ 2,400',
      method: 'Nagad Corporate Wallet',
      status: isPaid ? 'Settled' : 'Pending Commitment',
      date: 'Today, 11:45 AM',
      ref: 'NG-KRM-3312',
    },
    {
      id: 'TXN-98216',
      recipient: 'Tariq Al-Amin (Driver)',
      purpose: 'Logistics & Fuel Toll Allocation',
      amount: '৳ 800',
      method: 'Instant Mobile Payout',
      status: state.dependencies.transport.status === 'SCHEDULED' || isPaid ? 'Authorized' : 'Hold (No Driver)',
      date: 'Today, 12:10 PM',
      ref: 'BK-TRQ-9901',
    },
    {
      id: 'TXN-97810',
      recipient: 'Mirpur Weighbridge Station',
      purpose: 'Digital Calibration & Certification',
      amount: '৳ 150',
      method: 'Auto-debit Slip',
      status: 'Settled',
      date: 'Yesterday, 04:20 PM',
      ref: 'WB-SLP-4401',
    },
  ];

  const handleDownloadStatement = () => {
    const csvContent = [
      ['Transaction ID', 'Recipient', 'Purpose', 'Amount', 'Method', 'Status', 'Date', 'Reference'],
      ...TRANSACTIONS.map((t) => [t.id, t.recipient, t.purpose, t.amount, t.method, t.status, t.date, t.ref]),
    ]
      .map((e) => e.map((val) => `"${val}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `C-Link-Finance-Statement-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✦ Real CSV Financial Statement downloaded!');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-gray-900">Finance & Settlement Ledger</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Escrow Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automated disbursals, vendor payouts, VAT challans, and escrow release triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadStatement}
            className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement (.csv)</span>
          </button>
          <button
            onClick={() => setActiveWorkspace('operations')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <span>Back to Operations →</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Escrow Treasury Balance
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">৳ 85,400</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secured via Corporate bKash</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Today's Committed Payouts
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">৳ 6,800</div>
          <span className="text-xs text-gray-500 font-medium mt-1">Rahim (৳3,600) + Karim (৳2,400) + Tariq (৳800)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Disbursal State
          </span>
          <div className={`text-2xl font-black mt-1 ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isPaid ? 'All Paid' : 'Pending Delivery'}
          </div>
          <span className="text-xs text-gray-500 font-medium mt-1">
            {isPaid ? 'Settlement verified' : 'Holds until weighbridge verified'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              1-Tap Settlement
            </span>
            <span className="text-xs text-gray-500 mt-0.5 block">Execute instant payment</span>
          </div>
          {!isPaid ? (
            <button
              onClick={processPayment}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Release ৳6,800 Now</span>
            </button>
          ) : (
            <div className="py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold text-center border border-emerald-200">
              ✓ All Settled
            </div>
          )}
        </div>
      </div>

      {/* Live Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Active Operational Disbursals</h3>
            <span className="text-xs text-gray-500">Every transaction corresponds to a causal reality state.</span>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            4 Linked Entries
          </span>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-200">
            <tr>
              <th className="p-3.5 font-bold">Transaction ID</th>
              <th className="p-3.5 font-bold">Beneficiary</th>
              <th className="p-3.5 font-bold">Scope / Purpose</th>
              <th className="p-3.5 font-bold">Channel</th>
              <th className="p-3.5 font-bold text-right">Amount</th>
              <th className="p-3.5 font-bold text-center">Epistemic Status</th>
              <th className="p-3.5 font-bold text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {TRANSACTIONS.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3.5 font-mono font-semibold text-gray-900">{t.id}</td>
                <td className="p-3.5 font-bold text-gray-900">{t.recipient}</td>
                <td className="p-3.5 text-gray-600">{t.purpose}</td>
                <td className="p-3.5 text-gray-500">{t.method}</td>
                <td className="p-3.5 text-right font-mono font-black text-gray-900">{t.amount}</td>
                <td className="p-3.5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Settled'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : t.status === 'Authorized'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : t.status.includes('Hold')
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => showToast(`✦ Viewing voucher for ${t.id}`)}
                    className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View Slip →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
