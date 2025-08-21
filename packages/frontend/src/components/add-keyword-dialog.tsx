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
  keyword: z.string().min(1, {
    message: 'Từ khóa không được để trống.',
  }),
  projectId: z.string().min(1, {
    message: 'Vui lòng chọn dự án.',
  }),
  status: z.enum(['pending', 'checked', 'failed']).default('pending'),
  notes: z.string().optional(),
});

interface AddKeywordDialogProps {
  onKeywordCreated?: (keyword: any) => void;
  onRefresh?: () => void;
  trigger?: React.ReactNode;
  projects?: any[];
}

export function AddKeywordDialog({ onKeywordCreated, onRefresh, trigger, projects = [] }: AddKeywordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      projectId: '',
      status: 'pending',
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('Đang thêm từ khóa:', values);
      
      const newKeyword = await apiClient.createKeyword({
        keyword: values.keyword,
        projectId: values.projectId,
        status: values.status,
        notes: values.notes || '',
      });
      
      console.log('Từ khóa đã được thêm:', newKeyword);
      
      form.reset();
      setOpen(false);
      
      if (onKeywordCreated) {
        onKeywordCreated(newKeyword);
      }
      
      if (onRefresh) {
        onRefresh();
      }
      
      alert('Từ khóa đã được thêm thành công!');
      
    } catch (error: any) {
      console.error('Lỗi khi thêm từ khóa:', error);
      setError(error.message || 'Có lỗi xảy ra khi thêm từ khóa. Vui lòng thử lại.');
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
                  <Button className="bg-green-600 hover:bg-green-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Từ Khóa
        </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Thêm Từ Khóa Mới
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Nhập thông tin từ khóa mới. Click lưu khi hoàn thành.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Từ Khóa *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ví dụ: SEO tools" 
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
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Dự Án *
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Trạng Thái
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="pending">Chờ kiểm tra</option>
                      <option value="checked">Đã kiểm tra</option>
                      <option value="failed">Thất bại</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Ghi Chú (Tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Ghi chú về từ khóa..."
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? '⏳ Đang thêm...' : '💾 Thêm Từ Khóa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
