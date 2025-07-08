import React from 'react';
import { NavItem } from './NavItem';
import { navigationItems } from './navigation';

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  return (
    <nav className="flex-1 px-3">
      {navigationItems.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          badge={item.badge}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
}