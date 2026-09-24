const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldHeader = `<header className="pt-12 pb-6 px-6 shrink-0 flex justify-center relative pointer-events-none z-30 bg-gradient-to-b from-[#FCFAF8] to-transparent">
        <h1 className="tracking-[0.3em] text-[10px] font-bold text-gray-400 uppercase">C-Link Reality Canvas</h1>
      </header>`;

const newHeader = `<header className="pt-12 pb-6 px-6 shrink-0 flex items-center justify-between relative z-30 bg-gradient-to-b from-[#FCFAF8] to-transparent">
        <div className="flex-1"></div>
        <h1 className="tracking-[0.3em] text-[10px] font-bold text-gray-400 uppercase pointer-events-none text-center flex-1">C-Link Reality Canvas</h1>
        <div className="flex-1 flex justify-end">
          {activeWorkId && (
            <button 
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 tracking-wide uppercase"
            >
              <History size={14} />
              Ledger
            </button>
          )}
        </div>
      </header>`;

code = code.replace(oldHeader, newHeader);

// Now I need to inject the Audit Trail Panel before the final </div>
const auditTrailPanel = `
      {/* Audit Trail Panel */}
      {showAuditTrail && (
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white border-l border-gray-100 shadow-2xl z-50 flex flex-col transform transition-transform">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-gray-900 uppercase">Canonical Events</h2>
            <button onClick={() => setShowAuditTrail(false)} className="text-gray-400 hover:text-gray-900">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {events.length === 0 ? (
              <div className="text-xs text-gray-400 text-center mt-10">No events yet.</div>
            ) : (
              events.map((ev, i) => (
                <div key={ev.id} className="flex gap-4 relative">
                  {i !== events.length - 1 && (
                    <div className="absolute left-[7px] top-[24px] bottom-[-24px] w-[2px] bg-gray-50"></div>
                  )}
                  <div className="w-4 h-4 rounded-full bg-blue-50 border-2 border-blue-500 shrink-0 mt-1 z-10"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 tracking-wide uppercase">{ev.type.replace('.', ' ')}</span>
                    <span className="text-[13px] text-gray-500 mt-1 leading-relaxed">
                      {ev.type === 'work.created' && 'Work initialized.'}
                      {ev.type === 'actor.proposed' && \`Actor proposed: \${ev.payload?.name || 'Unknown'}\`}
                      {ev.type === 'actor.updated' && \`Status changed to \${ev.payload?.status || 'Unknown'}\`}
                      {ev.type === 'evidence.provided' && \`Proof: \${ev.payload?.description || 'Documented'}\`}
                      {ev.type === 'work.resolved' && 'Work officially resolved.'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-2">
                      {ev.timestamp?.toDate ? ev.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n}/g, auditTrailPanel + "    </div>\n  );\n}");

fs.writeFileSync('src/App.tsx', code);
