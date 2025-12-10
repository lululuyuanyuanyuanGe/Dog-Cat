import React from 'react';
import Icon from './Icon';

interface NoteCardProps {
    item: {
        content: string;
        bg?: string;
        time: string;
    };
}

const NoteCard: React.FC<NoteCardProps> = ({ item }) => (
    <div className={`p-6 h-full flex flex-col justify-between relative shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 ${item.bg || 'bg-white'} rotate-[-1deg] hover:rotate-0`}>
        {/* Pin or Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm z-20 border-2 border-white/50"></div>

        <p className="font-hand text-slate text-xl leading-relaxed opacity-90 mt-2">"{item.content}"</p>
        <div className="flex justify-between items-center mt-4 border-t border-black/5 pt-2">
             <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center text-[10px]">❤️</div>
            </div>
            <span className="font-mono text-[10px] text-slate/40">{item.time}</span>
        </div>
    </div>
);

export default NoteCard;