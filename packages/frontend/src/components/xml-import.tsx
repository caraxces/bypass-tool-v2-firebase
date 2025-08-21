'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Label } from './ui/label';
import { buildApiUrl, API_CONFIG } from '../lib/api-config';

interface XMLImport {
  id?: string;
  url: string;
  xpath: string;
  result: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  createdBy: string;
  createdAt: Date;
}

interface PageStructure {
  title: string;
  h1: string[];
  h2: string[];
  h3: string[];
  p: string[];
  div: string[];
  meta: {
    description?: string;
    keywords?: string;
  };
}

export default function XMLImport() {
  const [imports, setImports] = useState<XMLImport[]>([]);
  const [url, setUrl] = useState('https://ru9.vn');
  const [xpath, setXpath] = useState('//h1');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageStructure, setPageStructure] = useState<PageStructure | null>(null);
  const [analyzingStructure, setAnalyzingStructure] = useState(false);

  useEffect(() => {
    fetchImports();
  }, []);

  const fetchImports = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.XML_IMPORTS));
      const data = await response.json();
      if (data.success) {
        setImports(data.data);
      }
    } catch (error) {
      console.error('Error fetching imports:', error);
    }
  };

  const analyzePageStructure = async () => {
    if (!url.trim()) return;

    setAnalyzingStructure(true);
    setError('');
    setPageStructure(null);
    
    try {
      console.log(`Đang phân tích cấu trúc trang: ${url}`);
      
      const response = await fetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.XML_IMPORTS)}/structure?url=${encodeURIComponent(url.trim())}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setPageStructure(data.data);
        console.log('Phân tích cấu trúc thành công:', data.data);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi phân tích cấu trúc trang');
        console.error('Lỗi từ API:', data.error);
      }
    } catch (error) {
      console.error('Error analyzing page structure:', error);
      setError('Có lỗi xảy ra khi kết nối đến server');
    } finally {
      setAnalyzingStructure(false);
    }
  };

  const extractData = async () => {
    if (!url.trim() || !xpath.trim()) return;

    setLoading(true);
    setError('');
    setResult('');
    
    try {
      console.log(`Đang trích xuất từ: ${url} với XPath: ${xpath}`);
      
      // Sử dụng API mới để trích xuất dữ liệu thực tế
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.XML_IMPORTS) + '/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          xpath: xpath.trim(),
          createdBy: 'admin', // TODO: Get from auth context
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data.result);
        console.log('Trích xuất thành công:', data.data);
        // Refresh danh sách imports
        fetchImports();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi trích xuất dữ liệu');
        console.error('Lỗi từ API:', data.error);
      }
    } catch (error) {
      console.error('Error extracting data:', error);
      setError('Có lỗi xảy ra khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const suggestXPath = (type: string) => {
    const suggestions = {
      'title': '//title',
      'h1': '//h1',
      'h2': '//h2',
      'h3': '//h3',
      'p': '//p',
      'meta-description': '//meta[@name="description"]/@content',
      'meta-keywords': '//meta[@name="keywords"]/@content'
    };
    
    if (suggestions[type as keyof typeof suggestions]) {
      setXpath(suggestions[type as keyof typeof suggestions]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Import XML - Trích xuất dữ liệu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ru9.vn"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={analyzePageStructure} 
              disabled={analyzingStructure || !url.trim()}
              variant="outline"
              className="flex-1"
            >
              {analyzingStructure ? 'Đang phân tích...' : '🔍 Phân tích cấu trúc trang'}
            </Button>
          </div>

          {pageStructure && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-3">📋 Cấu trúc trang đã phân tích:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Tiêu đề:</strong> {pageStructure.title}
                </div>
                {pageStructure.meta.description && (
                  <div>
                    <strong>Mô tả:</strong> {pageStructure.meta.description}
                  </div>
                )}
                {pageStructure.h1.length > 0 && (
                  <div>
                    <strong>H1:</strong> {pageStructure.h1.join(', ')}
                  </div>
                )}
                {pageStructure.h2.length > 0 && (
                  <div>
                    <strong>H2:</strong> {pageStructure.h2.join(', ')}
                  </div>
                )}
                {pageStructure.p.length > 0 && (
                  <div>
                    <strong>Đoạn văn:</strong> {pageStructure.p.slice(0, 3).join(', ')}...
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">💡 Gợi ý XPath:</h4>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => suggestXPath('title')}>
                    //title
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => suggestXPath('h1')}>
                    //h1
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => suggestXPath('h2')}>
                    //h2
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => suggestXPath('p')}>
                    //p
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => suggestXPath('meta-description')}>
                    //meta[@name="description"]/@content
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="xpath">XPath</Label>
            <Input
              id="xpath"
              value={xpath}
              onChange={(e) => setXpath(e.target.value)}
              placeholder="//h1 hoặc //title hoặc //p"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Sử dụng XPath hợp lệ: //h1, //title, //p, //div, //meta[@name="description"]/@content
            </p>
          </div>

          <Button 
            onClick={extractData} 
            disabled={loading || !url.trim() || !xpath.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Đang trích xuất...' : '🚀 Lấy thông tin'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <Label>🎯 Kết quả trích xuất:</Label>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 mb-2">{result}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(result)}
                  className="bg-white hover:bg-gray-50"
                >
                  📋 Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            📚 Lịch sử Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>XPath</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imports.map((importItem) => (
                  <TableRow key={importItem.id}>
                    <TableCell className="max-w-xs truncate">
                      <a 
                        href={importItem.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {importItem.url}
                      </a>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{importItem.xpath}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={importItem.result}>
                        {importItem.result || importItem.errorMessage || 'Không có dữ liệu'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        importItem.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {importItem.status === 'success' ? '✅ Thành công' : '❌ Thất bại'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(importItem.createdAt).toLocaleDateString('vi-VN')}
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
