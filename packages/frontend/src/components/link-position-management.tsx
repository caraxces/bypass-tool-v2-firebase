'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const linkPositionSchema = z.object({
  projectId: z.string().min(1, 'Project ID là bắt buộc'),
  keyword: z.string().min(1, 'Từ khóa là bắt buộc'),
  domain: z.string().min(1, 'Domain là bắt buộc'),
  position: z.number().min(1, 'Vị trí phải lớn hơn 0'),
  resultLink: z.string().min(1, 'Link kết quả là bắt buộc'),
  contentArea: z.string().optional(),
});

type LinkPositionFormData = z.infer<typeof linkPositionSchema>;

interface LinkPosition {
  id: string;
  projectId: string;
  keyword: string;
  domain: string;
  position: number;
  resultLink: string;
  contentArea?: string;
  status: 'checked' | 'failed';
  checkedAt: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  domain: string;
}

export default function LinkPositionManagement() {
  const [linkPositions, setLinkPositions] = useState<LinkPosition[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<LinkPosition | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const form = useForm<LinkPositionFormData>({
    resolver: zodResolver(linkPositionSchema),
    defaultValues: {
      projectId: '',
      keyword: '',
      domain: '',
      position: 1,
      resultLink: '',
      contentArea: '',
    },
  });

  useEffect(() => {
    fetchProjects();
    fetchLinkPositions();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchLinkPositions(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchLinkPositions = async (projectId?: string) => {
    setIsLoading(true);
    try {
      const url = projectId ? `/api/link-positions?projectId=${projectId}` : '/api/link-positions';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLinkPositions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching link positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LinkPositionFormData) => {
    try {
      const url = editingPosition ? `/api/link-positions/${editingPosition.id}` : '/api/link-positions';
      const method = editingPosition ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        setIsDialogOpen(false);
        setEditingPosition(null);
        fetchLinkPositions(selectedProjectId);
      }
    } catch (error) {
      console.error('Error saving link position:', error);
    }
  };

  const handleEdit = (position: LinkPosition) => {
    setEditingPosition(position);
    form.reset({
      projectId: position.projectId,
      keyword: position.keyword,
      domain: position.domain,
      position: position.position,
      resultLink: position.resultLink,
      contentArea: position.contentArea || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa link position này?')) {
      try {
        const response = await fetch(`/api/link-positions/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchLinkPositions(selectedProjectId);
        }
      } catch (error) {
        console.error('Error deleting link position:', error);
      }
    }
  };

  const openCreateDialog = () => {
    setEditingPosition(null);
    form.reset({
      projectId: selectedProjectId || '',
      keyword: '',
      domain: '',
      position: 1,
      resultLink: '',
      contentArea: '',
    });
    setIsDialogOpen(true);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getStatusColor = (status: string) => {
    return status === 'checked' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (status: string) => {
    return status === 'checked' ? 'Checked' : 'Failed';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Check Vị trí Link</h1>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          + Thêm Link Position mới
        </Button>
      </div>

      {/* Project Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="project-filter" className="text-sm font-medium">
              Lọc theo Project:
            </Label>
            <select
              id="project-filter"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.domain})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số Link</p>
                <p className="text-2xl font-bold text-gray-900">{linkPositions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Checked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {linkPositions.filter(p => p.status === 'checked').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {linkPositions.filter(p => p.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🌐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Domains</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(linkPositions.map(p => p.domain)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Link Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Result Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">
                      {getProjectName(position.projectId)}
                    </TableCell>
                    <TableCell>{position.keyword}</TableCell>
                    <TableCell>{position.domain}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        #{position.position}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={position.resultLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block max-w-xs"
                      >
                        {position.resultLink}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status)}`}>
                        {getStatusLabel(position.status)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(position.checkedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(position)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(position.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPosition ? 'Chỉnh sửa Link Position' : 'Thêm Link Position mới'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn Project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name} ({project.domain})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập từ khóa..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resultLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Result Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/page" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Area (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input placeholder="Khu vực nội dung..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPosition ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
