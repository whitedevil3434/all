const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `{/* ========================================================= */}
              {/* CARD 3: THE DEFICIT / 2ND SUPPLIER / LOGISTICS FRONTIER  */}
              {/* ========================================================= */}`;

const fix = `
                </>
              ) : (
                <>
              {/* CARD 2: COMMITTED SUPPLIER (Rahim) */}
              <motion.div
                layout="position"
                onClick={() => toggleZoom('rahim')}
                className={\`w-full bg-neo-bg rounded-[24px] p-5 shadow-neo-up-lg border border-white/40 flex items-center gap-4 cursor-pointer hover:shadow-neo-up-xl transition-all \${
                  zoomedCardId === 'rahim' ? 'ring-2 ring-black/10' : ''
                }\`}
              >
                <div className="w-12 h-12 rounded-full border-transparent bg-neo-bg shadow-neo-down flex items-center justify-center shrink-0 text-[#1C1C1A]">
                  <User className="w-5 h-5 text-gray-700 stroke-[1.5]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {lang === 'bn' ? '১ম সরবরাহকারী (WHO)' : 'SUPPLIER 1 (WHO)'}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      {lang === 'bn' ? 'সম্মত' : 'Agreed'}
                    </span>
                  </div>
                  <span className="text-base sm:text-[17px] font-bold text-[#1C1C1A] leading-snug">
                    {activeWant.committedActor || 'Rahim (Farmer)'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 font-medium">
                      {activeWant.committedAmount || '30kg'} · {activeWant.committedPrice || '৳3,600'}
                    </span>
                    <span className="text-[11px] text-gray-400">Sherpur Farm</span>
                  </div>
                </div>
              </motion.div>
              {/* In-Place Semantic Zoom for Rahim */}
              <AnimatePresence>
                {zoomedCardId === 'rahim' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-[92%] bg-neo-bg/95 border-x border-b border-black/[0.04] rounded-b-2xl p-3.5 text-xs text-gray-600 flex flex-col gap-2 -mt-2 z-0"
                  >
                    <div className="flex justify-between border-b border-black/[0.04] pb-1.5">
                      <span className="font-semibold text-gray-800">Farmer:</span>
                      <span>Rahim (Sherpur Agro)</span>
                    </div>
                    <div className="flex justify-between border-b border-black/[0.04] pb-1.5">
                      <span className="font-semibold text-gray-800">Unit Price:</span>
                      <span className="font-mono font-bold">৳120 / kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Proof Commitment:</span>
                      <span>Digital Signed Commitment #842</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Atmospheric Connector 2 */}
              <div className="flex flex-col items-center my-0.5">
                <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-0.5" />
                <div className="w-[1.5px] h-3.5 border-l-2 border-dotted border-gray-300" />
              </div>

              {/* ========================================================= */}
              {/* CARD 3: THE DEFICIT / 2ND SUPPLIER / LOGISTICS FRONTIER  */}
              {/* ========================================================= */}`;

content = content.replace(target, fix);
fs.writeFileSync(path, content);
