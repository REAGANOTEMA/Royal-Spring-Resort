// src/api/createUser.ts
import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express'; // Or your server framework

// Server-only keys
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const allowedRoles = ['director', 'gm', 'hr', 'staff'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Check how many users exist for this role
    const { data: existingUsers, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('role', role);

    if (userError) throw userError;

    // Role limits
    if (role === 'director' && existingUsers.length >= 1) {
      return res.status(400).json({ message: 'Only one director can exist.' });
    }
    if (['gm', 'hr', 'staff'].includes(role) && existingUsers.length >= 12) {
      return res.status(400).json({ message: `Role limit reached for ${role.toUpperCase()}.` });
    }

    // Create Supabase Auth user (server-side)
    const { user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });

    if (authError) throw authError;

    // Insert into custom users table (optional, if you track more info)
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert([{ email, role }]);

    if (insertError) throw insertError;

    return res.status(200).json({ message: `${role.toUpperCase()} account created successfully!` });
  } catch (error: any) {
    console.error('Create user error:', error.message || error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};