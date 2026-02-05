-- Adds product availability fields.
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS is_available boolean NOT NULL DEFAULT false;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS availability_checked_at timestamptz NULL;
