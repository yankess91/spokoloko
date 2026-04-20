ALTER TABLE services
    ADD COLUMN IF NOT EXISTS max_completion_time_days integer;

ALTER TABLE services
    ADD COLUMN IF NOT EXISTS order_position integer;

UPDATE services
SET order_position = ranked.rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
    FROM services
) AS ranked
WHERE services.id = ranked.id
  AND (services.order_position IS NULL OR services.order_position = 0);

ALTER TABLE services
    ALTER COLUMN order_position SET NOT NULL;

ALTER TABLE services
    ALTER COLUMN order_position SET DEFAULT 0;
