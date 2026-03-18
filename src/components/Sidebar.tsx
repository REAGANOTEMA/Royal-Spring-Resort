"use client";

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SidebarContent from './SidebarContent';

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'staff');
    setUserName(localStorage.getItem('userName') || 'Staff Member');
  }, []);

  return (
    <>
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col border-r border-slate-800">
        <SidebarContent role={role} userName={userName} location={location} />
      </aside>
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-slate-950 border-slate-800 text-white">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r border-slate-800">
            <SidebarContent 
              role={role} 
              userName={userName} 
              location={location} 
              onClose={() => setIsOpen(false)} 
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;