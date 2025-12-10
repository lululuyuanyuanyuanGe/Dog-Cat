'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MemoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'photo' | 'video' | 'note' | 'pdf' | 'audio';
  content?: string; 
  mediaUrls?: string[];
  initialIndex?: number;
  time?: string;
  bg?: string;
}

export default function MemoryViewer({ isOpen, onClose, type, content, mediaUrls = [], initialIndex = 0, time, bg }: MemoryViewerProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (mediaUrls.length > 0) setIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (mediaUrls.length > 0) setIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Controls */}
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white z-50 p-2">
            <X size={32} />
          </button>

          {type === 'photo' && mediaUrls.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-4 rounded-full hover:bg-white/10 transition-colors">
                <ChevronLeft size={40} />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-4 rounded-full hover:bg-white/10 transition-colors">
                <ChevronRight size={40} />
              </button>
            </>
          )}

          {/* Content */}
          <motion.div
            key={type === 'photo' ? index : 'static'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-40 max-w-5xl w-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()} 
          >
            {type === 'photo' && mediaUrls[index] && (
                <div className="relative">
                    <img 
                        src={mediaUrls[index]} 
                        alt="Memory" 
                        className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" 
                    />
                    {content && (
                        <div className="absolute -bottom-16 left-0 right-0 text-center">
                            <span className="font-pen text-2xl text-white/90 drop-shadow-md">{content}</span>
                            {mediaUrls.length > 1 && <span className="block text-xs font-sans text-white/40 mt-2">{index + 1} / {mediaUrls.length}</span>}
                        </div>
                    )}
                </div>
            )}

            {type === 'note' && (
                <div 
                    className={`relative p-12 md:p-16 rounded-sm shadow-2xl max-w-2xl w-full rotate-1 flex flex-col ${bg || 'bg-white'}`} 
                >
                    {/* Pin - Matches NoteCard */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-400 shadow-md z-20 border-4 border-white/50"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        <Quote className="text-black/5 w-12 h-12 absolute -top-4 -left-4 -scale-x-100" />
                        
                        <p className="font-hand text-3xl md:text-5xl leading-relaxed text-slate-600 opacity-90 text-center whitespace-pre-wrap mt-8">
                            "{content}"
                        </p>
                        
                        <Quote className="text-black/5 w-12 h-12 absolute -bottom-4 -right-4" />

                        {/* Footer Time */}
                        {time && (
                            <div className="mt-12 pt-6 border-t border-black/5 w-full flex justify-end">
                                <span className="font-mono text-sm text-slate/40">{time}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
