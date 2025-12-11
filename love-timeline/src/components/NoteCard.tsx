import React from 'react';
import NoteContent from './NoteContent';

interface NoteCardProps {
    item: {
        id: string; 
        content: string;
        time: string;
        [key: string]: any;
    };
    onSingleClick?: (e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ item, onSingleClick }) => {
    return <NoteContent item={item} onClick={onSingleClick} />;
};

export default NoteCard;