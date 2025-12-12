"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import LoginModal from '@/components/LoginModal';
import UploadStatus from '@/components/UploadStatus';
import { useUploadQueue } from '@/hooks/useUploadQueue';
import { Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

const START_DATE = "2025-12-01T00:00:00"; 
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
    const router = useRouter();
    const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [memories, setMemories] = useState(initialMemories);
    const [comments, setComments] = useState(initialComments);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { queue, addToQueue } = useUploadQueue();
    const mainContentRef = useRef<HTMLElement>(null);
    
    // --- NEW: State for Comments ---
    const [commentAuthor, setCommentAuthor] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        setMemories(initialMemories);
        setComments(initialComments);
    }, [initialMemories, initialComments]);

    // --- NEW: Comment Submission Logic ---
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const author = commentAuthor.trim() || 'A Guest';
        const content = commentContent.trim();
        if (!content) return;

        setIsSubmittingComment(true);

        const tempId = `temp-comment-${Date.now()}`;
        const newComment = {
            id: tempId,
            memory_date: activeDate,
            author_name: author,
            content: content,
            created_at: new Date().toISOString(),
            avatar_seed: author.charAt(0).toUpperCase()
        };

        // Optimistic update
        setComments(prev => [newComment, ...prev]);
        setCommentContent('');

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memory_date: activeDate,
                    author_name: author,
                    content: content,
                }),
            });

            if (!res.ok) throw new Error('Failed to post comment');
            
            router.refresh();

        } catch (error) {
            console.error(error);
            // Revert optimistic update on failure
            setComments(prev => prev.filter(c => c.id !== tempId));
            alert('Your comment could not be saved. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };


    const handleAddOptimistic = (newMemory: any) => {
        setMemories(prev => {
            const updated = [newMemory, ...prev];
            return updated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
        setActiveDate(newMemory.date);
    };

    const handleDeleteOptimistic = (id: string) => {
        // Check if this is the last memory for the day
        const remainingForDay = memories.filter(m => m.date === activeDate && m.id !== id);
        if (remainingForDay.length === 0) {
            // Cascade delete comments
            setComments(prev => prev.filter(c => c.memory_date !== activeDate));
            fetch(`/api/comments?date=${activeDate}`, { method: 'DELETE' }).catch(console.error);
        }
        
        setMemories(prev => prev.filter(m => m.id !== id));
    };

    const handleDeleteComment = async (commentId: string) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
        try {
            await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete comment:", error);
            router.refresh();
        }
    };

    const handleLikeOptimistic = (id: string) => setMemories(prev => prev.map(m => m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
    const handleUnlikeOptimistic = (id: string) => setMemories(prev => prev.map(m => m.id === id ? { ...m, likes: Math.max((m.likes || 0) - 1, 0) } : m));

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
        const allData = [...memories];
        const groupedByDate: { [key: string]: any } = {};

        allData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        allData.forEach(memory => {
            const date = memory.date;
            if (!groupedByDate[date]) {
                groupedByDate[date] = { date: date, items: [], comments: [] };
            }

            const author = memory.author || { name: memory.users?.display_name || "Unknown", avatar: memory.users?.avatar_url };

            const lastItem = groupedByDate[date].items[groupedByDate[date].items.length - 1];
            
            // Grouping Logic
            let isGroupable = false;
            
            if (lastItem && memory.type === 'photo' && lastItem.type === 'photo') {
                const batchId = memory.metadata?.batchId;
                const lastBatchId = lastItem.metadata?.batchId;

                if (batchId && lastBatchId) {
                    // Strict Batch Matching
                    isGroupable = batchId === lastBatchId;
                } else {
                    // Legacy Time/Content Matching
                    isGroupable = lastItem.author.name === author.name && 
                                  lastItem.content === memory.content && 
                                  Math.abs(new Date(lastItem.raw_created_at).getTime() - new Date(memory.created_at).getTime()) < 120000;
                }
            }

            if (isGroupable) {
                lastItem.media_urls.push(memory.media_url);
            } else {
                groupedByDate[date].items.push({
                    ...memory,
                    src: memory.media_url,
                    media_urls: memory.type === 'photo' ? [memory.media_url] : undefined,
                    time: new Date(memory.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    author: author,
                    raw_created_at: memory.created_at
                });
            }
        });

        comments.forEach((comment: any) => {
             const date = comment.memory_date;
             if (groupedByDate[date]) {
                 groupedByDate[date].comments.push({
                     id: comment.id,
                     user: comment.author_name,
                     avatarSeed: comment.avatar_seed,
                     text: comment.content,
                     time: new Date(comment.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                 });
             }
        });

        return Object.values(groupedByDate).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [memories, comments]);

    const [activeDate, setActiveDate] = useState(() => {
        // Default to local today
        const now = new Date();
        const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        return processedData[0]?.date || localDate;
    });
    
    const selectedYear = new Date(activeDate.replace(/-/g, '/')).getFullYear();
    const currentData = processedData.find((d: any) => d.date === activeDate) || { date: activeDate, items: [], comments: [] };
    const displayDate = new Date(activeDate.replace(/-/g,'/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const dayOfWeek = new Date(activeDate.replace(/-/g, '/')).getDay();
    const dayStyle = DAY_STYLES[dayOfWeek] || DAY_STYLES[0];

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeDate]);

    const handleAddMemoryClick = () => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
        } else {
            setIsAddMemoryOpen(true);
        }
    };

    return (
        <div className="min-h-screen pb-20 relative font-sans text-slate">
            <BackgroundBlobs />
            <BackgroundDecorations />
            
            <ProfileWidget onUserChange={setCurrentUser} />
            <UploadStatus queue={queue} />
            <AddMemoryModal isOpen={isAddMemoryOpen} onClose={() => setIsAddMemoryOpen(false)} onAddOptimistic={handleAddOptimistic} currentUser={currentUser} addToQueue={addToQueue} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

            <header className="relative z-10 flex flex-col items-center">
                <HeroHighlight user={heroData} />
                <LoveTimer startDate={START_DATE} />
                <ContributionHero memories={processedData} year={selectedYear} onDateSelect={setActiveDate} />
            </header>

            <div className="flex flex-col lg:flex-row gap-8 relative max-w-7xl mx-auto mt-4 z-10 px-4 md:px-8">
                <div className="hidden lg:block w-72 shrink-0 h-fit sticky top-8">
                    <TimelineTree data={processedData} activeDate={activeDate} onSelect={setActiveDate} />
                </div>

                <main ref={mainContentRef} className="flex-1 w-full min-w-0">
                    <div className="mb-8 flex items-end justify-between bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div>
                            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate mb-2">{displayDate}</h2>
                            <div className="flex gap-2">
                                <span className={`${dayStyle.color} px-3 py-1 rounded-full text-xs font-bold border shadow-sm`}>
                                    {dayStyle.label}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleAddMemoryClick} className="bg-slate text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-sm group">
                            <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition"><Icon name="Camera" size={16} /></div>
                            <span className="hidden md:inline">添加回憶</span>
                        </button>
                    </div>

                    <div key={activeDate} className="relative animate-in fade-in zoom-in-95 duration-500 mb-12">
                        {currentData.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-8 p-4">
                                {currentData.items.map((item: any) => (
                                    <ScrapbookItem 
                                        key={item.id} 
                                        item={item} 
                                        onDeleteOptimistic={handleDeleteOptimistic} 
                                        onLikeOptimistic={handleLikeOptimistic}
                                        onUnlikeOptimistic={handleUnlikeOptimistic}
                                        currentUser={currentUser}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate/40 italic bg-white/30 rounded-[2rem] border border-dashed border-slate/20">
                                <p className="mb-2">今天還沒回憶欸。</p>
                                <p className="text-xs">快去添加回憶吧！</p>
                            </div>
                        )}

                        <div className="mt-12 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-slate/50 uppercase tracking-widest flex items-center gap-2">
                                    <div className="bg-pastel-blue p-1.5 rounded-lg"><Icon name="MessageSquare" size={14} className="text-slate" /></div> Love Notes
                                </h3>
                                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-slate/40 border border-slate/5 shadow-sm">{currentData.comments?.length || 0} NOTES</span>
                            </div>
                            <div className="space-y-4 mb-8 pl-2 border-l-2 border-slate/10">
                                {currentData.comments?.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 border-2 border-white shadow-md flex items-center justify-center text-lg font-bold text-slate-500">{comment.avatarSeed}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-sm text-slate">{comment.user}</span>
                                                    <span className="text-[10px] font-mono text-gray-400 opacity-50">{comment.time}</span>
                                                </div>
                                                {currentUser && (
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400 p-1 hover:bg-red-50 rounded-full"
                                                        title="Delete Note"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate/70 leading-relaxed bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border border-gray-50">{comment.text}</p>
                                        </div>
                                    </div>
                                )) ?? <div className="text-sm text-slate/40 italic pl-2">No comments yet. Be the first!</div>}
                            </div>
                            <form onSubmit={handleCommentSubmit} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input type="text" placeholder="Your name (optional)" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} className="w-full bg-white border-2 border-white focus:border-coral/30 rounded-xl px-4 py-3 text-sm focus:outline-none shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all placeholder:text-slate/30" />
                                    <div className="relative group md:col-span-2">
                                        <input type="text" placeholder="Send them some love..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} required className="w-full bg-white border-2 border-white focus:border-coral/30 rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all placeholder:text-slate/30" />
                                        <button type="submit" disabled={isSubmittingComment} className="absolute right-2 top-2 bottom-2 bg-gradient-to-tr from-coral to-rose-400 text-white w-10 rounded-lg flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-coral/30 disabled:opacity-50">
                                            {isSubmittingComment ? <Loader2 size={16} className="animate-spin" /> : <Icon name="Send" size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};