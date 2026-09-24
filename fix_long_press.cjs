const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const t = setTimeout\(\(\) => onLongPress\(node\.id\), 500\);\s*window\.addEventListener\('pointerup', \(\) => clearTimeout\(t\), \{ once: true \}\);/,
  `const t = setTimeout(() => onLongPress(node.id), 400);
          const clear = () => clearTimeout(t);
          window.addEventListener('pointerup', clear, { once: true });
          window.addEventListener('pointermove', clear, { once: true });
          window.addEventListener('pointercancel', clear, { once: true });`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
