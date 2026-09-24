const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const metadataTarget = `          {/* Extended Metadata for Actor */}
          {node.type === 'ACTOR' && node.data && (
            <div className="flex gap-3 text-[10px] text-gray-500 font-medium mt-1">
              <span className="truncate max-w-[120px]">{node.data.role}</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-500" />
                <span>{node.data.rating}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span>{node.data.cost}</span>
              </div>
            </div>
          )}

          {/* Extended Metadata for Evidence */}
          {node.type === 'EVIDENCE' && node.data && (
            <div className="flex gap-3 text-[10px] text-gray-500 font-medium mt-1">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{node.data.fileType} • {node.data.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{node.data.timestamp}</span>
              </div>
            </div>
          )}
        </div>`;

const richMetadata = `          {/* Extended Metadata for Actor */}
          {node.type === 'ACTOR' && node.data && (
            <div className="flex gap-3 text-[10px] text-gray-500 font-medium mt-1">
              <span className="truncate max-w-[120px]">{node.data.role}</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-500" />
                <span>{node.data.rating}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span>{node.data.cost}</span>
              </div>
            </div>
          )}

          {/* Extended Metadata for Evidence */}
          {node.type === 'EVIDENCE' && node.data && (
            <div className="flex gap-3 text-[10px] text-gray-500 font-medium mt-1">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{node.data.fileType} • {node.data.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{node.data.timestamp}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Deep Semantic Bodies (The "Bla Bla") */}
        {node.data?.rationale && (
          <div className="mt-3 p-3 bg-white/50 border border-black/5 rounded-xl shadow-inner text-xs text-gray-600 leading-relaxed font-medium">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Causal Requirement</span>
            {node.data.rationale}
          </div>
        )}
        
        {node.data?.unknowns && node.data.unknowns.length > 0 && (
          <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl shadow-inner text-xs text-indigo-700/80 leading-relaxed font-medium">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Open Clarifications</span>
            <ul className="list-disc pl-4 space-y-1">
              {node.data.unknowns.map((u: string, idx: number) => <li key={idx}>{u}</li>)}
            </ul>
          </div>
        )}

        {node.data?.proposal && node.state !== 'FAILED' && node.state !== 'COMMITTED' && node.state !== 'EXECUTING' && node.state !== 'VERIFYING' && node.state !== 'RESOLVED' && (
          <div className="mt-3 p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl shadow-inner text-xs text-amber-800/80 leading-relaxed font-medium relative">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">Actor Proposal</span>
            "{node.data.proposal}"
          </div>
        )}

        {node.data?.summary && (node.state === 'VERIFYING' || node.state === 'RESOLVED') && (
          <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl shadow-inner text-xs text-blue-800/80 leading-relaxed font-medium">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-500 mb-1">Work Summary</span>
            {node.data.summary}
            <div className="mt-2 text-[9px] font-mono text-blue-400/80 bg-blue-100/50 px-2 py-1 rounded inline-block">
              Hash: {node.data.hash}
            </div>
          </div>
        )}`;

content = content.replace(metadataTarget, richMetadata);

// To prevent React errors, ensure we don't have unused variables or missing imports.
fs.writeFileSync(path, content);
console.log("Injected Rich UI for Actor/Evidence/Want/Dependency payloads.");
