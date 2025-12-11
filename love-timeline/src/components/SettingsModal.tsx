'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, User, Save } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; 
  onProfileUpdate: (newData: any) => void; // Callback for optimistic update
}

export default function SettingsModal({ isOpen, onClose, user, onProfileUpdate }: SettingsModalProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Create preview
      setAvatarUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // 1. Upload new avatar if selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('LoveTimelineMedias') // Using your specific bucket
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw new Error(`Avatar upload failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from('LoveTimelineMedias')
          .getPublicUrl(filePath);
          
        finalAvatarUrl = publicUrl;
      }

      // 2. Update User Profile in DB
      const { error: updateError } = await supabase
        .from('users')
        // @ts-ignore
        .update({
          display_name: displayName,
          avatar_url: finalAvatarUrl
        })
        .eq('id', user.id);

      if (updateError) throw new Error(updateError.message);

      // 3. Optimistic Update & Close
      // We use 'avatarUrl' here because if a file was selected, it contains the Blob URL which is instant.
      // If no file was selected, it contains the existing URL.
      onProfileUpdate({ ...user, display_name: displayName, avatar_url: avatarUrl });
      router.refresh();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/30">
              <h2 className="text-xl font-bold font-clash text-slate-700">Edit Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg cursor-pointer group overflow-hidden bg-slate-100"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={24} className="text-white" />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-bold text-coral hover:underline"
                >
                  Change Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50 font-display font-bold text-slate-700"
                  placeholder="Your Name"
                />
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
                  disabled={isSaving}
                  className="bg-coral text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-coral/20 hover:shadow-coral/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}