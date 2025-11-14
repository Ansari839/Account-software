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

interface Company {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Product {
  id: string;
  name: string;
  cost: number | null;
  stock: number;
}

interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQty: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  date: Date;
  status: string;
  supplierId: string;
  supplier: Supplier;
  purchasePersonId: string;
  purchasePerson: Employee;
  orderItems: PurchaseOrderItem[];
  totalAmount: number;
  createdAt: Date;
}

export default function PurchaseOrderPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
    unitPrice: 0,
  });
  const [formData, setFormData] = useState({
    orderNumber: '',
    date: '',
    supplierId: '',
    purchasePersonId: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockSuppliers: Supplier[] = [
          { id: '1', name: 'ABC Suppliers', email: 'contact@abcsuppliers.com' },
          { id: '2', name: 'XYZ Distributors', email: 'info@xyzdist.com' },
          { id: '3', name: 'Global Trading', email: 'hello@globaltrade.com' },
        ];
        
        const mockEmployees: Employee[] = [
          { id: '1', firstName: 'Alice', lastName: 'Brown' },
          { id: '2', firstName: 'Charlie', lastName: 'Davis' },
        ];
        
        const mockProducts: Product[] = [
          { id: '1', name: 'Laptop', cost: 1000, stock: 5 },
          { id: '2', name: 'Mouse', cost: 20, stock: 25 },
          { id: '3', name: 'Keyboard', cost: 50, stock: 15 },
        ];
        
        const mockOrders: PurchaseOrder[] = [
          {
            id: '1',
            orderNumber: 'PO-001',
            date: new Date('2024-01-10'),
            status: 'confirmed',
            supplierId: '1',
            supplier: { id: '1', name: 'ABC Suppliers', email: 'contact@abcsuppliers.com' },
            purchasePersonId: '1',
            purchasePerson: { id: '1', firstName: 'Alice', lastName: 'Brown' },
            orderItems: [
              { id: '1', productId: '1', productName: 'Laptop', quantity: 5, unitPrice: 1000, total: 5000, receivedQty: 0 },
              { id: '2', productId: '2', productName: 'Mouse', quantity: 10, unitPrice: 20, total: 200, receivedQty: 0 },
            ],
            totalAmount: 5200,
            createdAt: new Date(),
          },
          {
            id: '2',
            orderNumber: 'PO-002',
            date: new Date('2024-01-12'),
            status: 'partially_received',
            supplierId: '2',
            supplier: { id: '2', name: 'XYZ Distributors', email: 'info@xyzdist.com' },
            purchasePersonId: '2',
            purchasePerson: { id: '2', firstName: 'Charlie', lastName: 'Davis' },
            orderItems: [
              { id: '3', productId: '3', productName: 'Keyboard', quantity: 20, unitPrice: 50, total: 1000, receivedQty: 5 },
            ],
            totalAmount: 1000,
            createdAt: new Date(),
          },
        ];
        
        setSuppliers(mockSuppliers);
        setEmployees(mockEmployees);
        setProducts(mockProducts);
        setPurchaseOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const product = products.find(p => p.id === value);
    setCurrentItem({
      ...currentItem,
      productId: value,
      unitPrice: product?.cost || 0,
    });
  };

  const addOrderItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.unitPrice <= 0) {
      alert('Please select a product, enter a valid quantity and unit price');
      return;
    }

    const product = products.find(p => p.id === currentItem.productId);
    if (!product) return;

    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(), // In real app, this would be generated by the backend
      productId: currentItem.productId,
      productName: product.name,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      total: currentItem.unitPrice * currentItem.quantity,
      receivedQty: 0,
    };

    setOrderItems([...orderItems, newItem]);
    setCurrentItem({ productId: '', quantity: 1, unitPrice: 0 });
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Order date is required';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (!formData.purchasePersonId) {
      newErrors.purchasePersonId = 'Purchase person is required';
    }
    
    if (orderItems.length === 0) {
      newErrors.orderItems = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = calculateTotal();
      
      // Prepare order data
      const orderData = {
        ...formData,
        totalAmount,
        orderItems,
      };

      if (editingOrder) {
        // Update existing order
        // const updatedOrder = await updatePurchaseOrder(editingOrder.id, orderData);
        // setPurchaseOrders(purchaseOrders.map(o => o.id === editingOrder.id ? updatedOrder : o));
      } else {
        // Create new order
        // const newOrder = await createPurchaseOrder(orderData);
        // setPurchaseOrders([...purchaseOrders, newOrder]);
      }
      
      // Reset form and close dialog
      setFormData({
        orderNumber: editingOrder ? editingOrder.orderNumber : '',
        date: editingOrder ? new Date(editingOrder.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        supplierId: '',
        purchasePersonId: '',
        status: 'pending',
      });
      setOrderItems([]);
      setErrors({});
      setIsDialogOpen(false);
      setEditingOrder(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving purchase order:', error);
    }
  };

  const handleEdit = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setFormData({
      orderNumber: order.orderNumber,
      date: new Date(order.date).toISOString().split('T')[0],
      supplierId: order.supplierId,
      purchasePersonId: order.purchasePersonId,
      status: order.status,
    });
    setOrderItems(order.orderItems);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this purchase order?')) {
      try {
        // await deletePurchaseOrder(id);
        // setPurchaseOrders(purchaseOrders.filter(order => order.id !== id));
        // For mock implementation, just remove from state
        setPurchaseOrders(purchaseOrders.filter(order => order.id !== id));
      } catch (error) {
        console.error('Error deleting purchase order:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingOrder(null);
    setFormData({
      orderNumber: `PO-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      supplierId: '',
      purchasePersonId: '',
      status: 'pending',
    });
    setOrderItems([]);
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Purchase Orders</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your purchase orders
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Purchase Order
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Order #</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Supplier</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Purchase Person</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{order.orderNumber}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{order.supplier.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{order.purchasePerson.firstName} {order.purchasePerson.lastName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'received' ? 'default' : 
                          order.status === 'partially_received' ? 'secondary' : 
                          order.status === 'confirmed' ? 'outline' : 'destructive'
                        }
                      >
                        {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
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
                {editingOrder ? 'Edit Purchase Order' : 'Add New Purchase Order'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber" className="text-gray-700 dark:text-gray-300">
                      Order Number *
                    </Label>
                    <Input
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className={errors.orderNumber ? 'border-red-500' : ''}
                      readOnly={!!editingOrder}
                    />
                    {errors.orderNumber && <div className="text-red-500 text-sm">{errors.orderNumber}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                      Order Date *
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
                    <Label htmlFor="supplierId" className="text-gray-700 dark:text-gray-300">
                      Supplier *
                    </Label>
                    <Select value={formData.supplierId} onValueChange={(value) => handleSelectChange('supplierId', value)}>
                      <SelectTrigger className={errors.supplierId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} ({supplier.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.supplierId && <div className="text-red-500 text-sm">{errors.supplierId}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purchasePersonId" className="text-gray-700 dark:text-gray-300">
                      Purchase Person *
                    </Label>
                    <Select value={formData.purchasePersonId} onValueChange={(value) => handleSelectChange('purchasePersonId', value)}>
                      <SelectTrigger className={errors.purchasePersonId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a purchase person" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.purchasePersonId && <div className="text-red-500 text-sm">{errors.purchasePersonId}</div>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Order Items *
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <Select value={currentItem.productId} onValueChange={handleItemSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.cost})
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
                        placeholder="Qty"
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="number"
                        value={currentItem.unitPrice}
                        onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        placeholder="Price"
                      />
                    </div>
                    
                    <Button type="button" onClick={addOrderItem} variant="outline">
                      Add Item
                    </Button>
                  </div>
                  
                  {errors.orderItems && <div className="text-red-500 text-sm">{errors.orderItems}</div>}
                  
                  {orderItems.length > 0 && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-700 dark:text-gray-300">Product</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Quantity</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Unit Price</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Total</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Received</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-gray-800 dark:text-gray-200">{item.productName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell>${item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <span className="text-gray-500">{item.receivedQty} received</span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeOrderItem(item.id)}
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
                  {editingOrder ? 'Update Purchase Order' : 'Create Purchase Order'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}