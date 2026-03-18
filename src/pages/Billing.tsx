"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Receipt, Search, Printer, Plus, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const Billing = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ guest: '', room: '', amount: '' });

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from('billing').select('*').order('date', { ascending: false });
    if (!error) setInvoices(data || []);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePrint = (invoice: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${invoice.guest}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { height: 80px; margin-bottom: 10px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th, .table td { padding: 15px; border-bottom: 1px solid #eee; text-align: left; }
            .total { text-align: right; font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo.png" class="logo" />
            <h1>ROYAL SPRINGS RESORT</h1>
            <p>Official Payment Receipt</p>
          </div>
          <div class="details">
            <div>
              <p><strong>GUEST:</strong> ${invoice.guest}</p>
              <p><strong>ROOM:</strong> ${invoice.room}</p>
            </div>
            <div>
              <p><strong>DATE:</strong> ${invoice.date}</p>
              <p><strong>INVOICE #:</strong> ${invoice.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr><th>Description</th><th>Status</th><th style="text-align:right">Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Accommodation & Services</td><td>${invoice.status}</td><td style="text-align:right">UGX ${invoice.amount}</td></tr>
            </tbody>
          </table>
          <div class="total">TOTAL: UGX ${invoice.amount}</div>
          <div class="footer">
            <p>Thank you for choosing Royal Springs Resort. We hope you enjoyed your stay.</p>
            <p>Kampala, Uganda | +256 772 514 889 | info@royalspringsresort.com</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white"><Receipt size={24} /></div>
            <h2 className="text-xl font-black text-slate-900">Billing & Invoices</h2>
          </div>
          <Button className="bg-blue-700 hover:bg-blue-800 font-black rounded-xl h-12 px-6" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> CREATE INVOICE
          </Button>
        </header>

        <div className="p-8">
          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2rem]">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Date</TableHead>
                    <TableHead className="font-bold">Guest</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Amount (UGX)</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 text-slate-500">{invoice.date}</TableCell>
                      <TableCell className="font-black text-slate-900">{invoice.guest}</TableCell>
                      <TableCell><Badge variant="outline" className="font-bold">Room {invoice.room}</Badge></TableCell>
                      <TableCell><Badge className={cn("px-3 py-1 font-black rounded-lg", invoice.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{invoice.status}</Badge></TableCell>
                      <TableCell className="text-right font-black text-blue-700">{invoice.amount}</TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 rounded-xl" onClick={() => handlePrint(invoice)}><Printer size={18} /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Billing;