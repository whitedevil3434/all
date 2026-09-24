const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const bad1 = `{hypothesis ? (                              {Object.keys(resolvedActors).length > 0`;
const good1 = `{hypothesis ? (
              <>
              {Object.keys(resolvedActors).length > 0`;

content = content.replace(bad1, good1);

// We also need to fix the end because I might have broken the closing fragments.
// Wait, the error is around line 1809 too:
// `src/components/LivingCausalSurface.tsx(1809,15): error TS17015: Expected corresponding closing tag for JSX fragment.`

fs.writeFileSync(path, content);
console.log('Fixed early jsx');
