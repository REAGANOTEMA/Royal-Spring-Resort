-- ROYAL SPRING HOTEL ERP - MASTER DATABASE SCHEMA
-- Run this script in your SQL editor to initialize all tables.

-- 1. Rooms & Accommodations
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'Available', -- Available, Occupied, Cleaning, Maintenance
    floor TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Staff & Human Resources
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- director, gm, hr, accountant, chef, staff
    status TEXT DEFAULT 'Active',
    salary TEXT DEFAULT '0',
    advance TEXT DEFAULT '0',
    deduction TEXT DEFAULT '0',
    net TEXT DEFAULT '0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Attendance & Clocking
CREATE TABLE IF NOT EXISTS check_in_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    staff_name TEXT,
    check_in TIMESTAMPTZ DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    total_hours DECIMAL(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reservations & Front Desk
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest TEXT NOT NULL,
    room TEXT REFERENCES rooms(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Confirmed', -- Confirmed, Checked In, Checked Out, Cancelled
    amount TEXT,
    check_in DATE,
    check_out DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Financial Ledger & Invoicing
CREATE TABLE IF NOT EXISTS billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest TEXT NOT NULL,
    room TEXT,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- Paid, Pending, Expense
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Kitchen Inventory (Executive Chef)
CREATE TABLE IF NOT EXISTS kitchen_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    category TEXT, -- Vegetables, Meat, Spices, Dry Goods, Dairy
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    unit TEXT DEFAULT 'kg',
    min_stock_level DECIMAL(10, 2) DEFAULT 5,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Kitchen Usage Logs
CREATE TABLE IF NOT EXISTS kitchen_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES kitchen_inventory(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- Used, Damaged, Restocked
    quantity DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    logged_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. General Resort Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'pcs',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Housekeeping Management
CREATE TABLE IF NOT EXISTS housekeeping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    staff_name TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, In Progress, Completed, Inspected
    notes TEXT,
    last_cleaned TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Maintenance & Repairs
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT, -- Room number or Area
    priority TEXT DEFAULT 'Medium', -- Low, Medium, High, Critical
    status TEXT DEFAULT 'Open', -- Open, In Progress, Resolved
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Incident Reports
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    reported_by TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Media Library
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Image',
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Document Repository
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    uploaded_by TEXT,
    status TEXT DEFAULT 'Pending',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Guest Messages (AI Concierge)
CREATE TABLE IF NOT EXISTS guest_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT,
    last_message TEXT,
    time TEXT,
    status TEXT DEFAULT 'Unread',
    history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Recruitment & Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT,
    type TEXT,
    status TEXT DEFAULT 'Draft',
    applicants INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT,
    action TEXT NOT NULL,
    ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);