"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Wrench, Plus, Search, AlertTriangle, CheckCircle2, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const Maintenance = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', location: '', priority: 'Medium' });

  const fetchTickets = async () => {
    const { data, error } = await supabase.from('maintenance').select('*').order('created_at', { ascending: false });
    if (error) showError(error.message);
    else setTickets(data || []);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('maintenance').insert([newTicket]);
    if (error) showError(error.message);
    else {
      showSuccess("Maintenance ticket created.");
      setIsAddModalOpen(false);
      setNewTicket({ title: '', description: '', location: '', priority: 'Medium' });
      fetchTickets();
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('maintenance').update({ status: newStatus }).eq('id', id);
    if (error) showError(error.message);
    else {
      showSuccess(`Ticket marked as ${newStatus}`);
      fetchTickets();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Property Maintenance</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Technical Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-black rounded-xl shadow-lg" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} className="mr-2" /> New Ticket
            </Button>
            <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Critical Issues</p>
                  <h3 className="text-2xl font-black text-red-600">{tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length} Active</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Clock size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">In Progress</p>
                  <h3 className="text-2xl font-black text-slate-900">{tickets.filter(t => t.status === 'In Progress').length} Tickets</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl"><CheckCircle2 size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Resolved Today</p>
                  <h3 className="text-2xl font-black">{tickets.filter(t => t.status === 'Resolved').length} Fixed</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-black">Maintenance Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Issue</TableHead>
                    <TableHead className="font-bold">Location</TableHead>
                    <TableHead className="font-bold">Priority</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">{ticket.title}</span>
                          <span className="text-xs text-slate-400 truncate max-w-xs">{ticket.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                          <MapPin size={14} className="text-slate-400" />
                          {ticket.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[10px] uppercase tracking-widest",
                          ticket.priority === 'Critical' ? "bg-red-600 text-white" :
                          ticket.priority === 'High' ? "bg-amber-500 text-white" :
                          "bg-blue-500 text-white"
                        )}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(
                          "font-bold",
                          ticket.status === 'Open' ? "bg-slate-100 text-slate-600" :
                          ticket.status === 'In Progress' ? "bg-blue-50 text-blue-700" :
                          "bg-emerald-50 text-emerald-700"
                        )}>{ticket.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          {ticket.status === 'Open' && (
                            <Button size="sm" className="bg-blue-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(ticket.id, 'In Progress')}>Assign</Button>
                          )}
                          {ticket.status === 'In Progress' && (
                            <Button size="sm" className="bg-emerald-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(ticket.id, 'Resolved')}>Resolve</Button>
                          )}
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
          <DialogContent className="rounded-[2rem]">
            <DialogHeader><DialogTitle className="text-2xl font-black">Report Maintenance Issue</DialogTitle></DialogHeader>
            <form onSubmit={handleAddTicket} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-bold">Issue Title</Label>
                <Input value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} placeholder="e.g. AC Leakage" className="h-12 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Location</Label>
                <Input value={newTicket.location} onChange={e => setNewTicket({...newTicket, location: e.target.value})} placeholder="e.g. Room 204 or Lobby" className="h-12 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Priority</Label>
                <Select onValueChange={val => setNewTicket({...newTicket, priority: val})} value={newTicket.priority}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Description</Label>
                <Input value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} placeholder="Provide details..." className="h-12 rounded-xl" />
              </div>
              <DialogFooter><Button type="submit" className="w-full bg-blue-600 h-12 rounded-xl font-bold">Submit Ticket</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default Maintenance;