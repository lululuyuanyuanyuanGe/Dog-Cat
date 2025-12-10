import React from 'react';

const BackgroundBlobs = () => (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="blob w-96 h-96 bg-pastel-pink rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-float"></div>
        <div className="blob w-80 h-80 bg-pastel-blue rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-float-slow"></div>
        <div className="blob w-64 h-64 bg-pastel-yellow rounded-full top-1/2 left-1/3 opacity-40 animate-float"></div>
    </div>
);

export default BackgroundBlobs;