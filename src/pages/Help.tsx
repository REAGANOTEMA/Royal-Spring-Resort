"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { FileText, Book, Shield, HelpCircle, ChevronRight, Upload, FileCheck, FileWarning } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';

const Help = () => {
  const handleUpload = () => {
    showSuccess("Document uploaded and indexed for Director review.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">System Documentation & Files</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpload}>
            <Upload size={18} className="mr-2" /> Upload Paper Document
          </Button>
        </header>

        <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><FileCheck size={32} /></div>
                <div>
                  <h3 className="font-bold">Verified Docs</h3>
                  <p className="text-2xl font-black">124</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Upload size={32} /></div>
                <div>
                  <h3 className="font-bold">Pending Review</h3>
                  <p className="text-2xl font-black">8</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><FileWarning size={32} /></div>
                <div>
                  <h3 className="font-bold">Expired/Alerts</h3>
                  <p className="text-2xl font-black">3</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle className="text-lg">User Training Manual</CardTitle></CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How to record a guest check-in?</AccordionTrigger>
                    <AccordionContent>
                      Navigate to the Bookings module, find the reservation, and click "Check In". The room status will automatically update to "Occupied".
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How to process a refund?</AccordionTrigger>
                    <AccordionContent>
                      Only the Director or GM can process refunds via the Finance module under the "Transactions" tab.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle className="text-lg">Recent Uploads</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'May_Payroll_Summary.pdf', date: '2024-05-24', size: '1.2 MB' },
                  { name: 'Supplier_Invoice_FreshFoods.jpg', date: '2024-05-23', size: '850 KB' },
                  { name: 'Staff_Contract_Alice.pdf', date: '2024-05-22', size: '2.4 MB' },
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-blue-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{file.name}</p>
                        <p className="text-[10px] text-slate-500">{file.date} • {file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold">View</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Help;