const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The main return block of DynamicRealitySurface:
const mainReturnRegex = /return \(\s*<div className={`flex flex-col items-center w-full node-wrapper[\s\S]*?<div className="flex items-start justify-between">/m;

const mainReturnReplacement = `return (
    <div className="w-full max-w-4xl mx-auto pb-40 surface-container">
        <AnimatePresence mode="popLayout">`;

content = content.replace(mainReturnRegex, mainReturnReplacement);

// Let's also check if we messed up NodeRenderer return.
// The NodeRenderer function should look like this:
const nodeRendererRegex = /function NodeRenderer\({[\s\S]*?return \(/m;
// Let's see how NodeRenderer starts.
