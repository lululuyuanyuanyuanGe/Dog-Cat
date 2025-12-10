"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Star, Calendar } from 'lucide-react';

interface TimelineTreeProps {
    data: any[]; // Raw data
    activeDate: string;
    onSelect: (date: string) => void;
}

const TimelineTree: React.FC<TimelineTreeProps> = ({ data, activeDate, onSelect }) => {
    // Group Data: Year -> Month -> Days
    const grouped = useMemo(() => {
        const tree: { [year: string]: { [month: string]: any[] } } = {};
        
        data.forEach(entry => {
            const date = new Date(entry.date.replace(/-/g, '/'));
            const year = date.getFullYear().toString();
            const month = date.toLocaleString('default', { month: 'long' }); // Full month name
            
            if (!tree[year]) tree[year] = {};
            if (!tree[year][month]) tree[year][month] = [];
            tree[year][month].push(entry);
        });
        return tree;
    }, [data]);

    // Initialize Expanded States
    const [expandedYears, setExpandedYears] = useState<{ [key: string]: boolean }>({});
    const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: boolean }>({});

    // Auto-expand the year and month of the Active Date on first load
    useEffect(() => {
        if (activeDate) {
            const d = new Date(activeDate.replace(/-/g, '/'));
            const y = d.getFullYear().toString();
            const m = d.toLocaleString('default', { month: 'long' });
            
            setExpandedYears(prev => ({ ...prev, [y]: true }));
            setExpandedMonths(prev => ({ ...prev, [`${y}-${m}`]: true }));
        }
    }, [activeDate]);

    const toggleYear = (y: string) => setExpandedYears(prev => ({ ...prev, [y]: !prev[y] }));
    const toggleMonth = (key: string) => setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-sm overflow-hidden sticky top-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h2 className="font-display text-2xl font-bold text-slate mb-6 flex items-center gap-2">
                Timeline <Star size={16} className="text-coral fill-coral" />
            </h2>
            
            <div className="space-y-4">
                {Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
                    <div key={year} className="relative">
                        {/* YEAR TOGGLE */}
                        <button 
                            onClick={() => toggleYear(year)} 
                            className="flex items-center gap-3 w-full text-left font-display text-xl font-bold text-slate hover:text-coral transition mb-2 group"
                        >
                            <span className={`p-1.5 bg-white/60 rounded-full shadow-sm transition-transform duration-300 ${expandedYears[year] ? 'rotate-90' : ''}`}>
                                <ChevronRight size={14} className="text-slate/60 group-hover:text-coral" />
                            </span>
                            {year}
                        </button>

                        {/* YEAR CONTENT */}
                        <div className={`space-y-2 border-l-[1.5px] border-dashed border-coral/20 ml-[1.15rem] pl-4 transition-all duration-300 ease-in-out ${expandedYears[year] ? 'max-h-[2000px] opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            {Object.keys(grouped[year]).map(month => {
                                const monthKey = `${year}-${month}`;
                                const monthItems = grouped[year][month];
                                const totalMonthMemories = monthItems.reduce((acc, d) => acc + (d.items?.length || 0), 0);

                                return (
                                    <div key={monthKey} className="relative">
                                        {/* MONTH TOGGLE */}
                                        <button 
                                            onClick={() => toggleMonth(monthKey)}
                                            className="flex items-center justify-between w-full text-left py-1 group/month"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] text-slate/40 transition-transform duration-200 ${expandedMonths[monthKey] ? 'rotate-90' : ''}`}>
                                                    <ChevronRight size={12} />
                                                </span>
                                                <span className="font-mono text-sm font-bold text-slate/70 uppercase tracking-wide group-hover/month:text-coral transition-colors">
                                                    {month}
                                                </span>
                                            </div>
                                            <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded-full text-slate/40 border border-white">
                                                {totalMonthMemories}
                                            </span>
                                        </button>

                                        {/* MONTH CONTENT (DAYS) */}
                                        <div className={`space-y-2 mt-2 pl-3 transition-all duration-300 ${expandedMonths[monthKey] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                            {grouped[year][month].map(day => {
                                                const isActive = activeDate === day.date;
                                                const dayCount = day.items?.length || 0;
                                                const dObj = new Date(day.date.replace(/-/g, '/'));

                                                return (
                                                    <div 
                                                        key={day.date} 
                                                        onClick={() => onSelect(day.date)} 
                                                        className={`relative group/day cursor-pointer flex items-center justify-between gap-3 p-2 rounded-xl transition-all 
                                                            ${isActive 
                                                                ? 'bg-white shadow-md shadow-coral/5 scale-105 -translate-x-1' 
                                                                : 'hover:bg-white/40 hover:pl-3'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ring-2 ring-white transition-colors flex-shrink-0 ${isActive ? 'bg-coral ring-coral/30' : 'bg-slate/20'}`}></div>
                                                            <div>
                                                                <span className={`font-display text-lg block leading-none ${isActive ? 'text-coral font-bold' : 'text-slate'}`}>
                                                                    {dObj.getDate()}
                                                                </span>
                                                                <span className="text-[9px] text-gray-400 font-mono uppercase">
                                                                    {dObj.toLocaleDateString('en-US', { weekday: 'short' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Day Count Badge */}
                                                        {dayCount > 0 && (
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-coral/10 text-coral' : 'bg-slate/5 text-slate/40'}`}>
                                                                {dayCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineTree;
