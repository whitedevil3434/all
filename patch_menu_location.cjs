const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// The menu block starts at: {/* Haptic Context Menu */}
// and ends with: </motion.div> } </div> </motion.div>

const menuStart = content.indexOf('{/* Haptic Context Menu */}');
const menuEndString = `</motion.div>\n          )}\n\n          </div>`;
const menuEnd = content.indexOf(menuEndString, menuStart);

if (menuStart > -1 && menuEnd > -1) {
  // Extract the menu
  const fullMatchLength = menuEnd + menuEndString.length;
  // Actually, we want to take the menu out, and put it AFTER `</div>`.
  // Currently the code is:
  // {/* Haptic Context Menu */}
  // {isPopped && ( <motion.div ... > ... </motion.div> )}
  // </div>
  // </motion.div>
  
  content = content.replace(
    /\{\/\* Haptic Context Menu \*\/\}[\s\S]*?<\/motion\.div>\s*\)\}\s*<\/div>\s*<\/motion\.div>/,
    match => {
      // The match includes the closing </div> of the baseClass div, and the closing </motion.div> of the wrapper.
      // We want to move </div> to BEFORE the context menu.
      const menuOnly = match.replace(/\s*<\/div>\s*<\/motion\.div>/, '');
      return `\n          </div>\n          ${menuOnly}\n      </motion.div>`;
    }
  );
  
  fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
  console.log("Successfully moved context menu out of baseClass div.");
} else {
  console.log("Could not find menu boundaries.");
}
