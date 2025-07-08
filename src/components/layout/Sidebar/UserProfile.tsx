import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

interface UserProfileProps {
  isCollapsed: boolean;
}

export function UserProfile({ isCollapsed }: UserProfileProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  return (
    <div className="relative px-3 mb-2">
      {isCollapsed ? (
        <Tooltip content={user.name}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 flex justify-center hover:bg-gray-800 rounded-md"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          </button>
        </Tooltip>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 flex items-center hover:bg-gray-800 rounded-md"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3 text-left">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </button>
      )}

      {isOpen && (
        <div className={`
          absolute bottom-full mb-2 w-48 bg-gray-800 rounded-md shadow-lg py-1
          ${isCollapsed ? 'left-full ml-2' : 'left-3 right-3'}
        `}>
          <button className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-700">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </button>
          <button className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-700 text-red-400">
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}