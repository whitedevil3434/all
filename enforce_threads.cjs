const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The vertical stem
content = content.replace(
  /<div className="absolute left-\[15px\] top-\[-10px\] bottom-\[30px\] w-\[2px\] bg-gradient-to-b from-gray-300 via-gray-200\/50 to-transparent rounded-full" \/>/,
  '<div className="causal-thread-v" style={{ left: "15px", top: "-10px", bottom: "30px" }} />'
);

// The horizontal branch
content = content.replace(
  /<div className=\{`absolute left-\[-17px\] top-\[24px\] w-\[17px\] h-\[2px\] rounded-full transition-all duration-500 \$\{getThreadClass\(child\.state\)\}`\} \/>/,
  '<div className={`causal-thread-h transition-all duration-500 ${getThreadClass(child.state)}`} style={{ left: "-17px", top: "24px", width: "17px" }} />'
);

fs.writeFileSync(path, content);
console.log("Causal threads applied.");
