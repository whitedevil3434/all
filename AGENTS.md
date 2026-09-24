# C-Link Core Architecture Rules

**1. The Interface to Reality**
- The protocol may be enormous. The visible interface must remain small.
- The user never operates the protocol directly. The user operates the current reality.
- The UI is not a map of C-Link. The UI is C-Link's current projection of reality.

**2. The Reality Loop**
- When reality changes, the surface changes.
- When the user touches the surface, reality can change.
- When the user speaks, the same semantic action occurs.
- Conversation, visual interaction, actors, AI, commitments, evidence, and execution are different interfaces to one causal reality.

**3. Vocabulary Constraints (MANDATORY)**
Never use traditional CRUD or Dashboard terminology in code or concepts. Use the following:
- ❌ EditorView / GraphEditor -> ✅ `RealitySurface`
- ❌ UI Card / Node -> ✅ `RealityObject`
- ❌ Wire / Edge -> ✅ `CausalRelation`
- ❌ View / Screen -> ✅ `Projection`
- ❌ Highlight / Focus -> ✅ `Attention`
- ❌ Button Click / Chat Command -> ✅ `SemanticAction`
- ❌ Chatbot / LLM -> ✅ `Composer`
- ❌ User Role -> ✅ `ActorScope`
- ❌ DB Update -> ✅ `RealityEvent`

**4. AI as a Cursor, Not a Permanent Card**
AI presence is transient. It is represented by `✦` (Attention/Pointer).
Show observable reasoning consequences (e.g., `✦ finding capability`), not hidden chain-of-thought.
When reality settles (e.g., `✓ Karim accepted`), the AI presence (`✦`) disappears.

**5. Visual Meaning (Semantic Gravity)**
- Size, contrast, and position are determined by "Semantic Gravity".
- Objects that are critical (like an unresolved GAP) have high gravity (attention ↑).
- Objects that are resolved compress or fade (attention ↓).
- Animation is not decorative; it is the visual language of state transition (POSSIBLE -> OFFERED -> COMMITTED).

**6. Causal Conversation Runtime**
C-Link is an event-driven semantic runtime. `VOICE -> ASK_ACTOR` and `TOUCH -> ASK_ACTOR` map to the exact same canonical `SemanticAction`.
