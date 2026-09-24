const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `{perspectiveView === 'rahim' && (
            <ExternalActorCausalSurface
              key="karim-fractal-surface"
              actorType="karim"
              scenario={currentScenario}
              lang={lang}
              onBackToLive={() => {
                causalAudio.playCommitChord();
                setPerspectiveView('live');
              }}
              onSyncRealityEvent={(eventDesc) => {
                setTransientAiText(eventDesc);
                setTimeout(() => setTransientAiText(null), 4000);
              }}
              karimSubTasks={karimSubTasks}
              setKarimSubTasks={setKarimSubTasks}
              tariqSubTasks={tariqSubTasks}
              setTariqSubTasks={setTariqSubTasks}
            />
          )}`;

const replacementStr = `{perspectiveView === 'rahim' && (
            <UniversalActorSurface
              actorName={lang === 'bn' ? 'করিম' : 'Karim'}
              actorRole={lang === 'bn' ? 'সরবরাহকারী' : 'Supplier'}
              primaryResponsibility={lang === 'bn' ? '২০ কেজি চাল সরবরাহ' : 'Supply 20kg Rice'}
              lang={lang}
              onBackToLive={() => {
                causalAudio.playCommitChord();
                setPerspectiveView('live');
              }}
            />
          )}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content);
console.log('Replaced Rahim view with UniversalActorSurface');
