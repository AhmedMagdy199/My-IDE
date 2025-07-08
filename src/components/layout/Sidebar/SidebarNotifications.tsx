import React from 'react';
import { Bell } from 'lucide-react';

export const SidebarNotifications: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <Bell size={16} />
        <span className="text-sm">Notifications</span>
      </div>
    </div>
  );
};