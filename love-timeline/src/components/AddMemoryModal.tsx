'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Image as ImageIcon, Video, FileText, Mic, File } from 'lucide-react';
import DatePicker from '@/components/DatePicker';

type MemoryType = 'photo' | 'video' | 'note' | 'audio' | 'pdf';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOptimistic: (newMemory: any) => void;
  currentUser: any;
  addToQueue: (item: any) => void; 
}

export default function AddMemoryModal({ isOpen, onClose, onAddOptimistic, currentUser, addToQueue }: AddMemoryModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Correct Local Date Calculation
  const getLocalDate = () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const [date, setDate] = useState<string>(getLocalDate());
  const [type, setType] = useState<MemoryType>('photo');
  const [content, setContent] = useState('');
  
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const author = {
        name: currentUser?.display_name || "Me",
        avatar: currentUser?.avatar_url
    };

    try {
      // 1. NOTES
      if (type === 'note') {
          // Optimistic
          const tempId = `temp-${Date.now()}`;
          const newNote = {
              id: tempId,
              date,
              type,
              content,
              media_url: null,
              created_at: new Date().toISOString(),
              metadata: {},
              author
          };
          onAddOptimistic(newNote);
          
          // Queue Background Upload
          addToQueue({
              date,
              type,
              content,
              files: [], // No files
              author
          });
      } 
      // 2. MEDIA
      else {
          if (files.length === 0) throw new Error('Please select at least one file.');

          // Optimistic
          const tempMemories = files.map((file, i) => ({
              id: `temp-${Date.now()}-${i}`,
              date,
              type,
              content,
              media_url: URL.createObjectURL(file),
              created_at: new Date().toISOString(),
              metadata: { original_filename: file.name, size: file.size, mime_type: file.type },
              author
          }));
          tempMemories.forEach(m => onAddOptimistic(m));

          // Queue Background Upload
          addToQueue({
              date,
              type,
              content,
              files: files, // All files
              author
          });
      }

      // Close Immediately - No Waiting!
      onClose();
      
      // Reset Form
      setContent('');
      setFiles([]);
      // Reset date to today? No, maybe they want to add another for same date.
      // But if they close and reopen, 'isOpen' check logic in useEffect (if existed) would reset it?
      // State persists here.
      
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-cream/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-visible max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/30 sticky top-0 z-10 backdrop-blur-md">
              <h2 className="text-xl font-bold font-clash text-slate-700">Add New Memory</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-5 gap-2">
                <TypeButton t="photo" icon={ImageIcon} label="Photo" />
                <TypeButton t="video" icon={Video} label="Video" />
                <TypeButton t="note" icon={FileText} label="Note" />
                <TypeButton t="audio" icon={Mic} label="Audio" />
                <TypeButton t="pdf" icon={File} label="PDF" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <DatePicker value={date} onChange={setDate} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {type === 'note' ? 'Message' : 'Caption (Applied to all)'}
                  </label>
                  <textarea
                    rows={type === 'note' ? 4 : 2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something sweet..."
                    className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coral/50 text-sm resize-none"
                  />
                </div>

                {type !== 'note' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {type === 'audio' ? 'Voice/Audio Files' : 'Media Files'}
                    </label>
                    
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {files.map((f, i) => (
                                <div key={i} className="relative group/file">
                                    <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                                        {f.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <span className="text-[10px] text-slate-500 font-mono p-1 text-center break-all">{f.name.slice(0, 10)}...</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/file:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        files.length > 0 ? 'border-coral/50 bg-coral/5' : 'border-slate-300 hover:border-coral/50 hover:bg-white/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={getAcceptedFileTypes()}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                      />
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                          {files.length > 0 ? 'Add more files' : `Click to upload ${type}s`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

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
                  disabled={type !== 'note' && files.length === 0}
                  className="bg-coral text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-coral/20 hover:shadow-coral/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Add Memory
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}