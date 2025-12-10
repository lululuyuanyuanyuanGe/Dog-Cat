import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export type QueueItem = {
    id: string;
    files: File[]; 
    date: string;
    type: string;
    content: string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
};

export const useUploadQueue = () => {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const supabase = createSupabaseBrowserClient();
    const router = useRouter();

    const addToQueue = (item: Omit<QueueItem, 'status' | 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        setQueue(prev => [...prev, { ...item, id, status: 'pending' }]);
    };

    const processItem = async (item: QueueItem) => {
        try {
            // Update status to uploading
            setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i));

            if (item.type === 'note') {
                 const res = await fetch('/api/memories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        date: item.date, 
                        type: item.type, 
                        content: item.content, 
                        media_url: null, 
                        metadata: {} 
                    }),
                });
                
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || res.statusText);
                }
            }
            else {
                // Sequential Uploads
                for (const file of item.files) {
                    const fileExt = file.name.split('.').pop();
                    const safeFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${safeFileName}.${fileExt}`;
                    const filePath = `${item.type}s/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('LoveTimelineMedias')
                        .upload(filePath, file, { upsert: true });

                    if (uploadError) throw new Error(`Storage: ${uploadError.message}`);

                    const { data: { publicUrl } } = supabase.storage
                        .from('LoveTimelineMedias')
                        .getPublicUrl(filePath);

                    const res = await fetch('/api/memories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            date: item.date,
                            type: item.type,
                            content: item.content,
                            media_url: publicUrl,
                            metadata: {
                                original_filename: file.name,
                                size: file.size,
                                mime_type: file.type
                            }
                        }),
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(`DB: ${errorData.error || res.statusText}`);
                    }
                }
            }

            // Success
            setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed' } : i));
            router.refresh();
            
            // Cleanup
            setTimeout(() => {
                setQueue(prev => prev.filter(i => i.id !== item.id));
            }, 5000);

        } catch (err: any) {
            console.error("Queue Error:", err);
            setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: err.message } : i));
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const nextItem = queue.find(i => i.status === 'pending');
        if (nextItem && !isProcessing) {
            setIsProcessing(true);
            processItem(nextItem);
        }
    }, [queue, isProcessing]);

    return { queue, addToQueue };
};