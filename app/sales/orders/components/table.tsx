'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useState } from 'react';

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

interface SalesOrdersTableProps {
  salesOrders: SalesOrder[];
  refresh: () => void;
}

export function SalesOrdersTable({ salesOrders, refresh }: SalesOrdersTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      const response = await fetch(`/api/sales/orders?id=${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('An error occurred while updating the order status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const approveOrder = async (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed');
  };

  const cancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(orderId, 'cancelled');
    }
  };

  const generateDeliveryChallan = async (orderId: string) => {
    try {
      const response = await fetch('/api/sales/delivery-challan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salesOrderId: orderId,
          companyId: 'default-company-id', // In real app, get actual company ID
        }),
      });

      if (response.ok) {
        toast.success('Delivery challan created successfully');
        refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create delivery challan');
      }
    } catch (error) {
      console.error('Error creating delivery challan:', error);
      toast.error('An error occurred while creating the delivery challan');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'warning';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableCaption>A list of your sales orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Sales Person</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesOrders.length > 0 ? (
            salesOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{order.salesPerson.firstName} {order.salesPerson.lastName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveOrder(order.id)}
                          disabled={updatingStatus[order.id]}
                        >
                          {updatingStatus[order.id] ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => generateDeliveryChallan(order.id)}
                        disabled={updatingStatus[order.id]}
                      >
                        {updatingStatus[order.id] ? 'Processing...' : 'Create Dispatch'}
                      </Button>
                    )}
                    {(order.status === 'shipped') && (
                      <span className="text-sm text-muted-foreground">In Transit</span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-sm text-muted-foreground">Delivered</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No sales orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}