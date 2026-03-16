-- Royal Springs ERP Database Schema

-- 1. Staff Table
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- director, gm, hr, staff
  department TEXT,
  salary DECIMAL(12,2),
  advance_balance DECIMAL(12,2) DEFAULT 0,
  leave_balance INTEGER DEFAULT 21,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inventory Table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock_level INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  unit TEXT DEFAULT 'pcs',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rooms Table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY, -- Room Number
  type TEXT NOT NULL, -- Standard, Deluxe, Suite
  price DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'Available', -- Available, Occupied, Cleaning, Maintenance
  floor TEXT,
  image_url TEXT
);

-- 4. Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  room_id TEXT REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT DEFAULT 'Confirmed',
  total_amount DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT,
  action TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);