'use client';

import BaseLayout from '@/components/layout/BaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your ERP system settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">General Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                This section will contain general settings for your ERP system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}