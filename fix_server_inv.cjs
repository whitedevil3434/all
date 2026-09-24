const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const endpoint = `
app.get("/api/invitations/:invitationId", async (req, res) => {
  try {
    const { invitationId } = req.params;
    // We have to search for the invitation across all works since it's works/{workId}/invitations/{invitationId}
    const { getFirestore } = require("firebase-admin/firestore");
    const db = getFirestore();
    const invs = await db.collectionGroup("invitations").where("__name__", "==", \`invitations/\${invitationId}\`).get();
    
    // Wait, collectionGroup query requires an index, or we can just filter in memory if not indexed, but Firestore requires index.
    // Instead, since the UI generates the link, the UI can just encode the workId in the token!
    // E.g. token = base64(workId + ":" + invitationId)
  } catch(e) {}
});
`;

