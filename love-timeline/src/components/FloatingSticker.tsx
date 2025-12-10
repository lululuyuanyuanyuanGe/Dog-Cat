import React from 'react';
import Icon from './Icon';

interface FloatingStickerProps {
    text: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    rot: string;
    delay: string;
}

const FloatingSticker: React.FC<FloatingStickerProps> = ({ text, top, left, right, bottom, rot, delay }) => (
    <div
        className="absolute z-0 pointer-events-none animate-float-slow"
        style={{
            top, left, right, bottom,
            '--rot': rot,
            animationDelay: delay
        } as React.CSSProperties}
    >
        <div className="bg-white px-5 py-2 rounded-full sticker-dash flex items-center gap-2 transform hover:scale-110 transition-transform duration-500 shadow-sm opacity-60 hover:opacity-100">
            <Icon name="sparkles" size={14} className="text-yellow-400 fill-current" />
            <span className="font-hand text-slate text-sm font-bold whitespace-nowrap">{text}</span>
            <Icon name="heart" size={14} className="text-coral fill-current" />
        </div>
    </div>
);

export default FloatingSticker;