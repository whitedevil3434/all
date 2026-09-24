const fs = require('fs');
const pathCSS = './src/index.css';
let css = fs.readFileSync(pathCSS, 'utf8');

// We will bring back Neumorphism but keeping it clean, subtle, and premium.
// Neumorphism relies on matching the background color exactly and using dual shadows (light top-left, dark bottom-right).
const refinedNeoCSS = `@import "tailwindcss";

@theme {
  /* Premium Soft Neumorphic Palette */
  --color-neo-bg: #E6EBF0; /* Slightly cooler, premium light gray */
  --color-canvas-dot: rgba(0, 0, 0, 0.04);
  
  /* Refined, Elegant Neumorphic Shadows (Less muddy, more crisp) */
  --shadow-neo-up: 4px 4px 10px rgba(163, 177, 198, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.8);
  --shadow-neo-down: inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.8);
  
  --shadow-neo-up-sm: 2px 2px 5px rgba(163, 177, 198, 0.3), -2px -2px 5px rgba(255, 255, 255, 0.9);
  --shadow-neo-down-sm: inset 2px 2px 4px rgba(163, 177, 198, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.9);
  
  --shadow-neo-up-md: 6px 6px 14px rgba(163, 177, 198, 0.45), -6px -6px 14px rgba(255, 255, 255, 0.8);
  --shadow-neo-down-md: inset 6px 6px 12px rgba(163, 177, 198, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.8);
  
  --shadow-neo-up-lg: 10px 10px 20px rgba(163, 177, 198, 0.45), -10px -10px 20px rgba(255, 255, 255, 0.9);
  --shadow-neo-down-lg: inset 10px 10px 20px rgba(163, 177, 198, 0.5), inset -10px -10px 20px rgba(255, 255, 255, 0.9);
  
  --shadow-neo-up-xl: 14px 14px 28px rgba(163, 177, 198, 0.4), -14px -14px 28px rgba(255, 255, 255, 0.9);
}

@layer base {
  body {
    background-color: var(--color-neo-bg);
    color: #2D3748;
  }
}

@layer utilities {
  .bg-dot-grid {
    background-image: radial-gradient(var(--color-canvas-dot) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  .causal-thread-v {
    position: absolute;
    left: -20px;
    top: -12px;
    bottom: 24px;
    width: 2px;
    background: linear-gradient(to bottom, rgba(163,177,198,0.5) 0%, rgba(163,177,198,0.5) 100%);
    border-radius: 999px;
    box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.7);
  }
  
  .causal-thread-h {
    position: absolute;
    left: -20px;
    top: 24px;
    width: 20px;
    height: 2px;
    background-color: rgba(163,177,198,0.5);
    box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.7);
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
`;

fs.writeFileSync(pathCSS, refinedNeoCSS);
console.log("Restored and refined Neumorphism in index.css");

// 2. We need to update the React component to ensure background colors match the neo-bg (#E6EBF0) so the effect works.
const pathReact = './src/components/DynamicRealitySurface.tsx';
let react = fs.readFileSync(pathReact, 'utf8');

// Restore background colors to match neo-bg instead of 'bg-white' which breaks neumorphism
react = react.replace(
  `  const getAttentionClass = () => {
    // Semantic Gravity determines scale and shadow
    if (activeContextId === node.id) return 'ring-[1.5px] ring-indigo-500 shadow-neo-up-xl scale-[1.02] bg-white';
    if (node.attention && node.attention > 80) return 'ring-[1.5px] ring-indigo-400/50 shadow-neo-up-xl scale-[1.02] bg-white';
    if (node.state === 'EXECUTING') return 'ring-[1.5px] ring-amber-400 shadow-neo-up-lg scale-[1.01] bg-white';
    if (node.state === 'VERIFYING') return 'ring-[1.5px] ring-purple-400 shadow-neo-up-lg scale-[1.01] bg-white';
    if (node.state === 'FAILED') return 'ring-[1px] ring-red-200 shadow-sm scale-95 bg-red-50/50 opacity-70 grayscale-[30%]';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'shadow-sm scale-95 opacity-80 bg-white/80';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl bg-white transition-all duration-300';
  };`,
  `  const getAttentionClass = () => {
    // Semantic Gravity determines scale and shadow in a Neumorphic space
    if (activeContextId === node.id) return 'ring-2 ring-indigo-400/30 shadow-neo-up-xl scale-[1.02] bg-neo-bg';
    if (node.attention && node.attention > 80) return 'shadow-neo-up-xl scale-[1.02] bg-neo-bg';
    if (node.state === 'EXECUTING') return 'ring-1 ring-amber-400/50 shadow-neo-up-lg scale-[1.01] bg-neo-bg';
    if (node.state === 'VERIFYING') return 'ring-1 ring-purple-400/50 shadow-neo-up-lg scale-[1.01] bg-neo-bg';
    if (node.state === 'FAILED') return 'shadow-neo-down-lg scale-95 bg-neo-bg opacity-70 grayscale-[30%]';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'shadow-neo-down-md scale-95 opacity-90 bg-neo-bg';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl bg-neo-bg transition-all duration-300';
  };`
);

react = react.replace(
  `  let baseClass = \`w-full rounded-2xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  if (isHollow) {
    baseClass += ' p-5 border-[1.5px] border-dashed border-gray-300 bg-gray-50/50 shadow-neo-down-sm relative overflow-hidden backdrop-blur-sm';
  } else {
    baseClass += \` border border-gray-100/50 \${isCompact ? 'p-4' : 'p-6'}\`;
  }`,
  `  let baseClass = \`w-full rounded-3xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-black/5 bg-neo-bg shadow-neo-down-lg relative overflow-hidden';
  } else {
    baseClass += \` border border-white/40 \${isCompact ? 'p-4' : 'p-6'}\`;
  }`
);

// Bring back neumorphic input bar
react = react.replace(
  `className="w-full bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-full py-4 pl-6 pr-12 shadow-neo-up-lg focus:outline-none focus:ring-[1.5px] focus:ring-indigo-500/30 transition-all text-sm font-medium disabled:opacity-50 text-gray-800 placeholder:text-gray-400"`,
  `className="w-full bg-neo-bg rounded-full py-4 pl-6 pr-12 shadow-neo-down-lg border border-white/50 focus:outline-none focus:shadow-neo-down-md transition-all text-sm font-medium disabled:opacity-50 text-gray-700 placeholder:text-gray-400"`
);

// Inner semantic blocks neumorphism
react = react.replace(
  `className="mt-3 p-3 bg-white/50 border border-black/5 rounded-xl shadow-inner text-xs text-gray-600 leading-relaxed font-medium"`,
  `className="mt-3 p-3 bg-neo-bg rounded-xl shadow-neo-down-sm text-xs text-gray-600 leading-relaxed font-medium"`
);

fs.writeFileSync(pathReact, react);
console.log("Restored neumorphic elements in DynamicRealitySurface.");
