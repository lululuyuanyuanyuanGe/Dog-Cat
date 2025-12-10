import React from 'react';
import { getNoteStyle } from '@/lib/styles';

interface NoteCardProps {
    item: {
        id: string; 
        content: string;
        time: string;
        [key: string]: any;
    };
}

const NoteCard: React.FC<NoteCardProps> = ({ item }) => {
    const style = getNoteStyle(item.id);

    return (
        <div className={`p-6 h-full flex flex-col justify-between relative shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 ${style.bg} ${style.rotate} hover:rotate-0`}>
            
            {/* Decorations */}
            {style.decoration === 'pin-red' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm z-20 border-2 border-white/50"></div>
            )}
            {style.decoration === 'pin-gold' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-400 shadow-sm z-20 border-2 border-yellow-200"></div>
            )}
            {style.decoration === 'tape-pink' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-pink-300/50 backdrop-blur-sm shadow-sm rotate-2"></div>
            )}
            {style.decoration === 'tape-blue' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-sky-300/50 backdrop-blur-sm shadow-sm -rotate-2"></div>
            )}
            {style.decoration === 'clip' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 border-4 border-slate-400 rounded-t-full z-20"></div>
            )}

            <p className="font-hand text-slate-700 text-xl leading-relaxed opacity-90 mt-2 line-clamp-6">
                "{item.content}"
            </p>
            
            <div className="flex justify-between items-center mt-4 border-t border-black/5 pt-2">
                 <div className="flex -space-x-1">
                </div>
                <span className="font-mono text-[10px] text-slate/40">{item.time}</span>
            </div>
        </div>
    );
};

export default NoteCard;