-- Trust Hierarchy Restructuring: NCLT as Gateway, EB as Body of Christ
-- Renames layers to reflect biblical ecclesiology rather than corporate hierarchy

-- 1. Create new enum type with restructured layers
CREATE TYPE trust_entity_layer_new AS ENUM (
  'covenant',     -- Individual gateway — personal covenant with God through Christ (was: charter)
  'body',         -- Body of Christ — the collective you enter (was: trust)
  'stewardship',  -- Organs of the Body — asset stewardship (was: operational + platform)
  'assembly',     -- The gathered ecclesia — people governance (was: pma)
  'region',       -- City-churches / regional assemblies (was: chapter)
  'household',    -- House-churches / oikos groups (was: commune)
  'craft',        -- Skilled workers / Bezalel pattern (was: guild)
  'ministry',     -- Service initiatives / diakonia (was: project)
  'member'        -- Joint heirs — members of the Body (was: beneficiary)
);

-- 2. Migrate existing data
ALTER TABLE trust_entities
  ALTER COLUMN layer TYPE trust_entity_layer_new
  USING (
    CASE layer::text
      WHEN 'charter'     THEN 'covenant'::trust_entity_layer_new
      WHEN 'trust'       THEN 'body'::trust_entity_layer_new
      WHEN 'operational'  THEN 'stewardship'::trust_entity_layer_new
      WHEN 'pma'         THEN 'assembly'::trust_entity_layer_new
      WHEN 'platform'    THEN 'stewardship'::trust_entity_layer_new
      WHEN 'chapter'     THEN 'region'::trust_entity_layer_new
      WHEN 'commune'     THEN 'household'::trust_entity_layer_new
      WHEN 'guild'       THEN 'craft'::trust_entity_layer_new
      WHEN 'project'     THEN 'ministry'::trust_entity_layer_new
      WHEN 'beneficiary' THEN 'member'::trust_entity_layer_new
    END
  );

-- 3. Drop old enum, rename new
DROP TYPE trust_entity_layer;
ALTER TYPE trust_entity_layer_new RENAME TO trust_entity_layer;

-- 4. Add 'enters' to trust_relationship_type enum
ALTER TYPE trust_relationship_type ADD VALUE IF NOT EXISTS 'enters';

-- 5. Migrate layer references in trust_document_templates (layers column is text[])
UPDATE trust_document_templates SET applicable_layers = (
  SELECT array_agg(
    CASE elem
      WHEN 'charter'     THEN 'covenant'
      WHEN 'trust'       THEN 'body'
      WHEN 'operational' THEN 'stewardship'
      WHEN 'pma'         THEN 'assembly'
      WHEN 'platform'    THEN 'stewardship'
      WHEN 'chapter'     THEN 'region'
      WHEN 'commune'     THEN 'household'
      WHEN 'guild'       THEN 'craft'
      WHEN 'project'     THEN 'ministry'
      WHEN 'beneficiary' THEN 'member'
      ELSE elem
    END
  )
  FROM unnest(applicable_layers) AS elem
)
WHERE applicable_layers IS NOT NULL;
