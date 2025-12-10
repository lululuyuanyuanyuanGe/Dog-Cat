import React from 'react';
import WashiTape from './WashiTape';

interface PhotoCardProps {
    item: {
        src: string;
        sticker?: {
            text: string;
        };
    };
}

const PhotoCard: React.FC<PhotoCardProps> = ({ item }) => (
    <div className="h-full w-full relative bg-white border-[6px] border-white shadow-md hover:shadow-xl transition-shadow pb-12 rotate-1 hover:rotate-0 duration-300">
        <WashiTape className="-top-3 left-10 rotate-[-2deg]" />
        <div className="w-full h-full overflow-hidden relative bg-gray-100">
            <img src={item.src} className="w-full h-full object-cover" />
        </div>
        {/* Handwritten Caption Area */}
        <div className="absolute bottom-0 left-0 w-full h-12 flex items-center justify-center">
             <span className="font-pen text-2xl text-slate/80">{item.sticker ? item.sticker.text : "Lovely day"}</span>
        </div>
    </div>
);

export default PhotoCard;