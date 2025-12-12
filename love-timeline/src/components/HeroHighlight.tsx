import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import DoodleArrow from './DoodleArrow';
import DoodleUnderline from './DoodleUnderline';
import EkgLine from './EkgLine';
import { Crown, Sparkle, Star } from 'lucide-react';

type Props = {
    user: {
        avatar: string;
        partnerAvatar: string;
        name1: string;
        name2: string;
    }
};

const Sparkles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
        {[...Array(6)].map((_, i) => {
            // Deterministic random values based on index 'i' to prevent hydration mismatch
            const r1 = ((i * 17) % 100) / 100;
            const r2 = ((i * 23) % 100) / 100;
            const r3 = ((i * 31) % 100) / 100;
            const r4 = ((i * 47) % 100) / 100;
            
            return (
                <div 
                    key={i} 
                    className="absolute animate-float"
                    style={{
                        top: `${r1 * 100}%`,
                        left: `${r2 * 100}%`,
                        animationDelay: `${r3 * 2}s`,
                        animationDuration: `${2 + r4 * 3}s`
                    }}
                >
                    <Sparkle 
                        size={8 + r1 * 12} 
                        className="text-yellow-400 opacity-60 fill-yellow-200" 
                        style={{ transform: `rotate(${r2 * 360}deg)` }}
                    />
                </div>
            );
        })}
    </div>
);

const HeroHighlight = ({ user }: Props) => {
    const [ekgVariant, setEkgVariant] = useState(0);
    const [animationCycle, setAnimationCycle] = useState(0);

    useEffect(() => {
        const styleInterval = setInterval(() => {
            setEkgVariant(prevVariant => (prevVariant + 1) % 4);
            setAnimationCycle(prevCycle => prevCycle + 1);
        }, 2000);
        return () => clearInterval(styleInterval);
    }, []);

    const heartAnimationName = `pulse-heart-${animationCycle}`;
    const ekgAnimationName = `draw-lifeline-${animationCycle}`;

    return (
        <div className="w-full max-w-3xl mx-auto pt-16 pb-10 px-4 z-10 relative">
            <style>
                {`
                    @keyframes ${heartAnimationName} {
                        0% { transform: scale(1); stroke-width: 0; }
                        20% { transform: scale(1.3); stroke: #FDA4AF; stroke-width: 2; }
                        40%, 100% { transform: scale(1); stroke-width: 0; }
                    }
                `}
            </style>
            <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-white/50 to-blue-100/30 blur-3xl rounded-full -z-10 transform scale-150"></div>
                
                <div className="flex items-start justify-center w-full animate-in fade-in zoom-in duration-1000">
                    
                    {/* Partner 2 (Left) */}
                    <div className="flex flex-col items-center shrink-0 z-10 w-32 md:w-40 relative group">
                        <Sparkles />
                        <div className="relative">
                            <div className="absolute -top-6 -left-4 z-20 rotate-[-15deg] animate-bounce-slow">
                                <Crown size={32} className="text-yellow-500 fill-yellow-300 drop-shadow-md" />
                            </div>
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-coral to-rose-400 shadow-xl overflow-hidden relative transition-transform group-hover:scale-105 duration-300">
                                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                                    <img src={user.partnerAvatar} className="w-full h-full object-cover" alt={user.name2} />
                                </div>
                            </div>
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-coral to-rose-500 tracking-tighter drop-shadow-sm text-center mt-3 break-words w-full leading-tight">
                            {user.name2}
                        </h1>
                    </div>

                    {/* Connection Line Left */}
                    <div className="flex-1 mt-8 md:mt-12 -mx-4 relative -z-10 transform scale-x-[-1] text-coral/40">
                        <EkgLine variant={ekgVariant} animationName={ekgAnimationName} />
                    </div>

                    {/* Center Heart */}
                    <div className="flex flex-col items-center shrink-0 mx-2 -mt-1">
                        <div className="mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-full border-[3px] border-rose-100 shadow-[0_0_30px_rgba(255,107,107,0.6)] relative z-20">
                            <Icon 
                                name="Heart" 
                                size={36} 
                                className="text-rose-500 fill-rose-500 drop-shadow-xl"
                                style={{
                                    animationName: heartAnimationName,
                                    animationDuration: '1.4s',
                                    animationTimingFunction: 'ease-out',
                                    animationIterationCount: 'infinite',
                                }}
                            />
                        </div>
                        <span className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-orange-300 drop-shadow-sm opacity-90 mt-8 md:mt-13">
                            &
                        </span>
                    </div>

                    {/* Connection Line Right */}
                    <div className="flex-1 mt-8 md:mt-12 -mx-4 relative -z-10 text-coral/40">
                        <EkgLine variant={ekgVariant} animationName={ekgAnimationName} />
                    </div>

                    {/* Partner 1 (Right) */}
                    <div className="flex flex-col items-center shrink-0 z-10 w-32 md:w-40 relative group">
                        <Sparkles />
                        <div className="relative">
                            <div className="absolute -top-5 -right-3 z-20 rotate-[15deg] animate-pulse-slow">
                                <Star size={32} className="text-yellow-400 fill-yellow-200 drop-shadow-md" />
                            </div>
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-bl from-rose-400 to-orange-300 shadow-xl overflow-hidden relative transition-transform group-hover:scale-105 duration-300">
                                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.name1} />
                                </div>
                            </div>
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 tracking-tighter drop-shadow-sm text-center mt-3 break-words w-full leading-tight">
                            {user.name1}
                        </h1>
                    </div>
                </div>

                <div className="text-center relative mt-12 hidden md:block">
                    <div className="absolute -left-16 -top-8 opacity-40 rotate-12">
                        <DoodleArrow />
                    </div>
                    <div className="inline-block relative">
                        <p className="font-hand text-slate/40 text-2xl rotate-[-2deg]">
                            ( 祝你開心每一天 )
                        </p>
                        <DoodleUnderline />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroHighlight;
