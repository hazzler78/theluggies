import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function CalendarIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" fill="#A78BFA" stroke="#8B5CF6" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="#8B5CF6" strokeWidth="2"/>
      <circle cx="7" cy="15" r="1.5" fill="#8B5CF6"/>
      <circle cx="12" cy="15" r="1.5" fill="#8B5CF6"/>
      <circle cx="17" cy="15" r="1.5" fill="#8B5CF6"/>
      <circle cx="7" cy="19" r="1.5" fill="#8B5CF6"/>
      <circle cx="12" cy="19" r="1.5" fill="#8B5CF6"/>
    </svg>
  );
}

