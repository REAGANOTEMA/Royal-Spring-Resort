-- ==========================================
-- VERIFY CURRENT POLICIES AND TEST LOGIN
-- This script checks what policies exist and tests if login should work
-- ==========================================

-- Step 1: Check current policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || substring(qual::text, 1, 60) || '...'
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || substring(with_check::text, 1, 60) || '...'
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'staff'
ORDER BY policyname;

-- Step 2: Test if the key login policy exists
SELECT 
  COUNT(*) as policies_count,
  COUNT(CASE WHEN policyname = 'Users can view own staff record' THEN 1 END) as has_login_policy,
  COUNT(CASE WHEN policyname = 'Allow user signup - insert own staff record' THEN 1 END) as has_signup_policy
FROM pg_policies 
WHERE tablename = 'staff';

-- Step 3: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'staff';

-- Step 4: Test a simple query (this should work for authenticated users)
-- Uncomment this line to test if you're logged in to Supabase
-- SELECT 'Test query works' as test_result, auth.email() as current_email;

-- ==========================================
-- WHAT TO LOOK FOR:
-- 1. You should see "Users can view own staff record" policy - this fixes login
-- 2. RLS should be enabled for 'staff' table
-- 3. Total policies should be around 7-8 policies
-- ==========================================
