"use client";
import React, { useState, useMemo } from 'react';
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

// --- CONFIGURATION ---
const START_DATE = "2023-05-20T00:00:00"; 
    
const CURRENT_USER = {
    name: "Xiaolu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    partnerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
};

interface LoveTimelineProps {
  initialMemories: any[]; // Memories from DB
  initialComments: any[]; // Comments from DB
}

export default function LoveTimeline({ initialMemories, initialComments }: LoveTimelineProps) {
    const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
    
    // Transform Supabase data to App structure
    const processedData = useMemo(() => {
        // If no data, return empty array (we handle empty state in UI)
        if (!initialMemories || initialMemories.length === 0) return [];

        // Group by date
        const grouped = initialMemories.reduce((acc: any, memory: any) => {
            const date = memory.date;
            if (!acc[date]) {
                acc[date] = {
                    date: date,
                    items: [],
                    comments: []
                };
            }
            
            // Map DB fields to UI fields
            acc[date].items.push({
                type: memory.type,
                src: memory.media_url,
                content: memory.content,
                // Use metadata for extra styling if available, else defaults
                size: memory.metadata?.size || 'medium',
                time: new Date(memory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                bg: memory.type === 'note' ? 'bg-pastel-pink/30' : undefined,
                title: memory.metadata?.original_filename, // for PDF
                sizeLabel: memory.metadata?.size ? `${(memory.metadata.size/1024/1024).toFixed(1)} MB` : undefined,
                id: memory.id
            });

            return acc;
        }, {});

        // Attach comments to their respective dates
        initialComments.forEach((comment: any) => {
             const date = comment.memory_date;
             if (grouped[date]) {
                 grouped[date].comments.push({
                     user: comment.author_name,
                     avatar: `bg-${['blue','pink','yellow','green'][comment.author_name.length % 4]}-200`, // Simple avatar color gen
                     text: comment.content,
                     time: new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                 });
             }
        });

        // Convert to array and sort by date desc
        return Object.values(grouped).sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [initialMemories, initialComments]);

    // Initialize activeDate with the most recent date or today
    const [activeDate, setActiveDate] = useState(processedData[0]?.date || new Date().toISOString().split('T')[0]);

    // Safety check if processedData changed and activeDate is no longer valid
    const currentData = processedData.find((d: any) => d.date === activeDate) || { date: activeDate, items: [], comments: [] };
    const displayDate = new Date(activeDate.replace(/-/g,'/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen pb-20 relative font-sans text-slate">
            <BackgroundBlobs />
            <BackgroundDecorations />
            
            <ProfileWidget user={CURRENT_USER} />
            <AddMemoryModal isOpen={isAddMemoryOpen} onClose={() => setIsAddMemoryOpen(false)} />

            <header className="relative z-10 flex flex-col items-center">
                <HeroHighlight user={CURRENT_USER} />
                <LoveTimer startDate={START_DATE} />
                <ContributionHero memories={processedData} />
            </header>

            <div className="flex flex-col lg:flex-row gap-8 relative max-w-7xl mx-auto mt-4 z-10 px-4 md:px-8">
                {/* LEFT RAIL */}
                <div className="hidden lg:block w-72 shrink-0 h-fit">
                    <TimelineTree data={processedData} activeDate={activeDate} onSelect={setActiveDate} />
                </div>

                {/* MAIN CONTENT */}
                <main className="flex-1 w-full min-w-0">
                    {/* Day Header */}
                    <div className="mb-8 flex items-end justify-between bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div>
                            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate mb-2">{displayDate}</h2>
                            <div className="flex gap-2"><span className="bg-pastel-mint px-3 py-1 rounded-full text-xs font-bold text-slate/60 border border-emerald-100">Recorded 🌿</span></div>
                        </div>
                        <button 
                            onClick={() => setIsAddMemoryOpen(true)}
                            className="bg-slate text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-sm group"
                        >
                            <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition"><Icon name="camera" size={16} /></div>
                            <span className="hidden md:inline">Add Memory</span>
                        </button>
                    </div>

                    {/* NEW SCRAPBOOK GRID */}
                    <div key={activeDate} className="relative animate-in fade-in zoom-in-95 duration-500 mb-12">
                        {currentData.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-8 p-4">
                                {currentData.items.map((item: any, idx: number) => <ScrapbookItem key={idx} item={item} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate/40 italic bg-white/30 rounded-[2rem] border border-dashed border-slate/20">
                                <p className="mb-2">No memories recorded for this day.</p>
                                <p className="text-xs">Click "Add Memory" to capture this moment!</p>
                            </div>
                        )}

                        {/* GUESTBOOK (Visual Separation) */}
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
