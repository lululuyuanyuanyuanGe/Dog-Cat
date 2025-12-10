"use client";
import React, { useState } from 'react';
import Icon from '@/components/Icon';
import HeroHighlight from '@/components/HeroHighlight';
import LoveTimer from '@/components/LoveTimer';
import ContributionHero from '@/components/ContributionHero';
import ScrapbookItem from '@/components/ScrapbookItem';
import TimelineTree from '@/components/TimelineTree';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import BackgroundDecorations from '@/components/BackgroundDecorations';
import ProfileWidget from '@/components/ProfileWidget';

// --- CONFIGURATION ---
const START_DATE = "2023-05-20T00:00:00"; 
    
const CURRENT_USER = {
    name: "Xiaolu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    partnerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
};

// --- MOCK DATABASE ---
const RAW_DATA = [
    {
        date: "2025-01-24",
        items: [
            { type: 'photo', size: 'large', src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&fit=crop', time: '10:42 AM', sticker: { text: "So Yummy!", color: "bg-pastel-yellow", rotate: "-rotate-6" } },
            { type: 'note', size: 'small', content: "The way you looked at the sunset today... I never want to forget that.", bg: 'bg-pastel-blue/30', time: '12:15 PM' },
            { type: 'pdf', size: 'wide', title: "Our_Trip_Itinerary.pdf", sizeLabel: "2.4 MB", time: '02:30 PM' },
            { type: 'video', size: 'medium', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&fit=crop', time: '06:00 PM' }
        ],
        comments: [{ user: "Alice", avatar: "bg-blue-200", text: "Omg this date looks perfect!", time: "16:40" }]
    },
    {
        date: "2025-01-01",
        items: [
             { type: 'note', size: 'wide', content: "Happy New Year my love! 🎆 Here's to another year of us.", bg: 'bg-pastel-pink/30', time: '00:01 AM' },
             { type: 'photo', size: 'medium', src: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&fit=crop', time: '00:15 AM' }
        ],
        comments: []
    },
    {
        date: "2024-12-25",
        items: [
            { type: 'photo', size: 'large', src: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600&fit=crop', time: '09:00 AM' },
            { type: 'pdf', size: 'wide', title: "Christmas_Letter.pdf", sizeLabel: "500 KB", time: '10:30 AM' }
        ],
        comments: []
    },
    {
        date: "2024-05-20",
        items: [
             { type: 'note', size: 'large', content: "One year anniversary! I can't believe how fast time flies.", bg: 'bg-pastel-yellow/50', time: '08:00 PM' }
        ],
        comments: []
    }
];

export default function Home() {
    const [activeDate, setActiveDate] = useState(RAW_DATA[0].date);
    const currentData = RAW_DATA.find(d => d.date === activeDate) || RAW_DATA[0];
    const displayDate = new Date(activeDate.replace(/-/g,'/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen pb-20 relative font-sans text-slate">
            <BackgroundBlobs />
            <BackgroundDecorations />
            
            <ProfileWidget user={CURRENT_USER} />

            <header className="relative z-10 flex flex-col items-center">
                <HeroHighlight user={CURRENT_USER} />
                <LoveTimer startDate={START_DATE} />
                <ContributionHero memories={RAW_DATA} />
            </header>

            <div className="flex flex-col lg:flex-row gap-8 relative max-w-7xl mx-auto mt-4 z-10 px-4 md:px-8">
                {/* LEFT RAIL */}
                <div className="hidden lg:block w-72 shrink-0 h-fit">
                    <TimelineTree data={RAW_DATA} activeDate={activeDate} onSelect={setActiveDate} />
                </div>

                {/* MAIN CONTENT */}
                <main className="flex-1 w-full min-w-0">
                    {/* Day Header */}
                    <div className="mb-8 flex items-end justify-between bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div>
                            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate mb-2">{displayDate}</h2>
                            <div className="flex gap-2"><span className="bg-pastel-mint px-3 py-1 rounded-full text-xs font-bold text-slate/60 border border-emerald-100">Recorded 🌿</span></div>
                        </div>
                        <button className="bg-slate text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-sm group">
                            <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition"><Icon name="camera" size={16} /></div>
                            <span className="hidden md:inline">Add Memory</span>
                        </button>
                    </div>

                    {/* NEW SCRAPBOOK GRID */}
                    <div key={activeDate} className="relative animate-in fade-in zoom-in-95 duration-500 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-8 p-4">
                            {currentData.items.map((item, idx) => <ScrapbookItem key={idx} item={item} />)}
                        </div>

                        {/* GUESTBOOK (Visual Separation) */}
                        <div className="mt-12 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-slate/50 uppercase tracking-widest flex items-center gap-2">
                                    <div className="bg-pastel-blue p-1.5 rounded-lg"><Icon name="message" size={14} className="text-slate" /></div> Love Notes
                                </h3>
                                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-slate/40 border border-slate/5 shadow-sm">{currentData.comments.length} NOTES</span>
                            </div>
                            <div className="space-y-4 mb-8 pl-2 border-l-2 border-slate/10">
                                {currentData.comments.length > 0 ? currentData.comments.map((comment, i) => (
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
