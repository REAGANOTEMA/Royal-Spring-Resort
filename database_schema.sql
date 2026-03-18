-- ROYAL SPRING HOTEL ERP - MASTER DATABASE SCHEMA & SEED DATA
-- Run this in your SQL editor to initialize the entire system.

-- 1. Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'Available',
    floor TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO rooms (id, type, price, status, floor, image) VALUES
('101', 'Standard', 150000, 'Available', '1st Floor', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
('102', 'Standard', 150000, 'Occupied', '1st Floor', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
('201', 'Deluxe', 250000, 'Available', '2nd Floor', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'),
('301', 'Suite', 450000, 'Cleaning', '3rd Floor', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- 2. Staff
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    salary TEXT DEFAULT '0',
    advance TEXT DEFAULT '0',
    deduction TEXT DEFAULT '0',
    net TEXT DEFAULT '0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO staff (name, role, salary, net) VALUES
('John Doe', 'gm', '2500000', '2500000'),
('Sarah Smith', 'hr', '1800000', '1800000'),
('Chef Musa', 'chef', '2000000', '2000000'),
('Jane Accountant', 'accountant', '1800000', '1800000')
ON CONFLICT DO NOTHING;

-- 3. Kitchen Inventory
CREATE TABLE IF NOT EXISTS kitchen_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    category TEXT,
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    unit TEXT DEFAULT 'kg',
    min_stock_level DECIMAL(10, 2) DEFAULT 5,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO kitchen_inventory (item_name, category, stock_quantity, unit, min_stock_level) VALUES
('Fresh Tomatoes', 'Vegetables', 25.5, 'kg', 5.0),
('Beef Fillet', 'Meat & Poultry', 15.0, 'kg', 3.0),
('Basmati Rice', 'Dry Goods', 50.0, 'kg', 10.0),
('Cooking Oil', 'Dry Goods', 20.0, 'ltr', 5.0)
ON CONFLICT DO NOTHING;

-- 4. Kitchen Logs
CREATE TABLE IF NOT EXISTS kitchen_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES kitchen_inventory(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    logged_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Billing & Invoices
CREATE TABLE IF NOT EXISTS billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest TEXT NOT NULL,
    room TEXT,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Housekeeping
CREATE TABLE IF NOT EXISTS housekeeping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    staff_name TEXT,
    status TEXT DEFAULT 'Pending',
    notes TEXT,
    last_cleaned TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Maintenance
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Other Tables (Attendance, Incidents, Media, Docs, Messages, Jobs, Audit)
CREATE TABLE IF NOT EXISTS check_in_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), staff_id UUID REFERENCES staff(id), staff_name TEXT, check_in TIMESTAMPTZ DEFAULT NOW(), check_out TIMESTAMPTZ, total_hours DECIMAL(5, 2), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS incidents (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), type TEXT NOT NULL, description TEXT, priority TEXT DEFAULT 'Medium', status TEXT DEFAULT 'Open', reported_by TEXT, date DATE DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS media (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, type TEXT DEFAULT 'Image', url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS documents (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, category TEXT, uploaded_by TEXT, status TEXT DEFAULT 'Pending', date DATE DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS guest_messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), guest_name TEXT, last_message TEXT, time TEXT, status TEXT DEFAULT 'Unread', history JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS jobs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, department TEXT, type TEXT, status TEXT DEFAULT 'Draft', applicants INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS audit_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_name TEXT, action TEXT NOT NULL, ip TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS inventory (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, category TEXT, stock INTEGER DEFAULT 0, unit TEXT DEFAULT 'pcs', created_at TIMESTAMPTZ DEFAULT NOW());