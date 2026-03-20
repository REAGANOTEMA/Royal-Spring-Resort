-- ==========================================
-- LOGIN PERMISSION FIX
-- Fixes the "Permission denied" error during login
-- ==========================================

-- This script fixes the issue where users can't log in because
-- they can't read their own staff records due to RLS policies

-- Step 1: Check current policies
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'staff' ORDER BY policyname;

-- Step 2: Drop all existing policies cleanly
DO $$
BEGIN
    -- Drop each policy if it exists
    DROP POLICY IF EXISTS "Allow user signup - insert own staff record" ON staff;
    DROP POLICY IF EXISTS "Users can view own staff record" ON staff;
    DROP POLICY IF EXISTS "Users can update own staff record" ON staff;
    DROP POLICY IF EXISTS "Users can delete own staff record" ON staff;
    DROP POLICY IF EXISTS "Admins can view all staff" ON staff;
    DROP POLICY IF EXISTS "Admins can insert staff records" ON staff;
    DROP POLICY IF EXISTS "Admins can update staff records" ON staff;
    DROP POLICY IF EXISTS "Directors can delete staff records" ON staff;
    
    -- Drop any old policies that might exist
    DROP POLICY IF EXISTS "Authenticated users can insert their own staff record" ON staff;
    DROP POLICY IF EXISTS "Admins can insert staff" ON staff;
    DROP POLICY IF EXISTS "Admins can update staff" ON staff;
    DROP POLICY IF EXISTS "Admins can delete staff" ON staff;
END $$;

-- Step 3: Create simple, effective policies for login

-- Policy 1: Allow users to view their own staff record (FIXES LOGIN)
CREATE POLICY "Users can view own staff record"
ON staff FOR SELECT
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 2: Allow users to insert their own staff record (for signup)
CREATE POLICY "Allow user signup - insert own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 3: Allow users to update their own staff record
CREATE POLICY "Users can update own staff record"
ON staff FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
)
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 4: Allow admins to view all staff
CREATE POLICY "Admins can view all staff"
ON staff FOR SELECT
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
);

-- Policy 5: Allow admins to manage staff records
CREATE POLICY "Admins can manage staff records"
ON staff FOR ALL
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
)
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
);

-- Step 4: Verify the policies were created
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || substring(qual::text, 1, 80) || '...'
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || substring(with_check::text, 1, 80) || '...'
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'staff'
ORDER BY policyname;

-- Step 5: Test the policy (optional - you can run this to test)
-- This query should work for authenticated users to see their own records
-- SELECT * FROM staff WHERE auth.email() = email OR auth.email() = auth_email;

-- ==========================================
-- WHAT THIS FIXES:
-- 1. Users can now log in without "Permission denied" errors
-- 2. Users can view their own staff records during login
-- 3. Users can still signup and create their staff records
-- 4. Admins retain full access to manage all staff records
-- ==========================================
