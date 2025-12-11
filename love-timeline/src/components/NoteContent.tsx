import React from 'react';
import { getNoteStyle } from '@/lib/styles';

interface NoteContentProps {
  item: { id: string; content: string; time: string; [key: string]: any };
  viewMode?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const NoteContent: React.FC<NoteContentProps> = ({ item, viewMode = false, onClick }) => {
  const style = getNoteStyle(item.id, item.metadata?.styleId);
  
  // Dimensions for decorations
  const tapeClass = viewMode ? "w-32 h-8 -top-5" : "w-16 h-5 -top-3";
  const pinClass = viewMode ? "w-6 h-6 -top-3 border-2" : "w-4 h-4 -top-2 border-2";
  const clipClass = viewMode ? "w-12 h-12 -top-6 border-4" : "w-8 h-8 -top-4 border-4";

  return (
    <div 
        className={`relative flex flex-col justify-between transition-all duration-300 ${style.classes} ${viewMode ? 'p-12 w-full max-w-2xl min-h-[400px] shadow-2xl rotate-0' : `p-6 h-full hover:-translate-y-1 hover:rotate-0 hover:shadow-xl ${style.rotate}`} ${onClick ? 'cursor-zoom-in' : 'cursor-default'}`}
        style={style.css}
        onClick={onClick}
    >
        {/* Decorations */}
        {style.decoration === 'pin-red' && <div className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-red-400 shadow-md border-white/50 z-20 ${pinClass}`}></div>}
        {style.decoration === 'pin-gold' && <div className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 shadow-md border-yellow-200 z-20 ${pinClass}`}></div>}
        {style.decoration === 'pin-teal' && <div className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-teal-400 shadow-md border-white/50 z-20 ${pinClass}`}></div>}
        
        {style.decoration === 'tape-pink' && <div className={`absolute left-1/2 -translate-x-1/2 bg-pink-300/50 backdrop-blur-sm shadow-sm rotate-2 ${tapeClass}`}></div>}
        {style.decoration === 'tape-blue' && <div className={`absolute left-1/2 -translate-x-1/2 bg-sky-300/50 backdrop-blur-sm shadow-sm -rotate-2 ${tapeClass}`}></div>}
        {style.decoration === 'tape-purple' && <div className={`absolute left-1/2 -translate-x-1/2 bg-purple-300/50 backdrop-blur-sm shadow-sm rotate-1 ${tapeClass}`}></div>}
        {style.decoration === 'tape-green' && <div className={`absolute left-1/2 -translate-x-1/2 bg-emerald-300/50 backdrop-blur-sm shadow-sm -rotate-1 ${tapeClass}`}></div>}
        {style.decoration === 'tape-yellow' && <div className={`absolute left-1/2 -translate-x-1/2 bg-yellow-300/50 backdrop-blur-sm shadow-sm rotate-2 ${tapeClass}`}></div>}
        
        {style.decoration === 'clip' && <div className={`absolute left-1/2 -translate-x-1/2 border-slate-400 rounded-t-full z-20 ${clipClass}`}></div>}
        {style.decoration === 'clip-gold' && <div className={`absolute left-1/2 -translate-x-1/2 border-amber-400 rounded-t-full z-20 ${clipClass}`}></div>}

        <div className="flex-1 flex items-center justify-center">
            <p className={`font-hand leading-relaxed text-center ${viewMode ? 'text-3xl md:text-4xl whitespace-pre-wrap opacity-90' : 'text-xl font-bold opacity-100 drop-shadow-md line-clamp-6 pointer-events-none'}`}>
                "{item.content}"
            </p>
        </div>
        
        <div className={`flex justify-end items-center border-t border-current/10 pt-4 ${viewMode ? 'mt-8' : 'mt-4'}`}>
            <span className="font-mono text-[0.7em] opacity-60 uppercase tracking-widest">{item.time}</span>
        </div>
    </div>
  );
};

export default NoteContent;