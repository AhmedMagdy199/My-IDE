import React from 'react';
import { Command } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4">
      <div className="flex items-center space-x-4">
        <Command className="w-6 h-6 text-blue-400" />
        <h1 className="text-lg font-semibold">DevOps IDE</h1>
      </div>
    </header>
  );
}