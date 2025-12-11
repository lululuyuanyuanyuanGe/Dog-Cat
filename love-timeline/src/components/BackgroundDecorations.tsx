import React from 'react';
import FloatingSticker from './FloatingSticker';
import BackgroundBlobs from './BackgroundBlobs';

const BackgroundDecorations = () => (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <BackgroundBlobs />
        <FloatingSticker text="開心小狗" top="15%" left="5%" rot="-5deg" delay="0s" />
        <FloatingSticker text="好的好的" top="25%" right="8%" rot="6deg" delay="2s" />
        <FloatingSticker text="畫畫超棒的貓貓 💫" bottom="20%" left="10%" rot="-3deg" delay="4s" />
        <FloatingSticker text="拜哺" top="60%" right="15%" rot="4deg" delay="1s" />
        <FloatingSticker text="YIPPEE!!! ✌️" bottom="10%" right="30%" rot="-2deg" delay="3s" />
    </div>
);

export default BackgroundDecorations;