import React from 'react';
import WashiTape from './WashiTape';
import { getPhotoStyle } from '@/lib/styles';

interface PhotoCardProps {
    item: {
        id?: string;
        src: string;
        media_urls?: string[]; 
        content?: string;
        sticker?: {
            text: string;
        };
    };
    onClick?: (index: number) => void; // Changed signature
}

const STYLES = [
    { type: 'classic', border: 'border-[6px] border-white bg-white', rotate: 'rotate-1', text: 'text-slate/80', tape: true },
    { type: 'film', border: 'border-x-[8px] border-y-[12px] border-zinc-900 bg-zinc-900', rotate: '-rotate-1', text: 'text-white/70', tape: false },
    { type: 'clean', border: 'border-4 border-slate-100 bg-slate-100', rotate: 'rotate-0', text: 'text-slate-600', tape: false },
    { type: 'retro', border: 'border-[8px] border-[#f0f0f0] bg-[#f0f0f0]', rotate: 'rotate-2', text: 'text-slate/60', tape: true },
];

const PhotoCard: React.FC<PhotoCardProps> = ({ item, onClick }) => {
    const seed = (item.id || item.src).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const style = STYLES[seed % STYLES.length];

    const images = item.media_urls && item.media_urls.length > 0 ? item.media_urls : [item.src];
    const isMulti = images.length > 1;

    const handleClick = (e: React.MouseEvent, index: number) => {
        // We let parent handle stopPropagation if needed, but here we just pass index
        onClick?.(index);
    };

    return (
        <div className={`h-full w-full relative shadow-md hover:shadow-xl transition-shadow pb-12 duration-300 group ${style.border} ${style.rotate} hover:rotate-0`}>
            {style.tape && <WashiTape className={`-top-3 ${seed % 2 === 0 ? 'left-10' : 'right-10'} rotate-[-2deg]`} />}
            
            <div className="w-full h-full overflow-hidden relative bg-gray-100 cursor-zoom-in">
                {isMulti ? (
                    <div className={`grid h-full w-full gap-[2px] ${
                        images.length === 2 ? 'grid-cols-2' : 
                        images.length === 3 ? 'grid-cols-2 grid-rows-2' : 
                        'grid-cols-2 grid-rows-2'
                    }`}>
                        {images.slice(0, 4).map((img, i) => (
                            <div 
                                key={i} 
                                className={`relative overflow-hidden ${
                                    images.length === 3 && i === 0 ? 'row-span-2' : ''
                                }`}
                                onClick={(e) => handleClick(e, i)}
                            >
                                <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {i === 3 && images.length > 4 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                        +{images.length - 4}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <img 
                        src={images[0]} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        onClick={(e) => handleClick(e, 0)}
                    />
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-12 flex items-center justify-center px-4 pointer-events-none">
                 <span className={`font-pen text-xl truncate w-full text-center ${style.text}`}>
                    {item.content || (style.type === 'film' ? 'Captured Moment' : 'Lovely day')}
                 </span>
            </div>
        </div>
    );
};

export default PhotoCard;
