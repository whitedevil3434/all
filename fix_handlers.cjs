const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const handlers = `
    if (text === 'CREATE INVITATION' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       const roleName = prompt("Enter role name (e.g. Supplier, Vendor):") || "Supplier";
       await sendCommand({
          type: 'GENERATE_INVITATION',
          workId: activeWorkId,
          payload: {
             needId: payload.needId,
             capabilityId: payload.capabilityId,
             roleName: roleName
          }
       });
       return;
    }
    if (text === 'COPY LINK' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       const link = window.location.origin + "/s/" + activeWorkId + "|" + payload.invitationId;
       navigator.clipboard.writeText(link);
       alert("Copied to clipboard: " + link);
       return;
    }
`;

code = code.replace(/if \(text === 'ACCEPT INVITATION' && sourceNodeValue && activeWorkId\) \{/, handlers + "    if (text === 'ACCEPT INVITATION' && sourceNodeValue && activeWorkId) {");
fs.writeFileSync('src/App.tsx', code);
