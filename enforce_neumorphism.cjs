const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  // Hypothesis Container
  {
    from: /className="w-full bg-indigo-50\/50 rounded-2xl p-6 border border-indigo-100 shadow-neo-up-lg mt-8"/g,
    to: 'className="w-full bg-neo-bg rounded-2xl p-6 shadow-neo-up-lg mt-8"'
  },
  // Proposed Dependencies items
  {
    from: /className="bg-white p-3 rounded-xl shadow-2xs border border-black\/5 flex items-start gap-3"/g,
    to: 'className="bg-neo-bg p-3 rounded-xl shadow-neo-up-sm flex items-start gap-3"'
  },
  // Open Clarifications Container
  {
    from: /className="mt-6 bg-indigo-50\/80 p-4 rounded-xl border border-indigo-100\/50 shadow-inner"/g,
    to: 'className="mt-6 bg-neo-bg p-4 rounded-xl shadow-neo-down-sm"'
  },
  // Clarification Input
  {
    from: /className="w-full bg-white rounded-lg py-2\.5 pl-4 pr-10 text-sm border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400\/50 transition-all shadow-sm"/g,
    to: 'className="w-full bg-neo-bg rounded-lg py-2.5 pl-4 pr-10 text-sm border-none shadow-neo-down focus:shadow-neo-down-md focus:outline-none transition-all text-gray-700"'
  },
  // Materialize Reality Button
  {
    from: /className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-neo-down transition-colors flex justify-center items-center gap-2"/g,
    to: 'className="flex-1 px-4 py-2 bg-neo-bg text-indigo-600 rounded-xl font-bold text-sm shadow-neo-up hover:shadow-neo-down transition-all flex justify-center items-center gap-2"'
  },
  // Node Details: Unknowns
  {
    from: /className="p-3 bg-indigo-50\/50 border border-indigo-100\/50 rounded-xl shadow-inner text-xs text-indigo-700\/80 leading-relaxed font-medium mb-2"/g,
    to: 'className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-indigo-700/80 leading-relaxed font-medium mb-2"'
  },
  // Node Details: Proposal
  {
    from: /className="p-3 bg-amber-50\/50 border border-amber-100\/50 rounded-xl shadow-inner text-xs text-amber-800\/80 leading-relaxed font-medium relative mb-2 break-words"/g,
    to: 'className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-amber-800/80 leading-relaxed font-medium relative mb-2 break-words"'
  },
  // Node Details: Summary
  {
    from: /className="p-3 bg-blue-50\/50 border border-blue-100\/50 rounded-xl shadow-inner text-xs text-blue-800\/80 leading-relaxed font-medium mb-2 break-words"/g,
    to: 'className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-blue-800/80 leading-relaxed font-medium mb-2 break-words"'
  },
  // Node Details: Summary Hash tag
  {
    from: /className="mt-2 text-\[9px\] font-mono text-blue-400\/80 bg-blue-100\/50 px-2 py-1 rounded inline-block break-all"/g,
    to: 'className="mt-2 text-[9px] font-mono text-blue-500 bg-neo-bg shadow-neo-down-sm px-2 py-1 rounded inline-block break-all"'
  },
  // Node Details: Proof of Reality Outer
  {
    from: /className="p-3 bg-emerald-50\/50 border border-emerald-100\/50 rounded-xl shadow-inner text-xs text-emerald-800\/80 leading-relaxed font-medium mb-2"/g,
    to: 'className="p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-emerald-800/80 leading-relaxed font-medium mb-2"'
  },
  // Node Details: Proof of Reality Grid Items
  {
    from: /className="bg-white\/60 p-2 rounded-lg border border-emerald-100\/50 flex flex-col items-center justify-center text-center"/g,
    to: 'className="bg-neo-bg p-2 rounded-lg shadow-neo-up-sm flex flex-col items-center justify-center text-center"'
  },
  // Node Details: Proof of Reality Bottom Item
  {
    from: /className="col-span-2 bg-white\/60 p-2 rounded-lg border border-emerald-100\/50 flex flex-col items-start text-left mt-1"/g,
    to: 'className="col-span-2 bg-neo-bg p-2 rounded-lg shadow-neo-up-sm flex flex-col items-start text-left mt-1"'
  },
  // Node Details: Progress Bar Track
  {
    from: /className="w-full bg-emerald-100 h-1\.5 rounded-full overflow-hidden"/g,
    to: 'className="w-full bg-neo-bg shadow-neo-down-sm h-1.5 rounded-full overflow-hidden"'
  }
];

replacements.forEach(r => {
  content = content.replace(r.from, r.to);
});

fs.writeFileSync(path, content);
console.log("Strict Neumorphism applied.");
