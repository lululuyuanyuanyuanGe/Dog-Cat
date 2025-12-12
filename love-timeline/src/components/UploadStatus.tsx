'use client';

import React from 'react';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { QueueItem } from '@/hooks/useUploadQueue';

interface UploadStatusProps {
    queue: QueueItem[];
}

const UploadStatus: React.FC<UploadStatusProps> = ({ queue }) => {
    if (queue.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none">
            {queue.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-xl p-3 flex items-center gap-3 w-64 pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-300"
                >
                    {/* Icon based on Status */}
                    <div className="shrink-0">
                        {item.status === 'pending' && <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50" />}
                        {item.status === 'uploading' && <Loader2 className="w-8 h-8 text-coral animate-spin" />}
                        {item.status === 'completed' && <CheckCircle className="w-8 h-8 text-green-500" />}
                        {item.status === 'error' && <AlertCircle className="w-8 h-8 text-red-500" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">
                            {item.type === 'photo' ? `${item.files.length} Photos` : 
                             item.type === 'note' ? 'New Note' : 
                             `${item.type} Upload`}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                            {item.status === 'pending' && 'Waiting...'}
                            {item.status === 'uploading' && 'Uploading...'}
                            {item.status === 'completed' && 'Done!'}
                            {item.status === 'error' && (item.error || 'Failed')}
                        </p>
                    </div>

                    {item.status === 'error' && (
                         <button className="text-slate-400 hover:text-slate-600">
                             <X size={14} />
                         </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UploadStatus;