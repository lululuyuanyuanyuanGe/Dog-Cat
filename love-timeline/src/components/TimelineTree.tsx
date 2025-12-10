"use client";
import React, { useState, useMemo } from 'react';
import Icon from './Icon';

interface TimelineTreeProps {
    data: any[]; // Raw data structure from example.html
    activeDate: string;
    onSelect: (date: string) => void;
}

const TimelineTree: React.FC<TimelineTreeProps> = ({ data, activeDate, onSelect }) => {
    const grouped = useMemo(() => {
        const tree: { [year: string]: { [month: string]: any[] } } = {};
        data.forEach(entry => {
            const date = new Date(entry.date.replace(/-/g, '/'));
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'long' });
            if (!tree[year]) tree[year] = {};
            if (!tree[year][month]) tree[year][month] = [];
            tree[year][month].push(entry);
        });
        return tree;
    }, [data]);

    const [expandedYears, setExpandedYears] = useState<{ [key: string]: boolean }>(
      Object.keys(grouped).reduce((acc, year) => ({ ...acc, [year]: true }), {}) // Expand all by default
    );
    const toggleYear = (y: string) => setExpandedYears(prev => ({ ...prev, [y]: !prev[y] }));

    return (
        <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-sm overflow-hidden sticky top-8">
            <h2 className="font-display text-2xl font-bold text-slate mb-6 flex items-center gap-2">Timeline <Icon name="star" size={14} className="text-coral" /></h2>
            <div className="space-y-4">
                {Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
                    <div key={year} className="relative">
                        <button onClick={() => toggleYear(year)} className="flex items-center gap-2 w-full text-left font-display text-xl font-bold text-slate hover:text-coral transition mb-2">
                            <span className="text-xs p-1 bg-white rounded-full shadow-sm">{expandedYears[year] ? <Icon name="chevronDown" size={12} /> : <Icon name="chevronRight" size={12} />}</span>
                            {year}
                        </button>
                        <div className={`space-y-4 border-l-2 border-dashed border-coral/30 ml-3 pl-4 transition-all duration-300 ${expandedYears[year] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            {Object.keys(grouped[year]).map(month => (
                                <div key={month}>
                                    <h4 className="font-mono text-xs font-bold text-slate/50 uppercase mb-2 mt-2">{month}</h4>
                                    <div className="space-y-3">
                                        {grouped[year][month].map(day => (
                                            <div key={day.date} onClick={() => onSelect(day.date)} className={`relative group cursor-pointer flex items-center gap-3 transition-all ${activeDate === day.date ? 'translate-x-2' : 'hover:translate-x-1'}`}>
                                                <div className={`w-2 h-2 rounded-full ring-2 ring-white transition-colors ${activeDate === day.date ? 'bg-coral ring-coral/30' : 'bg-gray-300'}`}></div>
                                                <div>
                                                    <span className={`font-display text-lg block leading-none ${activeDate === day.date ? 'text-coral font-bold' : 'text-slate'}`}>{new Date(day.date.replace(/-/g, '/')).getDate()}</span>
                                                    <span className="text-[9px] text-gray-400 font-mono">{new Date(day.date.replace(/-/g, '/')).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineTree;