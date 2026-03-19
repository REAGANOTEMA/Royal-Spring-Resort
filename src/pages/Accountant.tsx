"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Banknote, Receipt, TrendingUp, Wallet, Plus, Download, FileText, Calculator, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const Accountant = () => {
  const [stats, setStats] = useState({ revenue: '0', expenses: '0', balance: '0' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Utilities' });

  const fetchFinanceData = async () => {
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      const rev = data.filter(t => t.status === 'Paid').reduce((acc, t) => acc + parseFloat(t.amount.replace(/,/g, '') || '0'), 0);
      const exp = data.filter(t => t.status === 'Expense').reduce((acc, t) => acc + parseFloat(t.amount.replace(/,/g, '') || '0'), 0);
      
      setStats({
        revenue: rev.toLocaleString(),
        expenses: exp.toLocaleString(),
        balance: (rev - exp).toLocaleString()
      });
      setTransactions(data.slice(0, 10));
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      guest: 'System Expense',
      room: newExpense.category,
      amount: newExpense.amount,
      status: 'Expense',
      date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('billing').insert([expenseData]);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Expense recorded in ledger.");
      setIsExpenseModalOpen(false);
      setNewExpense({ description: '', amount: '', category: 'Utilities' });
      fetchFinanceData();
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
              <h2 className="text-xl font-black text-slate-900">Financial Ledger</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Accountant Portal</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-black h-12 rounded-xl border-slate-200" onClick={() => window.print()}>
              <Download size={18} className="mr-2" /> EXPORT LEDGER
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 font-black h-12 px-6 rounded-xl shadow-lg shadow-blue-900/20" onClick={() => setIsExpenseModalOpen(true)}>
              <Plus size={18} className="mr-2" /> RECORD EXPENSE
            </Button>
          </div>
          <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  <ArrowUpRight size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-slate-900">UGX {stats.revenue}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                  <ArrowDownRight size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Expenses</p>
                  <h3 className="text-3xl font-black text-slate-900">UGX {stats.expenses}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-blue-700 text-white rounded-[2rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Banknote size={100} />
              </div>
              <CardContent className="p-8 flex items-center gap-6 relative z-10">
                <div className="p-5 bg-white/10 rounded-2xl">
                  <Wallet size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Net Balance</p>
                  <h3 className="text-3xl font-black">UGX {stats.balance}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-black">Recent Financial Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Date</TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="text-right font-bold">Amount (UGX)</TableHead>
                    <TableHead className="text-right px-8 font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((trx) => (
                    <TableRow key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 text-sm font-bold text-slate-500">{trx.date}</TableCell>
                      <TableCell className="font-black text-slate-900">
                        {trx.status === 'Expense' ? trx.room : `Invoice for ${trx.guest}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold bg-slate-100 text-slate-600">{trx.status === 'Expense' ? 'Operational' : 'Room Revenue'}</Badge>
                      </TableCell>
                      <TableCell className={cn("text-right font-black text-lg", trx.status === 'Expense' ? "text-red-600" : "text-blue-700")}>
                        {trx.status === 'Expense' ? `-${trx.amount}` : trx.amount}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Badge className={cn(
                          "px-4 py-1 font-black rounded-full uppercase text-[10px] tracking-widest",
                          trx.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                          trx.status === 'Expense' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'
                        )}>
                          {trx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
          <DialogContent className="rounded-[2.5rem] max-w-md">
            <DialogHeader><DialogTitle className="text-2xl font-black">Record New Expense</DialogTitle></DialogHeader>
            <form onSubmit={handleRecordExpense} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Expense Category</Label>
                <Select onValueChange={val => setNewExpense({...newExpense, category: val})} value={newExpense.category}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities (Water/Power)</SelectItem>
                    <SelectItem value="Kitchen">Kitchen Supplies</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Salaries">Staff Salaries</SelectItem>
                    <SelectItem value="Other">Other Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Amount (UGX)</Label>
                <Input 
                  type="text" 
                  placeholder="e.g. 50,000" 
                  className="h-12 rounded-xl bg-slate-50 border-none"
                  value={newExpense.amount} 
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})} 
                  required 
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-700 h-14 rounded-2xl font-black shadow-xl shadow-blue-900/20">SAVE TO LEDGER</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default Accountant;