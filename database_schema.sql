-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT DEFAULT 'Available',
    floor TEXT,
    image TEXT
);

-- 2. Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    salary TEXT,
    advance TEXT DEFAULT '0',
    deduction TEXT DEFAULT '0',
    net TEXT DEFAULT '0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Attendance Logs
CREATE TABLE IF NOT EXISTS check_in_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    staff_name TEXT,
    check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out TIMESTAMP WITH TIME ZONE,
    total_hours NUMERIC DEFAULT 0
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guest TEXT NOT NULL,
    room TEXT,
    status TEXT DEFAULT 'Confirmed',
    amount TEXT,
    check_in DATE,
    check_out DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Billing & Invoices
CREATE TABLE IF NOT EXISTS billing (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guest TEXT,
    room TEXT,
    amount TEXT,
    status TEXT DEFAULT 'Pending',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT,
    description TEXT,
    priority TEXT,
    status TEXT DEFAULT 'Open',
    reported_by TEXT,
    date DATE DEFAULT CURRENT_DATE
);

-- 8. Guest Messages (AI & Staff Chat)
CREATE TABLE IF NOT EXISTS guest_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guest_name TEXT,
    last_message TEXT,
    time TEXT,
    status TEXT DEFAULT 'Unread',
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Job Postings
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    department TEXT,
    type TEXT,
    status TEXT DEFAULT 'Draft',
    applicants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Media Library
CREATE TABLE IF NOT EXISTS media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    type TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_name TEXT,
    action TEXT,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Initial Luxury Rooms
INSERT INTO rooms (id, type, price, status, floor, image) VALUES
('101', 'Suite', 450000, 'Available', '1st Floor', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
('102', 'Deluxe', 250000, 'Available', '1st Floor', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
('201', 'Suite', 450000, 'Available', '2nd Floor', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800'),
('202', 'Standard', 150000, 'Available', '2nd Floor', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;