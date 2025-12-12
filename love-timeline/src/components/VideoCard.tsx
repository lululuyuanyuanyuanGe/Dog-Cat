import React from 'react';
import Icon from './Icon';

interface VideoCardProps {
    item: {
        src: string;
        content?: string;
    };
}

const VideoCard: React.FC<VideoCardProps> = ({ item }) => (
    <div className="relative w-full h-full group bg-black rounded-xl overflow-hidden shadow-lg border-4 border-white rotate-1 hover:rotate-0 transition-all">
        <video 
            src={item.src} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
            muted
            playsInline
            loop
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => e.currentTarget.pause()}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/60 shadow-lg group-hover:scale-110 transition">
                <Icon name="Play" className="text-white fill-white ml-1" />
            </div>
        </div>
        
        {/* Caption */}
        {item.content && (
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                 <p className="text-white/90 text-xs font-medium text-center truncate px-2 font-hand tracking-wide">{item.content}</p>
            </div>
        )}

        {/* Film Strips decoration */}
        <div className="absolute top-0 left-0 w-full h-4 bg-repeat-x opacity-30 pointer-events-none" style={{backgroundImage: 'linear-gradient(to right, black 50%, transparent 50%)', backgroundSize: '10px 100%'}}></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-repeat-x opacity-30 pointer-events-none" style={{backgroundImage: 'linear-gradient(to right, black 50%, transparent 50%)', backgroundSize: '10px 100%'}}></div>
    </div>
);

export default VideoCard;