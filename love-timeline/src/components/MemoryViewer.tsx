'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import NoteContent from './NoteContent';

interface MemoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    type: 'photo' | 'video' | 'note' | 'pdf' | 'audio';
    content?: string; 
    mediaUrls?: string[];
    time?: string;
  };
  initialIndex?: number;
}

export default function MemoryViewer({ isOpen, onClose, item, initialIndex = 0 }: MemoryViewerProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (item.mediaUrls && item.mediaUrls.length > 0) setIndex((prev) => (prev + 1) % (item.mediaUrls?.length || 1));
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (item.mediaUrls && item.mediaUrls.length > 0) setIndex((prev) => (prev - 1 + (item.mediaUrls?.length || 1)) % (item.mediaUrls?.length || 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 text-white/50 hover:text-white z-50 p-2 cursor-pointer">
            <X size={32} />
          </button>

          {item.type === 'photo' && item.mediaUrls && item.mediaUrls.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-4 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronLeft size={40} />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-4 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <motion.div
            key={item.type === 'photo' ? index : 'static'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-40 max-w-5xl w-full flex items-center justify-center p-4"
          >
            {item.type === 'photo' && item.mediaUrls && item.mediaUrls[index] && (
                <div 
                    className="relative cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img 
                        src={item.mediaUrls[index]} 
                        alt="Memory" 
                        className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" 
                    />
                    {item.content && (
                        <div className="absolute -bottom-16 left-0 right-0 text-center">
                            <span className="font-pen text-2xl text-white/90 drop-shadow-md">{item.content}</span>
                            {item.mediaUrls.length > 1 && <span className="block text-xs font-sans text-white/40 mt-2">{index + 1} / {item.mediaUrls.length}</span>}
                        </div>
                    )}
                </div>
            )}

            {item.type === 'note' && (
                <NoteContent 
                    item={{ 
                        ...item, 
                        content: item.content || '', 
                        time: item.time || '' 
                    }} 
                    viewMode={true} 
                    onClick={(e) => e.stopPropagation()} 
                />
            )}

            {item.type === 'pdf' && item.mediaUrls && item.mediaUrls[0] && (
                <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden relative flex flex-col">
                    <iframe 
                        src={item.mediaUrls[0]} 
                        className="w-full flex-1"
                        title="PDF Viewer"
                    />
                    <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-slate-600 truncate max-w-[70%]">{item.content || 'Document'}</span>
                        <a 
                            href={item.mediaUrls[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-coral text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-rose-400 transition-colors"
                        >
                            Open / Download
                        </a>
                    </div>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
