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

    useEffect(() => {
        // Set an interval to cycle through the EKG animation styles every 4.5 seconds.
        // This creates a continuously changing visual effect.
        const styleInterval = setInterval(() => {
            setEkgVariant(prevVariant => (prevVariant + 1) % 3); // Cycle 0, 1, 2
        }, 4500); // 3 cycles of the 1.5s animation

        return () => clearInterval(styleInterval); // Cleanup on component unmount
    }, []); // Empty dependency array ensures this runs only once to set up the interval.

    return (
        <div className="w-full max-w-3xl mx-auto pt-16 pb-10 px-4 z-10 relative">
            <style>
                {`
                    @keyframes pulse-heart {
                        /* Heart swells immediately as the EKG line starts drawing */
                        0% {
                            transform: scale(1.25);
                            fill: #FB7185; /* rose-400 */
                        }
                        /* It returns to normal quickly, matching the beat's duration */
                        30%, 100% {
                            transform: scale(1);
                            fill: #F43F5E; /* rose-500 */
                        }
                    }
                    .heart-pulse-animate {
                        /* Animation is timed to match the EKG line's 1.5s duration */
                        animation: pulse-heart 1.5s ease-in-out infinite;
                    }
                `}
            </style>
            <div className="relative flex flex-col items-center">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-white/50 to-blue-100/30 blur-3xl rounded-full -z-10 transform scale-150"></div>
                
                {/* MAIN ROW */}
                <div className="flex items-start justify-center w-full animate-in fade-in zoom-in duration-1000">
                    
                    {/* === LEFT AVATAR GROUP === */}
                    <div className="flex flex-col items-center shrink-0 z-10 w-32 md:w-40">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-[5px] border-white shadow-2xl overflow-hidden relative group transition-transform hover:scale-105 duration-300 ring-1 ring-slate-100 bg-white">
                            <img src={user.partnerAvatar} className="w-full h-full object-cover" alt={user.name2} />
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-coral to-rose-500 tracking-tighter drop-shadow-sm text-center mt-3 break-words w-full leading-tight">
                            {user.name2}
                        </h1>
                    </div>

                    {/* === LEFT LINE === */}
                    <div className="flex-1 mt-8 md:mt-12 -mx-4 relative -z-10 transform scale-x-[-1] text-coral/40">
                        <EkgLine variant={ekgVariant} />
                    </div>

                    {/* === CENTER HEART & AMPERSAND === */}
                    <div className="flex flex-col items-center shrink-0 mx-2 -mt-1">
                        
                        {/* HEART (Aligned with Avatars) */}
                        <div className="mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-full border-[3px] border-rose-100 shadow-[0_0_30px_rgba(255,107,107,0.6)] relative z-20">
                            <Icon name="heart" size={36} className="text-coral drop-shadow-xl heart-pulse-animate" />
                        </div>
                        
                        {/* AMPERSAND (Pushed down to align with Names) */}
                        <span className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-orange-300 drop-shadow-sm opacity-90 mt-8 md:mt-13">
                            &
                        </span>
                    </div>

                    {/* === RIGHT LINE === */}
                    <div className="flex-1 mt-8 md:mt-12 -mx-4 relative -z-10 text-coral/40">
                        <EkgLine variant={ekgVariant} />
                    </div>

                    {/* === RIGHT AVATAR GROUP === */}
                    <div className="flex flex-col items-center shrink-0 z-10 w-32 md:w-40">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-[5px] border-white shadow-2xl overflow-hidden relative group transition-transform hover:scale-105 duration-300 ring-1 ring-slate-100 bg-white">
                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name1} />
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 tracking-tighter drop-shadow-sm text-center mt-3 break-words w-full leading-tight">
                            {user.name1}
                        </h1>
                    </div>

                </div>

                {/* Bottom Decoration */}
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