const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Update messages state definition
content = content.replace(
  /useState<Array<\{ id: string, role: 'user' \| 'ai', text: string, nodeIds: string\[\] \}>>\(\[\]\);/,
  `useState<Array<{ id: string, role: 'user' | 'ai', text: string, nodeIds: string[], actionOptions?: any[] }>>([]);`
);

// 2. Remove adding actionOptions to RealityEngine
content = content.replace(
  /\/\/ 4\. Also add actionOptions if any as GAPs to show up for user[\s\S]*?if \(newlyCreatedNodeIds\.length > 0\)/,
  `if (newlyCreatedNodeIds.length > 0)`
);

// 3. Add actionOptions to the message object
content = content.replace(
  /setMessages\(prev => \[\.\.\.prev, \{[\s\S]*?id: Date\.now\(\)\.toString\(\),[\s\S]*?role: 'ai',[\s\S]*?text: hypothesis\.inferredMeaning \|\| "Reality updated\.",[\s\S]*?nodeIds: newlyCreatedNodeIds[\s\S]*?\}\]\);/,
  `setMessages(prev => [...prev, {
         id: Date.now().toString(),
         role: 'ai',
         text: hypothesis.inferredMeaning || "Reality updated.",
         nodeIds: newlyCreatedNodeIds,
         actionOptions: hypothesis.actionOptions
      }]);`
);

// 4. Render actionOptions in the chat UI
content = content.replace(
  /\{\/\* Render newly created nodes inside the chat if they are in chatNodes \*\/\}/,
  `{/* Render Action Options as chips in the chat */}
                    {msg.actionOptions && msg.actionOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.actionOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const text = typeof opt === 'string' ? opt : opt.label;
                              handleInput({ preventDefault: () => {} } as any, text);
                            }}
                            className="text-xs bg-white border border-gray-200 shadow-sm text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {typeof opt === 'string' ? opt : opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Render newly created nodes inside the chat if they are in chatNodes */}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
