"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentHierarchyProps {
  departmentName: string;
}

interface StaffMember {
  id: string;
  name: string;
  staff_level: string;
  position: string;
  email: string;
  phone: string;
}

export const DepartmentHierarchy: React.FC<DepartmentHierarchyProps> = ({ departmentName }) => {
  const [manager, setManager] = useState<StaffMember | null>(null);
  const [supervisors, setSupervisors] = useState<StaffMember[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHierarchy = async () => {
      setLoading(true);
      try {
        // Fetch all staff in department
        const { data: staffData } = await supabase
          .from("staff")
          .select("*")
          .eq("department", departmentName)
          .eq("is_active", true)
          .order("staff_level", { ascending: true });

        if (staffData) {
          const managerData = staffData.find(s => s.staff_level === "manager" || s.staff_level === "director");
          const supervisorsData = staffData.filter(s => s.staff_level === "supervisor");
          const staffData_filtered = staffData.filter(s => s.staff_level === "staff");

          setManager(managerData || null);
          setSupervisors(supervisorsData);
          setStaff(staffData_filtered);
        }
      } catch (error) {
        console.error("Error fetching hierarchy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, [departmentName]);

  if (loading) {
    return <div className="text-center py-6 text-slate-500">Loading department hierarchy...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Manager/Head */}
      {manager && (
        <Card className="border-none shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] overflow-hidden border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <Crown size={22} /> Department Manager / Head
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-amber-600 text-white text-xl font-black">
                  {manager.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-2xl font-black text-slate-900">{manager.name}</p>
                <p className="text-sm text-amber-700 font-bold uppercase tracking-widest mb-3">
                  {manager.position}
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 text-xs uppercase font-bold">Email</p>
                    <p className="font-semibold text-slate-900">{manager.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs uppercase font-bold">Phone</p>
                    <p className="font-semibold text-slate-900">{manager.phone}</p>
                  </div>
                </div>
              </div>
              <Badge className="bg-amber-600 text-white h-fit font-black text-base px-4 py-2">
                MANAGER
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supervisors */}
      {supervisors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-blue-600" />
            <h3 className="text-lg font-black text-slate-900">Supervisors ({supervisors.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supervisors.map((supervisor) => (
              <Card key={supervisor.id} className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                <div className="bg-blue-100 border-b-4 border-blue-600 p-4">
                  <p className="text-sm font-black text-blue-700 uppercase tracking-widest">Supervisor</p>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-3 border-white shadow-md">
                      <AvatarFallback className="bg-blue-600 text-white font-black">
                        {supervisor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-black text-slate-900">{supervisor.name}</p>
                      <p className="text-xs text-slate-600 uppercase font-bold mb-2">{supervisor.position}</p>
                      <p className="text-xs text-slate-500">{supervisor.email}</p>
                      <p className="text-xs text-slate-500">{supervisor.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Staff Members */}
      {staff.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-emerald-600" />
            <h3 className="text-lg font-black text-slate-900">Staff Members ({staff.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staff.map((staffMember) => (
              <Card key={staffMember.id} className="border-none shadow-md bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-emerald-50 border-b-4 border-emerald-600 p-3">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Staff</p>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-emerald-600 text-white font-black">
                        {staffMember.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{staffMember.name}</p>
                      <p className="text-xs text-slate-600 truncate">{staffMember.position}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="truncate">{staffMember.email}</p>
                    <p>{staffMember.phone}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!manager && supervisors.length === 0 && staff.length === 0 && (
        <Card className="border-none shadow-sm bg-slate-50 rounded-2xl p-8 text-center">
          <p className="text-slate-500 font-medium">No staff members assigned to this department yet</p>
        </Card>
      )}
    </div>
  );
};

export default DepartmentHierarchy;
