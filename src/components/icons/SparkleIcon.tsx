import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

export function SparkleIcon({ className = '', size = 24, 'aria-hidden': ariaHidden = true }: IconProps) {
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
      <path d="M12 2L13.09 8.26L19.5 9.5L13.09 10.74L12 17L10.91 10.74L4.5 9.5L10.91 8.26L12 2Z" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5"/>
      <circle cx="7" cy="5" r="1.5" fill="#93C5FD"/>
      <circle cx="17" cy="14" r="1.5" fill="#93C5FD"/>
      <circle cx="17" cy="5" r="1" fill="#DBEAFE"/>
      <circle cx="7" cy="14" r="1" fill="#DBEAFE"/>
    </svg>
  );
}

