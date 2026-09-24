const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add aiResponse state
code = code.replace(
  "const [inputText, setInputText] = useState('');",
  "const [inputText, setInputText] = useState('');\n  const [aiResponse, setAiResponse] = useState<string | null>(null);"
);

// 2. Handle data.response in handleAction
const handleActionOld = `      const data = await response.json();

      if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {`;

const handleActionNew = `      const data = await response.json();
      
      if (data.response) {
        setAiResponse(data.response);
        setTimeout(() => setAiResponse(null), 8000);
      }

      if (data.semanticAction && (data.semanticAction.type === 'CONVERSATION' || data.semanticAction.type === 'SHOW_NEXT' || data.semanticAction.type === 'NONE')) {
        // Just conversational, do not mutate graph or create draft
        console.log("Conversational intent handled.");
      } else if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {`;

code = code.replace(handleActionOld, handleActionNew);

// 3. Render aiResponse bubble above the input box
const renderOld = `      {/* Semantic Composer Layer */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#FCFAF8] via-[#FCFAF8] to-transparent pt-12 pb-8 px-6 flex flex-col items-center z-40 pointer-events-none">`;

const renderNew = `      {/* Semantic Composer Layer */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#FCFAF8] via-[#FCFAF8] to-transparent pt-12 pb-8 px-6 flex flex-col items-center z-40 pointer-events-none">
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-4 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl max-w-sm text-sm font-medium leading-relaxed"
            >
              <Sparkles className="w-4 h-4 inline-block mr-2 -mt-0.5 text-gray-300" />
              {aiResponse}
            </motion.div>
          )}
        </AnimatePresence>`;

code = code.replace(renderOld, renderNew);

fs.writeFileSync('src/App.tsx', code);
