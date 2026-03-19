"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import DepartmentHierarchy from "@/components/DepartmentHierarchy";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  DoorOpen,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface RoomInventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  department: string;
  created_at: string;
}

const RoomsDivision: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [inventory, setInventory] = useState<RoomInventoryItem[]>([]);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [newItem, setNewItem] = useState({ item_name: "", quantity: 0, unit: "pieces" });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupied: 0,
    available: 0,
    cleaning: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch rooms
      const { data: roomsData } = await supabase
        .from("rooms")
        .select("*")
        .order("room_id", { ascending: true });

      if (roomsData) {
        setRooms(roomsData);
        setStats({
          totalRooms: roomsData.length,
          occupied: roomsData.filter(r => r.status === "Occupied").length,
          available: roomsData.filter(r => r.status === "Available").length,
          cleaning: roomsData.filter(r => r.status === "Cleaning").length,
        });
      }

      // Fetch inventory
      const { data: inventoryData } = await supabase
        .from("rooms_inventory")
        .select("*")
        .eq("department", "Rooms Division")
        .order("created_at", { ascending: false });

      setInventory(inventoryData || []);
    } catch (error) {
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.item_name || newItem.quantity <= 0) {
      showError("Please fill all inventory fields");
      return;
    }

    const toastId = showLoading("Adding inventory item...");
    try {
      const { error } = await supabase.from("rooms_inventory").insert([
        {
          item_name: newItem.item_name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          department: "Rooms Division",
        },
      ]);

      if (error) throw error;

      dismissToast(toastId);
      showSuccess("Inventory item added successfully");
      setNewItem({ item_name: "", quantity: 0, unit: "pieces" });
      setShowInventoryForm(false);
      fetchData();
    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message || "Failed to add inventory");
    }
  };

  const handleDeleteInventoryItem = async (id: string) => {
    const toastId = showLoading("Deleting item...");
    try {
      const { error } = await supabase.from("rooms_inventory").delete().eq("id", id);
      if (error) throw error;

      dismissToast(toastId);
      showSuccess("Item deleted");
      fetchData();
    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message || "Failed to delete");
    }
  };

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
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <DoorOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Rooms Division</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Front Office & Housekeeping</p>
            </div>
          </div>
          <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
        </header>

        <div className="p-8 space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Rooms</p>
                    <p className="text-3xl font-black text-slate-900">{stats.totalRooms}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DoorOpen size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Occupied</p>
                    <p className="text-3xl font-black text-emerald-600">{stats.occupied}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <DoorOpen size={24} className="text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Available</p>
                    <p className="text-3xl font-black text-blue-600">{stats.available}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DoorOpen size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Cleaning</p>
                    <p className="text-3xl font-black text-amber-600">{stats.cleaning}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <DoorOpen size={24} className="text-amber-600" />
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
              <DepartmentHierarchy departmentName="Rooms Division" />
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ClipboardList size={20} /> Department Inventory
              </CardTitle>
              <Button
                onClick={() => setShowInventoryForm(!showInventoryForm)}
                className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-lg"
              >
                <Plus size={16} className="mr-2" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {showInventoryForm && (
                <form onSubmit={handleAddInventoryItem} className="mb-6 p-4 bg-slate-50 rounded-2xl border-2 border-emerald-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Item Name</Label>
                      <Input
                        placeholder="e.g., Bed Sheets"
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
                        value={newItem.quantity || ""}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
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
                        <option value="boxes">Boxes</option>
                        <option value="liters">Liters</option>
                        <option value="kg">Kilograms</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-lg">
                      Save Item
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInventoryForm(false)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {inventory.length > 0 ? (
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
                      {inventory.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-semibold">{item.item_name}</TableCell>
                          <TableCell className="font-black text-blue-600">{item.quantity}</TableCell>
                          <TableCell className="text-slate-600">{item.unit}</TableCell>
                          <TableCell className="text-right px-8">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500"
                              onClick={() => handleDeleteInventoryItem(item.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6">No inventory items yet</p>
              )}
            </CardContent>
          </Card>

          {/* Rooms Overview */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <BarChart3 size={20} /> Room Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">Room ID</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Price/Night</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id} className="hover:bg-slate-50/50">
                        <TableCell className="px-8 font-black text-blue-600">{room.room_id}</TableCell>
                        <TableCell className="font-semibold">{room.type}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-black text-white",
                            room.status === "Available" ? "bg-emerald-600" :
                            room.status === "Occupied" ? "bg-blue-600" :
                            "bg-amber-600"
                          )}>
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{room.price_per_night}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default RoomsDivision;
