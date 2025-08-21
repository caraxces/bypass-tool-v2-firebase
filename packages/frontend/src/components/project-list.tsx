'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { apiClient, Project } from '../lib/api-client';
import { AddProjectDialog } from './add-project-dialog';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getProjects();
      setProjects(response);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📚 Danh Sách Dự Án</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải danh sách dự án...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">📚 Quản Lý Dự Án</h2>
        <AddProjectDialog onProjectCreated={handleProjectCreated} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
          <Button 
            onClick={fetchProjects} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            🔄 Thử lại
          </Button>
        </div>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dự án nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách tạo dự án đầu tiên của bạn</p>
            <AddProjectDialog onProjectCreated={handleProjectCreated} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                  {project.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Domain:</p>
                  <a 
                    href={project.domain} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {project.domain}
                  </a>
                </div>
                
                {project.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mô tả:</p>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'active' ? '✅ Hoạt động' : '⏸️ Tạm dừng'}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
