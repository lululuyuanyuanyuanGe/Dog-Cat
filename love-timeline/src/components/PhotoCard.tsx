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
    onSingleClick?: (e: React.MouseEvent, index: number) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ item, onSingleClick }) => {
    const style = getPhotoStyle(item.id || item.src);

    const images = item.media_urls && item.media_urls.length > 0 ? item.media_urls : [item.src];
    const isMulti = images.length > 1;

    // Grid Configuration
    const getGridClass = () => {
        if (images.length === 2) return 'grid-cols-2';
        if (images.length === 3) return 'grid-cols-2 grid-rows-2';
        if (images.length === 4) return 'grid-cols-2 grid-rows-2';
        if (images.length === 5) return 'grid-cols-6 grid-rows-2'; // Special 5-item layout
        return 'grid-cols-2 grid-rows-2'; // Default/Overflow
    };

    const getImageSpan = (index: number, total: number) => {
        if (total === 3 && index === 0) return 'row-span-2';
        if (total === 5) {
            // Row 1: 3 items (span 2)
            // Row 2: 2 items (span 3)
            if (index < 3) return 'col-span-2';
            return 'col-span-3';
        }
        return '';
    };

    return (
        <div 
            className={`h-full w-full relative shadow-md hover:shadow-xl transition-shadow duration-300 group ${style.border} ${style.rotate} hover:rotate-0`}
            style={style.css}
        >
            {style.tape && <WashiTape className={`-top-3 ${((item.id?.length || 0) % 2) === 0 ? 'left-10' : 'right-10'} rotate-[-2deg]`} />}
            
            <div 
                className="w-full h-full overflow-hidden relative bg-gray-100 cursor-zoom-in"
            >
                {isMulti ? (
                    <div className={`grid h-full w-full gap-[2px] ${getGridClass()}`}>
                        {images.slice(0, 5).map((img, i) => (
                            <div 
                                key={i} 
                                className={`relative overflow-hidden ${getImageSpan(i, Math.min(images.length, 5))}`}
                                onClick={(e) => onSingleClick?.(e, i)}
                            >
                                <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {i === 4 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                        +{images.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <img 
                        src={images[0]} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        onClick={(e) => onSingleClick?.(e, 0)}
                    />
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-12 flex items-center justify-center px-4 pointer-events-none">
                 <span className={`font-pen text-xl truncate w-full text-center ${style.text}`}>
                    {item.content || (style.type === 'Film Strip' ? 'Captured Moment' : 'Lovely day')}
                 </span>
            </div>
        </div>
    );
};

export default PhotoCard;