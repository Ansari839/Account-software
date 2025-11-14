'use client';

import BaseLayout from '@/components/layout/BaseLayout';

export default function ReportsPage() {
  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and view business reports
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Reports generation functionality will be implemented here.
          </p>
        </div>
      </div>
    </BaseLayout>
  );
}