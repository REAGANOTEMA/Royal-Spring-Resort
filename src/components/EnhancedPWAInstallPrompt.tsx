// 🚀 **Enhanced PWA Install Prompt - Universal Device Support**
// Supports installation on all devices with advanced features

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Monitor, Tablet, Wifi, Star, ChevronRight, Check, Info } from 'lucide-react';

interface PWAInstallPromptProps {
  className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installStep, setInstallStep] = useState(0);

  useEffect(() => {
    // Detect device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
    
    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);
    setIsInstalled(isStandaloneMode);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Show prompt after user interaction
    const timer = setTimeout(() => {
      if (!isStandaloneMode && !isInstalled) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // iOS installation instructions
      setInstallStep(1);
      return;
    }

    if (deferredPrompt) {
      // Android/Chrome installation
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        setInstallStep(2);
      }
    }
  };

  const handleIOSInstall = () => {
    // Add to Home Screen instructions for iOS
    setInstallStep(1);
  };

  const closePrompt = () => {
    setShowPrompt(false);
    setInstallStep(0);
  };

  const getDeviceIcon = () => {
    if (isIOS) return <Smartphone className="w-5 h-5" />;
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad/.test(userAgent)) return <Tablet className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const getInstallText = () => {
    if (isIOS) return "Add to Home Screen";
    if (deferredPrompt) return "Install App";
    return "Available for Install";
  };

  if (isInstalled || isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed bottom-6 right-6 z-50 max-w-sm ${className}`}
        >
          {/* Main Install Prompt */}
          {installStep === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-6 border border-blue-400/20 backdrop-blur-lg"
            >
              <div className="flex items-start gap-4">
                {/* App Icon */}
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2">
                    <img src="/logo.png" alt="Royal Springs" className="w-12 h-12 rounded-xl" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">Royal Springs Resort</h3>
                    <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                      PWA
                    </div>
                  </div>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    Install our app for the best experience with offline access and instant notifications.
                  </p>
                  
                  {/* Device-specific features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      {getDeviceIcon()}
                      <span>Works on your device</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Wifi className="w-3 h-3" />
                      <span>Offline access available</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Star className="w-3 h-3" />
                      <span>4.9★ rating</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleInstall}
                      className="flex-1 bg-white text-blue-600 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      {getInstallText()}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closePrompt}
                      className="bg-white/20 text-white/80 font-medium py-3 px-4 rounded-xl transition-all hover:bg-white/30"
                    >
                      Later
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closePrompt}
                className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </motion.div>
          )}

          {/* iOS Installation Instructions */}
          {installStep === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 border border-blue-200 max-w-md"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Install on iOS</h3>
                <p className="text-slate-600 text-sm">Follow these steps to add to Home Screen</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <p className="text-slate-900 font-medium mb-1">Tap Share Button</p>
                    <p className="text-slate-600 text-sm">Find and tap the share icon in Safari</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <p className="text-slate-900 font-medium mb-1">Add to Home Screen</p>
                    <p className="text-slate-600 text-sm">Scroll down and tap "Add to Home Screen"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <p className="text-slate-900 font-medium mb-1">Confirm Installation</p>
                    <p className="text-slate-600 text-sm">Tap "Add" to complete installation</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInstallStep(0)}
                  className="flex-1 bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all hover:bg-slate-300"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closePrompt}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {installStep === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-6 border border-green-400/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Successfully Installed!</h3>
                <p className="text-white/90 text-sm mb-4">Royal Springs Resort is now on your device</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closePrompt}
                  className="bg-white text-green-600 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Start Using App
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
