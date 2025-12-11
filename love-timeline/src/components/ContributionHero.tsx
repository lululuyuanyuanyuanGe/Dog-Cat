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
    year?: number; // Add year prop to control which year the graph displays
    onDateSelect?: (date: string) => void;
}

// SOLID HEART MAP (~390 pixels)
const SOLID_HEART_MAP = [
  [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const ContributionHero = ({ memories, year, onDateSelect}: Props) => {
    // Default to current year if not provided
    const selectedYear = year || new Date().getFullYear();

    const { gridCells, totalCount } = useMemo(() => {
        const contributions = new Map<string, number>();
        let totalMemories = 0;
        
        if (memories) {
            for (const memory of memories) {
                const date = memory.date;
                const count = memory.items ? memory.items.length : 0;
                contributions.set(date, (contributions.get(date) || 0) + count);
                
                // Only count total for the selected year
                const memoryYear = parseInt(date.split('-')[0]);
                if (memoryYear === selectedYear) {
                    totalMemories += count;
                }
            }
        }
        
        // Count total active slots in the map
        const totalSlots = SOLID_HEART_MAP.flat().filter(cell => cell === 1).length;

        const dateList: string[] = [];
        
        // Generate enough dates to fill the ENTIRE map starting from Jan 1 of SELECTED YEAR
        for (let i = 0; i < totalSlots; i++) {
            const d = new Date(Date.UTC(selectedYear, 0, 1)); 
            d.setUTCDate(d.getUTCDate() + i);
            dateList.push(d.toISOString().split('T')[0]); 
        }

        const colors: { [key: number]: string } = { 
            0: 'bg-rose-100/50', 
            1: 'bg-rose-200', 
            2: 'bg-rose-300', 
            3: 'bg-rose-400', 
            4: 'bg-coral shadow-[0_0_8px_rgba(255,107,107,0.4)]' 
        };
        
        let dayIndex = 0;
        const cells = SOLID_HEART_MAP.flat().map((cell, i) => {
            if (cell === 0) {
                return <div key={`spacer-${i}`} />;
            }
            
            const date = dateList[dayIndex];
            const count = contributions.get(date) || 0;
            dayIndex++;

            let level = 0;
            if (count > 0 && count <= 1) level = 1;
            else if (count > 1 && count <= 2) level = 2;
            else if (count > 2 && count <= 3) level = 3;
            else if (count > 3) level = 4;
            
            let tooltipText = "";
            if (date) {
                const [y, m, d] = date.split('-').map(Number);
                const formattedDate = new Date(Date.UTC(y, m-1, d)).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' 
                });
                const isNextYear = y > selectedYear;
                const yearLabel = isNextYear ? ` (${y})` : ''; 
                
                const contributionText = count === 1 ? '1 memory' : `${count || 'No'} memories`;
                tooltipText = `${contributionText} on ${formattedDate}${yearLabel}`;
            }

            const handleClick = () => {
                if (count > 0 && onDateSelect) {
                    onDateSelect(date);
                }
            };

            return (
                <div key={date} className="relative group" onClick={handleClick}>
                    <div className={`w-full h-full rounded-[2px] transition-all duration-200 
                        ${colors[level]}
                        ${count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-rose-400 z-10' : ''} 
                        cursor-pointer group-hover:scale-125 group-hover:shadow-lg group-hover:z-10
                    `} />
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate text-white text-xs font-bold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        {tooltipText}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate"></div>
                    </div>
                </div>
            );
        });

        return { gridCells: cells, totalCount: totalMemories };

    }, [memories, selectedYear]);
    
    return (
        <div className="w-full max-w-4xl mx-auto px-4 z-20 relative mb-12">
            <div className="glass-hero rounded-[3rem] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 w-32 h-1 bg-gradient-to-r from-coral to-rose-400 rounded-b-full"></div>
                
                {/* Header Stats */}
                <div className="relative mb-8 z-10 mt-2">
                    <DoodleArrow />
                    <span className="font-hand text-slate/40 text-lg md:text-xl block mb-1 -rotate-2">
                        Memories in {selectedYear}
                    </span>
                    <div className="relative inline-block">
                        <h2 className="text-6xl md:text-8xl font-display font-bold text-coral drop-shadow-sm tracking-tight leading-none">{totalCount.toLocaleString()}</h2>
                        <DoodleUnderline />
                    </div>
                </div>
                
                {/* Heart Grid */}
                <div 
                    className="grid gap-[2px] w-full max-w-[550px]" 
                    style={{ 
                        gridTemplateColumns: `repeat(${SOLID_HEART_MAP[0].length}, minmax(0, 1fr))`, 
                        aspectRatio: `${SOLID_HEART_MAP[0].length} / ${SOLID_HEART_MAP.length}` 
                    }}
                >
                    {gridCells}
                </div>
            </div>
        </div>
    );
};

export default ContributionHero;
