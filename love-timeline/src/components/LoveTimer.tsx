"use client";
import React, { useState, useEffect } from 'react';

type Props = {
    startDate: string;
};

const TimeCard = ({ val, label, color, rotate }: { val: number, label: string, color: string, rotate: string }) => (
    <div className={`relative flex flex-col items-center justify-center w-20 h-24 md:w-28 md:h-32 rounded-2xl border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur-xl ${color} ${rotate} transition-transform hover:scale-110 duration-300`}>
        <div className="text-3xl md:text-5xl font-display font-bold text-slate/80 tabular-nums">{String(val).padStart(2, '0')}</div>
        <div className="text-[10px] md:text-xs font-bold text-slate/50 uppercase tracking-widest mt-1 bg-white/40 px-2 py-0.5 rounded-full">{label}</div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none"></div>
    </div>
);

// A component to display the time elapsed since a start date.
const LoveTimer = ({ startDate }: Props) => {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        const updateTimer = () => {
            const start = new Date(startDate).getTime();
            const now = new Date().getTime();
            const distance = now - start;
            setTime({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        };
        const timer = setInterval(updateTimer, 1000);
        updateTimer();
        return () => clearInterval(timer);
    }, [startDate]);

    return (
        <div className="flex flex-col items-center py-8 z-10 relative">
            <div className="flex gap-3 md:gap-6">
                <TimeCard val={time.days} label="天" color="bg-pastel-pink/80" rotate="-rotate-2" />
                <TimeCard val={time.hours} label="時" color="bg-pastel-blue/80" rotate="rotate-1" />
                <TimeCard val={time.minutes} label="分" color="bg-pastel-yellow/80" rotate="-rotate-1" />
                <TimeCard val={time.seconds} label="秒" color="bg-pastel-mint/80" rotate="rotate-2" />
            </div>
        </div>
    );
};

export default LoveTimer;
