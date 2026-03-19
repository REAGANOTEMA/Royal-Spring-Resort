-- Enable RLS and create policies for staff table to allow sign up and sign in

-- Enable RLS on staff table
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert their own staff record
CREATE POLICY "Users can insert their own staff record" ON staff
FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Allow users to view their own staff record
CREATE POLICY "Users can view their own staff record" ON staff
FOR SELECT USING (auth.uid() = id);

-- Policy: Allow users to update their own staff record
CREATE POLICY "Users can update their own staff record" ON staff
FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow users to delete their own staff record
CREATE POLICY "Users can delete their own staff record" ON staff
FOR DELETE USING (auth.uid() = id);

-- For admin roles, allow viewing all staff (optional, adjust as needed)
-- You can add more policies for managers to view their department, etc.

-- Enable RLS on other tables if needed (uncomment and adjust)
-- ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- etc.

-- Note: For public sign up, ensure in Supabase Auth settings that "Enable signups" is checked (it is by default)</content>
<parameter name="filePath">c:\Users\REAGAN\Desktop\Royal-Spring-Hotel\supabase\migrations\20260319104200_rls_policies.sql