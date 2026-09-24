const fs = require('fs');
const path = './server.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const proxyUrl = process.env.PROXY_URL || "http://localhost:3001/v1/chat/completions";',
  'const proxyUrl = "https://api.kilo.ai/api/gateway/v1/chat/completions";'
);

content = content.replace(
  '"Authorization": "Bearer freellmapi-aa9d98f48a300e8c6b8736ea4293ec9354627d3c43b27ad4"',
  '"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwia2lsb1VzZXJJZCI6ImMxMzE3N2QwLTAxY2MtNGIyZC1hZmU0LThhNTJkYzZmZDJjMCIsImFwaVRva2VuUGVwcGVyIjpudWxsLCJ2ZXJzaW9uIjozLCJpYXQiOjE3NzUxMTA5MDYsImV4cCI6MTkzMjc5MDkwNn0.PkPIbuWl53_P7PbWbZSjQ0t31AOJ-A_VvPHJUX1LEa"'
);

content = content.replace(
  'model: "auto"',
  'model: "kilo-auto/free"'
);

fs.writeFileSync(path, content);
console.log('Applied Kilo API update to server.ts');
