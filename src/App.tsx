// src/App.tsx
"use client";

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Inventory from "./pages/Inventory";
import Bookings from "./pages/Bookings";
import Guests from "./pages/Guests";
import Finance from "./pages/Finance";
import HR from "./pages/HR";
import Incidents from "./pages/Incidents";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import OnlineBooking from "./pages/OnlineBooking";
import Help from "./pages/Help";
import JobPostings from "./pages/JobPostings";
import Careers from "./pages/Careers";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import Security from "./pages/Security";
import Media from "./pages/Media";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Supabase client
import { supabase } from "@/lib/supabaseClient";

// Private route guard
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = supabase.auth.getUser(); // check login
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global Toasts */}
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book" element={<OnlineBooking />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<Help />} />

            {/* Private / App Pages */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
            <Route path="/guests" element={<PrivateRoute><Guests /></PrivateRoute>} />
            <Route path="/finance" element={<PrivateRoute><Finance /></PrivateRoute>} />
            <Route path="/hr" element={<PrivateRoute><HR /></PrivateRoute>} />
            <Route path="/job-postings" element={<PrivateRoute><JobPostings /></PrivateRoute>} />
            <Route path="/incidents" element={<PrivateRoute><Incidents /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/security" element={<PrivateRoute><Security /></PrivateRoute>} />
            <Route path="/media" element={<PrivateRoute><Media /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;