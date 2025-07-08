import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarSearch } from './SidebarSearch';
import { SidebarNotifications } from './SidebarNotifications';
import { UserProfile } from './UserProfile';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`
        flex flex-col h-full bg-gray-900 border-r border-gray-800 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <SidebarHeader isCollapsed={isCollapsed} />
      <SidebarSearch isCollapsed={isCollapsed} />
      <SidebarNav isCollapsed={isCollapsed} />
      <SidebarNotifications isCollapsed={isCollapsed} />
      
      <div className="mt-auto">
        <UserProfile isCollapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-3 flex justify-center hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}