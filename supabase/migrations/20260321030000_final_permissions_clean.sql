-- ==========================================
-- FINAL PERMISSIONS FIX - ROYAL SPRINGS (CLEAN VERSION)
-- Handles existing policies gracefully
-- ==========================================

-- Step 1: Clean up all existing policies safely
DO $$
BEGIN
    -- Drop each policy individually with proper checking
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Allow user signup - insert own staff record') THEN
        EXECUTE 'DROP POLICY "Allow user signup - insert own staff record" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Users can view own staff record') THEN
        EXECUTE 'DROP POLICY "Users can view own staff record" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Users can update own staff record') THEN
        EXECUTE 'DROP POLICY "Users can update own staff record" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Users can delete own staff record') THEN
        EXECUTE 'DROP POLICY "Users can delete own staff record" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can view all staff') THEN
        EXECUTE 'DROP POLICY "Admins can view all staff" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can manage staff records') THEN
        EXECUTE 'DROP POLICY "Admins can manage staff records" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Directors can delete staff records') THEN
        EXECUTE 'DROP POLICY "Directors can delete staff records" ON staff';
    END IF;
    
    -- Drop any old policies that might exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Authenticated users can insert their own staff record') THEN
        EXECUTE 'DROP POLICY "Authenticated users can insert their own staff record" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can insert staff') THEN
        EXECUTE 'DROP POLICY "Admins can insert staff" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can update staff') THEN
        EXECUTE 'DROP POLICY "Admins can update staff" ON staff';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can delete staff') THEN
        EXECUTE 'DROP POLICY "Admins can delete staff" ON staff';
    END IF;
END $$;

-- Step 2: Create clean, effective policies

-- Policy 1: Allow users to insert their own staff record (SIGNUP)
CREATE POLICY "Allow user signup - insert own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 2: Allow users to view their own staff record (LOGIN)
CREATE POLICY "Users can view own staff record"
ON staff FOR SELECT
TO authenticated
USING (
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

-- Policy 4: Allow users to delete their own staff record
CREATE POLICY "Users can delete own staff record"
ON staff FOR DELETE
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 5: Allow admins to view all staff
CREATE POLICY "Admins can view all staff"
ON staff FOR SELECT
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
);

-- Policy 6: Allow admins to manage all staff records
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

-- Step 3: Verify policies were created successfully
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || substring(qual::text, 1, 80) || '...'
    ELSE 'No USING clause'
  END as using_clause
FROM pg_policies 
WHERE tablename = 'staff'
ORDER BY policyname;

-- Step 4: Test user access (optional - uncomment to test)
-- This should work for authenticated users
-- SELECT COUNT(*) FROM staff WHERE auth.email() = email OR auth.email() = auth_email;

-- ==========================================
-- WHAT THIS FIXES:
-- 1. Users can SIGN UP without "Permission denied" errors
-- 2. Users can LOG IN without permission errors  
-- 3. Users can view their own staff records
-- 4. Users can update their profiles
-- 5. Admins retain full management access
-- 6. Handles existing policies gracefully without errors
-- ==========================================
