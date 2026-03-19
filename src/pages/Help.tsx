"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { FileText, Upload, FileCheck, FileWarning, Search, Trash2, Eye, Download, ShieldCheck, BookOpen, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const Help: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);

  const fetchDocs = async () => {
    const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    if (error) showError(error.message);
    else setDocs(data || []);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async () => {
    const docToAdd = {
      name: "New_Document_" + Date.now() + ".pdf",
      category: "General",
      uploaded_by: localStorage.getItem('userName') || 'Staff',
      status: 'Pending'
    };
    const { error } = await supabase.from('documents').insert([docToAdd]);
    if (error) showError(error.message);
    else {
      showSuccess("Document uploaded and indexed for review.");
      fetchDocs();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) showError(error.message);
    else {
      showSuccess("Document removed from system.");
      fetchDocs();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Knowledge & Documents</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">System Repository</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-black rounded-xl shadow-lg shadow-blue-900/20" onClick={handleUpload}>
              <Upload size={18} className="mr-2" /> UPLOAD DOCUMENT
            </Button>
            <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl"><FileCheck size={32} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Docs</p>
                  <p className="text-3xl font-black text-slate-900">{docs.filter(d => d.status === 'Verified').length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-amber-50 text-amber-600 rounded-2xl"><Info size={32} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
                  <p className="text-3xl font-black text-slate-900">{docs.filter(d => d.status === 'Pending').length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-red-50 text-red-600 rounded-2xl"><FileWarning size={32} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">System Alerts</p>
                  <p className="text-3xl font-black text-slate-900">{docs.filter(d => d.status === 'Alert').length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-black">System Files & Uploads</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none rounded-xl" placeholder="Search documents..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Document Name</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="font-bold">Uploaded By</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={18} /></div>
                          <span className="font-bold text-slate-900">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="font-bold bg-slate-100 text-slate-600">{doc.category}</Badge></TableCell>
                      <TableCell className="text-sm font-bold text-slate-500">{doc.uploaded_by}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-4 py-1 font-black rounded-full uppercase text-[10px] tracking-widest",
                          doc.status === "Verified" ? "bg-emerald-100 text-emerald-700" :
                          doc.status === "Pending" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 rounded-xl"><Eye size={18} /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(doc.id)}><Trash2 size={18} /></Button>
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

export default Help;