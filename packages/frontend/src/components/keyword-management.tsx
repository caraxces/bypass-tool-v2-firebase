'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Keyword {
  id?: string;
  projectId: string;
  keyword: string;
  mainKeyword?: string;
  position?: number;
  resultLink?: string;
  status: 'pending' | 'checked' | 'failed';
  checkedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  domain: string;
}

export default function KeywordManagement() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchKeywords();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchKeywords = async () => {
    try {
      const url = selectedProject 
        ? `/api/keywords?projectId=${selectedProject}`
        : '/api/keywords';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setKeywords(data.data);
      }
    } catch (error) {
      console.error('Error fetching keywords:', error);
    }
  };

  const createKeyword = async () => {
    if (!newKeyword.trim() || !selectedProject) return;

    setLoading(true);
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject,
          keyword: newKeyword.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewKeyword('');
        fetchKeywords();
      }
    } catch (error) {
      console.error('Error creating keyword:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteKeyword = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa từ khóa này?')) return;

    try {
      const response = await fetch(`/api/keywords/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchKeywords();
      }
    } catch (error) {
      console.error('Error deleting keyword:', error);
    }
  };

  const updateKeywordStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/keywords/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        fetchKeywords();
      }
    } catch (error) {
      console.error('Error updating keyword:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Quản lý từ khóa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn dự án</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.domain}
                </option>
              ))}
            </select>
            <Input
              placeholder="Nhập từ khóa mới"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={createKeyword} 
              disabled={loading || !newKeyword.trim() || !selectedProject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Đang tạo...' : 'Thêm từ khóa'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Từ khóa</TableHead>
                  <TableHead>Từ khóa chính</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Link kết quả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>{keyword.mainKeyword || 'Chưa kiểm tra'}</TableCell>
                    <TableCell>{keyword.position || 'Chưa kiểm tra'}</TableCell>
                    <TableCell>{keyword.resultLink || 'Chưa kiểm tra'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        keyword.status === 'checked' ? 'bg-green-100 text-green-800' :
                        keyword.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {keyword.status === 'checked' ? 'Đã kiểm tra' :
                         keyword.status === 'failed' ? 'Thất bại' : 'Chờ kiểm tra'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateKeywordStatus(keyword.id!, 'pending')}
                        >
                          Kiểm tra lại
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteKeyword(keyword.id!)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
