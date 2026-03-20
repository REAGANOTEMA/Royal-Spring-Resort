# 🔑 **Login Permission Fix - Royal Springs Resort**

## ❌ **Problem: "Permission denied" during login**

Users are getting this error when trying to log in with correct credentials:
```
Permission denied. Please try again or contact your administrator.
```

## 🎯 **Root Cause**
The Row Level Security (RLS) policies on the `staff` table are preventing users from reading their own staff records during the login process.

## ✅ **Solution: Apply the LOGIN_PERMISSION_FIX.sql**

### 📋 **Step-by-Step Instructions:**

#### **Option 1: Using Supabase Dashboard (Recommended)**
1. **Go to your Supabase Dashboard**
2. **Navigate to:** `SQL Editor` → `New query`
3. **Copy and paste** the entire contents of `LOGIN_PERMISSION_FIX.sql`
4. **Click "Run"** to execute the script
5. **Verify success** - you should see the policies listed in the results

#### **Option 2: Using Command Line**
```bash
# If you have the Supabase CLI installed
supabase db push
# Or apply the SQL directly
psql YOUR_DATABASE_URL < LOGIN_PERMISSION_FIX.sql
```

#### **Option 3: Using Database Client**
- Connect to your Supabase database with any SQL client (pgAdmin, DBeaver, etc.)
- Run the `LOGIN_PERMISSION_FIX.sql` script

## 🔧 **What the Fix Does:**

### **1. Removes Problematic Policies**
- Drops all existing RLS policies that might be blocking access
- Cleans up old/unused policies

### **2. Creates New Effective Policies**
- **Users can view their own staff record** → Fixes login permission error
- **Users can insert their own record** → Fixes signup
- **Users can update their own record** → Profile updates work
- **Admins can manage all records** → Admin functionality preserved

### **3. Key Policy for Login Fix**
```sql
CREATE POLICY "Users can view own staff record"
ON staff FOR SELECT
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);
```

## 🧪 **Test the Fix**

### **1. Try Login Again**
After applying the fix, users should be able to log in normally with their credentials.

### **2. Check Console for Errors**
Open browser dev tools and check for any remaining permission errors.

### **3. Verify User Data**
Ensure user role and department are correctly loaded after login.

## 🔍 **Verification Steps**

### **Check Policies Applied**
Run this query to verify policies are in place:
```sql
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'staff';
```

You should see these policies:
- ✅ `Users can view own staff record`
- ✅ `Allow user signup - insert own staff record`
- ✅ `Users can update own staff record`
- ✅ `Admins can view all staff`
- ✅ `Admins can manage staff records`

### **Test User Access**
```sql
-- Test that users can see their own records
SELECT * FROM staff WHERE auth.email() = email LIMIT 1;
```

## 🚨 **If Issues Persist**

### **1. Check User Metadata**
Ensure users have the correct metadata in their auth profile:
```sql
SELECT auth.jwt() -> 'user_metadata' as user_metadata;
```

### **2. Verify Staff Records**
Check that staff records exist and have correct email mapping:
```sql
SELECT id, name, email, auth_email, staff_level FROM staff LIMIT 5;
```

### **3. Clear Browser Cache**
Sometimes browser cache can cause issues - clear localStorage and cookies.

## 🎉 **Expected Results**

After applying this fix:
- ✅ **Users can log in** without permission errors
- ✅ **User roles load correctly** during login
- ✅ **Department assignments work** properly
- ✅ **Admin functionality preserved**
- ✅ **Signup process works** for new users

## 📞 **Need Help?**

If you still experience issues after applying the fix:
1. **Check the Supabase logs** for detailed error messages
2. **Verify the SQL script** executed successfully
3. **Ensure user accounts exist** in both auth.users and staff tables
4. **Check email matching** between auth and staff records

---

**Your login system should now work perfectly!** 🔑✨
