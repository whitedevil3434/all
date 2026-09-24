import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export interface OperationalDocument {
  id: string;
  title: string;
  filename: string;
  category: 'challan' | 'weighbridge' | 'payment' | 'trip-pass';
  size: string;
  date: string;
  refNumber: string;
  issuedBy: string;
  recipient: string;
  items: { description: string; qty: string; rate: string; total: string }[];
  totalAmount: string;
  verificationHash: string;
  notes?: string;
}

interface DocumentViewerModalProps {
  document: OperationalDocument | null;
  onClose: () => void;
  onDownload: (doc: OperationalDocument) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  onDownload,
}) => {
  if (!doc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Modal Header */}
          <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">{doc.title}</h3>
                <span className="text-[11px] text-gray-400 font-mono">
                  REF: {doc.refNumber} • {doc.size}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDownload(doc)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors cursor-pointer"
                title="Print Voucher"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Body - Official Printable Format */}
          <div className="p-8 overflow-y-auto bg-gray-50 flex-1 space-y-6 text-gray-800">
            {/* Document Sheet Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
              {/* Organization Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight text-gray-900">
                      C-LINK REALITY PROTOCOL
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Autonomous Dispatch & Sourcing Infrastructure • Dhaka, Bangladesh
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Causal Transaction ID: {doc.verificationHash.slice(0, 18)}...
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Document Type
                  </span>
                  <span className="text-sm font-extrabold text-blue-600 capitalize">
                    {doc.category} Certificate
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">{doc.date}</span>
                </div>
              </div>

              {/* Parties Breakdown */}
              <div className="grid grid-cols-2 gap-6 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Issued By (Actor)
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{doc.issuedBy}</p>
                  <p className="text-gray-500 mt-0.5">Authorized Primary Dispatch Station</p>
                  <p className="text-gray-500">Dhaka North Sourcing Cluster</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Recipient / Beneficiary
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{doc.recipient}</p>
                  <p className="text-gray-500 mt-0.5">Gulshan-2 Central Office Terminal</p>
                  <p className="text-gray-500">Attention: Sabbir (Operations Manager)</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">Item Description</th>
                      <th className="py-2.5 text-center">Quantity</th>
                      <th className="py-2.5 text-right">Unit Rate</th>
                      <th className="py-2.5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {doc.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 font-semibold text-gray-900">{it.description}</td>
                        <td className="py-3 text-center font-mono">{it.qty}</td>
                        <td className="py-3 text-right font-mono">{it.rate}</td>
                        <td className="py-3 text-right font-mono font-bold text-gray-900">
                          {it.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total & Notes */}
              <div className="pt-4 border-t border-gray-200 flex items-start justify-between">
                <div className="max-w-xs text-xs text-gray-500">
                  <span className="font-bold text-gray-700 block mb-0.5">Verification Note:</span>
                  <p>{doc.notes || 'This document serves as definitive epistemic evidence under C-Link reality ledger.'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Total Certified Value</span>
                  <span className="text-xl font-black text-gray-900">{doc.totalAmount}</span>
                </div>
              </div>

              {/* Digital Signature & Barcode Simulation */}
              <div className="pt-5 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cryptographically Signed & Sealed</span>
                </div>
                <div className="font-mono text-gray-400 tracking-widest text-[10px]">
                  ||| |||| || ||||| ||||||| |||| ||
                </div>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Valid and tamper-proof PDF digital slip
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
