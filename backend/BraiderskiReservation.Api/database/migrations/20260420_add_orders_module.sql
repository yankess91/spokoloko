ALTER TABLE services DROP COLUMN IF EXISTS type;
ALTER TABLE services DROP COLUMN IF EXISTS completion_deadline_date;
ALTER TABLE services DROP COLUMN IF EXISTS order_position;

CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY,
    number text NOT NULL UNIQUE,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    status integer NOT NULL,
    delivery_method integer NOT NULL,
    due_date date NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    total_amount numeric NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS ix_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS ix_orders_delivery_method ON orders(delivery_method);
CREATE INDEX IF NOT EXISTS ix_orders_due_date ON orders(due_date);
CREATE INDEX IF NOT EXISTS ix_orders_created_at ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY,
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    name text NOT NULL,
    notes text NOT NULL,
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    line_total numeric NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_order_items_order_id ON order_items(order_id);
