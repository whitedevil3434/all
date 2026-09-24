const fs = require('fs');
let code = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf8');

const target = `  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
          
  useEffect(() => {
    const handleOpenDiscovery = (e: any) => {
      setDiscoveryTargetId(e.detail.id);
      setDiscoveryTargetLabel(e.detail.label);
      setDiscoveryOpen(true);
    };
    window.addEventListener('OPEN_DISCOVERY', handleOpenDiscovery);
    return () => window.removeEventListener('OPEN_DISCOVERY', handleOpenDiscovery);
  }, []);

  return () => clearTimeout(t);
    }
  }, [toastMessage]);`;

const replacement = `  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  useEffect(() => {
    const handleOpenDiscovery = (e: any) => {
      setDiscoveryTargetId(e.detail.id);
      setDiscoveryTargetLabel(e.detail.label);
      setDiscoveryOpen(true);
    };
    window.addEventListener('OPEN_DISCOVERY', handleOpenDiscovery);
    return () => window.removeEventListener('OPEN_DISCOVERY', handleOpenDiscovery);
  }, []);`;

if (code.includes(target)) {
    fs.writeFileSync('src/components/DynamicRealitySurface.tsx', code.replace(target, replacement));
    console.log('Fixed nested useEffect');
} else {
    console.log('Target not found');
}
