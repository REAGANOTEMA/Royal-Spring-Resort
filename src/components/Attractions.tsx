// 🎨 **Enhanced Attractions Component - Royal Springs Resort**
// Features attractions, graphics, and 3D effects

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Trees, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Camera, 
  Utensils,
  Sparkles,
  Trophy,
  Users,
  Calendar,
  Wifi,
  Car,
  Plane,
  Phone,
  Mail,
  ChevronRight,
  Play,
  Volume2
} from 'lucide-react';

const Attractions = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const attractions = [
    {
      id: 1,
      title: "Crystal Waterfall Paradise",
      description: "Our breathtaking 50-foot waterfall cascades into natural pools, perfect for meditation and photography.",
      icon: Waves,
      image: "/waterfall1.JPG",
      features: ["Natural Spa", "Photo Spot", "Meditation Area"],
      rating: 4.9,
      visitors: "2,500+ monthly"
    },
    {
      id: 2,
      title: "Tropical Garden Maze",
      description: "Get lost in our 2-acre botanical garden with over 200 species of exotic plants and flowers.",
      icon: Trees,
      image: "/garden-greens.JPG",
      features: ["Guided Tours", "Bird Watching", "Plant Nursery"],
      rating: 4.8,
      visitors: "1,800+ monthly"
    },
    {
      id: 3,
      title: "Infinity Pool Oasis",
      description: "Olympic-sized infinity pool with underwater lighting, swim-up bar, and poolside cabanas.",
      icon: Waves,
      image: "/free-garden.JPG",
      features: ["Pool Bar", "Cabanas", "Night Lighting"],
      rating: 4.9,
      visitors: "3,200+ monthly"
    },
    {
      id: 4,
      title: "Royal Golf Course",
      description: "18-hole championship golf course with panoramic views and professional coaching available.",
      icon: Trophy,
      image: "/hotel-road.JPG",
      features: ["Pro Shop", "Golf Cart", "Club House"],
      rating: 4.7,
      visitors: "1,200+ monthly"
    },
    {
      id: 5,
      title: "Spa & Wellness Center",
      description: "Full-service spa with massage therapy, sauna, steam room, and beauty treatments.",
      icon: Heart,
      image: "/bathroom-hero2.webp",
      features: ["Massage", "Facial", "Body Treatments"],
      rating: 4.9,
      visitors: "900+ monthly"
    },
    {
      id: 6,
      title: "Adventure Sports Complex",
      description: "Tennis courts, volleyball, basketball, and organized adventure activities.",
      icon: Users,
      image: "/hotel-house5.webp",
      features: ["Equipment Rental", "Coaching", "Tournaments"],
      rating: 4.6,
      visitors: "1,500+ monthly"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % attractions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentAttraction = attractions[activeIndex];

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
            Royal <span className="text-blue-600">Attractions</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Discover the extraordinary experiences that await you at Royal Springs Resort
          </p>
        </motion.div>

        {/* Main Attraction Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Featured Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-96 lg:h-full rounded-3xl overflow-hidden shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentAttraction.image}
                  src={currentAttraction.image}
                  alt={currentAttraction.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </AnimatePresence>
              
              {/* Overlay with Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-black mb-2">{currentAttraction.title}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} className={i < Math.floor(currentAttraction.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />
                      ))}
                    </div>
                    <span className="text-lg font-bold">{currentAttraction.rating}</span>
                  </div>
                  <p className="text-lg leading-relaxed mb-4">{currentAttraction.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentAttraction.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-600 text-sm font-medium rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users size={16} />
                      <span className="text-sm">{currentAttraction.visitors} visitors</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <Camera size={18} />
                      Explore
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Attraction List */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-8">All Attractions</h3>
            
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveIndex(index)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl scale-105' 
                    : 'bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    activeIndex === index ? 'bg-white/20' : 'bg-blue-100'
                  }`}>
                    <attraction.icon size={24} className={activeIndex === index ? 'text-white' : 'text-blue-600'} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold mb-2 ${
                      activeIndex === index ? 'text-white' : 'text-slate-900'
                    }`}>
                      {attraction.title}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-3 ${
                      activeIndex === index ? 'text-white/90' : 'text-slate-600'
                    }`}>
                      {attraction.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.floor(attraction.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />
                        ))}
                      </div>
                      <span className={`text-sm font-bold ${
                        activeIndex === index ? 'text-white' : 'text-slate-700'
                      }`}>
                        {attraction.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Features Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { icon: Calendar, label: "Daily Activities", color: "bg-purple-100 text-purple-600" },
            { icon: Utensils, label: "5 Restaurants", color: "bg-orange-100 text-orange-600" },
            { icon: Wifi, label: "Free WiFi", color: "bg-green-100 text-green-600" },
            { icon: Car, label: "Valet Parking", color: "bg-blue-100 text-blue-600" },
            { icon: Plane, label: "Airport Transfer", color: "bg-indigo-100 text-indigo-600" },
            { icon: Phone, label: "24/7 Concierge", color: "bg-pink-100 text-pink-600" },
            { icon: Sparkles, label: "Premium Spa", color: "bg-cyan-100 text-cyan-600" },
            { icon: Trophy, label: "Golf Championship", color: "bg-amber-100 text-amber-600" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${feature.color} p-6 rounded-2xl text-center shadow-lg cursor-pointer`}
            >
              <feature.icon size={32} className="mx-auto mb-3" />
              <p className="text-sm font-bold">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block"
          >
            <h3 className="text-3xl font-black text-slate-900 mb-4">
              Ready for <span className="text-blue-600">Royal</span> Experience?
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Book your stay and discover why we're Uganda's premier luxury destination
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-black rounded-2xl shadow-2xl transition-all flex items-center gap-3"
            >
              <Sparkles size={24} />
              Book Royal Experience
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Attractions;
