export const NOTE_STYLES = [
    { name: 'Classic', bg: 'bg-[#fffdf5]', decoration: 'pin-red', rotate: 'rotate-1' },
    { name: 'Pink', bg: 'bg-rose-50', decoration: 'tape-pink', rotate: '-rotate-1' },
    { name: 'Blue', bg: 'bg-sky-50', decoration: 'tape-blue', rotate: 'rotate-2' },
    { name: 'Yellow', bg: 'bg-amber-50', decoration: 'clip', rotate: '-rotate-2' },
    { name: 'Green', bg: 'bg-emerald-50', decoration: 'pin-gold', rotate: 'rotate-1' },
];

export const PHOTO_STYLES = [
    { type: 'classic', border: 'border-[6px] border-white bg-white', rotate: 'rotate-1', text: 'text-slate/80', tape: true },
    { type: 'film', border: 'border-x-[8px] border-y-[12px] border-zinc-900 bg-zinc-900', rotate: '-rotate-1', text: 'text-white/70', tape: false },
    { type: 'clean', border: 'border-4 border-slate-100 bg-slate-100', rotate: 'rotate-0', text: 'text-slate-600', tape: false },
    { type: 'retro', border: 'border-[8px] border-[#f0f0f0] bg-[#f0f0f0]', rotate: 'rotate-2', text: 'text-slate/60', tape: true },
];

export const getNoteStyle = (id: string) => {
    const seed = (id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return NOTE_STYLES[seed % NOTE_STYLES.length];
};

export const getPhotoStyle = (id: string) => {
    const seed = (id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PHOTO_STYLES[seed % PHOTO_STYLES.length];
};
