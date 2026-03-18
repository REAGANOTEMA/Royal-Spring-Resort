"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { Booking } from '../types/index';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BookingModal = ({ isOpen, onClose, onSuccess }: BookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    roomType: 'Standard',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    amount: '150,000'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = showLoading("Creating reservation...");

    try {
      const { error } = await supabase.from('bookings').insert([{
        guest: formData.guestName,
        room: formData.roomNumber,
        status: 'Confirmed',
        amount: formData.amount,
        check_in: formData.checkIn,
        check_out: formData.checkOut
      }]);

      if (error) throw error;

      // Also update room status
      await supabase.from('rooms').update({ status: 'Occupied' }).eq('id', formData.roomNumber);

      dismissToast(toastId);
      showSuccess("Reservation created successfully!");
      if (onSuccess) onSuccess();
      onClose();
      setFormData({
        guestName: '',
        phone: '',
        roomType: 'Standard',
        roomNumber: '',
        checkIn: '',
        checkOut: '',
        amount: '150,000'
      });
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Reservation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Guest Name</Label>
              <Input 
                id="guestName" 
                placeholder="Full Name" 
                value={formData.guestName}
                onChange={e => setFormData({...formData, guestName: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+256..." 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select onValueChange={val => setFormData({...formData, roomType: val})} value={formData.roomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input 
                id="roomNumber" 
                placeholder="e.g. 204" 
                value={formData.roomNumber}
                onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check In</Label>
              <Input 
                id="checkIn" 
                type="date" 
                value={formData.checkIn}
                onChange={e => setFormData({...formData, checkIn: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check Out</Label>
              <Input 
                id="checkOut" 
                type="date" 
                value={formData.checkOut}
                onChange={e => setFormData({...formData, checkOut: e.target.value})}
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount (UGX)</Label>
            <Input 
              id="amount" 
              placeholder="150,000" 
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              required 
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;