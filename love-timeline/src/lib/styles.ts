export const NOTE_STYLES = [
    { 
        id: 'classic',
        name: 'Classic Yellow', 
        classes: 'bg-yellow-200 text-slate-900 rounded-sm shadow-xl',
        css: {},
        decoration: 'pin-red', 
        rotate: 'rotate-1' 
    },
    { 
        id: 'lined',
        name: 'Lined Notebook', 
        classes: 'bg-white text-slate-800 shadow-lg border-l-4 border-red-300 rounded-r-sm ring-1 ring-black/5',
        css: { backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)' },
        decoration: 'tape-blue', 
        rotate: '-rotate-1' 
    },
    { 
        id: 'graph',
        name: 'Graph Paper', 
        classes: 'bg-white text-slate-800 shadow-md border border-slate-300 rounded-sm',
        css: { backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' },
        decoration: 'clip', 
        rotate: 'rotate-2' 
    },
    { 
        id: 'chalk',
        name: 'Midnight Chalk', 
        classes: 'bg-slate-800 text-white shadow-2xl rounded-md border-2 border-slate-700 font-hand',
        css: {},
        decoration: 'tape-yellow', 
        rotate: '-rotate-2' 
    },
    { 
        id: 'kraft',
        name: 'Kraft Paper', 
        classes: 'bg-[#d2b48c] text-[#4a3b2a] shadow-lg rounded-sm border-[1px] border-[#c19b6c]',
        css: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }, 
        decoration: 'clip-gold', 
        rotate: 'rotate-1' 
    },
    { 
        id: 'peach',
        name: 'Soft Peach', 
        classes: 'bg-gradient-to-br from-orange-100 to-rose-100 text-rose-950 shadow-lg rounded-[2rem] border border-orange-100',
        css: {},
        decoration: 'pin-teal', 
        rotate: '-rotate-1' 
    },
    { 
        id: 'mint',
        name: 'Mint Leaf', 
        classes: 'bg-emerald-100 text-emerald-950 shadow-md rounded-tr-3xl rounded-bl-3xl border border-emerald-200',
        css: {},
        decoration: 'tape-green', 
        rotate: 'rotate-2' 
    },
    { 
        id: 'receipt',
        name: 'Retro Receipt', 
        classes: 'bg-white text-slate-800 shadow-lg font-mono border-t-4 border-slate-800 ring-1 ring-black/5',
        css: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 95% 95%, 90% 100%, 85% 95%, 80% 100%, 75% 95%, 70% 100%, 65% 95%, 60% 100%, 55% 95%, 50% 100%, 45% 95%, 40% 100%, 35% 95%, 30% 100%, 25% 95%, 20% 100%, 15% 95%, 10% 100%, 5% 95%, 0% 100%)' },
        decoration: 'tape-purple', 
        rotate: '-rotate-2' 
    },
    { 
        id: 'index',
        name: 'Index Card', 
        classes: 'bg-white text-slate-900 shadow-md rounded-sm border border-slate-300',
        css: { backgroundImage: 'linear-gradient(transparent 40px, #f43f5e 41px, #f43f5e 43px, transparent 44px)' }, 
        decoration: 'clip-gold', 
        rotate: 'rotate-1' 
    },
    { 
        id: 'lavender',
        name: 'Lavender Dream', 
        classes: 'bg-purple-50 text-purple-950 shadow-md rounded-xl border-2 border-dashed border-purple-200',
        css: {},
        decoration: 'tape-purple', 
        rotate: '-rotate-1' 
    },
    {
        id: 'blueprint',
        name: 'Blueprint',
        classes: 'bg-blue-600 text-white shadow-xl rounded-sm font-mono border-2 border-blue-400',
        css: { backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' },
        decoration: 'tape-yellow',
        rotate: 'rotate-2'
    },
    {
        id: 'cyber',
        name: 'Cyberpunk',
        classes: 'bg-slate-900 text-cyan-400 shadow-2xl rounded-none border border-cyan-400 font-mono',
        css: { boxShadow: '5px 5px 0px #06b6d4' },
        decoration: 'pin-teal', 
        rotate: '-rotate-2'
    },
    {
        id: 'water',
        name: 'Watercolor',
        classes: 'bg-white text-slate-900 shadow-lg rounded-lg border-none',
        css: { backgroundImage: 'radial-gradient(circle at 30% 20%, #fecdd3, transparent 60%), radial-gradient(circle at 80% 80%, #bfdbfe, transparent 60%)' },
        decoration: 'tape-blue',
        rotate: 'rotate-1'
    },
    {
        id: 'origami',
        name: 'Origami',
        classes: 'bg-orange-500 text-white shadow-xl',
        css: { clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' },
        decoration: 'clip',
        rotate: '-rotate-1'
    },
    {
        id: 'starry',
        name: 'Starry Night',
        classes: 'bg-indigo-900 text-yellow-100 shadow-xl rounded-xl border border-indigo-700',
        css: { backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' },
        decoration: 'pin-gold',
        rotate: 'rotate-2'
    }
];

export const PHOTO_STYLES = [
    { 
        id: 'classic', 
        type: 'Classic', 
        border: 'border-[8px] border-white bg-white', 
        rotate: 'rotate-1', 
        text: 'text-slate-700', 
        tape: true,
        css: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } 
    },
    { 
        id: 'film', 
        type: 'Film Strip', 
        border: 'bg-zinc-900 px-2 py-4 border-l-4 border-r-4 border-zinc-900', 
        rotate: '-rotate-1', 
        text: 'text-white/80', 
        tape: false,
        css: { backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '100% 4px' } 
    },
    { 
        id: 'clean', 
        type: 'Clean', 
        border: 'border-4 border-slate-50 bg-slate-50', 
        rotate: 'rotate-0', 
        text: 'text-slate-600', 
        tape: false,
        css: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } 
    },
    { 
        id: 'retro', 
        type: 'Retro', 
        border: 'border-[8px] border-[#f0f0f0] bg-[#f0f0f0]', 
        rotate: 'rotate-2', 
        text: 'text-slate-500', 
        tape: true,
        css: { borderStyle: 'solid', outline: '1px dashed #d4d4d4', outlineOffset: '-6px' } 
    },
    { 
        id: 'polaroid', 
        type: 'Polaroid', 
        border: 'bg-white pb-16 pt-2 px-2 shadow-xl', 
        rotate: '-rotate-2', 
        text: 'text-slate-800 font-hand text-2xl', 
        tape: true,
        css: { transformOrigin: 'top center' }
    },
    { 
        id: 'neon', 
        type: 'Neon Cyber', 
        border: 'bg-slate-900 border-2 border-cyan-400 p-1', 
        rotate: 'rotate-1', 
        text: 'text-cyan-400 font-mono', 
        tape: false,
        css: { boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }
    },
    { 
        id: 'gold', 
        type: 'Gold Frame', 
        border: 'bg-amber-50 p-2 border-4 border-amber-300', 
        rotate: '-rotate-1', 
        text: 'text-amber-800 font-serif italic', 
        tape: false,
        css: { outline: '2px solid #b45309', outlineOffset: '2px' }
    },
    { 
        id: 'grunge', 
        type: 'Grunge', 
        border: 'bg-stone-200 p-2', 
        rotate: 'rotate-2', 
        text: 'text-stone-800 font-typewriter', 
        tape: true,
        css: { clipPath: 'polygon(2% 2%, 98% 1%, 100% 98%, 1% 99%)', filter: 'sepia(0.4)' }
    },
    { 
        id: 'soft', 
        type: 'Soft Cloud', 
        border: 'bg-white p-3 rounded-[2rem]', 
        rotate: '-rotate-1', 
        text: 'text-slate-600', 
        tape: false,
        css: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
    },
    { 
        id: 'wooden', 
        type: 'Wooden', 
        border: 'bg-[#5d4037] p-3 rounded-sm', 
        rotate: 'rotate-1', 
        text: 'text-[#d7ccc8]', 
        tape: false,
        css: { backgroundImage: 'repeating-linear-gradient(45deg, #3e2723 0, #3e2723 10px, #4e342e 10px, #4e342e 20px)' }
    }
];

export const getNoteStyle = (id: string, styleId?: string) => {
    if (styleId) {
        const found = NOTE_STYLES.find(s => s.id === styleId);
        if (found) return found;
    }
    const seed = (id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return NOTE_STYLES[seed % NOTE_STYLES.length];
};

export const getRandomStyleId = () => {
    const idx = Math.floor(Math.random() * NOTE_STYLES.length);
    return NOTE_STYLES[idx].id;
};

export const getPhotoStyle = (id: string) => {
    const seed = (id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PHOTO_STYLES[seed % PHOTO_STYLES.length];
};
