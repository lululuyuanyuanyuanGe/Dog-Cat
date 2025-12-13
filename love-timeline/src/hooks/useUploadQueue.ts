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
    metadata?: any;
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
                        metadata: item.metadata || {} 
                    }),
                });
                
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || res.statusText);
                }
            }
            else {
                // Sequential Uploads (Strict Mode for Stability Debugging)
                console.log(`Starting processing for ${item.files.length} files...`);
                
                for (const [index, file] of item.files.entries()) {
                    console.log(`Processing file ${index + 1}/${item.files.length}: ${file.name} (${file.type})`);
                    
                    const fileExt = file.name.split('.').pop();
                    const safeFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${safeFileName}.${fileExt}`;
                    
                    const folder = item.type === 'pdf' ? 'pdfs' : 
                                   item.type === 'video' ? 'videos' : 
                                   item.type === 'audio' ? 'audios' : 'photos';
                                   
                    const filePath = `${folder}/${fileName}`;

                    // 1. Upload to Storage
                    console.log(`Uploading to ${filePath}...`);
                    const { error: uploadError, data: uploadData } = await supabase.storage
                        .from('LoveTimelineMedias')
                        .upload(filePath, file, { 
                            upsert: true,
                            contentType: file.type 
                        });

                    if (uploadError) {
                        console.error("Storage Upload Failed:", uploadError);
                        throw new Error(`Storage: ${uploadError.message}`);
                    }
                    console.log("Upload success:", uploadData);

                    // 2. Get Public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('LoveTimelineMedias')
                        .getPublicUrl(filePath);

                    // 3. Insert to DB
                    console.log("Inserting to DB...", publicUrl);
                    const res = await fetch('/api/memories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            date: item.date,
                            type: item.type,
                            content: item.content,
                            media_url: publicUrl,
                            metadata: {
                                ...(item.metadata || {}),
                                original_filename: file.name,
                                size: file.size,
                                mime_type: file.type
                            }
                        }),
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        console.error("DB Insert Failed:", errorData);
                        throw new Error(`DB: ${errorData.error || res.statusText}`);
                    }
                    console.log("DB Insert success");
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