import React from 'react';

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function Logo({ width = 120, height = 120, className = '' }: LogoProps) {
    return (
        <svg width={width} height={height} viewBox="12 12 226 226" fill="none" xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <defs>
                {/* Radial gradient for inner circle fill */}
                <radialGradient id="paint0_radial_133_107" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2a1a40" />
                    <stop offset="100%" stopColor="#1a1625" />
                </radialGradient>

                {/* Linear gradients */}
                <linearGradient id="paint1_linear_133_107" x1="18.5%" y1="125%" x2="231.6%" y2="-25%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="21%" stopColor="#A059E5" />
                    <stop offset="47%" stopColor="#4485F5" />
                    <stop offset="70%" stopColor="#44C7F5" />
                    <stop offset="99%" stopColor="#39FFD9" />
                </linearGradient>

                <linearGradient id="paint2_linear_133_107" x1="18.5%" y1="125%" x2="231.6%" y2="-25%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="21%" stopColor="#A059E5" />
                    <stop offset="47%" stopColor="#4485F5" />
                    <stop offset="70%" stopColor="#44C7F5" />
                    <stop offset="99%" stopColor="#39FFD9" />
                </linearGradient>

                <linearGradient id="paint3_linear_133_107" x1="21%" y1="125%" x2="228.4%" y2="-23.1%">
                    <stop offset="0%" stopColor="#1a1625" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#2a2235" stopOpacity="0.95" />
                </linearGradient>

                {/* Text gradient */}
                <linearGradient id="paint4_linear_133_107" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="50%" stopColor="#4485F5" />
                    <stop offset="100%" stopColor="#39FFD9" />
                </linearGradient>

                <linearGradient id="paint5_linear_133_107" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="50%" stopColor="#4485F5" />
                    <stop offset="100%" stopColor="#39FFD9" />
                </linearGradient>

                <linearGradient id="paint6_linear_133_107" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="50%" stopColor="#4485F5" />
                    <stop offset="100%" stopColor="#39FFD9" />
                </linearGradient>

                {/* Waveform gradients */}
                <linearGradient id="paint17_linear_133_107" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="21%" stopColor="#A059E5" />
                    <stop offset="47%" stopColor="#4485F5" />
                    <stop offset="70%" stopColor="#44C7F5" />
                    <stop offset="99%" stopColor="#39FFD9" />
                </linearGradient>

                {/* Stroke gradients for waveform bars */}
                <linearGradient id="waveStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A03EE5" />
                    <stop offset="50%" stopColor="#4485F5" />
                    <stop offset="100%" stopColor="#39FFD9" />
                </linearGradient>

                {/* Clip path to crop to circle */}
                <clipPath id="circleClip">
                    <circle cx="125" cy="125" r="107" />
                </clipPath>
            </defs>

            {/* Outer circle with gradient border */}
            <path
                d="m124.4 18.51c-57.75 0-105.9 48.12-105.9 106.5 0 57.93 47.77 105.1 105.9 105.1 57.63 0 107.1-46.98 107.1-105.1 0-57.82-47.88-106.5-107.1-106.5z"
                fill="url(#paint1_linear_133_107)" stroke="url(#paint2_linear_133_107)" strokeMiterlimit="10"
                strokeWidth="2.703" />

            {/* Inner circle */}
            <path
                d="m123.7 227.4c56.11 0 104.7-46.22 104.7-102.3s-47.37-104-104.7-104c-56.5 0-102.7 46.22-102.7 104 0 56.5 46.19 102.3 102.7 102.3z"
                fill="url(#paint3_linear_133_107)" />

            {/* FitAI Text */}
            <path d="m72.38 169.3h25.33v4.42h-19.68v8.3h17.38v4.38h-17.38v11.34h-6.1v-28.44h0.45z"
                fill="url(#paint4_linear_133_107)" />
            <path
                d="m102.1 176.4h6.1v21.34h-5.65v-21.34h-0.45zm3.14-9.48c2.74 0 3.4 1.7 3.4 3.25 0 1.7-1.26 2.82-3.4 2.82-2.36 0-3.23-1.4-3.23-2.95 0-1.54 1.05-3.12 3.23-3.12z"
                fill="url(#paint5_linear_133_107)" />
            <path
                d="m115.9 176.4v-6.08h5.2v6.08h7.3v3.8h-7.3v8.53c0 3.25 1.01 4.7 3.97 4.7 1.26 0 2.61-0.46 3.51-0.96l0.71 4.38c-1.44 0.72-3.66 1.13-5.55 1.13-5.56 0-7.84-2.56-7.84-8.26v-9.48h-4.2v-3.8h4.2v-0.04z"
                fill="url(#paint6_linear_133_107)" />
            <path
                d="m145.7 169.3h6.7l15.51 28.44h-6.7l-3.48-6.62h-17.17l-3.31 6.62h-6.7l15.15-28.44zm-2.83 17.1h12.68l-6.24-12.46h-0.26l-6.18 12.46z"
                fill="url(#paint4_linear_133_107)" />
            <path d="m171.4 169.3h5.6v28.44h-5.6v-28.44z" fill="url(#paint4_linear_133_107)" />

            {/* Audio waveform bars */}
            <g stroke="url(#waveStroke)" strokeMiterlimit="10" strokeWidth="1.08">
                <path d="m57.41 100.4 0.22-0.54h2.47l0.31 0.54v9.26l-0.49 0.5h-2.51l-0.66-0.5v-8.49l0.66-0.77z" />
                <path d="m191.4 100.4-0.49-0.54h-1.22l-0.36 0.54v9.26l0.36 0.5h1.71l0.49-0.5v-8.49l-0.49-0.77z" />
                <path d="m62.92 90.04 0.9-0.63h4.85l0.71 0.63v29.66l-0.87 0.63h-4.9l-0.69-0.63v-29.66z" />
                <path d="m73.12 84.91 0.91-0.77h5.6l0.91 0.77v40.31l-0.91 0.86h-5.6l-0.91-0.86v-40.31z" />
                <path d="m84.64 77.61 1.15-1.17h6.61l1.11 1.17v54l-1.11 1.17h-6.61l-1.15-1.17v-54z" />
                <path d="m155.5 77.61 1.11-1.17h7.3l1.11 1.17v54l-1.11 1.17h-7.3l-1.11-1.17v-54z" />
                <path d="m168.7 84.91 0.91-0.77h4.9l0.91 0.77v40.31l-0.91 0.86h-4.9l-0.91-0.86v-40.31z" />
                <path d="m179.6 90.72 0.86-0.68h4.9l0.91 0.68v28.94l-0.91 0.67h-4.9l-0.86-0.67v-28.94z" />
            </g>

            {/* Center horizontal bar */}
            <path d="m96.78 100h55.94v9.35h-55.94v-9.35z" fill="url(#paint17_linear_133_107)"
                stroke="url(#paint17_linear_133_107)" strokeMiterlimit="10" strokeWidth="1.08" />

            {/* Radiating lines from center */}
            <g stroke="url(#waveStroke)" strokeMiterlimit="10" strokeWidth="1.08">
                <path d="m103.5 113.5v19.34l-9.62 10.39h-21.52" />
                <path d="m112.4 113.5v20.25l-2.51 3.48-15.16 15.16" />
                <path d="m120 113.5v22.74l-8.49 10.7" />
                <path d="m124.3 113.5v39.43" />
                <path d="m129 113.5v22.74l8.49 10.7" />
                <path d="m136.9 126.7v6.11l18.81 18.8h15.99" />
                <path d="m145.4 113.5v18.43l10.33 11.79h19.69" />
                <path d="m136.9 95.72v-21.34l17.9-17.21h9.11" />
                <path d="m144.4 95.72v-20.44l12.19-9.76h18.79" />
                <path d="m129 95.72v-23.09l7.53-9.76" />
                <path d="m123.9 95.72v-40.09" />
                <path d="m120 95.72v-23.09l-7.52-10.33" />
                <path d="m103.7 95.72v-19.99l-9.8-9.76h-20.23" />
            </g>
        </svg>
    );
}
