import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { SearchResults } from './SearchResults';

interface SidebarSearchProps {
  isCollapsed: boolean;
}

export function SidebarSearch({ isCollapsed }: SidebarSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-3 mb-4">
      {isCollapsed ? (
        <Tooltip content="Search">
          <button className="w-full p-2 flex justify-center hover:bg-gray-800 rounded-md">
            <Search className="w-5 h-5" />
          </button>
        </Tooltip>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search..."
            className="w-full bg-gray-800 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {isFocused && query && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 overflow-hidden">
              <SearchResults 
                query={query}
                onSelect={() => {
                  setQuery('');
                  setIsFocused(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}