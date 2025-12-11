import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import DoodleArrow from './DoodleArrow';
import DoodleUnderline from './DoodleUnderline';
import EkgLine from './EkgLine';

type Props = {
    user: {
        avatar: string;
        partnerAvatar: string;
        name1: string;
        name2: string;
    }
};

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
                        0% {
                            transform: scale(1);
                            stroke-width: 0;
                        }
                        20% {
                            transform: scale(1.3);
                            stroke: #FDA4AF; /* rose-300 */
                            stroke-width: 2;
                        }
                        40%, 100% {
                            transform: scale(1);
                            stroke-width: 0;
                        }
                    }
                `}
            </style>
            <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-white/50 to-blue-100/30 blur-3xl rounded-full -z-10 transform scale-150"></div>
                
                <div className="flex items-start justify-center w-full animate-in fade-in zoom-in duration-1000">
                    
                    <div className="flex flex-col items-center shrink-0 z-10 w-32 md:w-40">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-[5px] border-white shadow-2xl overflow-hidden relative group transition-transform hover:scale-105 duration-300 ring-1 ring-slate-100 bg-white">
                            <img src={user.partnerAvatar} className="w-full h-full object-cover" alt={user.name2} />
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-coral to-rose-500 tracking-tighter drop-shadow-sm text-center mt-3 break-words w-full leading-tight">
                            {user.name2}
                        </h1>
                    </div>

                    <div className="flex-1 mt-8 md:mt-12 -mx-4 relative -z-10 transform scale-x-[-1] text-coral/40">
                        <EkgLine variant={ekgVariant} animationName={ekgAnimationName} />
                    </div>

                    <div className="flex flex-col items-center shrink-0 mx-2 -mt-1">
                        <div className="mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-full border-[3px] border-rose-100 shadow-[0_0_30px_rgba(255,107,107,0.6)] relative z-20">
                            <Icon 
                                name="Heart" // FIX: Use PascalCase for the icon name
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

                    <div className="flex-1 mt-8 md:mt-12 -mx-4 relative -z-10 text-coral/40">
                        <EkgLine variant={ekgVariant} animationName={ekgAnimationName} />
                    </div>

                    <div className="flex flex-col items-center shrink-0 z-10 w-32 md:w-40">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-[5px] border-white shadow-2xl overflow-hidden relative group transition-transform hover:scale-105 duration-300 ring-1 ring-slate-100 bg-white">
                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name1} />
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
                            ( One Life, One Love, Forever )
                        </p>
                        <DoodleUnderline />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroHighlight;
