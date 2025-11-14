'use client';

import BaseLayout from '@/components/layout/BaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to ERP System</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your business efficiently with our ERP solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Card */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800 dark:text-white">Sales Overview</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Track your sales performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">$0</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">today</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="text-green-600 dark:text-green-400">0% </span>
                <span>from yesterday</span>
              </p>
            </CardContent>
          </Card>

          {/* Inventory Card */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800 dark:text-white">Inventory Status</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Monitor your stock levels and movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">0</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">items</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="text-red-600 dark:text-red-400">0 </span>
                <span>items low in stock</span>
              </p>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800 dark:text-white">Recent Orders</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                View your latest orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">0</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">pending</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="text-green-600 dark:text-green-400">0% </span>
                <span>fulfillment rate</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Recent Activity Card */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Latest actions in your ERP system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                No recent activity to display.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}