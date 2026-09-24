const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Looking closely at the output from line 285 to 375:
/*
285:  return (
286-    <div className="flex flex-col items-center w-full">
287-      <motion.div 
288-        layout="position"
289-        initial={{ opacity: 0, y: 20, scale: 0.95 }}
290-        animate={{ opacity: 1, y: 0, scale: 1 }}
291-        className={baseClass}
292-      >
*/
// My previous regex replaced things improperly. Let's look for exactly where the error is.
// The error is: Unexpected closing "div" tag does not match opening "motion.div" tag at 432
// And Unexpected closing "motion.div" tag does not match opening "div" tag at 702
// Basically, we injected `<div className="node-wrapper..."><div className={baseClass}>` but didn't close them properly, OR we messed up the `motion.div`.

// Let's just restore the whole file to a known good state, or manually patch it with exact string replacements if we know the structure.
// Wait, I can see the structure in the file currently:
/*
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className="w-full flex flex-col"
    >
      <div className={\`node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}>
      <div className={baseClass}>
*/

// Let's find the closing tags of NodeRenderer
