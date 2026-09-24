const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes("import { Routes, Route, useParams }")) {
   code = code.replace("import { sendCommand } from './lib/api';", "import { sendCommand } from './lib/api';\nimport { Routes, Route, useParams, useNavigate } from 'react-router-dom';");
}

code = code.replace(/export default function App\(\) \{/, 'function MainApp() {');
code = code.replace(/$/, '\nexport default function App() {\n  return (\n    <Routes>\n      <Route path="/" element={<MainApp />} />\n      <Route path="/s/:invitationId" element={<InvitationView />} />\n    </Routes>\n  );\n}\n\nfunction InvitationView() {\n  const { invitationId } = useParams();\n  const navigate = useNavigate();\n  const [loading, setLoading] = React.useState(true);\n  const [name, setName] = React.useState("");\n\n  React.useEffect(() => {\n    // Ideally we would fetch the invitation details here.\n    // For this prototype, we just ask for their name and claim.\n    setLoading(false);\n  }, [invitationId]);\n\n  const handleClaim = async () => {\n    if (!name) return;\n    try {\n       // Note: We need workId here, which isn\'t in the URL but we can make it /s/:workId/:invitationId or fetch it.\n       // Wait, the prompt says /s/:token.\n       // If it\'s a global token, we need a backend endpoint to resolve the token to a workId. \n    } catch (e) {}\n  };\n\n  return <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">\n    <h1 className="text-2xl font-bold mb-4">C-LINK</h1>\n    <p className="mb-4">You have been invited to a Work.</p>\n    <input className="border p-2 mb-4" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />\n    <button className="bg-black text-white px-4 py-2" onClick={handleClaim}>Accept Invitation</button>\n  </div>;\n}\n');

fs.writeFileSync('src/App.tsx', code);
