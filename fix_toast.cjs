const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(/import \{ toast \} from 'sonner';\n?/, '');

content = content.replace(
  /const \[pendingContextId, setPendingContextId\] = useState<string \| null>\(null\);/,
  `const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);`
);

content = content.replace(
  /if \(hypothesis\.inferredMeaning\) toast\(hypothesis\.inferredMeaning, \{ icon: '✦' \}\);/,
  `if (hypothesis.inferredMeaning) setToastMessage(hypothesis.inferredMeaning);`
);

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)$/,
  `        {toastMessage && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-gray-900/90 text-white text-[12px] font-medium tracking-wide px-5 py-2.5 rounded-full shadow-lg border border-gray-700/50 flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
