"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { UserCog, Plus, Search, FileText, Calendar, Target, Banknote, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const staffData = [
  { id: 'ST-001', name: 'Alice Johnson', role: 'Front Desk', salary: '1,200,000', advance: '100,000', deduction: '50,000', net: '1,050,000' },
  { id: 'ST-002', name: 'Bob Williams', role: 'Chef', salary: '2,500,000', advance: '0', deduction: '120,000', net: '2,380,000' },
];

const leaveRequests = [
  { id: 'LV-101', name: 'Alice Johnson', type: 'Holiday', start: '2024-06-01', end: '2024-06-05', status: 'Pending' },
  { id: 'LV-102', name: 'Bob Williams', type: 'Sick Leave', start: '2024-05-20', end: '2024-05-22', status: 'Approved' },
];

const HR = () => {
  const handleApproveLeave = (id: string) => {
    showSuccess(`Leave request ${id} approved.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">HR & Payroll Management</h2>
          <Button className="bg-blue-700 hover:bg-blue-800 font-bold">
            <Plus size={18} className="mr-2" /> Add Staff Member
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <Tabs defaultValue="payroll" className="w-full">
            <TabsList className="bg-white border mb-6">
              <TabsTrigger value="payroll">Payroll & Salaries</TabsTrigger>
              <TabsTrigger value="leave">Leave Management</TabsTrigger>
              <TabsTrigger value="targets">Performance Targets</TabsTrigger>
            </TabsList>

            <TabsContent value="payroll">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Monthly Payroll (May 2024)</CardTitle>
                  <Button variant="outline" size="sm"><FileText size={16} className="mr-2" /> Generate Payslips</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Staff Name</TableHead>
                        <TableHead>Base Salary</TableHead>
                        <TableHead>Advances</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead className="text-right font-bold">Net Pay (UGX)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-semibold">{s.name}</TableCell>
                          <TableCell>{s.salary}</TableCell>
                          <TableCell className="text-rose-600">-{s.advance}</TableCell>
                          <TableCell className="text-rose-600">-{s.deduction}</TableCell>
                          <TableCell className="text-right font-bold text-blue-700">{s.net}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leave">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader><CardTitle className="text-lg">Holiday & Leave Requests</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Staff Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((l) => (
                        <TableRow key={l.id}>
                          <TableCell className="font-semibold">{l.name}</TableCell>
                          <TableCell><Badge variant="outline">{l.type}</Badge></TableCell>
                          <TableCell>{l.start} to {l.end}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              l.status === 'Approved' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {l.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {l.status === 'Pending' && (
                              <Button size="sm" onClick={() => handleApproveLeave(l.id)}>Approve</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targets">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Departmental Targets</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { dept: 'Reception', target: '90% Guest Satisfaction', progress: 85 },
                      { dept: 'Housekeeping', target: 'Room Turnaround < 30m', progress: 70 },
                      { dept: 'Kitchen', target: 'Zero Food Waste Initiative', progress: 45 },
                    ].map((t) => (
                      <div key={t.dept} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{t.dept}</span>
                          <span className="text-slate-500">{t.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${t.progress}%` }} />
                        </div>
                        <p className="text-xs text-slate-400">{t.target}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HR;