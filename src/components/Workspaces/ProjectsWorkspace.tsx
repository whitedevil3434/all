import React from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Target
} from 'lucide-react';
import { useCausalState } from '../../engine/causalStore';

export const ProjectsWorkspace: React.FC = () => {
  const { setActiveWorkspace, showToast } = useCausalState();

  const PROJECTS = [
    {
      id: 'proj-gulshan',
      title: 'Gulshan-2 Central Hub Expansion',
      lead: 'Sabbir (Operations Manager)',
      deadline: 'Oct 30, 2026',
      progress: 90,
      status: 'Final Verification',
      budget: '৳ 4,50,000',
      milestones: [
        { name: 'Floor structural reinforcement', done: true },
        { name: 'High-density shelving racks installation', done: true },
        { name: 'Digital scale & barcode scanner calibration', done: true },
        { name: 'Fire safety & HACCP certification', done: false },
      ],
    },
    {
      id: 'proj-sreepur',
      title: 'Sreepur Agro Cold Storage (2,000 MT)',
      lead: 'Dr. Kabir (Facility Director)',
      deadline: 'Dec 15, 2026',
      progress: 65,
      status: 'Construction Phase',
      budget: '৳ 28,00,000',
      milestones: [
        { name: 'Land acquisition & foundation', done: true },
        { name: 'Refrigeration unit shipment clearance', done: true },
        { name: 'Insulation panel assembly', done: false },
        { name: 'Backup generator 120kVA setup', done: false },
      ],
    },
    {
      id: 'proj-sorter',
      title: 'Automated Grain Sorter & Weighbridge Integration',
      lead: 'Eng. Farhan (Automation Team)',
      deadline: 'Nov 10, 2026',
      progress: 40,
      status: 'Software & Hardware Integration',
      budget: '৳ 6,80,000',
      milestones: [
        { name: 'Camera vision optical sensor mounting', done: true },
        { name: 'C-Link Protocol API bridge setup', done: true },
        { name: 'Batch sorting speed benchmark (>50kg/min)', done: false },
        { name: 'Field trial at Mirpur Mill No. 4', done: false },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-gray-900">Strategic Facilities & Capital Projects</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              3 Initiatives
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tracking infrastructure development, capacity enhancements, and cold storage rollout.
          </p>
        </div>

        <button
          onClick={() => setActiveWorkspace('operations')}
          className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <span>← Back to Daily Operations</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {PROJECTS.map((proj) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{proj.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>Lead: <b className="text-gray-700">{proj.lead}</b></span>
                  <span>Target: <b className="text-gray-700">{proj.deadline}</b></span>
                  <span>Budget: <b className="text-gray-900">{proj.budget}</b></span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-indigo-600">{proj.progress}% Completed</span>
                <div className="w-36 h-2 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestones list */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Causal Milestones
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {proj.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                      m.done
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {m.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span className="font-medium truncate">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
