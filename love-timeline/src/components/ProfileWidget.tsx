'use client';

import React, { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { LogIn, LogOut, Settings, ChevronDown, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import SettingsModal from './SettingsModal';

type Props = {
    initialUser?: any; 
    onUserChange?: (user: any) => void;
};

const ProfileWidget = ({ initialUser, onUserChange }: Props) => {
    const [user, setUser] = useState<any>(initialUser || null);
    const [isLoading, setIsLoading] = useState(!initialUser);
    const [isOpen, setIsOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    const supabase = createSupabaseBrowserClient();
    const router = useRouter();

    // Propagate user changes to parent
    useEffect(() => {
        if (onUserChange) {
            onUserChange(user);
        }
    }, [user, onUserChange]);

    useEffect(() => {
        // Check active session
        const getUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // Fetch profile data
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    
                    // Merge auth user with profile data
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(null);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
             if (session?.user) {
                 // Fetch updated profile immediately to show changes
                 const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                 
                 setUser({ ...session.user, ...profile });
                 setIsLoading(false);
                 router.refresh();
             } else {
                 setUser(null);
                 setIsLoading(false);
                 router.refresh();
             }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    const handleLogout = async () => {
        // Optimistic UI update: Clear user immediately
        setIsOpen(false);
        setUser(null);
        
        try {
            await supabase.auth.signOut();
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (isLoading) return null;

    if (!user) {
        return (
            <>
                <div className="fixed top-6 right-6 z-[100]">
                    <button
                        onClick={() => setShowLogin(true)}
                        className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-4 py-2 rounded-full border border-white shadow-lg hover:bg-white hover:scale-105 transition-all text-slate-600 font-bold text-sm"
                    >
                        <LogIn size={16} />
                        <span>Sign In</span>
                    </button>
                </div>
                <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
            </>
        );
    }

    return (
        <>
            <div className="fixed top-6 right-6 z-[100]">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 bg-white/70 backdrop-blur-xl p-2 pr-5 rounded-full border border-white shadow-lg shadow-slate/5 cursor-pointer hover:bg-white transition-all group"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-rose-100 flex items-center justify-center bg-slate-100">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} className="text-slate-400" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate/50 uppercase tracking-wider leading-none mb-0.5">Welcome</span>
                        <span className="font-display font-bold text-slate text-sm leading-none group-hover:text-coral transition-colors">
                            {user.display_name || user.email?.split('@')[0]}
                        </span>
                    </div>

                    <div className={`ml-1 text-slate/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={14} />
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div 
                            onClick={() => {
                                setShowSettings(true);
                                setIsOpen(false);
                            }}
                            className="p-2 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center gap-3 text-slate/70 hover:text-coral transition-colors"
                        >
                            <Settings size={16} />
                            <span className="text-sm font-bold">Settings</span>
                        </div>
                        <div 
                            onClick={handleLogout}
                            className="p-2 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center gap-3 text-slate/70 hover:text-coral transition-colors"
                        >
                            <LogOut size={16} />
                            <span className="text-sm font-bold">Log Out</span>
                        </div>
                    </div>
                )}
            </div>

            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
                user={user} 
                onProfileUpdate={(newData) => setUser(newData)}
            />
        </>
    );
};

export default ProfileWidget;