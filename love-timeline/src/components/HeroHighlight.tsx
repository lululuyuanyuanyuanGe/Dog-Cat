import React from 'react';
import Icon from './Icon';
import DoodleArrow from './DoodleArrow';
import DoodleUnderline from './DoodleUnderline';

type Props = {
    user: {
        avatar: string;
        partnerAvatar: string;
    }
};

const HeroHighlight = ({ user }: Props) => (
    <div className="w-full max-w-4xl mx-auto pt-12 pb-6 px-4 z-10 relative">
        <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-white/50 to-blue-100/30 blur-3xl rounded-full -z-10 transform scale-150"></div>
            <div className="flex items-center gap-4 md:gap-8 mb-6 animate-in fade-in zoom-in duration-1000">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl overflow-hidden relative group">
                    <img src={user.partnerAvatar} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative w-24 md:w-32">
                    <div className="w-full border-t-2 border-dashed border-coral/40 absolute top-1/2 -translate-y-1/2"></div>
                    <div className="bg-white p-2 rounded-full border border-rose-100 shadow-sm relative z-10 animate-pulse-slow">
                        <Icon name="heart" size={24} className="text-coral fill-coral" />
                    </div>
                </div>
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl overflow-hidden relative group">
                    <img src={user.avatar} className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="text-center relative">
                <DoodleArrow />
                <h1 className="font-display font-bold text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-coral via-rose-500 to-orange-400 tracking-tighter drop-shadow-sm leading-tight">
                    luyuan & Claire<br className="md:hidden" /> 
                </h1>
                <div className="inline-block relative mt-2">
                    <p className="font-hand text-slate/50 text-lg md:text-xl rotate-[-2deg]">( One Life, One Love, Forever )</p>
                    <DoodleUnderline />
                </div>
            </div>
        </div>
    </div>
);

export default HeroHighlight;
