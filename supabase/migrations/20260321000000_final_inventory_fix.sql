-- ==========================================
-- ROYAL SPRING HOTEL - FINAL INVENTORY FIX
-- Standardizes all inventory tables to use 'quantity'
-- ==========================================

-- 1. ROOMS DIVISION INVENTORY
CREATE TABLE IF NOT EXISTS rooms_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    department TEXT DEFAULT 'Rooms Division',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. KITCHEN INVENTORY
CREATE TABLE IF NOT EXISTS kitchen_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    department TEXT DEFAULT 'Food & Beverage',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe rename for kitchen_inventory
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kitchen_inventory' AND column_name='stock_quantity') THEN
        ALTER TABLE kitchen_inventory RENAME COLUMN stock_quantity TO quantity;
    END IF;
END $$;

-- 3. ENGINEERING INVENTORY
CREATE TABLE IF NOT EXISTS engineering_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    department TEXT DEFAULT 'Engineering',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe rename for engineering_inventory
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='engineering_inventory' AND column_name='stock_quantity') THEN
        ALTER TABLE engineering_inventory RENAME COLUMN stock_quantity TO quantity;
    END IF;
END $$;

-- 4. HOUSEKEEPING SUPPLIES
CREATE TABLE IF NOT EXISTS housekeeping_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    department TEXT DEFAULT 'Housekeeping',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SECURITY SUPPLIES
CREATE TABLE IF NOT EXISTS security_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    equipment_type TEXT,
    department TEXT DEFAULT 'Security',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IT SUPPLIES
CREATE TABLE IF NOT EXISTS it_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    equipment_type TEXT,
    department TEXT DEFAULT 'Information Technology',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS department_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    inventory_item_id UUID,
    inventory_type TEXT,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EMPLOYEE RECOGNITION
CREATE TABLE IF NOT EXISTS employee_recognition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    recognition_type TEXT NOT NULL,
    title TEXT NOT NULL,
    notes TEXT,
    awarded_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RLS POLICIES
ALTER TABLE rooms_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineering_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_recognition ENABLE ROW LEVEL SECURITY;

-- Generic View Policy for all inventory
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%inventory%' OR table_name LIKE '%supplies%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "view_policy" ON %I', t);
        EXECUTE format('CREATE POLICY "view_policy" ON %I FOR SELECT TO authenticated USING (true)', t);
        
        EXECUTE format('DROP POLICY IF EXISTS "manage_policy" ON %I', t);
        EXECUTE format('CREATE POLICY "manage_policy" ON %I FOR ALL TO authenticated USING (auth.jwt() ->> ''staff_level'' IN (''director'', ''manager''))', t);
    END LOOP;
END $$;