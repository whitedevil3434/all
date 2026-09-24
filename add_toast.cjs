const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Add sonner toast for transient narration
content = content.replace(
  /import \{ useUniversalCompose \} from '\.\.\/engine\/universal\/useUniversalCompose';/,
  `import { useUniversalCompose } from '../engine/universal/useUniversalCompose';\nimport { toast } from 'sonner';`
);

content = content.replace(
  /causalAudio\.playSettleHarmony\(\);/,
  `causalAudio.playSettleHarmony();\n      if (hypothesis.inferredMeaning) toast(hypothesis.inferredMeaning, { icon: '✦' });`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
