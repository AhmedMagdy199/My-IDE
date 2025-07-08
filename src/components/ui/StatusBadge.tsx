import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (true) {
      case statusLower.includes('running') || statusLower.includes('success') || statusLower.includes('healthy') || statusLower.includes('active') || statusLower.includes('connected') || statusLower.includes('completed') || statusLower.includes('passing') || statusLower.includes('merged'):
        return 'bg-green-600';
      case statusLower.includes('pending') || statusLower.includes('progress') || statusLower.includes('warning') || statusLower.includes('stopped') || statusLower.includes('disconnected'):
        return 'bg-yellow-600';
      case statusLower.includes('error') || statusLower.includes('failed') || statusLower.includes('critical') || statusLower.includes('failing') || statusLower.includes('inactive'):
        return 'bg-red-600';
      case statusLower.includes('open'):
        return 'bg-blue-600';
      case statusLower.includes('closed'):
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}