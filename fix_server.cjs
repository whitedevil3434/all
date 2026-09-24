const fs = require('fs');
let code = fs.readFileSync('server_new.ts', 'utf8');
code = code.replace(/import express from "express";/, 'import express from "express";\nimport { handleCommand } from "./server-commands.js";');
code = code.replace(/app\.post\("\/api\/commands", require\("\.\/server-commands\.ts"\)\.handleCommand\);/, 'app.post("/api/commands", handleCommand);');
fs.writeFileSync('server.ts', code);
