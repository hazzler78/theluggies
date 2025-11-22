import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function MovieCameraIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
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
      <rect x="4" y="7" width="14" height="10" rx="1.5" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="2"/>
      <circle cx="11" cy="12" r="3" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
      <circle cx="11" cy="12" r="1.5" fill="#7C3AED"/>
      <rect x="18" y="9" width="3" height="6" rx="0.5" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.5"/>
      <circle cx="6" cy="11" r="1" fill="#7C3AED"/>
      <circle cx="6" cy="13" r="1" fill="#7C3AED"/>
      <line x1="3" y1="17" x2="21" y2="17" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

