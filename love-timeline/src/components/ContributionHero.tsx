"use client";
import React, { useMemo, useState, useEffect } from 'react';
import DoodleArrow from './DoodleArrow';
import DoodleUnderline from './DoodleUnderline';

interface Memory {
    date: string;
    items: any[];
}

interface Props {
    memories: Memory[];
}

const ContributionHero = ({ memories }: Props) => {
    const [matrix, setMatrix] = useState<any[]>([]);

    useEffect(() => {
        // Use the prototype's random generation for the visual matrix
        const rows = 27;
        const cols = 31;
        const grid = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = (c / cols) * 3.5 - 1.75;
                const y = -((r / rows) * 3.5 - 1.5);
                const equation = Math.pow((x * x + y * y - 1), 3) - (x * x * y * y * y);
                const isInside = equation <= 0;
                const level = isInside ? (Math.random() > 0.3 ? Math.ceil(Math.random() * 4) : 0) : -1;
                grid.push({ id: `${r}-${c}`, isInside, level });
            }
        }
        setMatrix(grid);
    }, []); // Empty dependency array ensures this runs only once on the client

    const totalCount = useMemo(() => {
        return memories.reduce((sum, memory) => sum + memory.items.length, 0);
    }, [memories]);

    const colors: { [key: number]: string } = { '-1': 'opacity-0', 0: 'bg-rose-100/50', 1: 'bg-rose-200', 2: 'bg-rose-300', 3: 'bg-rose-400', 4: 'bg-coral shadow-[0_0_8px_rgba(255,107,107,0.4)]' };
    
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
                <div className="heart-grid">
                    {matrix.map((cell) => (
                        <div key={cell.id} className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-[2px] transition-all duration-300 ${colors[cell.level]} ${cell.isInside ? 'hover:scale-150 hover:z-20 cursor-pointer' : ''}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContributionHero;
