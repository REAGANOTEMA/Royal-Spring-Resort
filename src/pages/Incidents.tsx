"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import ReportIncidentModal from '@/components/ReportIncidentModal';
import DeleteDialog from '@/components/DeleteDialog';
import { AlertCircle, Search, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const initialIncidents = [
  { id: 'INC-001', type: 'Damage', description: 'Broken TV screen in Room 204', reportedBy: 'Housekeeping', date: '2024-05-24', priority: 'High', status: 'Open' },
];

const Incidents = () => {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = () => {
    setIncidents(incidents.filter(i => i.id !== selectedId));
    setIsDeleteModalOpen(false);
    showSuccess("Incident report deleted.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Incident Reports</h2>
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Report Incident
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell className="font-medium text-slate-500">{inc.id}</TableCell>
                      <TableCell><Badge variant="outline">{inc.type}</Badge></TableCell>
                      <TableCell className="max-w-xs truncate">{inc.description}</TableCell>
                      <TableCell><Badge className="bg-red-100 text-red-700">{inc.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(inc.id); setIsDeleteModalOpen(true); }}>
                          <Trash2 size={16} />
                        </Button>
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
      <ReportIncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DeleteDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
    </div>
  );
};

export default Incidents;