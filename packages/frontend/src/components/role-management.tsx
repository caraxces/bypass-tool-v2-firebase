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

const roleSchema = z.object({
  name: z.string().min(1, 'Tên role là bắt buộc'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Ít nhất 1 permission là bắt buộc'),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
}

const availablePermissions = [
  'projects:read',
  'projects:write',
  'projects:delete',
  'keywords:read',
  'keywords:write',
  'keywords:delete',
  'schemas:read',
  'schemas:write',
  'schemas:delete',
  'tags:read',
  'tags:write',
  'tags:delete',
  'users:read',
  'users:write',
  'users:delete',
  'roles:read',
  'roles:write',
  'roles:delete',
  'admin:all',
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RoleFormData) => {
    try {
      const url = editingRole ? `/api/roles/${editingRole.id}` : '/api/roles';
      const method = editingRole ? 'PUT' : 'POST';
      
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
        setEditingRole(null);
        fetchRoles();
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa role này?')) {
      try {
        const response = await fetch(`/api/roles/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchRoles();
        }
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const openCreateDialog = () => {
    setEditingRole(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const togglePermission = (permission: string) => {
    const currentPermissions = form.watch('permissions');
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    
    form.setValue('permissions', newPermissions);
  };

  const selectAllPermissions = () => {
    form.setValue('permissions', availablePermissions);
  };

  const clearAllPermissions = () => {
    form.setValue('permissions', []);
  };

  const getPermissionLabel = (permission: string) => {
    const labels: Record<string, string> = {
      'projects:read': 'Xem dự án',
      'projects:write': 'Tạo/Sửa dự án',
      'projects:delete': 'Xóa dự án',
      'keywords:read': 'Xem từ khóa',
      'keywords:write': 'Tạo/Sửa từ khóa',
      'keywords:delete': 'Xóa từ khóa',
      'schemas:read': 'Xem schema',
      'schemas:write': 'Tạo/Sửa schema',
      'schemas:delete': 'Xóa schema',
      'tags:read': 'Xem tag',
      'tags:write': 'Tạo/Sửa tag',
      'tags:delete': 'Xóa tag',
      'users:read': 'Xem user',
      'users:write': 'Tạo/Sửa user',
      'users:delete': 'Xóa user',
      'roles:read': 'Xem role',
      'roles:write': 'Tạo/Sửa role',
      'roles:delete': 'Xóa role',
      'admin:all': 'Quyền admin tất cả',
    };
    return labels[permission] || permission;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Role</h1>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          + Thêm Role mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số Role</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(roles.flatMap(r => r.permissions)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.filter(r => r.permissions.includes('admin:all')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Role</CardTitle>
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
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {getPermissionLabel(permission)}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(role)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(role.id)}
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
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Chỉnh sửa Role' : 'Thêm Role mới'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên role..." {...field} />
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
                      <Input placeholder="Mô tả role (tùy chọn)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllPermissions}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllPermissions}
                        >
                          Clear All
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-3">
                        {availablePermissions.map((permission) => (
                          <label
                            key={permission}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={form.watch('permissions').includes(permission)}
                              onChange={() => togglePermission(permission)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {getPermissionLabel(permission)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
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
                  {editingRole ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
