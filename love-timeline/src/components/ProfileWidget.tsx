"use client";
import React, { useState } from 'react';
import Icon from './Icon';

type Props = {
    user: {
        name: string;
        avatar: string;
    }
};

const ProfileWidget = ({ user }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-6 right-6 z-[100]">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-xl p-2 pr-5 rounded-full border border-white shadow-lg shadow-slate/5 cursor-pointer hover:bg-white transition-all group"
            >
                <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-rose-100">
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate/50 uppercase tracking-wider leading-none mb-0.5">Welcome</span>
                    <span className="font-display font-bold text-slate text-sm leading-none group-hover:text-coral transition-colors">{user.name}</span>
                </div>

                <div className={`ml-1 text-slate/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <Icon name="chevronDown" size={14} />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center gap-3 text-slate/70 hover:text-coral transition-colors">
                        <Icon name="settings" size={16} />
                        <span className="text-sm font-bold">Settings</span>
                    </div>
                    <div className="p-2 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center gap-3 text-slate/70 hover:text-coral transition-colors">
                        <Icon name="logOut" size={16} />
                        <span className="text-sm font-bold">Log Out</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileWidget;