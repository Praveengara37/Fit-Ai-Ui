import React from 'react';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export default function Logo({ className = '', width = 250, height = 94 }: LogoProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 250 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Dumbbell Icon */}
            <g transform="translate(10, 25)">
                {/* Left weight */}
                <rect x="0" y="10" width="15" height="24" rx="2" fill="url(#purpleGradient)" />
                <rect x="2" y="12" width="11" height="20" rx="1" fill="url(#cyanGradient)" opacity="0.5" />

                {/* Bar */}
                <rect x="15" y="19" width="30" height="6" rx="3" fill="url(#purpleGradient)" />

                {/* Right weight */}
                <rect x="45" y="10" width="15" height="24" rx="2" fill="url(#purpleGradient)" />
                <rect x="47" y="12" width="11" height="20" rx="1" fill="url(#cyanGradient)" opacity="0.5" />
            </g>

            {/* FitAI Text */}
            <text
                x="80"
                y="50"
                fontFamily="Space Grotesk, sans-serif"
                fontSize="42"
                fontWeight="900"
                fill="url(#textGradient)"
            >
                Fit<tspan fill="url(#cyanGradient)">AI</tspan>
            </text>

            {/* Gradients */}
            <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8a2be2" />
                    <stop offset="100%" stopColor="#6a1bb2" />
                </linearGradient>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00bfff" />
                    <stop offset="100%" stopColor="#0099cc" />
                </linearGradient>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8a2be2" />
                    <stop offset="100%" stopColor="#00bfff" />
                </linearGradient>
            </defs>
        </svg>
    );
}
