"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  MessageSquare,
  Receipt,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("Executive");
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStaff: 0,
    pendingIncidents: 0,
    dailyRevenue: 0
  });

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Executive');
    
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];

      const { count: roomsCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
      const { count: occupiedCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('status', 'Occupied');
      const { count: staffCount } = await supabase.from('staff').select('*', { count: 'exact', head: true });
      const { count: incidentCount } = await supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'Open');
      
      const { data: billingData } = await supabase
        .from('billing')
        .select('amount')
        .eq('date', today)
        .eq('status', 'Paid');

      const revenue = (billingData || []).reduce((acc, curr) => {
        return acc + parseFloat(curr.amount.replace(/,/g, '') || '0');
      }, 0);

      setStats({
        totalRooms: roomsCount || 0,
        occupiedRooms: occupiedCount || 0,
        totalStaff: staffCount || 0,
        pendingIncidents: incidentCount || 0,
        dailyRevenue: revenue
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Executive Overview</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Welcome back, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">System Online</p>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <BedDouble size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Occupancy</p>
                  <h3 className="text-2xl font-black text-slate-900">{stats.occupiedRooms}/{stats.totalRooms}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Staff Active</p>
                  <h3 className="text-2xl font-black text-slate-900">{stats.totalStaff}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Incidents</p>
                  <h3 className="text-2xl font-black text-slate-900">{stats.pendingIncidents}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-blue-700 text-white rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={80} />
              </div>
              <CardContent className="p-6 flex items-center gap-5 relative z-10">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Daily Revenue</p>
                  <h3 className="text-2xl font-black">UGX {stats.dailyRevenue.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 gap-3">
                <Link to="/bookings">
                  <Button className="w-full justify-between h-14 bg-slate-900 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all group">
                    <div className="flex items-center gap-3">
                      <Plus size={20} />
                      <span>New Reservation</span>
                    </div>
                    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/billing">
                  <Button variant="outline" className="w-full justify-between h-14 border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-2xl font-bold transition-all group">
                    <div className="flex items-center gap-3">
                      <Receipt size={20} />
                      <span>Generate Invoice</span>
                    </div>
                    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button variant="outline" className="w-full justify-between h-14 border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-2xl font-bold transition-all group">
                    <div className="flex items-center gap-3">
                      <MessageSquare size={20} />
                      <span>Guest Messages</span>
                    </div>
                    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900">Live Activity Feed</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={40} className="text-slate-200" />
                </div>
                <h4 className="text-slate-900 font-bold mb-2">All Systems Operational</h4>
                <p className="text-slate-500 text-sm max-w-xs">Your resort is running smoothly. New activities will appear here as they happen.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;