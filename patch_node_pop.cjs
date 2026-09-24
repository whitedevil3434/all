const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add isPressing state
content = content.replace(
  /const \[evidenceInput, setEvidenceInput\] = useState\(''\);/,
  `const [evidenceInput, setEvidenceInput] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const isPopped = poppedNodeId === node.id;`
);

// 2. Modify onPointerDown
content = content.replace(
  /onPointerDown=\{\(\) => \{[\s\S]*?window\.addEventListener\('pointercancel', clear, \{ once: true \}\);\s*\}\s*\}\}/,
  `onPointerDown={() => {
        if (onLongPress) {
          const t = setTimeout(() => onLongPress(node.id), 400);
          const clear = () => clearTimeout(t);
          window.addEventListener('pointerup', clear, { once: true });
          window.addEventListener('pointermove', clear, { once: true });
          window.addEventListener('pointercancel', clear, { once: true });
        } else {
          setIsPressing(true);
          const t = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('CLINK_POP_NODE', { detail: { id: node.id } }));
            setIsPressing(false);
          }, 400);
          const clear = () => { clearTimeout(t); setIsPressing(false); };
          window.addEventListener('pointerup', clear, { once: true });
          window.addEventListener('pointermove', clear, { once: true });
          window.addEventListener('pointercancel', clear, { once: true });
        }
      }}`
);

// 3. Add dynamic animation props to motion.div wrapper based on isPopped and isPressing
content = content.replace(
  /<motion\.div\s*layoutId=\{`node-\$\{node\.id\}`\}\s*className=\{`node-wrapper relative \$\{isExpanded \|\| activeContextId === node\.id \|\| node\.state === 'ASKING' \|\| node\.state === 'EXECUTING' \? 'node-is-focused z-10' : 'z-0'\}`\}/,
  `<motion.div 
      layoutId={\`node-\${node.id}\`}
      animate={isPopped ? { scale: 1.05, zIndex: 50, boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" } : isPressing ? { scale: 0.97 } : { scale: 1, zIndex: (isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING') ? 10 : 0, boxShadow: "none" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={\`node-wrapper relative \${isPopped ? 'z-50' : 'z-0'}\`}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
