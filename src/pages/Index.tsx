"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Leaf,
  Menu,
  Waves,
  Wifi,
  ShieldCheck,
  Utensils,
  BedDouble,
  Camera,
  Palmtree,
  Coffee,
  Pizza,
  UtensilsCrossed,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000',
    title: 'Royal Spring Hotel Iganga',
    subtitle: 'Iconic red-roofed luxury surrounded by majestic palm trees and vibrant flowers.',
  },
  {
    url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=2000',
    title: 'Authentic Fried Fish',
    subtitle: 'Savor our signature crispy fried fish, a true Ugandan delicacy.',
  },
  {
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000',
    title: 'Roasted Meat & Salads',
    subtitle: 'Perfectly seasoned roasted meats served with fresh, vibrant garden salads.',
  },
  {
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=2000',
    title: 'Gourmet Burgers & Snacks',
    subtitle: 'Delight in our juicy hamburgers and a wide variety of crispy snacks.',
  },
  {
    url: 'https://images.unsplash.com/photo-1598502136455-c959d7715b21?auto=format&fit=crop&q=80&w=2000',
    title: 'Serene Garden Seating',
    subtitle: 'Relax in our flat, lush compounds with plenty of comfortable seating under the trees.',
  },
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', title: 'Red-Roofed Architecture' },
  { url: 'https://images.unsplash.com/photo-1598502136455-c959d7715b21?auto=format&fit=crop&q=80&w=800', title: 'Garden Seating' },
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', title: 'Lush Compounds' },
  { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', title: 'Luxury Interiors' },
  { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800', title: 'Infinity Pool' },
  { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800', title: 'Tropical Flora' },
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
      {/* Navigation */}
      <nav className="h-20 border-b px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">Royal Springs Resort</span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="#experience" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Experience</a>
          <a href="#dining" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Dining</a>
          <a href="#gallery" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">Gallery</a>
          <Link to="/login">
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 font-bold">Staff Portal</Button>
          </Link>
          <Link to="/book">
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold shadow-lg shadow-blue-900/20">Book Now</Button>
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={28} className="text-slate-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-white">
              <div className="flex flex-col gap-6 mt-12">
                <a href="#experience" className="text-lg font-bold text-slate-900">Experience</a>
                <a href="#dining" className="text-lg font-bold text-slate-900">Dining</a>
                <a href="#gallery" className="text-lg font-bold text-slate-900">Gallery</a>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full border-blue-700 text-blue-700 font-bold h-12">Staff Portal</Button>
                </Link>
                <Link to="/book" className="w-full">
                  <Button className="w-full bg-blue-700 font-bold h-12">Book Now</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img
              src={heroSlides[currentSlide].url}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="flex gap-1.5 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
            </div>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tighter"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-10 h-16 w-full sm:w-auto font-bold rounded-2xl shadow-2xl transition-transform hover:scale-105">
                Reserve Your Stay
              </Button>
            </Link>
            <a href="#experience">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-slate-900 text-xl px-10 h-16 font-bold rounded-2xl w-full sm:w-auto transition-transform hover:scale-105">
                Explore The Resort
              </Button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-12 h-1.5 rounded-full transition-all duration-500",
                currentSlide === i ? "bg-blue-500 w-20" : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Resort Gallery</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A visual journey through our iconic red-roofed architecture and lush garden landscapes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group h-80 rounded-[2rem] overflow-hidden shadow-2xl"
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-xl font-bold tracking-widest uppercase">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;