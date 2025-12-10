import React from 'react';

const WashiTape: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`absolute w-24 h-6 washi-tape z-20 ${className}`}></div>
);

export default WashiTape;