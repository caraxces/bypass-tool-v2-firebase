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
    message: 'Tên Schema phải có ít nhất 2 ký tự.',
  }),
  type: z.string().min(1, {
    message: 'Vui lòng chọn loại Schema.',
  }),
  projectId: z.string().min(1, {
    message: 'Vui lòng chọn dự án.',
  }),
  content: z.string().min(10, {
    message: 'Nội dung Schema phải có ít nhất 10 ký tự.',
  }),
  description: z.string().optional(),
});

interface AddSchemaDialogProps {
  onSchemaCreated?: (schema: any) => void;
  onRefresh?: () => void;
  trigger?: React.ReactNode;
  projects?: any[];
}

export function AddSchemaDialog({ onSchemaCreated, onRefresh, trigger, projects = [] }: AddSchemaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      projectId: '',
      content: '',
      description: '',
    },
  });

  const schemaTypes = [
    'Article',
    'Product',
    'Organization',
    'LocalBusiness',
    'FAQ',
    'BreadcrumbList',
    'WebSite',
    'Person',
    'Review',
    'Event',
    'Recipe',
    'JobPosting',
    'VideoObject',
    'MusicAlbum',
    'Book',
    'Movie',
    'SoftwareApplication',
    'MobileApplication',
    'WebApplication',
    'Game',
    'CreativeWork',
    'Place',
    'Thing',
    'Intangible',
    'Service',
    'Brand',
    'Offer',
    'AggregateRating',
    'ImageObject',
    'AudioObject'
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('Đang tạo Schema:', values);
      
      const newSchema = await apiClient.createSchema({
        name: values.name,
        type: values.type,
        projectId: values.projectId,
        content: values.content,
        description: values.description || '',
      });
      
      console.log('Schema đã được tạo:', newSchema);
      
      form.reset();
      setOpen(false);
      
      if (onSchemaCreated) {
        onSchemaCreated(newSchema);
      }
      
      if (onRefresh) {
        onRefresh();
      }
      
      alert('Schema đã được tạo thành công!');
      
    } catch (error: any) {
      console.error('Lỗi khi tạo Schema:', error);
      setError(error.message || 'Có lỗi xảy ra khi tạo Schema. Vui lòng thử lại.');
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
                  <Button className="bg-purple-600 hover:bg-purple-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Schema
        </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Tạo Schema Mới
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Nhập thông tin Schema mới. Click lưu khi hoàn thành.
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
                    Tên Schema *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ví dụ: Product Schema cho Ru9.vn" 
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Loại Schema *
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn loại Schema...</option>
                      {schemaTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
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
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Dự Án *
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Nội Dung Schema (JSON-LD) *
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder='{"@context": "https://schema.org", "@type": "Product", "name": "..."}'
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      rows={8}
                    />
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
                      placeholder="Mô tả về Schema này..."
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? '⏳ Đang tạo...' : '💾 Tạo Schema'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
