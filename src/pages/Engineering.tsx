"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import DepartmentHierarchy from "@/components/DepartmentHierarchy";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Plus,
  Trash2,
  ArrowLeft,
  ClipboardList,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface EngItem {
  id: string;
  item_name: string;
  stock_quantity: number;
  unit: string;
  category: string;
  department: string;
  created_at: string;
}

const Engineering: React.FC = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<EngItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: "",
    stock_quantity: 0,
    unit: "pieces",
    category: "Tools",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("engineering_inventory")
        .select("*")
        .eq("department", "Engineering")
        .order("created_at", { ascending: false });

      setInventory(data || []);
    } catch (error) {
      showError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.item_name || newItem.stock_quantity <= 0) {
      showError("Please fill all fields");
      return;
    }

    const toastId = showLoading("Adding inventory item...");
    try {
      const { error } = await supabase.from("engineering_inventory").insert([
        {
          item_name: newItem.item_name,
          stock_quantity: newItem.stock_quantity,
          unit: newItem.unit,
          category: newItem.category,
          department: "Engineering",
        },
      ]);

      if (error) throw error;

      dismissToast(toastId);
      showSuccess("Item added successfully");
      setNewItem({ item_name: "", stock_quantity: 0, unit: "pieces", category: "Tools" });
      setShowForm(false);
      fetchData();
    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message || "Failed to add item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    const toastId = showLoading("Deleting...");
    try {
      const { error } = await supabase.from("engineering_inventory").delete().eq("id", id);
      if (error) throw error;

      dismissToast(toastId);
      showSuccess("Item deleted");
      fetchData();
    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message);
    }
  };

  const stats = {
    totalItems: inventory.length,
    totalStock: inventory.reduce((sum, item) => sum + item.stock_quantity, 0),
    categories: [...new Set(inventory.map(i => i.category))].length,
  };

  const categories = [...new Set(inventory.map(i => i.category))];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors mr-2"
              title="Go Back"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="p-2 bg-red-600 rounded-xl text-white">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Engineering & Maintenance</h2>
              <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">Technical Operations</p>
            </div>
          </div>
          <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
        </header>

        <div className="p-8 space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Items</p>
                    <p className="text-3xl font-black text-slate-900">{stats.totalItems}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Wrench size={24} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Stock</p>
                    <p className="text-3xl font-black text-red-600">{stats.totalStock}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Zap size={24} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Categories</p>
                    <p className="text-3xl font-black text-red-600">{stats.categories}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Hierarchy */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
              <CardTitle className="text-lg font-black">Department Team Structure</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <DepartmentHierarchy departmentName="Engineering" />
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ClipboardList size={20} /> Equipment & Supplies
              </CardTitle>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-lg"
              >
                <Plus size={16} className="mr-2" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {showForm && (
                <form onSubmit={handleAddItem} className="mb-6 p-4 bg-slate-50 rounded-2xl border-2 border-emerald-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Item Name</Label>
                      <Input
                        placeholder="e.g., Wrench Set"
                        value={newItem.item_name}
                        onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Quantity</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="1"
                        value={newItem.stock_quantity || ""}
                        onChange={(e) => setNewItem({ ...newItem, stock_quantity: parseInt(e.target.value) || 0 })}
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Unit</Label>
                      <select
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        className="h-10 rounded-lg border border-slate-200 px-3 font-medium"
                      >
                        <option value="pieces">Pieces</option>
                        <option value="sets">Sets</option>
                        <option value="meters">Meters</option>
                        <option value="boxes">Boxes</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Category</Label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="h-10 rounded-lg border border-slate-200 px-3 font-medium"
                      >
                        <option value="Tools">Tools</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-lg">
                      Save Item
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-lg">
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {inventory.length > 0 ? (
                <div className="space-y-6">
                  {categories.map(category => (
                    <div key={category}>
                      <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                        <Badge className="bg-red-600 text-white">{category}</Badge>
                        <span className="text-sm text-slate-600">
                          ({inventory.filter(i => i.category === category).length} items)
                        </span>
                      </h4>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="font-bold">Item Name</TableHead>
                              <TableHead className="font-bold">Quantity</TableHead>
                              <TableHead className="font-bold">Unit</TableHead>
                              <TableHead className="text-right font-bold px-8">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {inventory
                              .filter(item => item.category === category)
                              .map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                  <TableCell className="font-semibold">{item.item_name}</TableCell>
                                  <TableCell className="font-black text-red-600">{item.stock_quantity}</TableCell>
                                  <TableCell className="text-slate-600">{item.unit}</TableCell>
                                  <TableCell className="text-right px-8">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500"
                                      onClick={() => handleDeleteItem(item.id)}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6">No inventory items yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Engineering;
