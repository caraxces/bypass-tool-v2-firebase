'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Tên Tag phải có ít nhất 2 ký tự.',
  }),
  color: z.string().min(1, {
    message: 'Vui lòng chọn màu cho Tag.',
  }),
  projectId: z.string().min(1, {
    message: 'Vui lòng chọn dự án.',
  }),
  description: z.string().optional(),
});

interface AddTagDialogProps {
  onTagCreated?: (tag: any) => void;
  onRefresh?: () => void;
  trigger?: React.ReactNode;
  projects?: any[];
}

export function AddTagDialog({ onTagCreated, onRefresh, trigger, projects = [] }: AddTagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '#3B82F6',
      projectId: '',
      description: '',
    },
  });

  const tagColors = [
    { name: 'Xanh dương', value: '#3B82F6' },
    { name: 'Xanh lá', value: '#10B981' },
    { name: 'Đỏ', value: '#EF4444' },
    { name: 'Vàng', value: '#F59E0B' },
    { name: 'Tím', value: '#8B5CF6' },
    { name: 'Hồng', value: '#EC4899' },
    { name: 'Cam', value: '#F97316' },
    { name: 'Xám', value: '#6B7280' },
    { name: 'Đen', value: '#111827' },
    { name: 'Trắng', value: '#FFFFFF' },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('Đang thêm Tag:', values);
      
      const newTag = await apiClient.createTag({
        name: values.name,
        color: values.color,
        projectId: values.projectId,
        description: values.description || '',
      });
      
      console.log('Tag đã được thêm:', newTag);
      
      form.reset();
      setOpen(false);
      
      if (onTagCreated) {
        onTagCreated(newTag);
      }
      
      if (onRefresh) {
        onRefresh();
      }
      
      alert('Tag đã được thêm thành công!');
      
    } catch (error: any) {
      console.error('Lỗi khi thêm Tag:', error);
      setError(error.message || 'Có lỗi xảy ra khi thêm Tag. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setError('');
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Tag
        </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Thêm Tag Mới
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Nhập thông tin Tag mới. Click lưu khi hoàn thành.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Tên Tag *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ví dụ: SEO, Marketing, Content" 
                      {...field} 
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Màu sắc *
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-5 gap-2">
                      {tagColors.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          type="button"
                          onClick={() => field.onChange(colorOption.value)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            field.value === colorOption.value 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: colorOption.value }}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                    <Input 
                      type="color"
                      {...field} 
                      className="w-full mt-2 h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Dự Án *
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Chọn dự án...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Mô Tả (Tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Mô tả về Tag này..."
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <DialogFooter className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {isSubmitting ? '⏳ Đang thêm...' : '💾 Thêm Tag'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
