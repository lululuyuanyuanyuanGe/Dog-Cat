"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Icon from '@/components/Icon';
import HeroHighlight from '@/components/HeroHighlight';
import LoveTimer from '@/components/LoveTimer';
import ContributionHero from '@/components/ContributionHero';
import ScrapbookItem from '@/components/ScrapbookItem';
import TimelineTree from '@/components/TimelineTree';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import BackgroundDecorations from '@/components/BackgroundDecorations';
import ProfileWidget from '@/components/ProfileWidget';
import AddMemoryModal from '@/components/AddMemoryModal';
import { useUploadQueue } from '@/hooks/useUploadQueue';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const START_DATE = "2025-12-08T00:00:00"; 
const PLACEHOLDER_AVATAR = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop";

const DAY_STYLES: { [key: number]: { label: string; color: string } } = {
  0: { label: 'Sunday ☀️', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  1: { label: 'Monday 🚀', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  2: { label: 'Tuesday 🛠️', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  3: { label: 'Wednesday 🐫', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  4: { label: 'Thursday 💡', color: 'bg-violet-100 text-violet-600 border-violet-200' },
  5: { label: 'Friday 🎉', color: 'bg-pink-100 text-pink-600 border-pink-200' },
  6: { label: 'Saturday 🛋️', color: 'bg-rose-100 text-rose-600 border-rose-200' },
};

interface LoveTimelineProps {
  initialMemories: any[]; 
  initialComments: any[]; 
  partners: any[]; 
}

export default function LoveTimeline({ initialMemories, initialComments, partners }: LoveTimelineProps) {
    const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
    const [memories, setMemories] = useState(initialMemories);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { queue, addToQueue } = useUploadQueue();

    useEffect(() => {
        setMemories(initialMemories);
    }, [initialMemories]);

    const handleAddOptimistic = (newMemory: any) => {
        setMemories(prev => {
            const updated = [newMemory, ...prev];
            return updated.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (dateB !== dateA) return dateB - dateA;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
        });
    };

    const handleDeleteOptimistic = (id: string) => {
        setMemories(prev => prev.filter(m => m.id !== id));
    };

    const handleLikeOptimistic = (id: string) => {
        setMemories(prev => prev.map(m => 
            m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m
        ));
    };

    const handleUnlikeOptimistic = (id: string) => {
        setMemories(prev => prev.map(m => 
            m.id === id ? { ...m, likes: Math.max((m.likes || 0) - 1, 0) } : m
        ));
    };

    const heroData = useMemo(() => {
        const p1 = partners?.[0];
        const p2 = partners?.[1];
        return {
            avatar: p1?.avatar_url || PLACEHOLDER_AVATAR,
            partnerAvatar: p2?.avatar_url || PLACEHOLDER_AVATAR,
            name1: p1?.display_name || "Partner 1",                                                                
            name2: p2?.display_name || "Partner 2",
        };
    }, [partners]);

    const processedData = useMemo(() => {
        if (!memories || memories.length === 0) return [];

        const grouped = memories.reduce((acc: any, memory: any) => {
            const date = memory.date;
            if (!acc[date]) {
                acc[date] = { date: date, items: [], comments: [] };
            }
            
            const author = memory.author || {
                name: memory.users?.display_name || "Unknown",
                avatar: memory.users?.avatar_url
            };

            // Attempt to Group with Last Item
            const lastItem = acc[date].items[acc[date].items.length - 1];
            const isGroupable = 
                memory.type === 'photo' && 
                lastItem && 
                lastItem.type === 'photo' &&
                lastItem.author.name === author.name &&
                lastItem.content === memory.content && // Same caption
                // Time difference < 2 minutes (allows for sequential upload lag)
                Math.abs(new Date(lastItem.raw_created_at).getTime() - new Date(memory.created_at).getTime()) < 120000;

            if (isGroupable) {
                // Merge into existing item
                lastItem.media_urls.push(memory.media_url);
                // We keep the ID of the 'parent' (first/newest item) for likes/deletes
                // This means 'liking' the group counts towards the first photo only? 
                // Or we treat it as a collection. For now, simple.
            } else {
                // New Item
                acc[date].items.push({
                    type: memory.type,
                    src: memory.media_url,
                    media_urls: memory.type === 'photo' ? [memory.media_url] : undefined, // Initialize array
                    content: memory.content,
                    size: memory.metadata?.size || 'medium',
                    time: new Date(memory.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    bg: memory.type === 'note' ? 'bg-pastel-pink/30' : undefined,
                    title: memory.metadata?.original_filename,
                    sizeLabel: memory.metadata?.size ? `${(memory.metadata.size/1024/1024).toFixed(1)} MB` : undefined,
                    id: memory.id,
                    likes: memory.likes || 0,
                    author: author,
                    raw_created_at: memory.created_at // Helper for grouping
                });
            }

            return acc;
        }, {});

        initialComments.forEach((comment: any) => {
             const date = comment.memory_date;
             if (grouped[date]) {
                 grouped[date].comments.push({
                     user: comment.author_name,
                     avatar: `bg-${['blue','pink','yellow','green'][comment.author_name.length % 4]}-200`,
                     text: comment.content,
                     time: new Date(comment.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                 });
             }
        });

        return Object.values(grouped).sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [memories, initialComments]);

    const [activeDate, setActiveDate] = useState(processedData[0]?.date || new Date().toISOString().split('T')[0]);
    const selectedYear = new Date(activeDate.replace(/-/g, '/')).getFullYear();
    const currentData = processedData.find((d: any) => d.date === activeDate) || { date: activeDate, items: [], comments: [] };
    const displayDate = new Date(activeDate.replace(/-/g,'/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const dayOfWeek = new Date(activeDate.replace(/-/g, '/')).getDay();
    const dayStyle = DAY_STYLES[dayOfWeek] || DAY_STYLES[0];

    const activeQueue = queue.filter(q => q.status !== 'completed' || (q.status === 'completed' && queue.length > 0)); 

    return (
        <div className="min-h-screen pb-20 relative font-sans text-slate">
            <BackgroundBlobs />
            <BackgroundDecorations />
            
            <ProfileWidget 
                initialUser={partners?.[0]} 
                onUserChange={setCurrentUser} 
            />
            
            <AddMemoryModal 
                isOpen={isAddMemoryOpen} 
                onClose={() => setIsAddMemoryOpen(false)} 
                onAddOptimistic={handleAddOptimistic} 
                currentUser={currentUser} 
                addToQueue={addToQueue} 
            />

            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {queue.map((item) => (
                    <div key={item.id} className={`bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border flex items-center gap-3 w-72 transition-all duration-300 pointer-events-auto ${item.status === 'error' ? 'border-red-200 bg-red-50' : 'border-white'}`}>
                        <div className="bg-slate-100 p-2 rounded-lg">
                            {item.status === 'uploading' ? (
                                <Loader2 size={20} className="animate-spin text-coral" />
                            ) : item.status === 'error' ? (
                                <AlertCircle size={20} className="text-red-500" />
                            ) : item.status === 'completed' ? (
                                <CheckCircle2 size={20} className="text-green-500" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">
                                {item.type === 'note' ? 'Uploading Note...' : `Uploading ${item.files.length} items...`}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                                {item.status === 'error' ? 'Failed' : item.status === 'completed' ? 'Done' : 'Processing'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <header className="relative z-10 flex flex-col items-center">
                <HeroHighlight user={heroData} />
                <LoveTimer startDate={START_DATE} />
                <ContributionHero memories={processedData} year={selectedYear} />
            </header>

            <div className="flex flex-col lg:flex-row gap-8 relative max-w-7xl mx-auto mt-4 z-10 px-4 md:px-8">
                <div className="hidden lg:block w-72 shrink-0 h-fit">
                    <TimelineTree data={processedData} activeDate={activeDate} onSelect={setActiveDate} />
                </div>

                <main className="flex-1 w-full min-w-0">
                    <div className="mb-8 flex items-end justify-between bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div>
                            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate mb-2">{displayDate}</h2>
                            <div className="flex gap-2">
                                <span className={`${dayStyle.color} px-3 py-1 rounded-full text-xs font-bold border shadow-sm`}>
                                    {dayStyle.label}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsAddMemoryOpen(true)}
                            className="bg-slate text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-sm group"
                        >
                            <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition"><Icon name="camera" size={16} /></div>
                            <span className="hidden md:inline">Add Memory</span>
                        </button>
                    </div>

                    <div key={activeDate} className="relative animate-in fade-in zoom-in-95 duration-500 mb-12">
                        {currentData.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-8 p-4">
                                {currentData.items.map((item: any, idx: number) => (
                                    <ScrapbookItem 
                                        key={idx} 
                                        item={item} 
                                        onDeleteOptimistic={handleDeleteOptimistic} 
                                        onLikeOptimistic={handleLikeOptimistic}
                                        onUnlikeOptimistic={handleUnlikeOptimistic}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate/40 italic bg-white/30 rounded-[2rem] border border-dashed border-slate/20">
                                <p className="mb-2">No memories recorded for this day.</p>
                                <p className="text-xs">Click "Add Memory" to capture this moment!</p>
                            </div>
                        )}

                        <div className="mt-12 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-slate/50 uppercase tracking-widest flex items-center gap-2">
                                    <div className="bg-pastel-blue p-1.5 rounded-lg"><Icon name="message" size={14} className="text-slate" /></div> Love Notes
                                </h3>
                                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-slate/40 border border-slate/5 shadow-sm">{currentData.comments?.length || 0} NOTES</span>
                            </div>
                            <div className="space-y-4 mb-8 pl-2 border-l-2 border-slate/10">
                                {(currentData.comments && currentData.comments.length > 0) ? currentData.comments.map((comment: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className={`w-10 h-10 rounded-full ${comment.avatar} flex-shrink-0 border-2 border-white shadow-md flex items-center justify-center text-lg`}>😊</div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-sm text-slate">{comment.user}</span>
                                                <span className="text-[10px] font-mono text-gray-400 opacity-50">{comment.time}</span>
                                            </div>
                                            <p className="text-sm text-slate/70 leading-relaxed bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border border-gray-50">{comment.text}</p>
                                        </div>
                                    </div>
                                )) : <div className="text-sm text-slate/40 italic pl-2">No comments yet. Be the first!</div>}
                            </div>
                            <div className="relative group">
                                <input type="text" placeholder="Send them some love..." className="w-full bg-white border-2 border-white focus:border-coral/30 rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all placeholder:text-slate/30" />
                                <button className="absolute right-2 top-2 bottom-2 bg-gradient-to-tr from-coral to-rose-400 text-white w-12 rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-coral/30"><Icon name="send" size={18} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="h-32 flex flex-col items-center justify-center text-slate/30 text-sm font-hand mt-8 gap-2">
                        <Icon name="heart" size={16} /> To be continued...
                    </div>
                </main>
            </div>
        </div>
    );
};
