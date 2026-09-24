const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf-8');

content = content.replace(
  /\.causal-thread-v \{[\s\S]*?border-radius: 999px;\s*\}/,
  `.causal-thread-v {
    position: absolute;
    left: -20px;
    top: -12px;
    bottom: 24px;
    width: 0px;
    border-left: 2px solid #E4E4E7;
  }`
);

content = content.replace(
  /\.causal-thread-h \{[\s\S]*?background-color: #E4E4E7;\s*\}/,
  `.causal-thread-h {
    position: absolute;
    left: -20px;
    top: 24px;
    width: 20px;
    height: 0px;
    border-top: 2px solid #E4E4E7;
  }`
);

fs.writeFileSync('src/index.css', content);
