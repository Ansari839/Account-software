'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BaseLayout from '@/components/layout/BaseLayout';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  date: Date;
  totalAmount: number;
  status: string;
}

interface SalesReturn {
  id: string;
  returnNumber: string;
  date: Date;
  totalAmount: number;
  status: string;
}

interface CustomerLedger {
  id: string;
  date: Date;
  transactionType: string; // sales_order, sales_return, payment, etc.
  referenceId: string; // ID of the related transaction
  description: string;
  debit: number; // Amount owed to customer (return, credit)
  credit: number; // Amount owed by customer (sale, invoice)
  balance: number; // Running balance
  relatedOrder?: SalesOrder;
  relatedReturn?: SalesReturn;
}

export default function CustomerLedgerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [ledgerEntries, setLedgerEntries] = useState<CustomerLedger[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [salesReturns, setSalesReturns] = useState<SalesReturn[]>([]);

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockCustomers: Customer[] = [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
        ];
        
        const mockSalesOrders: SalesOrder[] = [
          { id: '1', orderNumber: 'SO-001', date: new Date('2024-01-15'), totalAmount: 2525, status: 'delivered' },
          { id: '2', orderNumber: 'SO-002', date: new Date('2024-01-16'), totalAmount: 225, status: 'delivered' },
          { id: '3', orderNumber: 'SO-003', date: new Date('2024-01-17'), totalAmount: 1200, status: 'pending' },
        ];
        
        const mockSalesReturns: SalesReturn[] = [
          { id: '1', returnNumber: 'SR-001', date: new Date('2024-01-20'), totalAmount: 1200, status: 'processed' },
          { id: '2', returnNumber: 'SR-002', date: new Date('2024-01-21'), totalAmount: 75, status: 'approved' },
        ];
        
        const mockLedgerEntries: CustomerLedger[] = [
          {
            id: '1',
            date: new Date('2024-01-15'),
            transactionType: 'sales_order',
            referenceId: '1',
            description: 'Sales Order #SO-001',
            debit: 0,
            credit: 2525,
            balance: 2525,
            relatedOrder: { id: '1', orderNumber: 'SO-001', date: new Date('2024-01-15'), totalAmount: 2525, status: 'delivered' },
          },
          {
            id: '2',
            date: new Date('2024-01-16'),
            transactionType: 'sales_order',
            referenceId: '2',
            description: 'Sales Order #SO-002',
            debit: 0,
            credit: 225,
            balance: 2750, // 2525 + 225
            relatedOrder: { id: '2', orderNumber: 'SO-002', date: new Date('2024-01-16'), totalAmount: 225, status: 'delivered' },
          },
          {
            id: '3',
            date: new Date('2024-01-20'),
            transactionType: 'sales_return',
            referenceId: '1',
            description: 'Sales Return #SR-001',
            debit: 1200,
            credit: 0,
            balance: 1550, // 2750 - 1200
            relatedReturn: { id: '1', returnNumber: 'SR-001', date: new Date('2024-01-20'), totalAmount: 1200, status: 'processed' },
          },
          {
            id: '4',
            date: new Date('2024-01-21'),
            transactionType: 'payment',
            referenceId: 'P-001',
            description: 'Payment received',
            debit: 1000,
            credit: 0,
            balance: 550, // 1550 - 1000
          },
        ];
        
        setCustomers(mockCustomers);
        setSalesOrders(mockSalesOrders);
        setSalesReturns(mockSalesReturns);
        setLedgerEntries(mockLedgerEntries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
  };

  // Calculate customer balance
  const calculateBalance = () => {
    if (!selectedCustomer) return 0;
    return ledgerEntries.reduce((sum, entry) => sum + (entry.credit - entry.debit), 0);
  };

  // Filter ledger entries for selected customer
  const filteredLedgerEntries = selectedCustomer 
    ? ledgerEntries 
    : [];

  // Get selected customer object
  const selectedCustomerObj = customers.find(c => c.id === selectedCustomer);

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Ledger</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View transaction history for customers
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-gray-800 dark:text-white">Customer Selection</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Customer
                  </label>
                  <Select value={selectedCustomer} onValueChange={handleCustomerChange}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCustomerObj && (
                  <div className="flex items-end">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Current Balance:</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        ${calculateBalance().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {selectedCustomer && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">
                Ledger for {selectedCustomerObj?.name}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Transaction history for the selected customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Reference</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Debit</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Credit</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLedgerEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        <Badge variant="outline">
                          {entry.transactionType === 'sales_order' && entry.relatedOrder?.orderNumber}
                          {entry.transactionType === 'sales_return' && entry.relatedReturn?.returnNumber}
                          {entry.transactionType === 'payment' && 'Payment'}
                          {entry.transactionType !== 'sales_order' && 
                           entry.transactionType !== 'sales_return' && 
                           entry.transactionType !== 'payment' && entry.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{entry.description}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                        ${entry.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredLedgerEntries.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No ledger entries found for this customer.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedCustomer && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Please select a customer to view their ledger.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLayout>
  );
}