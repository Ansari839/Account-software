import BaseLayout from '@/components/layout/BaseLayout';

export default function DeliveryChallanPage() {
  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Delivery Challan</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your delivery challans</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Delivery Challan functionality will be implemented here.
          </p>
        </div>
      </div>
    </BaseLayout>
  );
}