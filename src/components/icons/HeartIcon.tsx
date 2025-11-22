import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function HeartIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5"/>
      <ellipse cx="10.5" cy="11.5" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      <ellipse cx="17.5" cy="11.5" rx="1.5" ry="2" fill="white" opacity="0.6"/>
    </svg>
  );
}

