-- Add biblical relationship types to trust_relationship_type enum
-- shepherds: 1 Peter 5:2 (elder/pastor care of flock)
-- teaches: Matthew 28:20 (discipleship chain)
-- serves: Mark 10:45 (diaconal service)
-- tithes: Malachi 3:10 (storehouse giving)

ALTER TYPE trust_relationship_type ADD VALUE IF NOT EXISTS 'shepherds';
ALTER TYPE trust_relationship_type ADD VALUE IF NOT EXISTS 'teaches';
ALTER TYPE trust_relationship_type ADD VALUE IF NOT EXISTS 'serves';
ALTER TYPE trust_relationship_type ADD VALUE IF NOT EXISTS 'tithes';
