import React from 'react';
import FloatingSticker from './FloatingSticker';
import BackgroundBlobs from './BackgroundBlobs';
import { Star, Heart, Cloud, Music, Sparkle, Sun } from 'lucide-react';

const BackgroundDecorations = () => (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <BackgroundBlobs />
        
        {/* Text Stickers */}
        <FloatingSticker text="開心小狗" top="15%" left="5%" rot="-5deg" delay="0s" />
        <FloatingSticker text="好的好的" top="25%" right="8%" rot="6deg" delay="2s" />
        <FloatingSticker text="畫畫超棒的貓貓 💫" bottom="20%" left="10%" rot="-3deg" delay="4s" />
        <FloatingSticker text="拜哺" top="60%" right="15%" rot="4deg" delay="1s" />
        <FloatingSticker text="YIPPEE!!! ✌️" bottom="10%" right="30%" rot="-2deg" delay="3s" />
        <FloatingSticker text="天天想你 💖" top="40%" left="8%" rot="3deg" delay="5s" />
        <FloatingSticker text="話癆貓貓 🍱" bottom="35%" right="5%" rot="-4deg" delay="2.5s" />
        <FloatingSticker text="抱抱 🤗" top="80%" left="25%" rot="2deg" delay="1.5s" />
        <FloatingSticker text="失眠小狗 🌹" top="10%" right="40%" rot="-2deg" delay="4.5s" />

        {/* Icon Doodles */}
        {/* Top Left Cluster */}
        <div className="absolute top-[10%] left-[15%] animate-float" style={{ animationDelay: '1s' }}>
            <Star size={24} className="text-yellow-300 fill-yellow-100 opacity-60 rotate-12" />
        </div>
        <div className="absolute top-[5%] left-[25%] animate-float" style={{ animationDelay: '3s' }}>
            <Cloud size={32} className="text-sky-200 fill-sky-50 opacity-50 -rotate-6" />
        </div>

        {/* Top Right Cluster */}
        <div className="absolute top-[18%] right-[20%] animate-float" style={{ animationDelay: '0.5s' }}>
            <Heart size={20} className="text-rose-300 fill-rose-100 opacity-50 rotate-45" />
        </div>
        <div className="absolute top-[8%] right-[5%] animate-float" style={{ animationDelay: '2.5s' }}>
            <Sun size={40} className="text-orange-300 fill-orange-50 opacity-40 rotate-12" />
        </div>

        {/* Mid/Side */}
        <div className="absolute top-[45%] left-[2%] animate-float" style={{ animationDelay: '4s' }}>
            <Music size={28} className="text-violet-300 opacity-40 -rotate-12" />
        </div>
        <div className="absolute top-[55%] right-[3%] animate-float" style={{ animationDelay: '1.5s' }}>
            <Sparkle size={32} className="text-amber-300 fill-amber-50 opacity-50 rotate-90" />
        </div>

        {/* Bottom Area */}
        <div className="absolute bottom-[15%] left-[20%] animate-float" style={{ animationDelay: '2s' }}>
            <Heart size={24} className="text-pink-400 fill-pink-200 opacity-40 -rotate-12" />
        </div>
        <div className="absolute bottom-[25%] right-[10%] animate-float" style={{ animationDelay: '3.5s' }}>
            <Star size={18} className="text-yellow-400 fill-yellow-200 opacity-50 rotate-[30deg]" />
        </div>
        <div className="absolute bottom-[5%] left-[40%] animate-float" style={{ animationDelay: '0.8s' }}>
            <Cloud size={48} className="text-slate-200 fill-white opacity-30 rotate-2" />
        </div>
    </div>
);

export default BackgroundDecorations;