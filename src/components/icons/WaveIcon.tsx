import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function WaveIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
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
      <path d="M7 10C7 8.5 8 7 9.5 7C10.2 7 10.8 7.3 11.2 7.8C11.6 7.3 12.2 7 13 7C14.5 7 15.5 8.5 15.5 10V13C15.5 14.5 14 16 12.5 16C11 16 9.5 14.5 9.5 13V11.5C9.5 10.8 8.8 10.2 8.1 10.2C7.4 10.2 6.7 10.8 6.7 11.5V14.5C6.7 16 5.2 17.5 3.5 17.5" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M3.5 14.5C3.5 13.5 4.2 12.5 5.2 12.5C5.8 12.5 6.3 12.8 6.6 13.2" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="9" cy="9" r="1.2" fill="#F59E0B"/>
      <circle cx="13" cy="9" r="1.2" fill="#F59E0B"/>
      <ellipse cx="11" cy="12.5" rx="1.5" ry="1.2" fill="#FCD34D"/>
    </svg>
  );
}

