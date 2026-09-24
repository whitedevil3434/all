-- C-Link Database Schema for Supabase (PostgreSQL)

-- ============================================================================
-- 1. Custom Types (Enums)
-- Enforcing C-Link's specific epistemic states and causal topology types
-- ============================================================================

CREATE TYPE object_kind AS ENUM (
    'WANT', 
    'ACTOR', 
    'GAP', 
    'CAPABILITY', 
    'COMMITMENT', 
    'EXECUTION', 
    'PROOF', 
    'OUTCOME'
);

CREATE TYPE epistemic_state AS ENUM (
    'UNKNOWN', 
    'POSSIBLE', 
    'OFFERED', 
    'COMMITTED', 
    'DOING', 
    'PROVEN', 
    'DONE', 
    'ASKING'
);

CREATE TYPE provenance_source AS ENUM (
    'user', 
    'ai_inference', 
    'actor_statement', 
    'verified_evidence'
);

CREATE TYPE relation_kind AS ENUM (
    'requires', 
    'covers', 
    'depends_on', 
    'candidate', 
    'part_of'
);

CREATE TYPE relation_visibility AS ENUM (
    'visible', 
    'hidden', 
    'dimmed'
);

-- ============================================================================
-- 2. Tables
-- ============================================================================

-- Reality Contexts: Groups objects and relations into a single graph/workspace
CREATE TABLE reality_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reality Objects: The nodes in the C-Link surface
CREATE TABLE reality_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID NOT NULL REFERENCES reality_contexts(id) ON DELETE CASCADE,
    
    kind object_kind NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    
    state epistemic_state NOT NULL DEFAULT 'UNKNOWN',
    provenance provenance_source NOT NULL DEFAULT 'ai_inference',
    
    actor_id TEXT, -- Can be linked to a separate users/actors table if needed
    quantity NUMERIC,
    unit TEXT,
    
    attention BOOLEAN NOT NULL DEFAULT false,
    ai_transient_message TEXT,
    available_actions TEXT[], -- Array of strings e.g., '{"Ask", "Compare"}'
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Causal Relations: The edges mapping semantic consequence
CREATE TABLE causal_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID NOT NULL REFERENCES reality_contexts(id) ON DELETE CASCADE,
    
    from_id UUID NOT NULL REFERENCES reality_objects(id) ON DELETE CASCADE,
    to_id UUID NOT NULL REFERENCES reality_objects(id) ON DELETE CASCADE,
    
    kind relation_kind NOT NULL,
    visibility relation_visibility NOT NULL DEFAULT 'visible',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent duplicate identical relations between the exact same nodes
    UNIQUE(from_id, to_id, kind)
);

-- ============================================================================
-- 3. Triggers for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reality_contexts_modtime
    BEFORE UPDATE ON reality_contexts
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_reality_objects_modtime
    BEFORE UPDATE ON reality_objects
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 4. Row Level Security (RLS)
-- ============================================================================

ALTER TABLE reality_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE causal_relations ENABLE ROW LEVEL SECURITY;

-- Note: For prototyping, we allow anonymous access. 
-- In production, replace `true` with `auth.uid() = user_id` checks.
CREATE POLICY "Allow public read/write for contexts" ON reality_contexts FOR ALL USING (true);
CREATE POLICY "Allow public read/write for objects" ON reality_objects FOR ALL USING (true);
CREATE POLICY "Allow public read/write for relations" ON causal_relations FOR ALL USING (true);
