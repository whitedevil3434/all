const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The issue seems to be an extra closing </div> or unmatched closing tag before </TransformComponent>
const beforeContent = `          )}
        </AnimatePresence>
      </div>


            </div>
          </TransformComponent>`;

const afterContent = `          )}
        </AnimatePresence>


            </div>
          </TransformComponent>`;

content = content.replace(beforeContent, afterContent);
fs.writeFileSync(path, content);
console.log("Fixed unbalanced divs.");
