const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add useRef to imports if not there (it's not, we only have useState, useEffect, useCallback)
content = content.replace(
  /import React, \{ useState, useEffect, useCallback \} from 'react';/,
  `import React, { useState, useEffect, useCallback, useRef } from 'react';`
);

// Fallback if import is different:
content = content.replace(
  /import React, \{ useState, useEffect \} from 'react';/,
  `import React, { useState, useEffect, useRef } from 'react';`
);

// 2. Add touchRef inside NodeRenderer
content = content.replace(
  /const \[isPressing, setIsPressing\] = useState\(false\);/,
  `const [isPressing, setIsPressing] = useState(false);
  const touchRef = useRef(false);`
);

// 3. Update pointer down block
content = content.replace(
  /setIsPressing\(true\);\s*const t = setTimeout\(\(\) => \{\s*window\.dispatchEvent\(new CustomEvent\('CLINK_POP_NODE', \{ detail: \{ id: node\.id \} \}\)\);\s*setIsPressing\(false\);\s*\}, 400\);\s*const clear = \(\) => \{ clearTimeout\(t\); setIsPressing\(false\); \};/,
  `setIsPressing(true);
          touchRef.current = false;
          const t = setTimeout(() => {
            touchRef.current = true;
            window.dispatchEvent(new CustomEvent('CLINK_POP_NODE', { detail: { id: node.id } }));
            setIsPressing(false);
          }, 400);
          const clear = () => { 
            clearTimeout(t); 
            setIsPressing(false); 
            setTimeout(() => touchRef.current = false, 100); 
          };`
);

// 4. Update onClick
content = content.replace(
  /<div className=\{baseClass \+ ' cursor-pointer'\} onClick=\{\(\) => setActiveContextId\(activeContextId === node\.id \? null : node\.id\)\}>/,
  `<div className={baseClass + ' cursor-pointer'} onClick={(e) => {
          if (touchRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          setActiveContextId(activeContextId === node.id ? null : node.id);
        }}>`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
