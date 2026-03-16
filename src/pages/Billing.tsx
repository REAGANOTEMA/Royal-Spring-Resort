"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DeleteDialog from '@/components/DeleteDialog';
import { Receipt, Search, Printer, Download, CreditCard, Plus, User, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const initialBilling = [
  { id: 'INV-2024-001', guest: 'John Doe', room: '204', amount: '850,000', status: 'Paid', date: '2024-05-24' },
  { id: 'INV-2024-002', guest: 'Sarah Smith', room: '105', amount: '150,000', status: 'Pending', date: '2024-05-24' },
];

const Billing = () => {
  const [invoices, setInvoices] = useState(initialBilling);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState({ guest: '', room: '', amount: '' });

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceToAdd = {
      id: `INV-2024-00${invoices.length + 1}`,
      guest: newInvoice.guest,
      room: newInvoice.room,
      amount: newInvoice.amount,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setInvoices([invoiceToAdd, ...invoices]);
    setIsAddModalOpen(false);
    showSuccess(`Invoice created for ${newInvoice.guest}.`);
    setNewInvoice({ guest: '', room: '', amount: '' });
  };

  const handleDelete = () => {
    setInvoices(invoices.filter(inv => inv.id !== selectedId));
    setIsDeleteModalOpen(false);
    showSuccess("Invoice deleted.");
  };

  const handlePrint = (id: string) => {
    showSuccess(`Sending ${id} to printer...`);
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Guest Billing & Invoices</h2>
          <Button className="bg-blue-700 hover:bg-blue-800 font-bold" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Create New Invoice
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Invoice History</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none" placeholder="Search guest or invoice ID..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold px-8">Invoice ID</TableHead>
                    <TableHead className="font-bold">Guest</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Amount (UGX)</TableHead>
                    <TableHead className="font-bold text-right px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-500 px-8">{invoice.id}</TableCell>
                      <TableCell className="font-bold text-slate-900">{invoice.guest}</TableCell>
                      <TableCell><Badge variant="outline">Room {invoice.room}</Badge></TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-3 py-1 font-bold rounded-full",
                          invoice.status === 'Paid' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-blue-700">{invoice.amount}</TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => handlePrint(invoice.id)}><Printer size={18} /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(invoice.id); setIsDeleteModalOpen(true); }}><Trash2 size={18} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
            <form onSubmit={handleAddInvoice} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Guest Name</Label>
                <Input value={newInvoice.guest} onChange={e => setNewInvoice({...newInvoice, guest: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Input value={newInvoice.room} onChange={e => setNewInvoice({...newInvoice, room: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount (UGX)</Label>
                  <Input value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-700">Generate Invoice</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
        <Footer />
      </main>
    </div>
  );
};

export default Billing;