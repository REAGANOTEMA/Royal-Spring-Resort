"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Sparkles, CheckCircle2, Clock, AlertCircle, Search, Filter, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const Housekeeping = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('housekeeping')
      .select('*, rooms(type)')
      .order('last_cleaned', { ascending: false });
    
    if (error) showError(error.message);
    else setTasks(data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (id: string, roomId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error: hError } = await supabase
        .from('housekeeping')
        .update({ status: newStatus, last_cleaned: newStatus === 'Completed' ? new Date().toISOString() : undefined })
        .eq('id', id);

      if (hError) throw hError;

      // Update room status if completed
      if (newStatus === 'Completed' || newStatus === 'Inspected') {
        await supabase.from('rooms').update({ status: 'Available' }).eq('id', roomId);
      } else if (newStatus === 'In Progress') {
        await supabase.from('rooms').update({ status: 'Cleaning' }).eq('id', roomId);
      }

      showSuccess(`Task marked as ${newStatus}`);
      fetchTasks();
    } catch (err: any) {
      showError(err.message);
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
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Housekeeping & Sanitation</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Room Readiness Control</p>
            </div>
          </div>
          <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Cleaning</p>
                  <h3 className="text-2xl font-black text-slate-900">{tasks.filter(t => t.status === 'Pending').length} Rooms</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Sparkles size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">In Progress</p>
                  <h3 className="text-2xl font-black text-slate-900">{tasks.filter(t => t.status === 'In Progress').length} Rooms</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-emerald-600 text-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl"><CheckCircle2 size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">Ready for Guests</p>
                  <h3 className="text-2xl font-black">{tasks.filter(t => t.status === 'Inspected').length} Rooms</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <CardHeader className="border-b px-8 py-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black">Cleaning Schedule</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input className="pl-9 h-10 bg-slate-50 border-none rounded-xl" placeholder="Search rooms..." />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Room</TableHead>
                    <TableHead className="font-bold">Type</TableHead>
                    <TableHead className="font-bold">Assigned Staff</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 font-black text-slate-900">Room {task.room_id}</TableCell>
                      <TableCell><Badge variant="outline" className="font-bold">{task.rooms?.type}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-600">{task.staff_name || 'Unassigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-3 py-1 font-black uppercase text-[10px] tracking-widest rounded-lg",
                          task.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                          task.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                          task.status === 'Completed' ? "bg-emerald-100 text-emerald-700" :
                          "bg-slate-100 text-slate-700"
                        )}>{task.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          {task.status === 'Pending' && (
                            <Button size="sm" className="bg-blue-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(task.id, task.room_id, 'In Progress')} disabled={loading}>Start</Button>
                          )}
                          {task.status === 'In Progress' && (
                            <Button size="sm" className="bg-emerald-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(task.id, task.room_id, 'Completed')} disabled={loading}>Finish</Button>
                          )}
                          {task.status === 'Completed' && (
                            <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(task.id, task.room_id, 'Inspected')} disabled={loading}>Inspect</Button>
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
        <Footer />
      </main>
    </div>
  );
};

export default Housekeeping;