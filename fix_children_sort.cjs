const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /children = Array\.from\(new Map\(children\.map\(n => \[n\.id, n\]\)\)\)\.values\(\);/,
  `children = Array.from(new Map(children.map(n => [n.id, n])).values());
  children.sort((a, b) => {
    const getOrder = (t: string) => {
      if (t === 'GAP') return 1;
      if (t === 'DEPENDENCY') return 2;
      if (t === 'ACTOR') return 3;
      return 4;
    };
    return getOrder(a.type) - getOrder(b.type);
  });`
);

content = content.replace(
  /case 'WANT': return <Target className="w-5 h-5 text-gray-700" \/>;/,
  `case 'WANT': return <Target className="w-5 h-5 text-gray-700" />;
      case 'GAP' as any: return <AlertTriangle className="w-4 h-4 text-rose-500" />;`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
