import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isCollapsed: boolean;
  badge?: {
    count: number;
    variant: 'blue' | 'red' | 'yellow' | 'green';
  } | null;
}

export function NavItem({ icon: Icon, label, path, isCollapsed, badge }: NavItemProps) {
  const content = (
    <NavLink
      to={path}
      className={({ isActive }) => `
        w-full p-2 mb-1 flex items-center rounded-md transition-colors relative
        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
      `}
    >
      <Icon className="w-5 h-5" />
      {!isCollapsed && <span className="ml-3">{label}</span>}
      {badge && (
        <Badge variant={badge.variant} className={isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}>
          {badge.count}
        </Badge>
      )}
    </NavLink>
  );

  return isCollapsed ? (
    <Tooltip content={label}>{content}</Tooltip>
  ) : content;
}