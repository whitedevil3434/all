// Sandbox for testing NLP parsing idea
const parseInput = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('need') || lower.includes('want')) {
    return { intent: 'CREATE_WANT', item: text.replace(/i need |i want /i, '') };
  }
  return { intent: 'UNKNOWN' };
};
console.log(parseInput('I need 50kg rice'));
