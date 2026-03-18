"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface VoiceConciergeProps {
  context?: 'guest' | 'staff';
  userName?: string;
}

const VoiceConcierge = ({ context = 'guest', userName }: VoiceConciergeProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const speak = useCallback((text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Daniel'));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.1;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  useEffect(() => {
    if (!isMuted && !hasWelcomed) {
      const welcomeMsg = context === 'guest' 
        ? "Welcome to Royal Springs Resort. I am your AI concierge. How may I assist your stay today?"
        : `Welcome back to the Command Center, ${userName || 'Executive'}. All systems are operational.`;
      speak(welcomeMsg);
      setHasWelcomed(true);
    }
  }, [isMuted, hasWelcomed, context, userName, speak]);

  const toggleVoice = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('voiceMuted', newMuted.toString());
    if (!newMuted) {
      showSuccess("Royal Voice Concierge Activated");
      speak("Voice guidance enabled. I am ready to assist.");
    } else {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      <Button 
        onClick={toggleVoice}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500",
          isMuted ? "bg-slate-800 hover:bg-slate-700" : "bg-blue-600 hover:bg-blue-700 animate-pulse"
        )}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </Button>
      {!isMuted && (
        <div className="absolute -top-12 right-0 bg-white px-4 py-2 rounded-2xl shadow-xl border border-blue-100 whitespace-nowrap animate-bounce">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
            <Mic size={12} /> AI Voice Active
          </p>
        </div>
      )}
    </div>
  );
};

export const useRoyalVoice = () => {
  const speak = (text: string) => {
    const isMuted = localStorage.getItem('voiceMuted') === 'true';
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Daniel'));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };
  return { speak };
};

export default VoiceConcierge;