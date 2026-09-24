const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  </motion.div>
                </>
              ) : (
                <>
                  {/* CARD 2: COMMITTED SUPPLIER (Rahim) */}`;

const newStr = `                  </motion.div>
                </>
              ) : realityStage === 'universal_reasoning' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-gray-500 w-full">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 animate-pulse">Materializing Logic...</span>
                </motion.div>
              ) : (
                <>
                  {/* CARD 2: COMMITTED SUPPLIER (Rahim) */}`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content);
console.log('Fixed hardcoded fallback');
