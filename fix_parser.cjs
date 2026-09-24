const fs = require('fs');
const path = './src/engine/causalSemanticParser.ts';
let content = fs.readFileSync(path, 'utf8');

// We add 'UNIVERSAL_INTENT' to the type definition
content = content.replace(
  `  | 'SHOW_CANDIDATES';`,
  `  | 'SHOW_CANDIDATES'\n  | 'UNIVERSAL_INTENT';`
);

// We replace the generic fallback at the end
const fallbackStr = `  return {
    action: 'MATERIALIZE_WANT',
    wantData: customWant,
    rawQuery: raw,
    explanationEn: \`✦ Causal intent materialized: \${customWant.quantity} \${customWant.item}.\`,
    explanationBn: \`✦ নতুন উদ্দেশ্য বাস্তবায়িত হয়েছে: \${customWant.quantity} \${customWant.item}।\`,
  };`;

const newFallbackStr = `  // Check if customWant has default filler values like 'Supply Item' meaning we didn't understand it
  if (customWant.item === 'Supply Item' || customWant.item === rawText.split(/\\s+/).slice(0, 3).join(' ')) {
    return {
      action: 'UNIVERSAL_INTENT',
      rawQuery: raw,
      explanationEn: '✦ Contextualizing Universal Goal...',
      explanationBn: '✦ নতুন উদ্দেশ্য বিশ্লেষণ করা হচ্ছে...',
    };
  }

  return {
    action: 'MATERIALIZE_WANT',
    wantData: customWant,
    rawQuery: raw,
    explanationEn: \`✦ Causal intent materialized: \${customWant.quantity} \${customWant.item}.\`,
    explanationBn: \`✦ নতুন উদ্দেশ্য বাস্তবায়িত হয়েছে: \${customWant.quantity} \${customWant.item}।\`,
  };`;

content = content.replace(fallbackStr, newFallbackStr);

fs.writeFileSync(path, content);
console.log('Fixed causalSemanticParser');
