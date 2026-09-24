const fs = require('fs');
const path = './src/engine/universal/useUniversalCompose.ts';
let content = fs.readFileSync(path, 'utf8');

const importCode = `import { buildContextSnapshot } from './ContextOrchestrator';\n`;
content = importCode + content;

const targetCode = `  const submitIntent = async (prompt: string, contextSnapshot: any = {}) => {`;
const replaceCode = `  const submitIntent = async (prompt: string) => {
    const contextSnapshot = buildContextSnapshot(prompt);`;
    
content = content.replace(targetCode, replaceCode);

fs.writeFileSync(path, content);
console.log('Fixed useUniversalCompose');
