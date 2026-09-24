const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const [clarificationText, setClarificationText]')) {
  content = content.replace(
    "const [inputText, setInputText] = useState('');",
    "const [inputText, setInputText] = useState('');\n  const [clarificationText, setClarificationText] = useState('');"
  );
}

// Now replace the input section
const oldInputRegex = /<input\s+type="text"\s+id="clarification-input"[\s\S]*?onKeyDown=\{\(e\) => \{[\s\S]*?\}\}\s+\/>/m;

const newInput = `<input 
                      type="text"
                      id="clarification-input"
                      value={clarificationText}
                      onChange={(e) => setClarificationText(e.target.value)}
                      disabled={isComposing}
                      placeholder="Answer in natural language to refine..."
                      className="w-full bg-white rounded-lg py-2.5 pl-4 pr-10 text-sm border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = clarificationText.trim();
                          if (val) {
                            const refinementPrompt = \`Original Intent: \${hypothesis.inferredMeaning}\\nPending Unknowns: \${hypothesis.unknowns.join(', ')}\\n\\nUser Clarification: \${val}\\n\\nPlease refine the proposal, resolve the unknowns, and generate a new structure.\`;
                            setClarificationText('');
                            clearHypothesis();
                            submitIntent(refinementPrompt);
                          }
                        }
                      }}
                    />`;

content = content.replace(oldInputRegex, newInput);

fs.writeFileSync(path, content);
console.log("Clarification input patched.");
