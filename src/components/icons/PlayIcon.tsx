import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function PlayIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      <path d="M10 8L16 12L10 16V8Z" fill="white"/>
    </svg>
  );
}

