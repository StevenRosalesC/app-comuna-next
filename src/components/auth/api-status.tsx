'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiCommunity from '@/utils/communityApi';

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string>('');

  const checkApiStatus = async () => {
    setStatus('checking');
    setError('');

    try {
      await apiCommunity.get('/health');
      setStatus('online');
    } catch (err: any) {
      setStatus('offline');
      setError(err.message || 'Unknown error');
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>API Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' :
                status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
            <span className="capitalize">{status}</span>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              Error: {error}
            </div>
          )}

          <Button onClick={checkApiStatus} disabled={status === 'checking'}>
            {status === 'checking' ? 'Checking...' : 'Check Again'}
          </Button>

          <div className="text-xs text-gray-500">
            API URL: {process.env.NEXT_PUBLIC_API_URL}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 