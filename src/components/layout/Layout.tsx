import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar/Sidebar';

export function Layout() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}