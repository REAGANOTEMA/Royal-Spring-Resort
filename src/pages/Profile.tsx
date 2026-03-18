"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  User, Mail, Briefcase, Calendar, Banknote, Camera, ShieldCheck, Lock, Wallet, TrendingDown, Phone, MapPin, Clock, Save, Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

const Profile: React.FC = () => {
  const [staff, setStaff] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchProfile = async () => {
    const name = localStorage.getItem("userName") || "Staff Member";
    const { data: staffData } = await supabase.from('staff').select('*').eq('name', name).single();
    
    if (staffData) {
      setStaff(staffData);
      setFormData(staffData);
      
      const { data: attendData } = await supabase
        .from('check_in_logs')
        .select('*')
        .eq('staff_id', staffData.id)
        .order('check_in', { ascending: false });
      setAttendance(attendData || []);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !staff) return;

    const toastId = showLoading("Uploading profile image...");
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const { error } = await supabase.from('staff').update({ avatar_url: base64 }).eq('id', staff.id);
      if (error) showError(error.message);
      else {
        setStaff({ ...staff, avatar_url: base64 });
        showSuccess("Profile picture updated!");
      }
      dismissToast(toastId);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const toastId = showLoading("Saving profile changes...");
    const { error } = await supabase.from('staff').update({
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      bio: formData.bio
    }).eq('id', staff.id);

    dismissToast(toastId);
    if (error) showError(error.message);
    else {
      showSuccess("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    }
  };

  if (!staff) return <div className="h-screen flex items-center justify-center font-black text-blue-600">Loading Profile...</div>;

  const totalHours = attendance.reduce((acc, log) => acc + (parseFloat(log.total_hours) || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-900">Executive Profile</h2>
          <div className="flex gap-3">
            {isEditing ? (
              <Button onClick={handleSaveProfile} className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-xl">
                <Save size={18} className="mr-2" /> SAVE CHANGES
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 font-black rounded-xl">
                EDIT PROFILE
              </Button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <div className="h-40 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900" />
            <CardContent className="relative pt-0 pb-10 px-10">
              <div className="flex flex-col md:flex-row items-end gap-8 -mt-16 mb-8">
                <div className="relative group">
                  <Avatar className="h-40 w-40 border-8 border-white shadow-2xl rounded-[2.5rem]">
                    <AvatarImage src={staff.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-slate-100 text-blue-600 text-5xl font-black">
                      {staff.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all cursor-pointer hover:scale-110">
                    <Camera size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div className="flex-1 pb-4">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{staff.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge className="bg-blue-700 text-white font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                      {staff.position}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                      {staff.department}
                    </Badge>
                    <span className="text-slate-400 font-bold text-sm flex items-center gap-1">
                      <Calendar size={14} /> Joined {staff.joined_at}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  {isEditing ? (
                    <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-10 rounded-xl" />
                  ) : (
                    <p className="font-bold text-slate-700">{staff.email || 'Not set'}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                  {isEditing ? (
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-10 rounded-xl" />
                  ) : (
                    <p className="font-bold text-slate-700">{staff.phone || 'Not set'}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Address</p>
                  {isEditing ? (
                    <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-10 rounded-xl" />
                  ) : (
                    <p className="font-bold text-slate-700">{staff.address || 'Not set'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock size={20} className="text-blue-400" /> Attendance & Work Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total Hours Worked</p>
                    <h3 className="text-3xl font-black text-slate-900">{totalHours.toFixed(1)} hrs</h3>
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Shift Completion</p>
                    <h3 className="text-3xl font-black text-slate-900">{attendance.length} Shifts</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Shift Logs</h4>
                  <div className="space-y-3">
                    {attendance.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-700">{new Date(log.check_in).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {new Date(log.check_in).toLocaleTimeString()} - {log.check_out ? new Date(log.check_out).toLocaleTimeString() : 'Active'}
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 font-black">{log.total_hours || '0'}h</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-lg font-bold">Professional Bio</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {isEditing ? (
                    <Textarea 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})} 
                      placeholder="Tell us about your professional background..." 
                      className="min-h-[150px] rounded-2xl"
                    />
                  ) : (
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {staff.bio || "No bio provided yet. Click edit to add your professional summary."}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-blue-700 text-white rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl"><Wallet size={24} /></div>
                    <div>
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Net Payable</p>
                      <h3 className="text-2xl font-black">UGX {parseFloat(staff.net).toLocaleString()}</h3>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="opacity-60">Base Salary</span>
                      <span>UGX {parseFloat(staff.salary).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-red-300">
                      <span>Deductions</span>
                      <span>-UGX {parseFloat(staff.deduction).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Profile;