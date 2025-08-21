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

const tagSchema = z.object({
  name: z.string().min(1, 'Tên tag là bắt buộc'),
  domain: z.string().min(1, 'Domain là bắt buộc'),
  description: z.string().optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

interface Tag {
  id: string;
  name: string;
  domain: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function TagManagement() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      domain: '',
      description: '',
    },
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TagFormData) => {
    try {
      const url = editingTag ? `/api/tags/${editingTag.id}` : '/api/tags';
      const method = editingTag ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          createdBy: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        form.reset();
        setIsDialogOpen(false);
        setEditingTag(null);
        fetchTags();
      }
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.reset({
      name: tag.name,
      domain: tag.domain,
      description: tag.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tag này?')) {
      try {
        const response = await fetch(`/api/tags/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchTags();
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const openCreateDialog = () => {
    setEditingTag(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Tag</h1>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          + Thêm Tag mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số Tag</p>
                <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Tag Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tags.filter(t => t.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-600">Tag Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tags.filter(t => t.status === 'inactive').length}
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
                  {new Set(tags.map(t => t.domain)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Tag</CardTitle>
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
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>{tag.domain}</TableCell>
                    <TableCell>{tag.description || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tag.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tag.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(tag.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(tag)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(tag.id)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Chỉnh sửa Tag' : 'Thêm Tag mới'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên tag..." {...field} />
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Mô tả tag (tùy chọn)" {...field} />
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
                  {editingTag ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
