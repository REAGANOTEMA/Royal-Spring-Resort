-- Corrected RLS policies using proper JWT claim access
-- Run this in Supabase SQL Editor to fix the policies

-- First, drop existing policies that use incorrect current_setting
DROP POLICY IF EXISTS "Select staff for admin/hr" ON staff;
DROP POLICY IF EXISTS "Insert staff for admin/hr" ON staff;
DROP POLICY IF EXISTS "Update staff for admin/hr" ON staff;
DROP POLICY IF EXISTS "Delete staff for admin" ON staff;
DROP POLICY IF EXISTS "Select bookings" ON bookings;
DROP POLICY IF EXISTS "Insert bookings" ON bookings;
DROP POLICY IF EXISTS "Update bookings" ON bookings;
DROP POLICY IF EXISTS "Delete bookings" ON bookings;
DROP POLICY IF EXISTS "Select billing" ON billing;
DROP POLICY IF EXISTS "Insert billing" ON billing;
DROP POLICY IF EXISTS "Update billing" ON billing;
DROP POLICY IF EXISTS "Delete billing" ON billing;
DROP POLICY IF EXISTS "Select rooms" ON rooms;
DROP POLICY IF EXISTS "Insert rooms" ON rooms;
DROP POLICY IF EXISTS "Update rooms" ON rooms;
DROP POLICY IF EXISTS "Delete rooms" ON rooms;
DROP POLICY IF EXISTS "Select check_in_logs" ON check_in_logs;
DROP POLICY IF EXISTS "Insert check_in_logs" ON check_in_logs;
DROP POLICY IF EXISTS "Update check_in_logs" ON check_in_logs;
DROP POLICY IF EXISTS "Delete check_in_logs" ON check_in_logs;
DROP POLICY IF EXISTS "Select settings" ON settings;
DROP POLICY IF EXISTS "Update settings" ON settings;
DROP POLICY IF EXISTS "Delete settings" ON settings;

-- ==========================================
-- STAFF TABLE POLICIES (Corrected)
-- ==========================================

-- Allow authenticated users to insert their own staff record (for sign up)
CREATE POLICY "Users can insert their own staff record" ON staff
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own staff record
CREATE POLICY "Users can view their own staff record" ON staff
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own staff record
CREATE POLICY "Users can update their own staff record" ON staff
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow users to delete their own staff record
CREATE POLICY "Users can delete their own staff record" ON staff
FOR DELETE USING (auth.uid() = id);

-- Admin policies for managing all staff
CREATE POLICY "Admins can view all staff" ON staff
FOR SELECT USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'));

CREATE POLICY "Admins can insert staff" ON staff
FOR INSERT WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'));

CREATE POLICY "Admins can update staff" ON staff
FOR UPDATE USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'));

CREATE POLICY "Admins can delete staff" ON staff
FOR DELETE USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm'));

-- ==========================================
-- ROOMS TABLE POLICIES (Corrected)
-- ==========================================

CREATE POLICY "Anyone can view rooms" ON rooms FOR SELECT USING (true);

CREATE POLICY "Admins can manage rooms" ON rooms
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm'));

-- ==========================================
-- BOOKINGS TABLE POLICIES (Corrected)
-- ==========================================

CREATE POLICY "Staff can view bookings" ON bookings
FOR SELECT USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'staff'));

CREATE POLICY "Staff can manage bookings" ON bookings
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'staff'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'staff'));

-- ==========================================
-- BILLING TABLE POLICIES (Corrected)
-- ==========================================

CREATE POLICY "Finance staff can view billing" ON billing
FOR SELECT USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'accountant', 'staff'));

CREATE POLICY "Finance staff can manage billing" ON billing
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'accountant'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'accountant'));

-- ==========================================
-- CHECK_IN_LOGS TABLE POLICIES (Corrected)
-- ==========================================

CREATE POLICY "Users can view their own check-ins" ON check_in_logs
FOR SELECT USING (auth.uid()::text = staff_id::text OR auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'));

CREATE POLICY "Users can insert their own check-ins" ON check_in_logs
FOR INSERT WITH CHECK (auth.uid()::text = staff_id::text);

CREATE POLICY "Admins can manage check-ins" ON check_in_logs
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr'));

-- ==========================================
-- SETTINGS TABLE POLICIES (Corrected)
-- ==========================================

CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON settings
FOR UPDATE USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm'));

CREATE POLICY "Delete settings disabled" ON settings FOR DELETE USING (false);