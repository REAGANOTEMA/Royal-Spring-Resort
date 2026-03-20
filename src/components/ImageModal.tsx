import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  image: {
    src: string;
    title: string;
    category: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  image, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  currentIndex, 
  totalImages 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onPrevious();
          break;
        case 'ArrowRight':
          if (currentIndex < totalImages - 1) onNext();
          break;
        case 'Enter':
        case ' ':
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, totalImages, onPrevious, onNext, onClose, isFullscreen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="relative max-w-7xl max-h-[90vh] w-full flex flex-col">
        {/* Header with controls */}
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-t-2xl">
          <button
            onClick={onPrevious}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
            title="Previous image (←)"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center flex-1 px-4">
            <h3 className="text-white font-bold text-xl mb-1">{image.title}</h3>
            <p className="text-white/80 text-sm">{image.category}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: totalImages }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-white w-8' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={onNext}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === totalImages - 1}
            title="Next image (→)"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main image container */}
        <div className={`flex-1 flex items-center justify-center p-4 bg-black/20 ${isFullscreen ? 'bg-black' : ''} rounded-b-2xl`}>
          <div className="relative group">
            <img
              src={image.src}
              alt={image.title}
              className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 ${
                isFullscreen ? 'scale-100' : 'scale-100'
              }`}
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{ cursor: isFullscreen ? 'zoom-out' : 'zoom-in' }}
            />
            
            {/* Zoom indicator */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">
                {isFullscreen ? 'Click to exit fullscreen' : 'Click to fullscreen'}
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110 z-10"
          title="Close (Esc)"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 left-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110 z-10"
          title="Toggle fullscreen (Space)"
        >
          <Maximize2 className="w-6 h-6 text-white" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
          <p className="text-white text-sm font-medium">
            {currentIndex + 1} / {totalImages}
          </p>
        </div>

        {/* Navigation hints */}
        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full">
          <p className="text-white text-xs font-medium">
            Use arrow keys to navigate
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
