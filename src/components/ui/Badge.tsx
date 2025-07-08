import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'red' | 'yellow' | 'green';
  className?: string;
}

export function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-500 text-white',
    red: 'bg-red-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    green: 'bg-green-500 text-white',
  };

  return (
    <span className={`
      px-2 py-0.5 text-xs font-medium rounded-full
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}