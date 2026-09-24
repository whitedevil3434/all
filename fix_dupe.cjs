const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const strToFind = `              </>
              ) : (
                <>
              {/* CARD 2: COMMITTED SUPPLIER (Rahim) */}
              <motion.div
                layout="position"
                onClick={() => toggleZoom('rahim')}`;

const arr = content.split(strToFind);
if (arr.length === 3) {
  // We have a duplicate. We want to remove the SECOND instance of the duplicate, which goes up to `CARD 3: THE DEFICIT`.
  // Wait, the duplicate is exact. Let's just restore the file from before I ran `fix_end.cjs` but since I don't have git...
  // Let me just regex replace the second occurrence.
  const badBlockRegex = /              <\/>\n              \) : \(\n                <>\n              \{\/\* CARD 2: COMMITTED SUPPLIER \(Rahim\) \*\/\}[\s\S]*?\{\/\* ========================================================= \*\/ \n              \{\/\* CARD 3: THE DEFICIT \/ 2ND SUPPLIER \/ LOGISTICS FRONTIER  \*\/ \}/;
  content = content.replace(badBlockRegex, `              {/* ========================================================= */}
              {/* CARD 3: THE DEFICIT / 2ND SUPPLIER / LOGISTICS FRONTIER  */}`);
  fs.writeFileSync(path, content);
  console.log("Removed duplicate!");
} else {
  console.log("Could not split properly, found", arr.length, "instances.");
}
