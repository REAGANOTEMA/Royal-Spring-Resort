"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Users, Plus, Edit2, Trash2, Mail, Phone, Building2, Badge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { EnhancedSignUpForm } from "@/components/EnhancedSignUpForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStaff(data || []);
    } catch (err: any) {
      showError("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    const toastId = showLoading("Deleting staff member...");

    try {
      // Delete staff record
      const { error: deleteError } = await supabase
        .from("staff")
        .delete()
        .eq("id", staffId);

      if (deleteError) throw deleteError;

      // Delete auth user
      await supabase.auth.admin.deleteUser(staffId);

      dismissToast(toastId);
      showSuccess(`${name} has been deleted`);
      fetchStaff();
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to delete staff member");
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDept === "All" || member.department === filterDept;

    return matchesSearch && matchesDept;
  });

  const departments = ["All", ...new Set(staff.map((s) => s.department))];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">User Management</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                Manage Staff Accounts & Roles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 font-black rounded-xl h-12 px-6">
                  <Plus size={18} className="mr-2" /> Create Staff Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Staff Account</DialogTitle>
                </DialogHeader>
                <EnhancedSignUpForm
                  isAdminSignup={true}
                  onSuccess={() => {
                    setOpenDialog(false);
                    fetchStaff();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Filters */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Search Staff</label>
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Filter by Department</label>
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Showing {filteredStaff.length} of {staff.length} staff members
              </p>
            </CardContent>
          </Card>

          {/* Staff Table */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
              <CardTitle className="text-lg font-bold">Staff Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-slate-500 font-semibold">Loading staff list...</div>
              ) : filteredStaff.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-semibold">No staff members found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        <TableHead className="text-slate-700 font-bold">Name</TableHead>
                        <TableHead className="text-slate-700 font-bold">Email</TableHead>
                        <TableHead className="text-slate-700 font-bold">Department</TableHead>
                        <TableHead className="text-slate-700 font-bold">Position</TableHead>
                        <TableHead className="text-slate-700 font-bold">Level</TableHead>
                        <TableHead className="text-slate-700 font-bold">Phone</TableHead>
                        <TableHead className="text-slate-700 font-bold">Status</TableHead>
                        <TableHead className="text-slate-700 font-bold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((member) => (
                        <TableRow
                          key={member.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="font-bold text-slate-900">{member.name}</TableCell>
                          <TableCell className="text-slate-600 flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            {member.email}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                              {member.department}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600">{member.position}</TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                member.staff_level === "director"
                                  ? "bg-purple-100 text-purple-700"
                                  : member.staff_level === "manager"
                                  ? "bg-blue-100 text-blue-700"
                                  : member.staff_level === "supervisor"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {member.staff_level || "Staff"}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600 flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            {member.phone || "N/A"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                member.is_active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {member.is_active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-blue-600"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(member.id, member.name)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2.5rem]">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium opacity-90">Total Staff</p>
                <h3 className="text-3xl font-black">{staff.length}</h3>
                <p className="text-xs opacity-75">Active members</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-[2.5rem]">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium opacity-90">Directors</p>
                <h3 className="text-3xl font-black">
                  {staff.filter((s) => s.staff_level === "director").length}
                </h3>
                <p className="text-xs opacity-75">Management</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-[2.5rem]">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium opacity-90">Managers</p>
                <h3 className="text-3xl font-black">
                  {staff.filter((s) => s.staff_level === "manager").length}
                </h3>
                <p className="text-xs opacity-75">Team leaders</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-[2.5rem]">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium opacity-90">Departments</p>
                <h3 className="text-3xl font-black">
                  {new Set(staff.map((s) => s.department)).size}
                </h3>
                <p className="text-xs opacity-75">Divisions</p>
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