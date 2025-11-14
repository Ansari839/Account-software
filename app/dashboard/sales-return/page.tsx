'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, Calendar } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: Customer;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SalesReturn {
  id: string;
  returnNumber: string;
  date: Date;
  reason: string | null;
  status: string;
  salesOrderId: string | null;
  salesOrder: SalesOrder | null;
  customerId: string;
  customer: Customer;
  createdBy: string;
  creator: Employee;
  returnItems: ReturnItem[];
  totalAmount: number;
  createdAt: Date;
}

export default function SalesReturnPage() {
  const [salesReturns, setSalesReturns] = useState<SalesReturn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState<SalesReturn | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
  });
  const [formData, setFormData] = useState({
    returnNumber: '',
    date: '',
    reason: '',
    salesOrderId: '',
    customerId: '',
    createdBy: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

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
        
        const mockEmployees: Employee[] = [
          { id: '1', firstName: 'Alice', lastName: 'Brown' },
          { id: '2', firstName: 'Charlie', lastName: 'Davis' },
        ];
        
        const mockSalesOrders: SalesOrder[] = [
          { id: '1', orderNumber: 'SO-001', customer: { id: '1', name: 'John Doe', email: 'john@example.com' } },
          { id: '2', orderNumber: 'SO-002', customer: { id: '2', name: 'Jane Smith', email: 'jane@example.com' } },
        ];
        
        const mockProducts: Product[] = [
          { id: '1', name: 'Laptop', price: 1200 },
          { id: '2', name: 'Mouse', price: 25 },
          { id: '3', name: 'Keyboard', price: 75 },
        ];
        
        const mockReturns: SalesReturn[] = [
          {
            id: '1',
            returnNumber: 'SR-001',
            date: new Date('2024-01-20'),
            reason: 'Defective product',
            status: 'approved',
            salesOrderId: '1',
            salesOrder: { id: '1', orderNumber: 'SO-001', customer: { id: '1', name: 'John Doe', email: 'john@example.com' } },
            customerId: '1',
            customer: { id: '1', name: 'John Doe', email: 'john@example.com' },
            createdBy: '1',
            creator: { id: '1', firstName: 'Alice', lastName: 'Brown' },
            returnItems: [
              { id: '1', productId: '1', productName: 'Laptop', quantity: 1, unitPrice: 1200, total: 1200 },
            ],
            totalAmount: 1200,
            createdAt: new Date(),
          },
          {
            id: '2',
            returnNumber: 'SR-002',
            date: new Date('2024-01-21'),
            reason: 'Wrong item received',
            status: 'pending',
            salesOrderId: '2',
            salesOrder: { id: '2', orderNumber: 'SO-002', customer: { id: '2', name: 'Jane Smith', email: 'jane@example.com' } },
            customerId: '2',
            customer: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
            createdBy: '2',
            creator: { id: '2', firstName: 'Charlie', lastName: 'Davis' },
            returnItems: [
              { id: '2', productId: '3', productName: 'Keyboard', quantity: 1, unitPrice: 75, total: 75 },
            ],
            totalAmount: 75,
            createdAt: new Date(),
          },
        ];
        
        setCustomers(mockCustomers);
        setEmployees(mockEmployees);
        setSalesOrders(mockSalesOrders);
        setProducts(mockProducts);
        setSalesReturns(mockReturns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleItemChange = (name: string, value: string | number) => {
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const handleItemSelectChange = (value: string) => {
    setCurrentItem({
      ...currentItem,
      productId: value,
    });
  };

  const addReturnItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert('Please select a product and enter a valid quantity');
      return;
    }

    const product = products.find(p => p.id === currentItem.productId);
    if (!product) return;

    const newItem: ReturnItem = {
      id: Date.now().toString(), // In real app, this would be generated by the backend
      productId: currentItem.productId,
      productName: product.name,
      quantity: currentItem.quantity,
      unitPrice: product.price,
      total: product.price * currentItem.quantity,
    };

    setReturnItems([...returnItems, newItem]);
    setCurrentItem({ productId: '', quantity: 1 });
  };

  const removeReturnItem = (id: string) => {
    setReturnItems(returnItems.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.returnNumber.trim()) {
      newErrors.returnNumber = 'Return number is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Return date is required';
    }
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    
    if (!formData.createdBy) {
      newErrors.createdBy = 'Created by is required';
    }
    
    if (returnItems.length === 0) {
      newErrors.returnItems = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return returnItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = calculateTotal();
      
      // Prepare return data
      const returnData = {
        ...formData,
        totalAmount,
        returnItems,
      };

      if (editingReturn) {
        // Update existing return
        // const updatedReturn = await updateSalesReturn(editingReturn.id, returnData);
        // setSalesReturns(salesReturns.map(r => r.id === editingReturn.id ? updatedReturn : r));
      } else {
        // Create new return
        // const newReturn = await createSalesReturn(returnData);
        // setSalesReturns([...salesReturns, newReturn]);
      }
      
      // Reset form and close dialog
      setFormData({
        returnNumber: editingReturn ? editingReturn.returnNumber : '',
        date: editingReturn ? new Date(editingReturn.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        reason: editingReturn ? editingReturn.reason || '' : '',
        salesOrderId: editingReturn ? editingReturn.salesOrderId || '' : '',
        customerId: '',
        createdBy: '',
        status: 'pending',
      });
      setReturnItems([]);
      setErrors({});
      setIsDialogOpen(false);
      setEditingReturn(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving sales return:', error);
    }
  };

  const handleEdit = (returnItem: SalesReturn) => {
    setEditingReturn(returnItem);
    setFormData({
      returnNumber: returnItem.returnNumber,
      date: new Date(returnItem.date).toISOString().split('T')[0],
      reason: returnItem.reason || '',
      salesOrderId: returnItem.salesOrderId || '',
      customerId: returnItem.customerId,
      createdBy: returnItem.createdBy,
      status: returnItem.status,
    });
    setReturnItems(returnItem.returnItems);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sales return?')) {
      try {
        // await deleteSalesReturn(id);
        // setSalesReturns(salesReturns.filter(returnItem => returnItem.id !== id));
        // For mock implementation, just remove from state
        setSalesReturns(salesReturns.filter(returnItem => returnItem.id !== id));
      } catch (error) {
        console.error('Error deleting sales return:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingReturn(null);
    setFormData({
      returnNumber: `SR-${(salesReturns.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      reason: '',
      salesOrderId: '',
      customerId: '',
      createdBy: '',
      status: 'pending',
    });
    setReturnItems([]);
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sales Returns</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your sales returns
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Return
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Return #</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Sales Order</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesReturns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{returnItem.returnNumber}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(returnItem.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{returnItem.customer.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {returnItem.salesOrder ? returnItem.salesOrder.orderNumber : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          returnItem.status === 'processed' ? 'default' : 
                          returnItem.status === 'approved' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">${returnItem.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(returnItem)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(returnItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-4xl bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">
                {editingReturn ? 'Edit Sales Return' : 'Add New Sales Return'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnNumber" className="text-gray-700 dark:text-gray-300">
                      Return Number *
                    </Label>
                    <Input
                      id="returnNumber"
                      name="returnNumber"
                      value={formData.returnNumber}
                      onChange={handleInputChange}
                      className={errors.returnNumber ? 'border-red-500' : ''}
                      readOnly={!!editingReturn}
                    />
                    {errors.returnNumber && <div className="text-red-500 text-sm">{errors.returnNumber}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                      Return Date *
                    </Label>
                    <div className="relative">
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.date ? 'border-red-500' : ''}`}
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.date && <div className="text-red-500 text-sm">{errors.date}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerId" className="text-gray-700 dark:text-gray-300">
                      Customer *
                    </Label>
                    <Select value={formData.customerId} onValueChange={(value) => handleSelectChange('customerId', value)}>
                      <SelectTrigger className={errors.customerId ? 'border-red-500' : ''}>
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
                    {errors.customerId && <div className="text-red-500 text-sm">{errors.customerId}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salesOrderId" className="text-gray-700 dark:text-gray-300">
                      Related Sales Order
                    </Label>
                    <Select 
                      value={formData.salesOrderId || ''} 
                      onValueChange={(value) => handleSelectChange('salesOrderId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sales order" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesOrders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.orderNumber} - {order.customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="createdBy" className="text-gray-700 dark:text-gray-300">
                      Created By *
                    </Label>
                    <Select value={formData.createdBy} onValueChange={(value) => handleSelectChange('createdBy', value)}>
                      <SelectTrigger className={errors.createdBy ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.createdBy && <div className="text-red-500 text-sm">{errors.createdBy}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
                      Status *
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-gray-700 dark:text-gray-300">
                    Reason
                  </Label>
                  <Input
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Return Items *
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <Select value={currentItem.productId} onValueChange={handleItemSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div>
                      <Input
                        type="number"
                        value={currentItem.quantity}
                        onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>
                    
                    <Button type="button" onClick={addReturnItem} variant="outline">
                      Add Item
                    </Button>
                  </div>
                  
                  {errors.returnItems && <div className="text-red-500 text-sm">{errors.returnItems}</div>}
                  
                  {returnItems.length > 0 && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-700 dark:text-gray-300">Product</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Quantity</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Unit Price</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Total</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {returnItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-gray-800 dark:text-gray-200">{item.productName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell>${item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeReturnItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total Amount:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingReturn ? 'Update Sales Return' : 'Create Sales Return'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}