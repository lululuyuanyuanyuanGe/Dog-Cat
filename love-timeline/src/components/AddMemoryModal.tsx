'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Image as ImageIcon, Video, FileText, Mic, File } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import DatePicker from '@/components/DatePicker';

// Updated to match the new DB schema (Audio instead of Music)
type MemoryType = 'photo' | 'video' | 'note' | 'audio' | 'pdf';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemoryModal({ isOpen, onClose }: AddMemoryModalProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<MemoryType>('photo');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      let media_url = null;

      // 1. Upload File (if applicable)
      // Note: 'note' type generally doesn't have a file, but others do.
      if (type !== 'note' && file) {
        setIsUploading(true);
        
        // Sanitize filename to avoid issues
        const fileExt = file.name.split('.').pop();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${Date.now()}-${safeFileName}.${fileExt}`;
        const filePath = `${type}s/${fileName}`; // e.g., photos/123_abc.jpg

        const { error: uploadError } = await supabase.storage
          .from('media') // Ensure this bucket exists in Supabase
          .upload(filePath, file);

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        media_url = publicUrl;
        setIsUploading(false);
      }

      // 2. Save Memory to DB via API
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          type,
          content,
          media_url,
          metadata: {
            original_filename: file?.name,
            size: file?.size,
            mime_type: file?.type
          }
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save memory');
      }

      // 3. Success
      router.refresh(); // Refresh server components to show new data
      onClose();
      // Reset form
      setContent('');
      setFile(null);
      // We keep the date as is, usually user wants to add more for same day or just close.
      
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  // Helper to render type selector
  const TypeButton = ({ t, icon: Icon, label }: { t: MemoryType; icon: any; label: string }) => (
    <button
      type="button"
      onClick={() => setType(t)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 ${
        type === t
          ? 'border-coral bg-coral/10 text-coral'
          : 'border-transparent bg-white/50 hover:bg-white/80 text-slate-500'
      }`}
    >
      <Icon size={20} className="mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  // Helper to determine accepted file types
  const getAcceptedFileTypes = () => {
    switch (type) {
      case 'photo': return 'image/*';
      case 'video': return 'video/*';
      case 'audio': return 'audio/*';
      case 'pdf': return '.pdf';
      default: return '*/*';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-cream/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-visible"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/30">
              <h2 className="text-xl font-bold font-clash text-slate-700">Add New Memory</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type Selection */}
              <div className="grid grid-cols-5 gap-2">
                <TypeButton t="photo" icon={ImageIcon} label="Photo" />
                <TypeButton t="video" icon={Video} label="Video" />
                <TypeButton t="note" icon={FileText} label="Note" />
                <TypeButton t="audio" icon={Mic} label="Audio" />
                <TypeButton t="pdf" icon={File} label="PDF" />
              </div>

              {/* Date & Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  {/* Custom Date Picker Replacement */}
                  <DatePicker value={date} onChange={setDate} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {type === 'note' ? 'Message' : 'Caption'}
                  </label>
                  <textarea
                    rows={type === 'note' ? 4 : 2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something sweet..."
                    className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coral/50 text-sm resize-none"
                  />
                </div>

                {/* File Upload (Hidden for Note type) */}
                {type !== 'note' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {type === 'audio' ? 'Voice/Audio File' : 'Media File'}
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        file ? 'border-coral bg-coral/5' : 'border-slate-300 hover:border-coral/50 hover:bg-white/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={getAcceptedFileTypes()}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {file ? (
                        <div className="text-center">
                          <p className="text-sm font-medium text-coral">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500">Click to upload {type}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || (type !== 'note' && !file)}
                  className="bg-coral text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-coral/20 hover:shadow-coral/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {(isUploading || isSaving) ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      {isUploading ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    'Add Memory'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
