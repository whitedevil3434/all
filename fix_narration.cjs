const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetBn = `if (realityStage === 'transport_active') return '✦ চালক তারিক পণ্য নিয়ে গন্তব্যের পথে (শেরপুর ও মিরপুর পিকআপ সম্পন্ন)।';`;
const newBn = `if (realityStage === 'transport_active') return '✦ চালক তারিক পণ্য নিয়ে গন্তব্যের পথে (শেরপুর ও মিরপুর পিকআপ সম্পন্ন)।';
      if (realityStage === 'universal_reasoning') return '✦ কজাল অপটিমাইজেশন চলছে...';`;

const targetEn = `if (realityStage === 'transport_active') return '✦ Driver Tariq in transit with 50kg rice.';`;
const newEn = `if (realityStage === 'transport_active') return '✦ Driver Tariq in transit with 50kg rice.';
    if (realityStage === 'universal_reasoning') return '✦ Materializing Causal Surface...';`;

content = content.replace(targetBn, newBn);
content = content.replace(targetEn, newEn);

fs.writeFileSync(path, content);
console.log('Fixed narration');
