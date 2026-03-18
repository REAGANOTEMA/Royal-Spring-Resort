-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STAFF TABLE (Comprehensive)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    role TEXT NOT NULL, -- director, gm, hr, accountant, chef, staff
    status TEXT DEFAULT 'Active',
    joined_at DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT,
    bio TEXT,
    salary DECIMAL(12,2) DEFAULT 0,
    advance DECIMAL(12,2) DEFAULT 0,
    deduction DECIMAL(12,2) DEFAULT 0,
    net DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS check_in_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    staff_name TEXT,
    check_in TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    check_out TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(5,2),
    status TEXT DEFAULT 'Active'
);

-- SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'hotel_config',
    hotel_name TEXT DEFAULT 'Royal Spring Hotel',
    contact_email TEXT DEFAULT 'info@royalsprings.com',
    contact_phone TEXT DEFAULT '+256 772 514 889',
    address TEXT DEFAULT 'Kampala, Uganda',
    currency TEXT DEFAULT 'UGX',
    tax_rate DECIMAL(5,2) DEFAULT 18,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- SEED DATA: 14 EXECUTIVE WORKERS
INSERT INTO staff (name, email, role, salary, joined_at) VALUES
('Arthur Royal', 'arthur@royalsprings.com', 'director', 5000000, '2023-01-01'),
('Brenda Nabirye', 'brenda@royalsprings.com', 'gm', 3500000, '2023-02-15'),
('Charles Okello', 'charles@royalsprings.com', 'hr', 2500000, '2023-03-10'),
('Diana Mutesi', 'diana@royalsprings.com', 'accountant', 2800000, '2023-04-05'),
('Edward Kato', 'edward@royalsprings.com', 'chef', 2200000, '2023-05-20'),
('Fiona Namono', 'fiona@royalsprings.com', 'staff', 1200000, '2023-06-12'),
('George Musoke', 'george@royalsprings.com', 'staff', 1200000, '2023-07-01'),
('Harriet Zansanze', 'harriet@royalsprings.com', 'staff', 1200000, '2023-07-15'),
('Isaac Lule', 'isaac@royalsprings.com', 'staff', 1200000, '2023-08-01'),
('Jane Nakafeero', 'jane@royalsprings.com', 'staff', 1200000, '2023-08-20'),
('Kevin Ssebaana', 'kevin@royalsprings.com', 'staff', 1200000, '2023-09-05'),
('Lydia Atim', 'lydia@royalsprings.com', 'staff', 1200000, '2023-09-25'),
('Moses Baluku', 'moses@royalsprings.com', 'staff', 1200000, '2023-10-10'),
('Nina Kyolaba', 'nina@royalsprings.com', 'staff', 1200000, '2023-11-01')
ON CONFLICT (email) DO NOTHING;

INSERT INTO settings (id) VALUES ('hotel_config') ON CONFLICT (id) DO NOTHING;