'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', iconOnly = false, size = 'md' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Pure Shield Mark (No Arrows, No Circles, No Dots) */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Outer Shield Contour */}
          <path
            d="M 100 22 C 135 22, 175 34, 175 50 V 104 C 175 142, 138 170, 100 185 C 62 170, 25 142, 25 104 V 50 C 25 34, 65 22, 100 22 Z"
            fill="url(#shieldGradient)"
            stroke="#A855F7"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Minimal Inner Shield Outline */}
          <path
            d="M 100 48 C 124 48, 148 55, 148 67 V 102 C 148 126, 124 145, 100 155 C 76 145, 52 126, 52 102 V 67 C 52 55, 76 48, 100 48 Z"
            stroke="#A855F7"
            strokeWidth="6"
            strokeOpacity="0.4"
            fill="none"
          />

          <defs>
            <linearGradient id="shieldGradient" x1="25" y1="22" x2="175" y2="185" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F3E8FF" />
              <stop offset="1" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <span className={`font-black tracking-tight text-white leading-none ${textSizes[size]}`}>
            REVERSELOGISTICS<span className="text-purple-400">.AI</span>
          </span>
        </div>
      )}
    </div>
  );
}
