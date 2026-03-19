"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useRoyalVoice } from "@/components/VoiceConcierge";
import { Users, UserPlus, Clock, ShieldCheck, LogIn, LogOut, Timer, TrendingUp, Filter } from "lucide-react";
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [autoRefreshMinutes, setAutoRefreshMinutes] = useState(1); // Refresh every minute
  const { speak } = useRoyalVoice();

  const fetchData = async () => {
    const { data: staffData } = await supabase.from('staff').select('*');
    const { data: attendData } = await supabase
      .from('check_in_logs')
      .select('*')
      .order('check_in', { ascending: false });

    setStaff(staffData || []);
    setAttendance(attendData || []);
    
    // Extract unique departments
    const depts = [...new Set((staffData || []).map(s => s.department).filter(Boolean))];
    setDepartments(depts);
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh data every minute
    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshMinutes * 60 * 1000);

    // Check for 10-hour shifts every minute
    const shiftInterval = setInterval(() => {
      attendance.forEach(log => {
        if (!log.check_out) {
          const hours = (new Date().getTime() - new Date(log.check_in).getTime()) / (1000 * 60 * 60);
          if (hours >= 10 && hours < 10.02) {
            speak(`Attention ${log.staff_name}. You have completed 10 hours of your shift. Please consider checking out soon.`);
          }
        }
      });
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(shiftInterval);
    };
  }, [autoRefreshMinutes, speak]);

  const handleClockAction = async (staffMember: any) => {
    setLoading(true);
    try {
      const { data: activeLog } = await supabase
        .from('check_in_logs')
        .select('*')
        .eq('staff_id', staffMember.id)
        .is('check_out', null)
        .order('check_in', { ascending: false })
        .limit(1);

      if (activeLog && activeLog.length > 0) {
        // Clock Out
        const checkOutTime = new Date();
        const checkInTime = new Date(activeLog[0].check_in);
        const hours = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60) * 100) / 100;

        await supabase
          .from('check_in_logs')
          .update({ check_out: checkOutTime.toISOString(), total_hours: hours })
          .eq('id', activeLog[0].id);
        
        speak(`Congratulations ${staffMember.name}. You have successfully completed your shift of ${hours} hours. Have a wonderful rest.`);
        showSuccess(`${staffMember.name} clocked out. Hours worked: ${hours}h`);
      } else {
        // Clock In
        await supabase
          .from('check_in_logs')
          .insert([{ staff_id: staffMember.id, staff_name: staffMember.name,  check_in: new Date().toISOString() }]);
        
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

  // Calculate staff status and hours
  const getStaffStatus = (staffId: string) => {
    const activeLog = attendance.find(a => a.staff_id === staffId && !a.check_out);
    if (activeLog) {
      const hours = (new Date().getTime() - new Date(activeLog.check_in).getTime()) / (1000 * 60 * 60);
      return {
        status: "PRESENT",
        color: "bg-emerald-50 border-emerald-200",
        badgeColor: "bg-emerald-600",
        hoursWorked: Math.round(hours * 100) / 100,
        lastActivity: new Date(activeLog.check_in).toLocaleTimeString(),
        log: activeLog
      };
    }
    
    const lastLog = attendance.find(a => a.staff_id === staffId);
    return {
      status: "ABSENT",
      color: "bg-slate-50 border-slate-200",
      badgeColor: "bg-slate-400",
      hoursWorked: 0,
      lastActivity: lastLog ? new Date(lastLog.check_out || lastLog.check_in).toLocaleTimeString() : "No data",
      log: lastLog
    };
  };

  const filteredStaff = selectedDepartment
    ? staff.filter(s => s.department === selectedDepartment)
    : staff;

  const presentCount = filteredStaff.filter(s => getStaffStatus(s.id).status === "PRESENT").length;
  const absentCount = filteredStaff.filter(s => getStaffStatus(s.id).status === "ABSENT").length;
  const totalHoursWorked = filteredStaff.reduce((acc, s) => acc + (getStaffStatus(s.id).hoursWorked), 0);

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
          <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
        </header>

        <div className="p-8 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Staff</p>
                    <p className="text-3xl font-black text-slate-900">{filteredStaff.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Present Today</p>
                    <p className="text-3xl font-black text-emerald-600">{presentCount}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <LogIn size={24} className="text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Absent Today</p>
                    <p className="text-3xl font-black text-red-600">{absentCount}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <LogOut size={24} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Hours</p>
                    <p className="text-3xl font-black text-purple-600">{totalHoursWorked.toFixed(1)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Timer size={24} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDepartment("")}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                !selectedDepartment
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              <Filter size={16} className="inline mr-2" />
              All Departments
            </button>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={cn(
                  "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                  selectedDepartment === dept
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Attendance Table */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-black">Staff Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">Staff Member</TableHead>
                      <TableHead className="font-bold">Department</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Hours Worked</TableHead>
                      <TableHead className="font-bold">Last Activity</TableHead>
                      <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((s) => {
                      const statusInfo = getStaffStatus(s.id);
                      return (
                        <TableRow key={s.id} className={cn("hover:bg-slate-50/50 transition-colors border-b", statusInfo.color)}>
                          <TableCell className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-black text-xs">{s.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-bold text-slate-900">{s.name}</span>
                                <p className="text-xs text-slate-500">{s.position || s.role}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-700">{s.department || "N/A"}</TableCell>
                          <TableCell>
                            <Badge className={cn("font-black rounded-lg text-white", statusInfo.badgeColor)}>
                              {statusInfo.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-black text-lg text-blue-600">{statusInfo.hoursWorked.toFixed(2)}h</TableCell>
                          <TableCell className="text-sm text-slate-600">{statusInfo.lastActivity}</TableCell>
                          <TableCell className="text-right px-8">
                            <Button 
                              size="sm" 
                              className={cn("font-black rounded-xl text-white", statusInfo.status === "PRESENT" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700")}
                              onClick={() => handleClockAction(s)}
                              disabled={loading}
                            >
                              {statusInfo.status === "PRESENT" ? <><LogOut size={14} className="mr-1" /> OUT</> : <><LogIn size={14} className="mr-1" /> IN</>}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Logs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black">Today's Clock Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {attendance.length > 0 ? (
                  <div className="space-y-3">
                    {attendance.slice(0, 12).map((log) => {
                      const staff_member = staff.find(s => s.id === log.staff_id);
                      return (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                          <div className="flex-1">
                            <p className="font-black text-slate-900">{log.staff_name || staff_member?.name}</p>
                            <p className="text-xs text-slate-500">
                              <Clock size={12} className="inline mr-1" />
                              {new Date(log.check_in).toLocaleTimeString()} {log.check_out ? `→ ${new Date(log.check_out).toLocaleTimeString()}` : '(Active)'}
                            </p>
                          </div>
                          <Badge className={cn("font-black text-white", log.check_out ? "bg-slate-600" : "bg-emerald-600")}>
                            {log.total_hours > 0 ? `${log.total_hours}h` : (log.check_out ? "0h" : "Running")}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-6">No clock activity today</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" /> Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <p className="text-xs text-emerald-700 font-bold uppercase mb-1">Attendance Rate</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {filteredStaff.length > 0 ? Math.round((presentCount / filteredStaff.length) * 100) : 0}%
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-xs text-blue-700 font-bold uppercase mb-1">Avg Hours per Person</p>
                  <p className="text-2xl font-black text-blue-600">
                    {presentCount > 0 ? (totalHoursWorked / presentCount).toFixed(1) : "0"}h
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl">
                  <p className="text-xs text-purple-700 font-bold uppercase mb-1">Active Sessions</p>
                  <p className="text-2xl font-black text-purple-600">
                    {attendance.filter(a => !a.check_out).length}
                  </p>
                </div>
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