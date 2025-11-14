'use client';

import { useState, useEffect } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DeliveryChallan {
  id: string;
  challanNumber: string;
  date: string;
  status: string;
  salesOrder: {
    orderNumber: string;
    customer: {
      name: string;
    };
    orderItems: Array<{
      product: {
        name: string;
        sku: string;
      };
      quantity: number;
    }>;
  };
}

export default function DispatchPage() {
  const [deliveryChallans, setDeliveryChallans] = useState<DeliveryChallan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch delivery challans
        const challanRes = await fetch('/api/sales/delivery-challan');
        if (challanRes.ok) {
          const challanData = await challanRes.json();
          setDeliveryChallans(challanData.data || []);
        }
        
        // Fetch sales orders that are confirmed but not yet shipped
        const ordersRes = await fetch('/api/sales/orders?status=confirmed');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dispatch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createDeliveryChallan = async () => {
    if (!selectedOrderId) {
      toast.error('Please select a sales order');
      return;
    }

    try {
      const response = await fetch('/api/sales/delivery-challan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salesOrderId: selectedOrderId,
          vehicleNumber,
          driverName,
          companyId: 'default-company-id', // In real app, get actual company ID
        }),
      });

      if (response.ok) {
        toast.success('Delivery challan created successfully');
        // Reset form
        setSelectedOrderId('');
        setVehicleNumber('');
        setDriverName('');
        // Refresh data
        const challanRes = await fetch('/api/sales/delivery-challan');
        if (challanRes.ok) {
          const challanData = await challanRes.json();
          setDeliveryChallans(challanData.data || []);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create delivery challan');
      }
    } catch (error) {
      console.error('Error creating delivery challan:', error);
      toast.error('An error occurred while creating the delivery challan');
    }
  };

  const updateDeliveryStatus = async (challanId: string, status: string) => {
    try {
      const response = await fetch(`/api/sales/delivery-challan?id=${challanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Delivery status updated to ${status}`);
        // Refresh data
        const challanRes = await fetch('/api/sales/delivery-challan');
        if (challanRes.ok) {
          const challanData = await challanRes.json();
          setDeliveryChallans(challanData.data || []);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update delivery status');
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast.error('An error occurred while updating the delivery status');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dispatch Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage delivery challans and gatepasses</p>
        </div>

        {/* Create Dispatch Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Dispatch</CardTitle>
            <CardDescription>Generate a delivery challan for a confirmed sales order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salesOrder">Sales Order</Label>
                <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.orderNumber} - {order.customer.name} (${order.totalAmount.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="Enter vehicle number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Enter driver name"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={createDeliveryChallan}>
                Create Delivery Challan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Challans List */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Challans</CardTitle>
            <CardDescription>Manage and track delivery challans</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading delivery challans...</p>
              </div>
            ) : deliveryChallans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No delivery challans found
              </div>
            ) : (
              <div className="space-y-4">
                {deliveryChallans.map(challan => (
                  <div key={challan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Challan: {challan.challanNumber}</h3>
                        <p className="text-sm text-gray-500">
                          Order: {challan.salesOrder.orderNumber} | 
                          Customer: {challan.salesOrder.customer.name} | 
                          Date: {new Date(challan.date).toLocaleDateString()}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Items:</p>
                          <ul className="text-sm list-disc pl-5">
                            {challan.salesOrder.orderItems.map((item, idx) => (
                              <li key={idx}>
                                {item.product.name} ({item.product.sku}) - Qty: {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusBadgeVariant(challan.status)}>
                          {challan.status}
                        </Badge>
                        <div className="flex space-x-2">
                          {challan.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateDeliveryStatus(challan.id, 'delivered')}
                            >
                              Mark as Delivered
                            </Button>
                          )}
                          {challan.status === 'delivered' && (
                            <span className="text-sm text-green-600">Delivered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}