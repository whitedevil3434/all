const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the start block
const badStart = `{hypothesis ? (
              {Object.keys(resolvedActors).length > 0`;
const goodStart = `{hypothesis ? (
              <>
              {Object.keys(resolvedActors).length > 0`;
content = content.replace(badStart, goodStart);

// Need to close the fragment right before the `) : (`
const badEnd = `</AnimatePresence>
              ) : (`
const goodEnd = `</AnimatePresence>
              </>
              ) : (`
content = content.replace(badEnd, goodEnd);

fs.writeFileSync(path, content);
console.log('Fixed JSX syntax error');
