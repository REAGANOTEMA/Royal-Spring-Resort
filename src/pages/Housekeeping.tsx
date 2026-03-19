"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DepartmentHierarchy from '@/components/DepartmentHierarchy';
import { ArrowLeft, Sparkles, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

const Housekeeping = () => {
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, categories: 0 });
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pieces');
  const [category, setCategory] = useState('Cleaning');

  const categories = ['Cleaning', 'Linens', 'Equipment', 'Chemicals'];

  const fetchSupplies = async () => {
    try {
      const { data, error } = await supabase
        .from('housekeeping_supplies')
        .select('*')
        .eq('department', 'Housekeeping')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSupplies(data || []);

      // Calculate stats
      const totalItems = (data || []).length;
      const lowStockItems = (data || []).filter((s: any) => s.stock_quantity < 10).length;
      const uniqueCategories = new Set((data || []).map((s: any) => s.category)).size;

      setStats({
        total: totalItems,
        lowStock: lowStockItems,
        categories: uniqueCategories
      });
    } catch (err: any) {
      showError(err.message || 'Failed to fetch supplies');
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const handleAddSupply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim() || !quantity.trim()) {
      showError('Please fill in all fields');
      return;
    }

    const toastId = showLoading('Adding supply item...');
    setLoading(true);

    try {
      const { error } = await supabase.from('housekeeping_supplies').insert([
        {
          item_name: itemName.trim(),
          stock_quantity: parseInt(quantity),
          unit,
          category,
          department: 'Housekeeping'
        }
      ]);

      if (error) throw error;

      dismissToast(toastId);
      showSuccess('Supply item added successfully');
      setItemName('');
      setQuantity('');
      setUnit('pieces');
      setCategory('Cleaning');
      await fetchSupplies();
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || 'Failed to add supply');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupply = async (id: string) => {
    const toastId = showLoading('Deleting supply...');
    try {
      const { error } = await supabase
        .from('housekeeping_supplies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dismissToast(toastId);
      showSuccess('Supply deleted successfully');
      await fetchSupplies();
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || 'Failed to delete supply');
    }
  };

  const suppliesByCategory = categories.reduce((acc: any, cat: string) => {
    acc[cat] = supplies.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <Sidebar />
      <div className="flex-1">
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-400" />
                <h1 className="text-4xl font-bold text-white">Housekeeping Department</h1>
              </div>
            </div>
            <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
          </div>

          {/* Department Hierarchy */}
          <div className="mb-8">
            <DepartmentHierarchy departmentName="Housekeeping" />
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-indigo-900/40 border-indigo-700/50 hover:bg-indigo-900/60 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indigo-300">Total Supplies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-900/40 border-orange-700/50 hover:bg-orange-900/60 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-300">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.lowStock}</div>
              </CardContent>
            </Card>

            <Card className="bg-violet-900/40 border-violet-700/50 hover:bg-violet-900/60 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-violet-300">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.categories}</div>
              </CardContent>
            </Card>
          </div>

          {/* Add Supply Form */}
          <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Supply Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSupply} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Item Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., Cleaning Detergent"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Quantity</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Unit</label>
                    <Select value={unit} onValueChange={setUnit} disabled={loading}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="liters">Liters (L)</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                        <SelectItem value="rolls">Rolls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Category</label>
                    <Select value={category} onValueChange={setCategory} disabled={loading}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? 'Adding...' : 'Add Supply Item'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Supplies by Category */}
          <div className="space-y-6">
            {categories.map((category) => {
              const categorySupplies = suppliesByCategory[category];
              if (categorySupplies.length === 0) return null;

              const categoryColors: any = {
                'Cleaning': { badge: 'bg-blue-500/20 text-blue-300' },
                'Linens': { badge: 'bg-purple-500/20 text-purple-300' },
                'Equipment': { badge: 'bg-orange-500/20 text-orange-300' },
                'Chemicals': { badge: 'bg-red-500/20 text-red-300' }
              };

              return (
                <Card key={category} className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Badge className={categoryColors[category].badge}>{category}</Badge>
                      <span className="text-sm text-gray-400">({categorySupplies.length} items)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700/50">
                            <TableHead className="text-gray-400">Item Name</TableHead>
                            <TableHead className="text-gray-400">Stock Quantity</TableHead>
                            <TableHead className="text-gray-400">Unit</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categorySupplies.map((supply: any) => (
                            <TableRow key={supply.id} className="border-slate-700/50">
                              <TableCell className="text-gray-300">{supply.item_name}</TableCell>
                              <TableCell className="text-gray-300">{supply.stock_quantity}</TableCell>
                              <TableCell className="text-gray-300">{supply.unit}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    supply.stock_quantity < 10
                                      ? 'bg-red-500/20 text-red-300'
                                      : 'bg-green-500/20 text-green-300'
                                  }
                                >
                                  {supply.stock_quantity < 10 ? 'Low Stock' : 'In Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <button
                                  onClick={() => handleDeleteSupply(supply.id)}
                                  className="p-1 hover:bg-red-900/30 rounded transition-colors text-red-400"
                                  title="Delete supply"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {supplies.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-8 text-center">
                  <p className="text-gray-400">No supplies added yet. Add your first supply item above.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Housekeeping;