"use client";
import React, { useMemo } from 'react';
import DoodleArrow from './DoodleArrow';
import DoodleUnderline from './DoodleUnderline';

interface Memory {
    date: string;
    items: any[];
}

interface Props {
    memories: Memory[];
}

// A 25x19 grid containing 357 cells for a symmetrical heart shape.
const HEART_MAP = [
  [0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
];

const ContributionHero = ({ memories }: Props) => {
    const { gridCells, totalCount } = useMemo(() => {
        const contributions = new Map<string, number>();
        let totalMemories = 0;
        for (const memory of memories) {
            const date = memory.date;
            const count = memory.items.length;
            contributions.set(date, (contributions.get(date) || 0) + count);
            totalMemories += count;
        }

        const year = new Date().getFullYear();
        const isLeap = new Date(year, 1, 29).getDate() === 29;
        const totalDays = isLeap ? 366 : 365;

        const yearDates = [];
        const startDate = new Date(year, 0, 1);
        for (let i = 0; i < totalDays; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            yearDates.push(d.toISOString().split('T')[0]);
        }

        const colors: { [key: number]: string } = { 0: 'bg-rose-100/50', 1: 'bg-rose-200', 2: 'bg-rose-300', 3: 'bg-rose-400', 4: 'bg-coral shadow-[0_0_8px_rgba(255,107,107,0.4)]' };
        
        let dayIndex = 0;
        const cells = HEART_MAP.flat().map((cell, i) => {
            if (cell === 0) {
                return <div key={`empty-${i}`} />;
            }
            
            if (dayIndex >= yearDates.length) return null; // Should not happen with a 357/365 map
            
            const date = yearDates[dayIndex];
            const count = contributions.get(date) || 0;
            dayIndex++;

            let level = 0;
            if (count > 0 && count <= 1) level = 1;
            else if (count > 1 && count <= 2) level = 2;
            else if (count > 2 && count <= 3) level = 3;
            else if (count > 3) level = 4;
            
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' 
            });
            const contributionText = count === 1 ? '1 memory' : `${count || 'No'} memories`;

            return (
                <div key={date} className="relative group">
                    <div className={`w-full h-full rounded-[2px] transition-all duration-200 ${colors[level]} cursor-pointer group-hover:scale-125 group-hover:shadow-lg group-hover:z-10`} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate text-white text-xs font-bold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        {contributionText} on {formattedDate}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate"></div>
                    </div>
                </div>
            );
        });

        return { gridCells: cells, totalCount: totalMemories };

    }, [memories]);
    
    return (
        <div className="w-full max-w-4xl mx-auto px-4 z-20 relative mb-12">
            <div className="glass-hero rounded-[3rem] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 w-32 h-1 bg-gradient-to-r from-coral to-rose-400 rounded-b-full"></div>
                <div className="relative mb-8 z-10 mt-2">
                    <DoodleArrow />
                    <span className="font-hand text-slate/40 text-lg md:text-xl block mb-1 -rotate-2">We created...</span>
                    <div className="relative inline-block">
                        <h2 className="text-6xl md:text-8xl font-display font-bold text-coral drop-shadow-sm tracking-tight leading-none">{totalCount.toLocaleString()}</h2>
                        <DoodleUnderline />
                    </div>
                    <p className="font-sans font-bold text-slate/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-4">Beautiful Memories Together</p>
                </div>
                <div 
                    className="grid gap-1 w-full"
                    style={{ gridTemplateColumns: `repeat(${HEART_MAP[0].length}, minmax(0, 1fr))`, aspectRatio: `${HEART_MAP[0].length} / ${HEART_MAP.length}` }}
                >
                    {gridCells}
                </div>
            </div>
        </div>
    );
};

export default ContributionHero;
