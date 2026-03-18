"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Banknote, Wallet, TrendingDown, TrendingUp, Plus, Search, Download, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const Payroll = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [payrollData, setPayrollData] = useState({ salary: '', advance: '', deduction: '' });

  const fetchStaff = async () => {
    const { data, error } = await supabase.from('staff').select('*').order('name');
    if (error) showError(error.message);
    else setStaff(data || []);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleUpdatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const salary = parseFloat(payrollData.salary || '0');
    const advance = parseFloat(payrollData.advance || '0');
    const deduction = parseFloat(payrollData.deduction || '0');
    const net = salary - advance - deduction;

    const { error } = await supabase
      .from('staff')
      .update({
        salary: salary.toString(),
        advance: advance.toString(),
        deduction: deduction.toString(),
        net: net.toString()
      })
      .eq('id', selectedStaff.id);

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Payroll updated for ${selectedStaff.name}`);
      setIsModalOpen(false);
      fetchStaff();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Payroll & Compensation</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Financial Operations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 object-contain mr-4" />
            <Button variant="outline" className="font-black h-12 rounded-xl border-slate-200" onClick={() => window.print()}>
              <Download size={18} className="mr-2" /> EXPORT PAYROLL
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Wallet size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Monthly Payroll</p>
                  <h3 className="text-2xl font-black text-slate-900">
                    UGX {staff.reduce((acc, s) => acc + parseFloat(s.net || '0'), 0).toLocaleString()}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><TrendingDown size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Advances</p>
                  <h3 className="text-2xl font-black text-amber-600">
                    UGX {staff.reduce((acc, s) => acc + parseFloat(s.advance || '0'), 0).toLocaleString()}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl"><TrendingUp size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Staff Count</p>
                  <h3 className="text-2xl font-black">{staff.length} Active</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-black">Staff Payroll Ledger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Staff Member</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="text-right font-bold">Base Salary</TableHead>
                    <TableHead className="text-right font-bold">Advances</TableHead>
                    <TableHead className="text-right font-bold">Net Payable</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 font-bold text-slate-900">{s.name}</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold">{s.role}</Badge></TableCell>
                      <TableCell className="text-right font-bold">UGX {parseFloat(s.salary || '0').toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-red-600">-UGX {parseFloat(s.advance || '0').toLocaleString()}</TableCell>
                      <TableCell className="text-right font-black text-blue-700">UGX {parseFloat(s.net || '0').toLocaleString()}</TableCell>
                      <TableCell className="text-right px-8">
                        <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600" onClick={() => { setSelectedStaff(s); setPayrollData({ salary: s.salary, advance: s.advance, deduction: s.deduction }); setIsModalOpen(true); }}>
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader><DialogTitle className="text-2xl font-black">Adjust Payroll: {selectedStaff?.name}</DialogTitle></DialogHeader>
            <form onSubmit={handleUpdatePayroll} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-bold">Base Salary (UGX)</Label>
                <Input type="number" value={payrollData.salary} onChange={e => setPayrollData({...payrollData, salary: e.target.value})} className="h-12 rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Advances (UGX)</Label>
                  <Input type="number" value={payrollData.advance} onChange={e => setPayrollData({...payrollData, advance: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Deductions (UGX)</Label>
                  <Input type="number" value={payrollData.deduction} onChange={e => setPayrollData({...payrollData, deduction: e.target.value})} className="h-12 rounded-xl" />
                </div>
              </div>
              <DialogFooter><Button type="submit" className="w-full bg-blue-600 h-12 rounded-xl font-bold">Update Payroll</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default Payroll;