const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const actorHeaderTarget = `        <div className="flex items-center gap-2 mb-1 z-10 w-full relative">
          <div className={\`p-1.5 rounded-lg 
            \${node.type === 'WANT' ? 'bg-indigo-100 text-indigo-700' : ''}
            \${node.type === 'DEPENDENCY' ? 'bg-gray-100 text-gray-700' : ''}
            \${node.type === 'ACTOR' ? 'bg-amber-100 text-amber-700' : ''}
            \${node.type === 'EVIDENCE' ? 'bg-blue-100 text-blue-700' : ''}
          \`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <span className={\`font-bold truncate \${isCompact ? 'text-xs' : 'text-sm'}\`}>
              {node.label}
            </span>`;

const actorHeaderReplacement = `        <div className="flex items-start gap-3 mb-1 z-10 w-full relative">
          {node.type === 'ACTOR' && node.data?.avatar ? (
            <div className="w-10 h-10 rounded-full bg-white border border-black/10 shadow-sm overflow-hidden shrink-0">
              <img src={node.data.avatar} alt={node.label} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={\`p-1.5 rounded-lg shrink-0
              \${node.type === 'WANT' ? 'bg-indigo-100 text-indigo-700' : ''}
              \${node.type === 'DEPENDENCY' ? 'bg-gray-100 text-gray-700' : ''}
              \${node.type === 'ACTOR' ? 'bg-amber-100 text-amber-700' : ''}
              \${node.type === 'EVIDENCE' ? 'bg-blue-100 text-blue-700' : ''}
            \`}>
              {getIcon()}
            </div>
          )}
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2">
              <span className={\`font-bold truncate \${isCompact ? 'text-xs' : 'text-sm'}\`}>
                {node.label}
              </span>`;

content = content.replace(actorHeaderTarget, actorHeaderReplacement);

const statusTagTarget = `            \${node.state === 'RESOLVED' ? 'bg-gray-800 text-white' : ''}
            \${node.state === 'FAILED' ? 'bg-red-100 text-red-700' : ''}
          \`}>
            {node.state}
          </div>
          </div>
        </div>`;

const statusTagReplace = `            \${node.state === 'RESOLVED' ? 'bg-gray-800 text-white' : ''}
            \${node.state === 'FAILED' ? 'bg-red-100 text-red-700' : ''}
          \`}>
            {node.state}
          </div>
          </div>
          
          {/* Extended Metadata for Actor */}
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

content = content.replace(statusTagTarget, statusTagReplace);

fs.writeFileSync(path, content);
console.log("Upgraded Actor and Evidence UI Rendering.");
