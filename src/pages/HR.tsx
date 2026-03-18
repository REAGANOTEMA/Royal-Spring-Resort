"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useRoyalVoice } from "@/components/VoiceConcierge";
import { Users, UserPlus, Clock, ShieldCheck, LogIn, LogOut, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const HR = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { speak } = useRoyalVoice();

  const fetchData = async () => {
    const { data: staffData } = await supabase.from('staff').select('*');
    const { data: attendData } = await supabase
      .from('check_in_logs')
      .select('*')
      .order('check_in', { ascending: false });

    setStaff(staffData || []);
    setAttendance(attendData || []);
  };

  useEffect(() => {
    fetchData();
    
    // Check for 10-hour shifts every minute
    const interval = setInterval(() => {
      attendance.forEach(log => {
        if (!log.check_out) {
          const hours = (new Date().getTime() - new Date(log.check_in).getTime()) / (1000 * 60 * 60);
          if (hours >= 10 && hours < 10.02) { // Trigger once around 10 hours
            speak(`Attention ${log.staff_name}. You have completed 10 hours of your shift. Please consider checking out soon.`);
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [attendance, speak]);

  const handleClockAction = async (staffMember: any) => {
    setLoading(true);
    try {
      const { data: activeLog } = await supabase
        .from('check_in_logs')
        .select('*')
        .eq('staff_id', staffMember.id)
        .is('check_out', null)
        .single();

      if (activeLog) {
        // Clock Out
        const checkOutTime = new Date();
        const checkInTime = new Date(activeLog.check_in);
        const hours = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60) * 100) / 100;

        await supabase
          .from('check_in_logs')
          .update({ check_out: checkOutTime.toISOString(), total_hours: hours })
          .eq('id', activeLog.id);
        
        speak(`Congratulations ${staffMember.name}. You have successfully completed your shift of ${hours} hours. Have a wonderful rest.`);
        showSuccess(`${staffMember.name} clocked out.`);
      } else {
        // Clock In
        await supabase
          .from('check_in_logs')
          .insert([{ staff_id: staffMember.id, staff_name: staffMember.name }]);
        
        speak(`Welcome to work, ${staffMember.name}. Your shift has officially started. I will be here to guide you.`);
        showSuccess(`${staffMember.name} clocked in.`);
      }
      fetchData();
    } catch (err: any) {
      showError("Attendance update failed.");
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
            <div className="p-2 bg-blue-600 rounded-xl text-white"><Users size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Human Resources</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Staff & Attendance</p>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black">Staff Directory & Clocking</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">Staff Member</TableHead>
                      <TableHead className="font-bold">Role</TableHead>
                      <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-black text-xs">{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-slate-900">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold rounded-lg">{s.role}</Badge></TableCell>
                        <TableCell className="text-right px-8">
                          <Button 
                            size="sm" 
                            className={cn("font-black rounded-xl", attendance.find(a => a.staff_id === s.id && !a.check_out) ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700")}
                            onClick={() => handleClockAction(s)}
                            disabled={loading}
                          >
                            {attendance.find(a => a.staff_id === s.id && !a.check_out) ? <><LogOut size={14} className="mr-1" /> CLOCK OUT</> : <><LogIn size={14} className="mr-1" /> CLOCK IN</>}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Timer size={20} className="text-blue-600" /> Recent Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {attendance.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="font-black text-slate-900 text-sm">{log.staff_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {new Date(log.check_in).toLocaleTimeString()} {log.check_out ? `- ${new Date(log.check_out).toLocaleTimeString()}` : '(Active)'}
                      </p>
                    </div>
                    {log.total_hours > 0 && <Badge className="bg-blue-100 text-blue-700 font-black">{log.total_hours}h</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HR;