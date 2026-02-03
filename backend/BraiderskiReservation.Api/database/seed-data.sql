CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    phone_number text NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    brand text NOT NULL,
    notes text NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    duration interval NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    start_at timestamptz NOT NULL,
    end_at timestamptz NOT NULL,
    notes text NOT NULL
);

CREATE TABLE IF NOT EXISTS used_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name text NOT NULL,
    notes text NOT NULL,
    used_at timestamptz NOT NULL
);

INSERT INTO clients (id, full_name, email, phone_number)
VALUES
    ('0df1f94b-7b3f-4f28-8bb3-89f7a5a7d1cc', 'Anna Kowalska', 'anna.kowalska@example.com', '+48 600 111 222'),
    ('8a22b9d5-b894-4f01-a566-8a0f8b7bde8a', 'Maja Nowak', 'maja.nowak@example.com', '+48 600 333 444')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, brand, notes)
VALUES
    ('c7f0bd3f-48ab-45c0-9a02-2c1d1d07d8c5', 'Szampon regenerujący', 'LumiCare', 'Do włosów suchych'),
    ('2b4b2d2f-1a42-4b84-9f20-2bb2b8e4e2c1', 'Olejek ochronny', 'GlowRoots', 'Nakładany przed stylizacją')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, duration)
VALUES
    ('06b6b1d1-9c30-4e49-9c1a-5e7f93d2bb09', 'Warkocze klasyczne', 'Zaplatanie klasycznych warkoczy z pielęgnacją.', interval '90 minutes'),
    ('f3d7e56f-0a7c-4580-9cd1-00d9f64d8b0b', 'Regeneracja skóry głowy', 'Oczyszczanie i masaż skóry głowy.', interval '60 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointments (id, client_id, service_id, start_at, end_at, notes)
VALUES
    ('9fa0f7d8-15e0-4ad7-8d1a-1c6e4c6118d3', '0df1f94b-7b3f-4f28-8bb3-89f7a5a7d1cc', '06b6b1d1-9c30-4e49-9c1a-5e7f93d2bb09', '2024-08-12 09:00:00+00', '2024-08-12 10:30:00+00', 'Pierwsza wizyta'),
    ('bf445d6e-b6d3-4b6a-9d0b-1f69b6f0c2dd', '8a22b9d5-b894-4f01-a566-8a0f8b7bde8a', 'f3d7e56f-0a7c-4580-9cd1-00d9f64d8b0b', '2024-08-13 12:00:00+00', '2024-08-13 13:00:00+00', 'Cykliczna pielęgnacja')
ON CONFLICT (id) DO NOTHING;

INSERT INTO used_products (id, client_id, name, notes, used_at)
VALUES
    ('e5b05665-9a22-4e6a-8d52-1bf0e381b541', '0df1f94b-7b3f-4f28-8bb3-89f7a5a7d1cc', 'Szampon regenerujący', 'Wersja testowa', '2024-08-12 10:20:00+00'),
    ('3e0af111-32ae-4d9c-96e7-7f0c83ee2044', '8a22b9d5-b894-4f01-a566-8a0f8b7bde8a', 'Olejek ochronny', 'Wygładzenie końcówek', '2024-08-13 12:50:00+00')
ON CONFLICT (id) DO NOTHING;
