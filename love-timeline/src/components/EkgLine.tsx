import React from 'react';

// Define different EKG path styles for variety
const EKG_PATHS = [
    // Variant 0: Classic, strong beat
    "M0,50 H10 L15,30 L20,70 L25,50 L30,45 L35,55 L40,50 H100",
    // Variant 1: More intensive, multiple smaller beats
    "M0,50 H5 L8,40 L11,60 L14,50 L20,50 L23,45 L26,55 L29,50 L35,50 L38,48 L41,52 L44,50 H100",
    // Variant 2: A calmer, more spaced-out rhythm
    "M0,50 H25 L30,40 L35,60 L40,50 H100",
    // Variant 3 (NEW): Steeper, more complex polyline
    "M0,50 H10 L12,40 L18,65 L22,25 L26,75 L30,40 L35,50 H100",
];

// A safe, large value for stroke-dasharray that is longer than any of the paths.
const PATH_LENGTH = 500;

interface EkgLineProps {
    variant?: number;
    animationName: string;
}

/**
 * Renders an EKG line that animates as if it's being drawn.
 * It accepts a 'variant' prop to choose between different animation styles.
 */
const EkgLine = ({ variant = 0, animationName }: EkgLineProps) => {
    // Select the path data based on the variant, with a fallback to the first one.
    const pathData = EKG_PATHS[variant % EKG_PATHS.length] || EKG_PATHS[0];

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[80px] -mt-5">
            <style>
                {`
                    @keyframes ${animationName} {
                        from {
                            stroke-dashoffset: ${PATH_LENGTH};
                        }
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                `}
            </style>
            <path
                d={pathData}
                stroke="currentColor" // Inherits color from parent's text-color
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                    strokeDasharray: PATH_LENGTH,
                    strokeDashoffset: PATH_LENGTH,
                    // FIX: Use individual animation properties instead of the shorthand
                    animationName: animationName,
                    animationDuration: '1.2s',
                    animationTimingFunction: 'ease-out',
                    animationIterationCount: 'infinite',
                    animationDelay: '0.2s', // Delay to let heart swell first
                }}
            />
        </svg>
    );
};

export default EkgLine;
