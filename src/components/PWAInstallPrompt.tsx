import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PWAInstallPromptProps {
  onClose: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt after a delay for better UX
    const timer = setTimeout(() => {
      if (!isIOSDevice && !deferredPrompt) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
      onClose();
    }
  };

  const handleIOSInstall = () => {
    // For iOS, we show instructions
    setShowPrompt(false);
    onClose();
    // You could show a modal with iOS instructions here
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowPrompt(false);
            onClose();
          }}
          className="absolute top-2 right-2"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Install Royal Springs</h3>
            <p className="text-sm text-slate-600">
              {isIOS ? 
                "Add to home screen for quick access" : 
                "Install our app for the best experience"
              }
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {isIOS ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                <strong>iPhone/iPad:</strong><br />
                1. Tap Share button <span className="text-blue-600">⎋</span><br />
                2. Scroll down and tap "Add to Home Screen"<br />
                3. Tap "Add" to confirm
              </p>
              <Button onClick={handleIOSInstall} className="w-full">
                Got it!
              </Button>
            </div>
          ) : (
            <Button onClick={handleInstall} className="w-full" disabled={!deferredPrompt}>
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
