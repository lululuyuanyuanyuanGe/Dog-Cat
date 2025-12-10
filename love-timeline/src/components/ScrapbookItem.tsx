"use client"

import React, { useState, useEffect } from 'react';
import PhotoCard from './PhotoCard';
import NoteCard from './NoteCard';
import VideoCard from './VideoCard';
import PdfCard from './PdfCard';
import { User, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MemoryType = 'photo' | 'note' | 'video' | 'pdf' | 'audio';

interface ScrapbookItemProps {
  item: {
    type: MemoryType;
    size: 'small' | 'medium' | 'large' | 'wide';
    id: string; 
    author?: {
        name: string;
        avatar?: string;
    };
    [key: string]: any; 
  };
  onDeleteOptimistic: (id: string) => void;
}

const ScrapbookItem: React.FC<ScrapbookItemProps> = ({ item, onDeleteOptimistic }) => {
    const router = useRouter();
    const [rotation, setRotation] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const getSpan = () => {
        if (item.size === 'large') return 'col-span-1 md:col-span-2 md:row-span-2';
        if (item.size === 'wide') return 'col-span-1 md:col-span-2';
        return 'col-span-1';
    };

    useEffect(() => {
        const randomRotation = Math.floor(Math.random() * 6) - 3;
        setRotation(randomRotation);
    }, []); 

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this memory? This cannot be undone.')) return;
        
        setIsDeleting(true);
        
        // Optimistic Delete: Remove from UI immediately
        onDeleteOptimistic(item.id);

        try {
            const res = await fetch(`/api/memories/${item.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Could not delete memory.');
            // Ideally rollback here by re-fetching or reloading page
            window.location.reload(); 
        }
    };

    if (isDeleting) {
        return null; // Don't render anything if deleting (though parent usually unmounts it first)
    }

    return (
        <div
            className={`relative group transition-all duration-300 ${getSpan()}`}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className="w-full h-full hover:scale-[1.02] hover:rotate-0 transition-transform duration-300 ease-out hover:z-10 relative">
                
                {/* Controls (Author + Delete) */}
                <div className="absolute -top-3 left-0 right-0 z-20 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    
                    {/* Author Badge */}
                    {item.author ? (
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1 pr-3 rounded-full shadow-md border border-white/50 pointer-events-auto">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                                {item.author.avatar ? (
                                    <img src={item.author.avatar} alt={item.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} className="text-slate-400" />
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">
                                {item.author.name}
                            </span>
                        </div>
                    ) : <div></div>}

                    {/* Delete Button */}
                    <button 
                        onClick={handleDelete}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border border-white/50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors pointer-events-auto"
                        title="Delete Memory"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {item.type === 'photo' && <PhotoCard item={item} />}
                {item.type === 'note' && <NoteCard item={item} />}
                {item.type === 'video' && <VideoCard item={item} />}
                {item.type === 'pdf' && <PdfCard item={item} />}
                {item.type === 'audio' && (
                    <div className="w-full h-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center border border-slate-100">
                        <span className="text-slate-400 text-xs font-mono">Audio Clip</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrapbookItem;