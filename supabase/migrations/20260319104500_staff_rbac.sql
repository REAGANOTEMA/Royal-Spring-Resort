-- ROYAL SPRING HOTEL - STAFF RBAC & ENHANCED STAFF FIELDS
-- This migration adds comprehensive role-based access control and staff management features

-- ==========================================
-- 1. ALTER STAFF TABLE - ADD MISSING FIELDS
-- ==========================================

ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'General',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS auth_email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS staff_level TEXT DEFAULT 'staff', -- director, manager, supervisor, staff
ADD COLUMN IF NOT EXISTS can_manage_staff BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- ==========================================
-- 2. CREATE DEPARTMENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    head_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO departments (name, description) VALUES
    ('Rooms Division', 'Front Desk, Housekeeping, Guest Services'),
    ('Food & Beverage', 'Kitchen, Restaurant, Bar Services'),
    ('Finance', 'Accounting, Billing, Payroll'),
    ('Human Resources', 'HR, Recruitment, Staff Development'),
    ('Engineering', 'Maintenance, Facilities, Technical Support'),
    ('Security', 'Security Personnel, Safety'),
    ('Housekeeping', 'Cleaning, Laundry, Room Services'),
    ('Information Technology', 'IT Systems, Network, Support'),
    ('Sales & Marketing', 'Marketing, Reservations, Sales'),
    ('Procurement', 'Inventory, Purchasing, Supplies'),
    ('Executive Board', 'Director, Management')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 3. STAFF HIERARCHY LEVELS REFERENCE
-- ==========================================

CREATE TABLE IF NOT EXISTS staff_levels (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    hierarchy_order INT,
    can_view_all BOOLEAN DEFAULT FALSE,
    can_manage_own_dept BOOLEAN DEFAULT FALSE,
    can_manage_staff_in_dept BOOLEAN DEFAULT FALSE,
    can_access_financial BOOLEAN DEFAULT FALSE,
    can_access_payroll BOOLEAN DEFAULT FALSE
);

INSERT INTO staff_levels (id, name, hierarchy_order, can_view_all, can_manage_own_dept, can_manage_staff_in_dept, can_access_financial, can_access_payroll) VALUES
    ('director', 'Director', 1, TRUE, TRUE, TRUE, TRUE, TRUE),
    ('manager', 'Manager', 2, FALSE, TRUE, TRUE, TRUE, TRUE),
    ('supervisor', 'Supervisor', 3, FALSE, TRUE, FALSE, FALSE, FALSE),
    ('staff', 'Staff', 4, FALSE, FALSE, FALSE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. ENABLE RLS ON STAFF TABLE
-- ==========================================

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Director can view all staff
CREATE POLICY "director_can_view_all_staff"
ON staff FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director'
);

-- Managers can view their own department
CREATE POLICY "manager_can_view_own_department"
ON staff FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' IN ('manager', 'supervisor') AND
    department = auth.jwt() ->> 'department'
);

-- Staff can view their own record
CREATE POLICY "staff_can_view_own_record"
ON staff FOR SELECT
TO authenticated
USING (
    id = auth.uid()
);

-- Director can insert staff
CREATE POLICY "director_can_insert_staff"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'staff_level' = 'director'
);

-- Directors and Managers can update staff in their department
CREATE POLICY "manager_can_update_own_dept_staff"
ON staff FOR UPDATE
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    (auth.jwt() ->> 'staff_level' IN ('manager', 'supervisor') AND 
     department = auth.jwt() ->> 'department')
);

-- Staff can update their own profile
CREATE POLICY "staff_can_update_own_profile"
ON staff FOR UPDATE
TO authenticated
USING (
    id = auth.uid()
);

-- ==========================================
-- 5. ENABLE RLS ON OTHER CRITICAL TABLES
-- ==========================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Director and Rooms Division can view all bookings
CREATE POLICY "bookings_view_director_rooms"
ON bookings FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' IN ('Rooms Division', 'Finance')
);

-- Allow insert for authorized persons
CREATE POLICY "bookings_insert_authorized"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'staff_level' IN ('director', 'manager', 'supervisor') OR
    auth.jwt() ->> 'department' IN ('Rooms Division', 'Finance')
);

-- ==========================================
-- 6. BILLING & FINANCIAL RLS
-- ==========================================

ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- Only Finance and Directors can view billing
CREATE POLICY "billing_view_finance"
ON billing FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Finance'
);

-- ==========================================
-- 7. PAYROLL & SALARY RLS
-- ==========================================

CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    salary DECIMAL(12, 2),
    advance DECIMAL(12, 2) DEFAULT 0,
    deduction DECIMAL(12, 2) DEFAULT 0,
    net DECIMAL(12, 2),
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- Only Finance, HR, and Directors can view payroll
CREATE POLICY "payroll_view_authorized"
ON payroll FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' IN ('Finance', 'Human Resources')
);

-- Staff can view their own payroll
CREATE POLICY "payroll_view_own"
ON payroll FOR SELECT
TO authenticated
USING (
    staff_id = auth.uid()
);

-- ==========================================
-- 8. CREATE ACTIVITY LOG
-- ==========================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 9. SETTINGS TABLE UPDATES
-- ==========================================

ALTER TABLE IF EXISTS settings 
ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '+256772572645',
ADD COLUMN IF NOT EXISTS developer_name TEXT DEFAULT 'Development Team',
ADD COLUMN IF NOT EXISTS developer_phone TEXT DEFAULT '+256772572645';

-- ==========================================
-- 10. INDEX CREATION FOR PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_level ON staff(staff_level);
CREATE INDEX IF NOT EXISTS idx_staff_is_active ON staff(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_billing_status ON billing(status);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON payroll(month);
