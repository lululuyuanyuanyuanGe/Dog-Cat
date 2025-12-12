import React from 'react';
import Icon from './Icon';

interface PdfCardProps {
    item: {
        title: string;
        sizeLabel?: string;
        src: string;
    };
}

const PdfCard: React.FC<PdfCardProps> = ({ item }) => (
    <div className="h-full w-full relative bg-cream border border-gray-200 p-4 flex flex-col justify-between group-hover:bg-white transition paper-fold shadow-sm hover:shadow-md rotate-[-2deg] hover:rotate-0">
         <div className="absolute -top-3 right-8 text-gray-400 transform rotate-12 z-20"><Icon name="Paperclip" size={32} /></div>
         <div className="flex items-start gap-4 mt-2">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center text-rose-500 shrink-0 border border-rose-200"><Icon name="File" size={24} /></div>
            <div className="min-w-0">
                <h4 className="font-bold text-slate text-sm truncate leading-tight mb-1">{item.title}</h4>
                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.sizeLabel || 'DOC'}</span>
            </div>
         </div>
         <a 
            href={item.src} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-xs font-bold text-slate/60 hover:bg-coral hover:border-coral hover:text-white transition cursor-pointer"
         >
            <Icon name="Download" size={14} /> View File
         </a>
         <div className="paper-corner"></div>
    </div>
);

export default PdfCard;