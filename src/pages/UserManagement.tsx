"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { UserPlus, Shield, Trash2, Mail, Key, UserCheck, ShieldCheck, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({ email: "", password: "", role: "staff" });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('staff').select('*').order('name');
    if (!error) setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = showLoading("Provisioning staff credentials...");

    try {
      const { error } = await supabase.from('staff').insert([{
        name: formData.email.split('@')[0],
        role: formData.role,
        status: 'Active',
        salary: '0',
        net: '0'
      }]);

      if (error) throw error;

      dismissToast(toastId);
      showSuccess(`Executive account for ${formData.email} provisioned.`);
      setFormData({ email: "", password: "", role: "staff" });
      fetchUsers();
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to provision account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Access Control</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">System Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden h-fit">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-400" /> Provision New User
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Corporate Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        type="email" 
                        placeholder="executive@royalsprings.com" 
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-none"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Initial Access Key</Label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-none"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">System Role</Label>
                    <Select onValueChange={val => setFormData({...formData, role: val})} value={formData.role}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="gm">General Manager</SelectItem>
                        <SelectItem value="hr">HR Manager</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="chef">Executive Chef</SelectItem>
                        <SelectItem value="staff">General Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 font-black h-14 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95" disabled={loading}>
                    PROVISION ACCOUNT
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black">Authorized System Users</CardTitle>
                <Badge className="bg-blue-100 text-blue-700 font-black px-4 py-1 rounded-full">{users.length} ACTIVE</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">User Identity</TableHead>
                      <TableHead className="font-bold">Access Level</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 font-black">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize font-bold border-blue-200 text-blue-700 bg-blue-50">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Authorized</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-xl">
                            <Trash2 size={18} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default UserManagement;