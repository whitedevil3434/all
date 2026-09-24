const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Inside NodeRenderer, when it is rendered in the chat, we DO want it to render its children (even if they are in chatNodes).
// We know it is rendered in the chat if chatNodes is passed down.
// BUT wait, if we don't filter them, then msg.nodeIds mapping will render the child AGAIN as a sibling.
// So let's REMOVE the children filtering inside NodeRenderer, AND change the chat map to ONLY render roots of the newly created nodes.
// Actually, it's simpler: Let NodeRenderer render everything recursively. 
// Inside the chat, we just map over msg.nodeIds, but we only render the ones that don't have parents inside the same msg.nodeIds.
// Or we just don't pass chatNodes to NodeRenderer.
// Let's modify the filtering logic inside NodeRenderer.

content = content.replace(
  /if \(chatNodes\) \{\s*children = children\.filter\(c => !chatNodes\.has\(c\.id\)\);\s*\}/,
  `if (chatNodes) {
    // If we are on the board, we don't want to render children that are in the chat.
    // We are on the board if THIS node is NOT in chatNodes.
    if (!chatNodes.has(node.id)) {
      children = children.filter(c => !chatNodes.has(c.id));
    }
  }`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);
