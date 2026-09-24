const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// See if clarificationText state exists
if (!content.includes('clarificationText')) {
    console.log("No clarificationText state");
} else {
    console.log("Has clarificationText state");
}
