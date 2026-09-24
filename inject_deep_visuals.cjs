const fs = require('fs');
const pathCSS = './src/index.css';
let css = fs.readFileSync(pathCSS, 'utf8');

const newCSS = `
  /* Flowing energy for active causal threads */
  @keyframes flow-energy {
    0% { background-position: 200% 50%; }
    100% { background-position: 0% 50%; }
  }
  .thread-flowing {
    background-size: 200% 200%;
    background-image: linear-gradient(90deg, 
      rgba(251,191,36, 0.4) 0%, 
      rgba(251,191,36, 1) 50%, 
      rgba(251,191,36, 0.4) 100%
    );
    animation: flow-energy 1.5s linear infinite;
  }

  /* The Reality Void Effect for UNKNOWN dependencies */
  @keyframes void-pulse {
    0% { box-shadow: inset 0 2px 10px rgba(0,0,0,0.02); }
    50% { box-shadow: inset 0 5px 20px rgba(0,0,0,0.08); }
    100% { box-shadow: inset 0 2px 10px rgba(0,0,0,0.02); }
  }
  .reality-void {
    animation: void-pulse 4s ease-in-out infinite;
    background: repeating-linear-gradient(
      -45deg,
      rgba(0,0,0,0.01),
      rgba(0,0,0,0.01) 8px,
      rgba(0,0,0,0.03) 8px,
      rgba(0,0,0,0.03) 16px
    );
  }

  /* Cinematic Focus Engine using modern CSS :has() */
  /* When ANY node is focused/expanded, dim and blur the unfocused ones */
  .surface-container:has(.node-is-focused) .node-wrapper:not(.node-is-focused) {
     opacity: 0.35;
     filter: blur(1.5px) grayscale(40%);
     transform: scale(0.98);
  }
  
  /* Ensure parent wrappers of focused nodes don't dim */
  .surface-container:has(.node-is-focused) .node-wrapper:has(.node-is-focused) {
     opacity: 1;
     filter: none;
     transform: scale(1);
  }

  .node-wrapper {
     transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

if (!css.includes('thread-flowing')) {
  css = css.replace('}\n\n@layer base', '}  ' + newCSS + '\n@layer base');
  fs.writeFileSync(pathCSS, css);
  console.log("Injected deep visual CSS.");
}

const pathReact = './src/components/DynamicRealitySurface.tsx';
let react = fs.readFileSync(pathReact, 'utf8');

// 1. Add surface-container to the root rendering area
react = react.replace(
  `<div className="w-full max-w-4xl mx-auto pb-40">
        <AnimatePresence mode="popLayout">`,
  `<div className="w-full max-w-4xl mx-auto pb-40 surface-container">
        <AnimatePresence mode="popLayout">`
);

// 2. Wrap Node card in node-wrapper and apply node-is-focused
react = react.replace(
  `      <div className={baseClass}>`,
  `      <div className={\`node-wrapper \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}>
      <div className={baseClass}>`
);
react = react.replace(
  `        {node.type === 'WANT' && (
          <div className="mt-3 flex gap-2">`,
  `        </div>
        
        {/* Actions based on state */}
        {node.type === 'WANT' && (
          <div className="mt-3 flex gap-2">`
);

// We need a more precise regex or replace for the wrapper closure.
// Let's just do a clean string replacement on the NodeRenderer return block
const oldReturn = `  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className="w-full flex flex-col"
    >
      <div className={baseClass}>
        <div className="flex items-start justify-between gap-4">`;

const newReturn = `  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className="w-full flex flex-col"
    >
      <div className={\`node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}>
      <div className={baseClass}>
        <div className="flex items-start justify-between gap-4">`;

react = react.replace(oldReturn, newReturn);

// Close the wrapper before the recursive children block
const oldChildrenRender = `      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (`;

const newChildrenRender = `      </div>
      
      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (`;

react = react.replace(oldChildrenRender, newChildrenRender);


// 3. Add reality-void to hollow baseClass
react = react.replace(
  `  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-gray-300/50 bg-neo-bg shadow-neo-down-lg relative overflow-hidden';
  }`,
  `  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-gray-300/50 bg-neo-bg shadow-neo-down-lg relative overflow-hidden reality-void';
  }`
);

// 4. Add flowing thread animation
react = react.replace(
  `      case 'ASKING': 
      case 'EXECUTING': return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';`,
  `      case 'ASKING': 
      case 'EXECUTING': return 'thread-flowing shadow-[0_0_12px_rgba(251,191,36,1)]';`
);

fs.writeFileSync(pathReact, react);
console.log("Injected deep cinematic visuals and void mechanics.");
