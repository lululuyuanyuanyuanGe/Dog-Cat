"use client"

import React, { useState, useEffect, useRef } from 'react';
import PhotoCard from './PhotoCard';
import NoteCard from './NoteCard';
import VideoCard from './VideoCard';
import PdfCard from './PdfCard';
import { User, Trash2, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DeleteConfirmModal from './DeleteConfirmModal';
import MemoryViewer from './MemoryViewer';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrapbookItemProps {
  item: {
    type: 'photo' | 'note' | 'video' | 'pdf' | 'audio';
    size: 'small' | 'medium' | 'large' | 'wide';
    id: string; 
    user_id?: string;
    author?: {
        name: string;
        avatar?: string;
    };
    likes?: number;
    media_urls?: string[];
    src?: string;
    content?: string;
    time?: string;
    [key: string]: any; 
  };
  onDeleteOptimistic: (id: string) => void;
  onLikeOptimistic: (id: string) => void;
  onUnlikeOptimistic: (id: string) => void;
  currentUser?: any;
}

const ScrapbookItem: React.FC<ScrapbookItemProps> = ({ item, onDeleteOptimistic, onLikeOptimistic, onUnlikeOptimistic, currentUser }) => {
    const router = useRouter();
    const [rotation, setRotation] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    
    const [viewerIndex, setViewerIndex] = useState(0);
    
    const [hasLiked, setHasLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(item.likes || 0);
    
    const likeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const serverLikedState = useRef(false); 

    const isOwner = currentUser && (currentUser.id === item.user_id || currentUser.display_name === item.author?.name);

    // Ref for handling single vs double click
    const interactionTimer = useRef<NodeJS.Timeout | null>(null);
    const clickCount = useRef(0);

    const getSpan = () => {
        if (item.size === 'large') return 'col-span-1 md:col-span-2 md:row-span-2';
        if (item.size === 'wide') return 'col-span-1 md:col-span-2';
        if (item.media_urls && item.media_urls.length >= 3) return 'col-span-1 md:col-span-2 md:row-span-2';
        if (item.media_urls && item.media_urls.length === 2) return 'col-span-1 md:col-span-2';
        return 'col-span-1';
    };

    useEffect(() => {
        setLocalLikes(item.likes || 0);
    }, [item.likes]);

    useEffect(() => {
        const randomRotation = Math.floor(Math.random() * 6) - 3;
        setRotation(randomRotation);
        
        const liked = localStorage.getItem(`liked_${item.id}`) === 'true';
        setHasLiked(liked);
        serverLikedState.current = liked;
    }, [item.id]); 

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const triggerLike = () => {
        const nextState = !hasLiked;
        setHasLiked(nextState); 
        localStorage.setItem(`liked_${item.id}`, String(nextState));
        setLocalLikes(prev => nextState ? prev + 1 : Math.max(prev - 1, 0));

        if (nextState) {
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 800);
            onLikeOptimistic(item.id);
        } else {
            onUnlikeOptimistic(item.id);
        }

        if (likeTimeoutRef.current) clearTimeout(likeTimeoutRef.current);

        likeTimeoutRef.current = setTimeout(async () => {
            const currentServerState = serverLikedState.current;
            if (nextState === currentServerState) return; 
            try {
                if (nextState) await fetch(`/api/memories/${item.id}/like`, { method: 'POST' });
                else await fetch(`/api/memories/${item.id}/like`, { method: 'DELETE' });
                serverLikedState.current = nextState;
            } catch (error) { console.error("Like sync failed", error); }
        }, 1000); 
    };
    
    // Unified handler for all clicks on the card
    const handleInteraction = (e: React.MouseEvent, index: number = 0) => {
        e.stopPropagation();
        clickCount.current++;

        if (clickCount.current === 1) {
            interactionTimer.current = setTimeout(() => {
                // Timer finished, it was a single click
                clickCount.current = 0;
                setViewerIndex(index);
                setShowViewer(true);
            }, 250); // 250ms window to detect double-click
        } else if (clickCount.current === 2) {
            // It's a double click
            if(interactionTimer.current) clearTimeout(interactionTimer.current);
            clickCount.current = 0;
            triggerLike();
        }
    };


    const executeDelete = async () => {
        setIsDeleting(true);
        onDeleteOptimistic(item.id);
        try {
            const res = await fetch(`/api/memories/${item.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            router.refresh();
        } catch (err) { console.error(err); alert('Could not delete memory.'); window.location.reload(); }
    };

    if (isDeleting) return null;

    const images = item.media_urls && item.media_urls.length > 0 ? item.media_urls : (item.src ? [item.src] : []);
    
    return (
        <>
            <div
                className={`relative group transition-all duration-300 ${getSpan()} select-none`}
                style={{ transform: `rotate(${rotation}deg)` }}
                onClick={handleInteraction} // Use the unified handler on the wrapper
            >
                <div className="w-full h-full hover:scale-[1.02] hover:rotate-0 transition-transform duration-300 ease-out hover:z-10 relative cursor-pointer">
                    
                    <div className="absolute -top-3 left-0 right-0 z-20 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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

                        {isOwner && (
                            <button 
                                onClick={handleDeleteClick}
                                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border border-white/50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors pointer-events-auto"
                                title="Delete Memory"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    {((localLikes > 0) || hasLiked) && (
                        <div className="absolute -bottom-2 -right-2 z-20 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md border border-rose-100 flex items-center gap-1">
                            <Heart size={12} className={`transition-colors ${hasLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400'} ${localLikes > 0 ? 'scale-110' : ''}`} />
                            <span className="text-[10px] font-bold text-slate-600">{localLikes}</span>
                        </div>
                    )}

                    <AnimatePresence>
                        {showHeart && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1, rotate: [0, -10, 10, 0] }}
                                exit={{ scale: 0.5, opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                            >
                                <Heart size={80} className="text-white fill-rose-500 drop-shadow-xl" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {item.type === 'photo' && <PhotoCard item={item} onSingleClick={handleInteraction} />}
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

            <DeleteConfirmModal 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                onConfirm={executeDelete} 
            />

            {/* Pass the entire item to the viewer now */}
            <MemoryViewer 
                isOpen={showViewer} 
                onClose={() => setShowViewer(false)} 
                item={{ ...item, mediaUrls: images }}
                initialIndex={viewerIndex}
            />
        </>
    );
};

export default ScrapbookItem;