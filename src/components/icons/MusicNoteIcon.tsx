import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function MusicNoteIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
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
      <path d="M9 18V5L21 3V16" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="6" cy="18" r="3.5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      <circle cx="18" cy="16" r="3.5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
    </svg>
  );
}

