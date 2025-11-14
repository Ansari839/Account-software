'use client';

import { useState, useEffect } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { SalesOrdersTable } from './components/table';
import { SalesOrderForm } from './components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SalesOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  customer: {
    name: string;
  };
  salesPerson: {
    firstName: string;
    lastName: string;
  };
  totalAmount: number;
  orderItems: Array<{
    id: string;
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
    unitPrice: number;
  }>;
}

export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger refresh
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        setLoading(true);
        const url = activeTab === 'all' 
          ? '/api/sales/orders' 
          : `/api/sales/orders?status=${activeTab}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (response.ok) {
          setSalesOrders(result.data || []);
        } else {
          console.error('Failed to fetch sales orders:', result.error);
        }
      } catch (error) {
        console.error('Error fetching sales orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, [refreshTrigger, activeTab]);

  const handleOrderCreated = () => {
    setIsFormOpen(false);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  // Group orders by status for the tabs
  const pendingOrders = salesOrders.filter(order => order.status === 'pending');
  const confirmedOrders = salesOrders.filter(order => order.status === 'confirmed');
  const shippedOrders = salesOrders.filter(order => order.status === 'shipped');
  const deliveredOrders = salesOrders.filter(order => order.status === 'delivered');
  const cancelledOrders = salesOrders.filter(order => order.status === 'cancelled');

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sales Orders</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>Create Sales Order</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Sales Order</DialogTitle>
              </DialogHeader>
              <SalesOrderForm onSuccess={handleOrderCreated} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600 dark:text-gray-400">Loading sales orders...</p>
              </div>
            ) : (
              <SalesOrdersTable 
                salesOrders={salesOrders} 
                refresh={() => setRefreshTrigger(prev => prev + 1)} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <SalesOrdersTable 
              salesOrders={pendingOrders} 
              refresh={() => setRefreshTrigger(prev => prev + 1)} 
            />
          </TabsContent>
          
          <TabsContent value="confirmed" className="mt-4">
            <SalesOrdersTable 
              salesOrders={confirmedOrders} 
              refresh={() => setRefreshTrigger(prev => prev + 1)} 
            />
          </TabsContent>
          
          <TabsContent value="shipped" className="mt-4">
            <SalesOrdersTable 
              salesOrders={shippedOrders} 
              refresh={() => setRefreshTrigger(prev => prev + 1)} 
            />
          </TabsContent>
          
          <TabsContent value="delivered" className="mt-4">
            <SalesOrdersTable 
              salesOrders={deliveredOrders} 
              refresh={() => setRefreshTrigger(prev => prev + 1)} 
            />
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-4">
            <SalesOrdersTable 
              salesOrders={cancelledOrders} 
              refresh={() => setRefreshTrigger(prev => prev + 1)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}