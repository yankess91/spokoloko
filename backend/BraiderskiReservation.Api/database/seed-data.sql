-- Seed data only. Schema must be managed by EF Core migrations.

INSERT INTO clients (id, full_name, email, phone_number, notes, is_active)
VALUES
    ('0df1f94b-7b3f-4f28-8bb3-89f7a5a7d1cc', 'Anna Kowalska', 'anna.kowalska@example.com', '+48 600 111 222', 'Lubi delikatną pielęgnację i przypomnienia SMS.', true),
    ('8a22b9d5-b894-4f01-a566-8a0f8b7bde8a', 'Maja Nowak', 'maja.nowak@example.com', '+48 600 333 444', 'Preferuje terminy okołopołudniowe.', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, brand, notes, image_url, price, shop_url, is_available, availability_checked_at)
VALUES
    ('c7f0bd3f-48ab-45c0-9a02-2c1d1d07d8c5', 'Szampon regenerujący', 'LumiCare', 'Do włosów suchych', 'https://images.example.com/products/szampon-regenerujacy.jpg', 39.99, 'https://sklep.przyklad.pl/szampon-regenerujacy', true, NOW()),
    ('2b4b2d2f-1a42-4b84-9f20-2bb2b8e4e2c1', 'Olejek ochronny', 'GlowRoots', 'Nakładany przed stylizacją', 'https://images.example.com/products/olejek-ochronny.jpg', 54.50, 'https://sklep.przyklad.pl/olejek-ochronny', true, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, duration_from, duration_to, price_from, price_to, type)
VALUES
    ('06b6b1d1-9c30-4e49-9c1a-5e7f93d2bb09', 'Warkocze klasyczne', 'Zaplatanie klasycznych warkoczy z pielęgnacją.', interval '90 minutes', interval '90 minutes', 220.00, 220.00, 0),
    ('f3d7e56f-0a7c-4580-9cd1-00d9f64d8b0b', 'Regeneracja skóry głowy', 'Oczyszczanie i masaż skóry głowy.', interval '60 minutes', interval '60 minutes', 160.00, 160.00, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, full_name, email, password_hash, created_at)
VALUES
    ('1d44fd8a-c8a0-4d44-b721-8ee562bf5f27', 'Demo Owner', 'owner@example.com', '$2a$11$N9qo8uLOickgx2ZMRZo5i.ejQfA4J8C5M7u1zHkGumZ5qX6Ch12eK', NOW())
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

INSERT INTO service_products (id, service_id, product_id)
VALUES
    ('d4c0c6c4-f5cf-4f1e-af7b-66f4ad3f4a20', '06b6b1d1-9c30-4e49-9c1a-5e7f93d2bb09', 'c7f0bd3f-48ab-45c0-9a02-2c1d1d07d8c5'),
    ('e3149f7d-a5a2-4fd2-a49e-ded054f0e8d6', 'f3d7e56f-0a7c-4580-9cd1-00d9f64d8b0b', '2b4b2d2f-1a42-4b84-9f20-2bb2b8e4e2c1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointment_products (id, appointment_id, product_id)
VALUES
    ('92bd7d90-45cc-4d57-882f-bc984499efd5', '9fa0f7d8-15e0-4ad7-8d1a-1c6e4c6118d3', 'c7f0bd3f-48ab-45c0-9a02-2c1d1d07d8c5'),
    ('4f4f5091-d4c3-4b9b-b465-840d5f9ddb71', 'bf445d6e-b6d3-4b6a-9d0b-1f69b6f0c2dd', '2b4b2d2f-1a42-4b84-9f20-2bb2b8e4e2c1')
ON CONFLICT (id) DO NOTHING;
