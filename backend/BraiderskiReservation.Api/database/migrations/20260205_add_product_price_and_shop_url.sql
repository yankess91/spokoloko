-- Adds new product fields introduced by API changes.
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS price numeric(10,2) NOT NULL DEFAULT 0;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS shop_url text NOT NULL DEFAULT '';
