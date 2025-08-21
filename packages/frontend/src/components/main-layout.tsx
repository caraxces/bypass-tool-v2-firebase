'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import Dashboard from './dashboard';
import ProjectManagement from './project-management';
import KeywordManagement from './keyword-management';
import SchemaManagement from './schema-management';
import TagManagement from './tag-management';
import XMLImport from './xml-import';
import LinkPositionManagement from './link-position-management';
import UserManagement from './user-management';
import RoleManagement from './role-management';

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
  adminOnly?: boolean;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Trang chủ', icon: '🏠', component: Dashboard },
  { id: 'xml-import', label: 'Import XML', icon: '📄', component: XMLImport },
  { id: 'link-position', label: 'Check vị trí link', icon: '🔗', component: LinkPositionManagement },
  { id: 'link-position-hidden', label: 'Check vị trí link (ẩn)', icon: '🔍', component: LinkPositionManagement },
  { id: 'main-keyword', label: 'Check từ khóa chính', icon: '🔑', component: KeywordManagement },
  { id: 'keyword-projects', label: 'Danh sách dự án từ khóa', icon: '📋', component: ProjectManagement },
  { id: 'schemas', label: 'Danh sách schema', icon: '📊', component: SchemaManagement },
  { id: 'tags', label: 'Danh sách tag', icon: '🏷️', component: TagManagement },
];

const adminMenuItems: MenuItem[] = [
  { id: 'schema-design', label: 'Thiết kế form schema', icon: '🎨', component: SchemaManagement, adminOnly: true },
  { id: 'schema-access', label: 'Quản lý truy cập schema', icon: '🔐', component: SchemaManagement, adminOnly: true },
  { id: 'users', label: 'Quản lý user', icon: '👥', component: UserManagement, adminOnly: true },
  { id: 'roles', label: 'Quản lý role', icon: '👑', component: RoleManagement, adminOnly: true },
];

export default function MainLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [userRole] = useState('admin'); // TODO: Get from auth context

  const ActiveComponent = menuItems.find(item => item.id === activeMenu)?.component || 
                        adminMenuItems.find(item => item.id === activeMenu)?.component || 
                        ProjectManagement;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Menu</h1>
          
          {/* Main Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Admin Tool Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Admin Tool
            </h2>
            <nav className="space-y-2">
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">non@tool.com</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="w-8 h-8 p-0"
                title="Đăng xuất"
              >
                🚪
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
