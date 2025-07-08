import React from 'react';
import { Command } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-4 flex items-center">
      <Command className="w-6 h-6 text-blue-500" />
      {!isCollapsed && (
        <span className="ml-3 font-semibold text-lg">DevOps IDE</span>
      )}
    </div>
  );
}