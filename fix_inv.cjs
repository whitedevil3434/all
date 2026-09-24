const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const invView = `
function InvitationView() {
  const { invitationId: token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState("");
  const [invContext, setInvContext] = React.useState<any>(null);
  
  React.useEffect(() => {
    async function fetchInv() {
      if (!token) return;
      const [workId, invId] = token.split('|');
      if (!workId || !invId) return;
      // We can just fetch via API, or if read rules allow, we can read directly via Firebase!
      try {
         const res = await fetch('/api/invitation-context?workId=' + workId + '&invId=' + invId);
         const data = await res.json();
         setInvContext(data);
      } catch(e) {}
      setLoading(false);
    }
    fetchInv();
  }, [token]);

  const handleClaim = async () => {
    if (!name || !token) return;
    const [workId, invId] = token.split('|');
    try {
      setLoading(true);
      await sendCommand({
        type: 'ACCEPT_INVITATION',
        workId,
        payload: {
          invitationId: invId,
          actorName: name
        }
      });
      navigate('/?workId=' + workId);
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!invContext) return <div className="p-10">Invalid Invitation</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center border-b border-gray-100">
           <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">C-LINK</h1>
           <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Work Invitation</p>
        </div>
        <div className="p-8 bg-gray-50/50 flex flex-col gap-6">
           <div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Want</p>
             <p className="text-lg font-semibold text-gray-900">{invContext.needDesc}</p>
           </div>
           <div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Role</p>
             <p className="text-lg font-semibold text-gray-900">{invContext.roleName}</p>
           </div>
           <div className="pt-4 border-t border-gray-200">
             <p className="text-sm text-gray-600 mb-3 text-center">Can you fulfill this capability?</p>
             <input className="w-full border-2 border-gray-200 rounded-xl p-3 mb-4 font-medium focus:border-black focus:outline-none transition-colors text-center" placeholder="Enter your name to claim" value={name} onChange={e => setName(e.target.value)} />
             <button className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold tracking-wide hover:bg-gray-800 transition-colors shadow-lg shadow-black/10" onClick={handleClaim}>CAN DO IT</button>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

code = code.replace(/function InvitationView\(\) \{[\s\S]*\}\n/, invView);
fs.writeFileSync('src/App.tsx', code);
