import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-lg font-medium text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}