import React from 'react';

interface ProgressBarProps {
  value: number;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  value, 
  color = 'blue',
  size = 'md' 
}: ProgressBarProps) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full bg-gray-700 rounded-full ${sizes[size]}`}>
      <div
        className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}