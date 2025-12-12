import React, { useRef, useState } from 'react';
import Icon from './Icon';

interface AudioCardProps {
    item: {
        src: string;
        content?: string;
        time?: string;
    };
}

const AudioCard: React.FC<AudioCardProps> = ({ item }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="h-full w-full relative bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition rounded-xl group">
            <audio 
                ref={audioRef} 
                src={item.src} 
                onEnded={() => setIsPlaying(false)} 
                className="hidden"
            />
            
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <button 
                    onClick={togglePlay}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 ${isPlaying ? 'bg-rose-400 text-white animate-pulse-slow' : 'bg-white text-rose-400 border-2 border-rose-100'}`}
                >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={28} className={isPlaying ? "fill-current" : "fill-current ml-1"} />
                </button>
                
                {/* Visual Waveform (CSS) */}
                <div className="flex items-center gap-1 h-8">
                    {[...Array(10)].map((_, i) => {
                        // Deterministic height for hydration stability
                        const height = ((i * 13 + (item.src?.length || 0)) % 20) + 8;
                        return (
                            <div 
                                key={i} 
                                className={`w-1 bg-rose-300 rounded-full transition-all duration-300 ${isPlaying ? 'animate-music-bar' : 'h-3'}`}
                                style={{ 
                                    height: isPlaying ? undefined : `${height}px`,
                                    animationDelay: `${i * 0.1}s` 
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {item.content && (
                <div className="mt-4 pt-3 border-t border-rose-100/50">
                    <p className="font-hand text-lg text-slate-600 text-center leading-tight line-clamp-2">
                        "{item.content}"
                    </p>
                </div>
            )}
            
            {item.time && (
                <span className="absolute top-3 right-3 text-[10px] font-mono text-rose-300">
                    {item.time}
                </span>
            )}
        </div>
    );
};

export default AudioCard;