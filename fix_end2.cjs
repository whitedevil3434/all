const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// I need to add `</>)}` right before `</motion.div> )} {/* ========================================================= */} {/* 3. PARTICIPANT VIEW:`

const searchStr = `</motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. PARTICIPANT VIEW: KARIM (FARMER FRACTAL C-LINK SCOPE)   */}`;

const replaceStr = `                </>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. PARTICIPANT VIEW: KARIM (FARMER FRACTAL C-LINK SCOPE)   */}`;

content = content.replace(searchStr, replaceStr);
fs.writeFileSync(path, content);
