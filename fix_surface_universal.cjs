const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `        case 'MATERIALIZE_WANT':
        default:
          if (parsed.wantData) {
            setActiveWant(parsed.wantData);
          }
          setPerspectiveView('live');
          setRealityStage('gap_open');
          causalAudio.playCommitChord();
          setTransientAiText(
            lang === 'bn'
              ? '✦ ৩০ কেজি চাল নিশ্চিত। বাকি ২০ কেজির জন্য সরবরাহকারী প্রয়োজন।'
              : '✦ 30kg is committed. 20kg still needs a source.'
          );
          break;`;

const newStr = `        case 'UNIVERSAL_INTENT':
          // Let the Universal Compose engine handle it entirely!
          // We don't mutate the reality stage, keeping the UI clean so the hypothesis card can show.
          break;

        case 'MATERIALIZE_WANT':
        default:
          if (parsed.wantData) {
            setActiveWant(parsed.wantData);
          }
          setPerspectiveView('live');
          setRealityStage('gap_open');
          causalAudio.playCommitChord();
          setTransientAiText(
            lang === 'bn'
              ? '✦ ৩০ কেজি চাল নিশ্চিত। বাকি ২০ কেজির জন্য সরবরাহকারী প্রয়োজন।'
              : '✦ 30kg is committed. 20kg still needs a source.'
          );
          break;`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content);
console.log('Fixed LivingCausalSurface');
