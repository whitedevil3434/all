const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const endpoint = `
app.get("/api/invitation-context", async (req, res) => {
  try {
    const { workId, invId } = req.query;
    if (!workId || !invId) return res.status(400).json({ error: "Missing ids" });
    const { getFirestore } = require("firebase-admin/firestore");
    const db = getFirestore();
    const invSnap = await db.collection("works").doc(workId).collection("invitations").doc(invId).get();
    if (!invSnap.exists) return res.status(404).json({ error: "Not found" });
    const inv = invSnap.data();
    
    const needSnap = await db.collection("works").doc(workId).collection("needs").doc(inv.needId).get();
    const needDesc = needSnap.exists ? needSnap.data().description : "Unknown Need";
    
    return res.json({ roleName: inv.roleName, needDesc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
`;
code = code.replace(/app\.post\("\/api\/commands"/, endpoint + '\napp.post("/api/commands"');
fs.writeFileSync('server.ts', code);
