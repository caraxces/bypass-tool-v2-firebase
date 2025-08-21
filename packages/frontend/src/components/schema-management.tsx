'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'file';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

interface Schema {
  id?: string;
  name: string;
  description?: string;
  formFields: FormField[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SchemaManagement() {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSchema, setNewSchema] = useState({
    name: '',
    description: '',
    isPublic: false,
    formFields: [] as FormField[]
  });
  const [currentField, setCurrentField] = useState<FormField>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    defaultValue: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await fetch('/api/schemas');
      const data = await response.json();
      if (data.success) {
        setSchemas(data.data);
      }
    } catch (error) {
      console.error('Error fetching schemas:', error);
    }
  };

  const createSchema = async () => {
    if (!newSchema.name.trim() || newSchema.formFields.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/schemas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSchema,
          createdBy: 'admin', // TODO: Get from auth context
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsCreateDialogOpen(false);
        setNewSchema({ name: '', description: '', isPublic: false, formFields: [] });
        fetchSchemas();
      }
    } catch (error) {
      console.error('Error creating schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchema = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa schema này?')) return;

    try {
      const response = await fetch(`/api/schemas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchSchemas();
      }
    } catch (error) {
      console.error('Error deleting schema:', error);
    }
  };

  const addField = () => {
    if (!currentField.name.trim() || !currentField.label.trim()) return;

    setNewSchema(prev => ({
      ...prev,
      formFields: [...prev.formFields, { ...currentField }]
    }));

    setCurrentField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      defaultValue: ''
    });
  };

  const removeField = (index: number) => {
    setNewSchema(prev => ({
      ...prev,
      formFields: prev.formFields.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Quản lý Schema
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Tạo Schema mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo Schema mới</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên Schema *</Label>
                  <Input
                    id="name"
                    value={newSchema.name}
                    onChange={(e) => setNewSchema(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên schema"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Input
                    id="description"
                    value={newSchema.description}
                    onChange={(e) => setNewSchema(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Nhập mô tả schema"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newSchema.isPublic}
                    onChange={(e) => setNewSchema(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <Label htmlFor="isPublic">Schema công khai</Label>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="fieldName">Tên field *</Label>
                      <Input
                        id="fieldName"
                        value={currentField.name}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Tên field"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldLabel">Nhãn *</Label>
                      <Input
                        id="fieldLabel"
                        value={currentField.label}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Nhãn hiển thị"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldType">Loại *</Label>
                      <select
                        id="fieldType"
                        value={currentField.type}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                        <option value="file">File</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fieldRequired"
                        checked={currentField.required}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, required: e.target.checked }))}
                      />
                      <Label htmlFor="fieldRequired">Bắt buộc</Label>
                    </div>
                  </div>

                  <Button onClick={addField} className="mb-4">
                    Thêm Field
                  </Button>

                  <div className="space-y-2">
                    {newSchema.formFields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{field.label} ({field.type})</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeField(index)}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={createSchema}
                    disabled={loading || !newSchema.name.trim() || newSchema.formFields.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Đang tạo...' : 'Tạo Schema'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Schema</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số lượng fields</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemas.map((schema) => (
                  <TableRow key={schema.id}>
                    <TableCell className="font-medium">{schema.name}</TableCell>
                    <TableCell>{schema.description || 'Không có mô tả'}</TableCell>
                    <TableCell>{schema.formFields.length}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        schema.isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {schema.isPublic ? 'Công khai' : 'Riêng tư'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSchema(schema.id!)}
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
