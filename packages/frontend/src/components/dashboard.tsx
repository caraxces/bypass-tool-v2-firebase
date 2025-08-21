'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AddProjectDialog } from './add-project-dialog';
import { AddKeywordDialog } from './add-keyword-dialog';
import { AddSchemaDialog } from './add-schema-dialog';
import { AddTagDialog } from './add-tag-dialog';
import { buildApiUrl, API_CONFIG } from '../lib/api-config';

interface DashboardStats {
  totalProjects: number;
  totalKeywords: number;
  totalSchemas: number;
  totalTags: number;
  totalUsers: number;
  totalRoles: number;
  recentProjects: any[];
  recentKeywords: any[];
  systemStatus: 'healthy' | 'warning' | 'error';
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalKeywords: 0,
    totalSchemas: 0,
    totalTags: 0,
    totalUsers: 0,
    totalRoles: 0,
    recentProjects: [],
    recentKeywords: [],
    systemStatus: 'healthy',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [projectsRes, keywordsRes, schemasRes, tagsRes, usersRes, rolesRes] = await Promise.all([
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.KEYWORDS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SCHEMAS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TAGS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USERS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROLES)),
      ]);

      const projects = projectsRes.ok ? (await projectsRes.json()).data : [];
      const keywords = keywordsRes.ok ? (await keywordsRes.json()).data : [];
      const schemas = schemasRes.ok ? (await schemasRes.json()).data : [];
      const tags = tagsRes.ok ? (await tagsRes.json()).data : [];
      const users = usersRes.ok ? (await usersRes.json()).data : [];
      const roles = rolesRes.ok ? (await rolesRes.json()).data : [];

      setStats({
        totalProjects: projects.length,
        totalKeywords: keywords.length,
        totalSchemas: schemas.length,
        totalTags: tags.length,
        totalUsers: users.length,
        totalRoles: roles.length,
        recentProjects: projects.slice(0, 5),
        recentKeywords: keywords.slice(0, 5),
        systemStatus: 'healthy',
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, systemStatus: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const handleProjectCreated = (newProject: any) => {
    // Refresh dashboard data after creating new project
    fetchDashboardData();
  };

  const handleKeywordCreated = (newKeyword: any) => {
    // Refresh dashboard data after creating new keyword
    fetchDashboardData();
  };

  const handleSchemaCreated = (newSchema: any) => {
    // Refresh dashboard data after creating new schema
    fetchDashboardData();
  };

  const handleTagCreated = (newTag: any) => {
    // Refresh dashboard data after creating new tag
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Bypass Tool Pro
        </h1>
        <p className="text-xl text-gray-600">
          Hệ thống quản lý SEO và theo dõi từ khóa chuyên nghiệp
        </p>
      </div>

      {/* System Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                stats.systemStatus === 'healthy' ? 'bg-green-500' :
                stats.systemStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trạng thái hệ thống</h3>
                <p className="text-sm text-gray-600">
                  {stats.systemStatus === 'healthy' && 'Hệ thống hoạt động bình thường'}
                  {stats.systemStatus === 'warning' && 'Có cảnh báo cần chú ý'}
                  {stats.systemStatus === 'error' && 'Có lỗi cần khắc phục'}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(stats.systemStatus)}>
              {stats.systemStatus === 'healthy' && 'Healthy'}
              {stats.systemStatus === 'warning' && 'Warning'}
              {stats.systemStatus === 'error' && 'Error'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dự án</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.35-.35.527-.835.43-1.398A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Từ khóa</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalKeywords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Schema</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSchemas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tag</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTags}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">User</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Role</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Dự án gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có dự án nào</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.domain}</TableCell>
                      <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.35-.35.527-.835.43-1.398A6 6 0 1121.75 8.25z" />
              </svg>
              Từ khóa gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentKeywords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có từ khóa nào</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Từ khóa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentKeywords.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            keyword.status === 'checked' 
                              ? 'bg-green-100 text-green-800' 
                              : keyword.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {keyword.status === 'checked' ? 'Checked' : 
                           keyword.status === 'pending' ? 'Pending' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(keyword.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AddProjectDialog 
              onProjectCreated={handleProjectCreated} 
              onRefresh={fetchDashboardData}
              trigger={
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 w-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Tạo dự án mới</span>
                </Button>
              }
            />
            
            <AddKeywordDialog 
              onKeywordCreated={handleKeywordCreated} 
              onRefresh={fetchDashboardData}
              projects={stats.recentProjects}
              trigger={
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700 w-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.35-.35.527-.835.43-1.398A6 6 0 1121.75 8.25z" />
                  </svg>
                  <span>Thêm từ khóa</span>
                </Button>
              }
            />
            
            <AddSchemaDialog 
              onSchemaCreated={handleSchemaCreated} 
              onRefresh={fetchDashboardData}
              projects={stats.recentProjects}
              trigger={
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700 w-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Tạo Schema</span>
                </Button>
              }
            />
            
            <AddTagDialog 
              onTagCreated={handleTagCreated} 
              onRefresh={fetchDashboardData}
              projects={stats.recentProjects}
              trigger={
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-yellow-600 hover:bg-yellow-700 w-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Thêm Tag</span>
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
