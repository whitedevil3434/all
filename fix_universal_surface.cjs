const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add 'universal_reasoning' to RealityStage
content = content.replace(
  `'empty' | 'gap_open' | 'karim_asking' | 'karim_offered' | 'all_sourced' | 'transport_active' | 'settled'`,
  `'empty' | 'gap_open' | 'karim_asking' | 'karim_offered' | 'all_sourced' | 'transport_active' | 'settled' | 'universal_reasoning'`
);

// 2. Set 'universal_reasoning' when parsing UNIVERSAL_INTENT
const targetUniversalIntent = `        case 'UNIVERSAL_INTENT':
          // Let the Universal Compose engine handle it entirely!
          // We don't mutate the reality stage, keeping the UI clean so the hypothesis card can show.
          break;`;

const replacementUniversalIntent = `        case 'UNIVERSAL_INTENT':
          // We switch to the universal reasoning view
          setRealityStage('universal_reasoning');
          setPerspectiveView('live');
          break;`;
content = content.replace(targetUniversalIntent, replacementUniversalIntent);


// 3. Make the Progress metrics dynamic
const targetProgress = `  // Progress metrics calculation
  const totalKg = 50;
  const committedKg = realityStage === 'empty' ? 0 : realityStage === 'gap_open' || realityStage === 'karim_asking' || realityStage === 'karim_offered' ? 30 : 50;
  const progressPercent = (committedKg / totalKg) * 100;`;

const replacementProgress = `  // Progress metrics calculation
  const totalKg = 50;
  const committedKg = realityStage === 'empty' ? 0 : realityStage === 'gap_open' || realityStage === 'karim_asking' || realityStage === 'karim_offered' ? 30 : 50;
  const progressPercent = (committedKg / totalKg) * 100;
  
  const isUniversalMode = realityStage === 'universal_reasoning' || hypothesis !== null || dynamicReality.active;
  const universalTotal = hypothesis ? hypothesis.proposedDependencies.length : (dynamicReality.active ? dynamicReality.nodes.length : 1);
  const universalCommitted = dynamicReality.active ? dynamicReality.nodes.length : Object.keys(resolvedActors).length;
  const universalProgressPercent = (universalCommitted / universalTotal) * 100;`;
content = content.replace(targetProgress, replacementProgress);

// 4. Update the coverage bar to use dynamic progress when in universal mode
const targetCoverage = `{/* CRYSTAL-CLEAR CAUSAL COVERAGE BAR (Visual Story at a Glance) */}
      {/* ========================================================= */}
      {realityStage !== 'empty' && perspectiveView === 'live' && (`;

const replacementCoverage = `{/* CRYSTAL-CLEAR CAUSAL COVERAGE BAR (Visual Story at a Glance) */}
      {/* ========================================================= */}
      {realityStage !== 'empty' && perspectiveView === 'live' && (
        isUniversalMode ? (
          <div className="w-full max-w-[340px] sm:max-w-[380px] px-4 pt-3 z-10">
          <div className="bg-neo-bg rounded-2xl p-3.5 shadow-2xs border border-black/[0.04] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'bn' ? 'বাস্তবতার অগ্রগতি' : 'Reality Coverage'}
              </span>
              <span
                className={\`text-xs font-bold font-mono px-2 py-0.5 rounded-full \${
                  universalProgressPercent === 100
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }\`}
              >
                {universalCommitted} / {universalTotal} ({Math.round(universalProgressPercent)}%)
              </span>
            </div>
            {/* Split Progress Meter */}
            <div className="w-full h-2.5 bg-neo-bg rounded-full overflow-hidden flex">
              <div
                style={{ width: \`\${universalProgressPercent}%\` }}
                className={\`h-full transition-all duration-500 \${universalProgressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}\`}
              />
            </div>
          </div>
        </div>
        ) :
        (`;

content = content.replace(targetCoverage, replacementCoverage);

// Close the ternary for coverage bar
const targetCoverageEnd = `                  title="Karim 20kg (Committed)"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}`;

const replacementCoverageEnd = `                  title="Karim 20kg (Committed)"
                />
              ) : null}
            </div>
          </div>
        </div>
        )
      )}`;
content = content.replace(targetCoverageEnd, replacementCoverageEnd);


fs.writeFileSync(path, content);
console.log('Fixed universal surface');
