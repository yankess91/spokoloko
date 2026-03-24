ALTER TABLE services
    ADD COLUMN IF NOT EXISTS duration_from interval,
    ADD COLUMN IF NOT EXISTS duration_to interval,
    ADD COLUMN IF NOT EXISTS price_from numeric(10,2),
    ADD COLUMN IF NOT EXISTS price_to numeric(10,2);

UPDATE services
SET duration_from = COALESCE(duration_from, duration),
    duration_to = COALESCE(duration_to, duration),
    price_from = COALESCE(price_from, price),
    price_to = COALESCE(price_to, price);

ALTER TABLE services
    ALTER COLUMN duration_from SET NOT NULL,
    ALTER COLUMN duration_to SET NOT NULL,
    ALTER COLUMN price_from SET NOT NULL,
    ALTER COLUMN price_to SET NOT NULL;

ALTER TABLE services
    ALTER COLUMN price_from SET DEFAULT 0,
    ALTER COLUMN price_to SET DEFAULT 0;

ALTER TABLE services
    DROP COLUMN IF EXISTS duration,
    DROP COLUMN IF EXISTS price;
