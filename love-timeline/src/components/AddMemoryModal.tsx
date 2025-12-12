'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Image as ImageIcon, Video, FileText, Mic, File as FileIcon, StopCircle, Play, Trash2 } from 'lucide-react';
import DatePicker from '@/components/DatePicker';
import { getRandomStyleId } from '@/lib/styles';

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
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Correct Local Date Calculation
  const getLocalDate = () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const [date, setDate] = useState<string>(getLocalDate());
  const [type, setType] = useState<MemoryType>('photo');
  
  // Content per type
  const [contentByType, setContentByType] = useState<Record<string, string>>({
      photo: '',
      video: '',
      audio: '',
      pdf: '',
      note: ''
  });
  const content = contentByType[type] || '';

  // State per type to persist selections
  const [filesByType, setFilesByType] = useState<Record<string, File[]>>({
      photo: [],
      video: [],
      audio: [],
      pdf: [],
      note: [] 
  });
  
  // Derived state for current view
  const files = filesByType[type] || [];
  
  const [error, setError] = useState<string | null>(null);

  // Check for unsaved changes
  const hasUnsavedChanges = () => {
      const hasFiles = Object.values(filesByType).some(arr => arr.length > 0);
      const hasContent = Object.values(contentByType).some(s => s.trim().length > 0);
      return hasFiles || hasContent;
  };

  const handleCloseAttempt = () => {
      if (hasUnsavedChanges()) {
          if (window.confirm("Discard unsaved changes?")) {
              resetAndClose();
          }
      } else {
          resetAndClose();
      }
  };

  const resetAndClose = () => {
      setFilesByType({ photo: [], video: [], audio: [], pdf: [], note: [] });
      setContentByType({ photo: '', video: '', audio: '', pdf: '', note: '' });
      stopRecordingCleanup();
      onClose();
  };

  // Cleanup on unmount or close
  useEffect(() => {
      if (!isOpen) {
          stopRecordingCleanup();
      }
      return () => stopRecordingCleanup();
  }, [isOpen]);

  const stopRecordingCleanup = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setRecordingTime(0);
  };

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  audioChunksRef.current.push(event.data);
              }
          };

          mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
              
              setFilesByType(prev => ({
                  ...prev,
                  audio: [...(prev.audio || []), audioFile]
              }));
              
              stream.getTracks().forEach(track => track.stop()); // Stop mic
          };

          mediaRecorder.start();
          setIsRecording(true);
          setRecordingTime(0);
          
          timerRef.current = setInterval(() => {
              setRecordingTime(prev => prev + 1);
          }, 1000);

      } catch (err) {
          console.error("Microphone access denied:", err);
          setError("Microphone access denied. Please allow permissions.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if (timerRef.current) clearInterval(timerRef.current);
      }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      const LIMITS: Record<string, number> = {
          photo: 5,
          video: 1,
          pdf: 3,
          audio: 1
      };

      const currentLimit = LIMITS[type] || 5;

      if (files.length + newFiles.length > currentLimit) {
          setError(`You can only upload a maximum of ${currentLimit} ${type}${currentLimit > 1 ? 's' : ''} at once.`);
          return;
      }

      setFilesByType(prev => ({
          ...prev,
          [type]: [...(prev[type] || []), ...newFiles]
      }));
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFilesByType(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const author = {
        name: currentUser?.display_name || "Me",
        avatar: currentUser?.avatar_url
    };

    // Generate a unique ID for this upload batch
    const batchId = crypto.randomUUID();
    let hasItems = false;

    try {
      // 1. NOTES (Always submit note if content exists and user is on note tab OR just generically?)
      // User request: "upload everything in once". 
      // If user typed a note on 'Note' tab, we should upload it.
      // But 'content' is shared caption.
      // If 'files' exist, 'content' is caption.
      // If no files, 'content' is a Note?
      // Logic: If on 'Note' tab, treat content as Note.
      // If on other tabs, content is caption for files.
      
      // Better Logic: Iterate types.
      
      // A. Process Files (Photo, Video, Audio, PDF)
      Object.entries(filesByType).forEach(([fileType, fileList]) => {
          if (fileList.length > 0) {
              hasItems = true;
              const typeContent = contentByType[fileType] || '';
              
              // Optimistic
              const tempMemories = fileList.map((file, i) => ({
                  id: `temp-${Date.now()}-${fileType}-${i}`,
                  user_id: currentUser?.id,
                  date,
                  type: fileType,
                  content: typeContent,
                  media_url: URL.createObjectURL(file),
                  created_at: new Date().toISOString(),
                  metadata: { 
                      original_filename: file.name, 
                      size: file.size, 
                      mime_type: file.type,
                      batchId 
                  },
                  author
              }));
              tempMemories.forEach(m => onAddOptimistic(m));

              // Queue
              addToQueue({
                  date,
                  type: fileType,
                  content: typeContent,
                  files: fileList,
                  author,
                  metadata: { batchId }
              });
          }
      });

      // B. Process Note (If content exists in 'note' type)
      const noteContent = contentByType['note'] || '';
      
      if (noteContent.trim()) {
          hasItems = true;
          const styleId = getRandomStyleId();
          const tempId = `temp-${Date.now()}-note`;
          
          const newNote = {
              id: tempId,
              user_id: currentUser?.id,
              date,
              type: 'note',
              content: noteContent,
              media_url: null,
              created_at: new Date().toISOString(),
              metadata: { styleId, batchId },
              author
          };
          onAddOptimistic(newNote);
          
          addToQueue({
              date,
              type: 'note',
              content: noteContent,
              files: [],
              author,
              metadata: { styleId, batchId }
          });
      }

      if (!hasItems) {
          throw new Error("Please add some files or write a note.");
      }

      resetAndClose();
      
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
            onClick={handleCloseAttempt}
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
              <button onClick={handleCloseAttempt} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-5 gap-2">
                <TypeButton t="photo" icon={ImageIcon} label="Photo" />
                <TypeButton t="video" icon={Video} label="Video" />
                <TypeButton t="note" icon={FileText} label="Note" />
                <TypeButton t="audio" icon={Mic} label="Audio" />
                <TypeButton t="pdf" icon={FileIcon} label="PDF" />
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
                    onChange={(e) => setContentByType(prev => ({ ...prev, [type]: e.target.value }))}
                    placeholder="Write something sweet..."
                    className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coral/50 text-sm resize-none"
                  />
                </div>

                {type !== 'note' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {type === 'audio' ? 'Voice Recorder' : 'Media Files'}
                    </label>
                    
                    {/* Audio Recorder UI */}
                    {type === 'audio' && files.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-coral/30 rounded-xl bg-coral/5 gap-4">
                            {isRecording ? (
                                <>
                                    <div className="text-4xl font-mono text-coral font-bold animate-pulse">{formatTime(recordingTime)}</div>
                                    <button 
                                        type="button" 
                                        onClick={stopRecording}
                                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                                    >
                                        <StopCircle size={32} />
                                    </button>
                                    <p className="text-xs text-coral/80 font-bold uppercase tracking-widest">Recording...</p>
                                </>
                            ) : (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={startRecording}
                                        className="w-16 h-16 rounded-full bg-coral hover:bg-coral-dark flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                                    >
                                        <Mic size={32} />
                                    </button>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tap to Record</p>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs text-slate-400 hover:text-coral underline mt-2"
                                    >
                                        or upload audio file
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {files.map((f, i) => (
                                <div key={i} className={`relative group/file ${f.type.startsWith('audio/') ? 'w-full' : ''}`}>
                                    {f.type.startsWith('image/') ? (
                                        <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center relative shadow-sm">
                                            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                                        </div>
                                    ) : f.type.startsWith('audio/') ? (
                                        <div className="w-full p-3 rounded-lg bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral shrink-0">
                                                <Mic size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 truncate">{f.name}</p>
                                                <p className="text-xs text-slate-400">{Math.round(f.size / 1024)} KB</p>
                                            </div>
                                            <audio controls src={URL.createObjectURL(f)} className="h-8 w-24" />
                                        </div>
                                    ) : f.type.startsWith('video/') ? (
                                        <div className="w-20 h-16 rounded-lg bg-black border border-slate-700 overflow-hidden flex items-center justify-center relative group shadow-sm">
                                            <video 
                                                src={URL.createObjectURL(f)} 
                                                className="w-full h-full object-cover opacity-80"
                                                muted
                                                playsInline
                                                onMouseOver={(e) => e.currentTarget.play()}
                                                onMouseOut={(e) => e.currentTarget.pause()}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="bg-black/30 rounded-full p-1 backdrop-blur-sm">
                                                    <Play size={12} className="text-white fill-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : f.type === 'application/pdf' || f.name.endsWith('.pdf') ? (
                                        <div className="w-full p-2 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3 shadow-sm">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-red-100 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                                                <FileIcon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-red-900/70 truncate">{f.name}</p>
                                                <span className="text-[10px] font-bold text-red-400 bg-white px-1.5 py-0.5 rounded border border-red-100">PDF</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center p-2 text-slate-500 shadow-sm">
                                            <FileIcon size={24} className="mb-1 opacity-50" />
                                            <span className="text-[10px] font-mono text-center w-full truncate">{f.name.split('.').pop()}</span>
                                        </div>
                                    )}
                                    
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover/file:opacity-100 transition-opacity z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {type !== 'audio' && (
                        <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                            files.length > 0 ? 'border-coral/50 bg-coral/5' : 'border-slate-300 hover:border-coral/50 hover:bg-white/50'
                        }`}
                        >
                        <Upload size={24} className="text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">
                            {files.length > 0 ? 'Add more files' : `Click to upload ${type}s`}
                        </p>
                        </div>
                    )}
                    
                    {/* Unified hidden input for all media types */}
                     <input
                        ref={fileInputRef}
                        type="file"
                        accept={getAcceptedFileTypes()}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                    />
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
                  onClick={handleCloseAttempt}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={type !== 'note' && files.length === 0 && !isRecording}
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