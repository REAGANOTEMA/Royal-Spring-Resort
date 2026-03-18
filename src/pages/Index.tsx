"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, Palmtree, Utensils, BedDouble, Camera, Leaf, Waves, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=2000',
    title: 'Tropical Paradise',
    subtitle: 'Experience the serenity of our lush palm gardens and vibrant tropical flora.',
  },
  {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=2000',
    title: 'Royal Comfort',
    subtitle: 'Indulge in our masterfully designed suites featuring the finest luxury linens.',
  },
  {
    url: 'https://images.unsplash.com/photo-1598502136455-c959d7715b21?auto=format&fit=crop&q=80&w=2000',
    title: 'Garden Sanctuary',
    subtitle: 'Relax in our serene outdoor lounges surrounded by majestic greenery.',
  },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:inline uppercase">Royal Springs</span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="#experience" className="text-sm font-bold text-slate-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Experience</a>
          <a href="#dining" className="text-sm font-bold text-slate-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Dining</a>
          <Link to="/login">
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 font-black rounded-xl">STAFF PORTAL</Button>
          </Link>
          <Link to="/book">
            <Button className="bg-blue-700 hover:bg-blue-800 font-black rounded-xl shadow-lg shadow-blue-900/20 px-8">BOOK NOW</Button>
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu size={28} /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex flex-col gap-6 mt-12">
                <Link to="/book" className="w-full"><Button className="w-full bg-blue-700 font-black h-14 rounded-2xl">BOOK NOW</Button></Link>
                <Link to="/login" className="w-full"><Button variant="outline" className="w-full border-blue-700 text-blue-700 font-black h-14 rounded-2xl">STAFF PORTAL</Button></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={heroSlides[currentSlide].url} alt={heroSlides[currentSlide].title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center mb-6">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
          </motion.div>
          <motion.h1 key={`t-${currentSlide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-9xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
            {heroSlides[currentSlide].title}
          </motion.h1>
          <motion.p key={`s-${currentSlide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium">
            {heroSlides[currentSlide].subtitle}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-12 h-16 font-black rounded-2xl shadow-2xl">RESERVE NOW</Button></Link>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-slate-900 text-xl px-12 h-16 font-black rounded-2xl">EXPLORE GARDENS</Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Palmtree size={40} /></div>
              <h3 className="text-2xl font-black">Lush Gardens</h3>
              <p className="text-slate-500">Acres of meticulously maintained tropical vegetation and serene walking paths.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><BedDouble size={40} /></div>
              <h3 className="text-2xl font-black">Luxury Suites</h3>
              <p className="text-slate-500">Experience the pinnacle of comfort with our premium bedding and garden views.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Utensils size={40} /></div>
              <h3 className="text-2xl font-black">Fine Dining</h3>
              <p className="text-slate-500">Authentic Ugandan delicacies and international gourmet cuisine served in our garden.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;