'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BaseLayout from '@/components/layout/BaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();

  // Redirect to dashboard on initial load
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  // Fallback UI in case redirect fails
  return (
    <BaseLayout>
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-800 dark:text-white">ERP System</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              If you are not redirected automatically, please{' '}
              <a 
                href="/dashboard" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                click here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}