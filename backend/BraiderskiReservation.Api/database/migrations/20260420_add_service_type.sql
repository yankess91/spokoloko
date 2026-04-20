ALTER TABLE services
    ADD COLUMN IF NOT EXISTS type integer;

UPDATE services
SET type = 0
WHERE type IS NULL;

ALTER TABLE services
    ALTER COLUMN type SET NOT NULL;

ALTER TABLE services
    ALTER COLUMN type SET DEFAULT 0;
