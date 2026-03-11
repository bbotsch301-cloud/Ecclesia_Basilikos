ALTER TABLE users ADD COLUMN IF NOT EXISTS pma_agreement_accepted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS beneficial_unit_id VARCHAR;

-- Backfill existing users who accepted terms
UPDATE users SET pma_agreement_accepted_at = terms_accepted_at WHERE terms_accepted_at IS NOT NULL AND pma_agreement_accepted_at IS NULL;

-- Beneficial Units table
CREATE TABLE IF NOT EXISTS beneficial_units (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) UNIQUE,
  unit_number INTEGER NOT NULL UNIQUE,
  issued_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  withdrawn_at TIMESTAMP
);
