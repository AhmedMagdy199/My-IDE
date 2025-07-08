import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationItems } from './navigation';

interface SearchResultsProps {
  query: string;
  onSelect: () => void;
}

export function SearchResults({ query, onSelect }: SearchResultsProps) {
  const navigate = useNavigate();
  const results = navigationItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    return (
      <div className="p-2 text-sm text-gray-400 text-center">
        No results found
      </div>
    );
  }

  return (
    <div className="py-1">
      {results.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            className="w-full px-3 py-2 flex items-center text-left hover:bg-gray-800"
            onClick={() => {
              navigate(item.path);
              onSelect();
            }}
          >
            <Icon className="w-4 h-4 mr-3 text-gray-400" />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}