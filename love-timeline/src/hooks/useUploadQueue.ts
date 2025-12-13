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

    // Helper: Simple Image Compression
    const compressImage = async (file: File): Promise<File> => {
        if (!file.type.startsWith('image/')) return file;
        
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(url);
                    return resolve(file);
                }

                const maxWidth = 1920;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url);
                    if (!blob) return resolve(file);
                    resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
                }, 'image/jpeg', 0.8);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(file);
            };
        });
    };

    const processItem = async (item: QueueItem) => {
        try {
            // Update status to uploading
            setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i));

            if (item.type === 'note') {
                 // Note logic remains same...
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
                console.log(`Starting parallel processing for ${item.files.length} files...`);

                // 1. Parallel Storage Uploads with Compression
                const uploadPromises = item.files.map(async (originalFile) => {
                    console.log(`Processing file: ${originalFile.name}`);
                    // Compress if image
                    const file = await compressImage(originalFile);
                    
                    const fileExt = file.name.split('.').pop();
                    const safeFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${safeFileName}.${fileExt}`;
                    
                    const folder = item.type === 'pdf' ? 'pdfs' : 
                                   item.type === 'video' ? 'videos' : 
                                   item.type === 'audio' ? 'audios' : 'photos';
                                   
                                        const filePath = `${folder}/${fileName}`;
                    
                                        // Upload
                                        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                                        console.log(`Uploading to ${filePath}... (${sizeMB} MB, Type: ${file.type})`);
                                        
                                        if (parseFloat(sizeMB) > 50) console.warn(`Large file detected.`);
                    
                                        // Upload with Timeout Race
                                        const uploadPromise = supabase.storage
                                            .from('LoveTimelineMedias')
                                            .upload(filePath, file, {
                                                upsert: true,
                                                contentType: file.type 
                                            });
                    
                                        const timeoutPromise = new Promise((_, reject) => 
                                            setTimeout(() => reject(new Error("Upload timed out (30s)")), 30000)
                                        );
                    
                                        // @ts-ignore
                                        const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);
                    
                    if (uploadError) {
                        console.error(`Upload failed for ${file.name}:`, uploadError);
                        throw new Error(uploadError.message);
                    }
                    console.log(`Upload success for ${file.name}`);

                    const { data: { publicUrl } } = supabase.storage
                        .from('LoveTimelineMedias')
                        .getPublicUrl(filePath);
                    
                    return { file, publicUrl };
                });

                // Wait for all uploads (handling successes and failures)
                const results = await Promise.allSettled(uploadPromises);
                
                const successfulUploads = results
                    .filter((r): r is PromiseFulfilledResult<{file: File, publicUrl: string}> => r.status === 'fulfilled')
                    .map(r => r.value);

                const failures = results
                    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
                    .map(r => r.reason);

                if (failures.length > 0) {
                    console.error("Upload Failures Details:", failures);
                    console.warn(`${failures.length} uploads failed.`);
                }

                if (successfulUploads.length === 0 && item.files.length > 0) {
                    throw new Error(`All file uploads failed. Last error: ${failures[0]?.message || 'Unknown'}`);
                }

                // 2. Batch DB Insert
                const batchPayload = successfulUploads.map(({ file, publicUrl }) => ({
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
                }));

                if (batchPayload.length > 0) {
                    console.log(`Batch inserting ${batchPayload.length} records to DB...`);
                    const res = await fetch('/api/memories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(batchPayload),
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(`DB: ${errorData.error || res.statusText}`);
                    }
                    console.log("DB Batch Insert success");
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