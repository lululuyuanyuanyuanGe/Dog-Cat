"use client"

import React, { useMemo, useState, useEffect } from 'react';
import PhotoCard from './PhotoCard';
import NoteCard from './NoteCard';
import VideoCard from './VideoCard';
import PdfCard from './PdfCard';

// This will eventually come from the database
type MemoryType = 'photo' | 'note' | 'video' | 'pdf';

interface ScrapbookItemProps {
  item: {
    type: MemoryType;
    size: 'small' | 'medium' | 'large' | 'wide';
    [key: string]: any; // Loosening type for now, will be tightened with DB schema
  };
}

const ScrapbookItem: React.FC<ScrapbookItemProps> = ({ item }) => {
    const getSpan = () => {
        if (item.size === 'large') return 'col-span-1 md:col-span-2 md:row-span-2';
        if (item.size === 'wide') return 'col-span-1 md:col-span-2';
        return 'col-span-1';
    };

    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const randomRotation = Math.floor(Math.random() * 6) - 3;
        setRotation(randomRotation);
    }, []); // Empty dependency array ensures this runs only once on the client

    return (
        <div
            className={`relative group transition-all duration-300 ${getSpan()}`}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className="w-full h-full hover:scale-[1.02] hover:rotate-0 transition-transform duration-300 ease-out hover:z-10">
                {item.type === 'photo' && <PhotoCard item={item} />}
                {item.type === 'note' && <NoteCard item={item} />}
                {item.type === 'video' && <VideoCard item={item} />}
                {item.type === 'pdf' && <PdfCard item={item} />}
            </div>
        </div>
    );
};

export default ScrapbookItem;
