const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add 'is-popping' to root
content = content.replace(
  /<div className="w-full max-w-4xl mx-auto pb-40 surface-container">/,
  `<div className={\`w-full max-w-4xl mx-auto pb-40 surface-container \${poppedNodeId ? 'is-popping' : ''}\`}>
      <style>{\`
        .is-popping .card-content {
          filter: blur(2px) grayscale(20%);
          opacity: 0.5;
          transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-popping .popped-node .card-content {
          filter: none;
          opacity: 1;
        }
        .is-popping .causal-thread-v,
        .is-popping .causal-thread-h {
          opacity: 0.15;
          transition: opacity 0.4s ease;
        }
        .card-content {
          transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      \`}</style>`
);

// 2. Remove the old fixed backdrop completely (we will handle outside click via window listener, or just keep it simple)
content = content.replace(
  /\{\/\* Haptic Context Menu Backdrop \*\/\}[\s\S]*?\{\/\* The main tree rendering \*\/\}/,
  `{/* The main tree rendering */}`
);

// 3. Add 'popped-node' to the node wrapper
content = content.replace(
  /className=\{`node-wrapper relative \$\{isPopped \? 'z-50' : ''\}`\}/,
  `className={\`node-wrapper relative \${isPopped ? 'z-50 popped-node' : ''}\`}`
);

// 4. Add 'card-content' class to the baseClass div
content = content.replace(
  /<div className=\{baseClass \+ ' cursor-pointer'\} onClick=\{\(e\) => \{/,
  `<div className={baseClass + ' cursor-pointer card-content'} onClick={(e) => {`
);

// 5. Update the pointer events logic to dismiss pop if clicked outside
// Actually, setting window click listener inside `DynamicRealitySurface` useEffect:
content = content.replace(
  /window\.addEventListener\('CLINK_POP_NODE', handlePop\);/,
  `window.addEventListener('CLINK_POP_NODE', handlePop);
    const handleOutsideClick = (e: MouseEvent) => {
      // If we have a popped node and we click, let's just dismiss it (unless we click inside the menu, which we can stopPropagation on)
      setPoppedNodeId(null);
    };
    window.addEventListener('click', handleOutsideClick);`
);

content = content.replace(
  /window\.removeEventListener\('CLINK_POP_NODE', handlePop\);/,
  `window.removeEventListener('CLINK_POP_NODE', handlePop);
      window.removeEventListener('click', handleOutsideClick);`
);

// Stop propagation on the card content when popped so it doesn't immediately dismiss
content = content.replace(
  /setActiveContextId\(activeContextId === node\.id \? null : node\.id\);\s*\}\}>/,
  `setActiveContextId(activeContextId === node.id ? null : node.id);
        }}>`
);

// Wait, the card onClick already has e.stopPropagation() if touchRef.current is true, but what if it's already popped and they click the menu?
// The menu buttons already have e.stopPropagation().
// But if they click the card itself while it's popped, it will bubble to window and close it. That's actually expected (tapping the card closes the pop).

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
