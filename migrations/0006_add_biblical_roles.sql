-- Add biblical governance roles to trust_role enum
-- Elder/Deacon: 1 Timothy 3:1-13, Titus 1:5-9
-- Five-fold ministry: Ephesians 4:11 (apostle, prophet, evangelist, pastor, teacher)

ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'elder';
ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'deacon';
ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'apostle';
ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'prophet';
ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'evangelist';
ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'pastor';
ALTER TYPE trust_role ADD VALUE IF NOT EXISTS 'teacher';
