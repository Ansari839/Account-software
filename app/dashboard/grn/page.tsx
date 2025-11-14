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

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: Supplier;
}

interface Product {
  id: string;
  name: string;
  cost: number | null;
}

interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  receivedQty: number;
}

interface GoodsReceiptItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  purchaseOrderItemId: string;
}

interface GoodsReceipt {
  id: string;
  grnNumber: string;
  date: Date;
  status: string;
  purchaseOrderId: string;
  purchaseOrder: PurchaseOrder;
  supplierId: string;
  supplier: Supplier;
  receivedById: string;
  receiver: Employee;
  items: GoodsReceiptItem[];
  totalAmount: number;
  createdAt: Date;
}

export default function GRNPage() {
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGRN, setEditingGRN] = useState<GoodsReceipt | null>(null);
  const [grnItems, setGrnItems] = useState<GoodsReceiptItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    purchaseOrderItemId: '',
    quantity: 1,
  });
  const [formData, setFormData] = useState({
    grnNumber: '',
    date: '',
    purchaseOrderId: '',
    supplierId: '',
    receivedById: '',
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
        
        const mockPurchaseOrders: PurchaseOrder[] = [
          { 
            id: '1', 
            orderNumber: 'PO-001', 
            supplier: { id: '1', name: 'ABC Suppliers', email: 'contact@abcsuppliers.com' } 
          },
          { 
            id: '2', 
            orderNumber: 'PO-002', 
            supplier: { id: '2', name: 'XYZ Distributors', email: 'info@xyzdist.com' } 
          },
        ];
        
        const mockProducts: Product[] = [
          { id: '1', name: 'Laptop', cost: 1000 },
          { id: '2', name: 'Mouse', cost: 20 },
          { id: '3', name: 'Keyboard', cost: 50 },
        ];
        
        const mockPurchaseOrderItems: PurchaseOrderItem[] = [
          { id: '1', productId: '1', productName: 'Laptop', quantity: 5, unitPrice: 1000, receivedQty: 0 },
          { id: '2', productId: '2', productName: 'Mouse', quantity: 10, unitPrice: 20, receivedQty: 0 },
          { id: '3', productId: '3', productName: 'Keyboard', quantity: 20, unitPrice: 50, receivedQty: 5 },
        ];
        
        const mockGRNs: GoodsReceipt[] = [
          {
            id: '1',
            grnNumber: 'GRN-001',
            date: new Date('2024-01-15'),
            status: 'approved',
            purchaseOrderId: '1',
            purchaseOrder: { 
              id: '1', 
              orderNumber: 'PO-001', 
              supplier: { id: '1', name: 'ABC Suppliers', email: 'contact@abcsuppliers.com' } 
            },
            supplierId: '1',
            supplier: { id: '1', name: 'ABC Suppliers', email: 'contact@abcsuppliers.com' },
            receivedById: '1',
            receiver: { id: '1', firstName: 'Alice', lastName: 'Brown' },
            items: [
              { id: '1', productId: '1', productName: 'Laptop', quantity: 5, unitPrice: 1000, total: 5000, purchaseOrderItemId: '1' },
              { id: '2', productId: '2', productName: 'Mouse', quantity: 8, unitPrice: 20, total: 160, purchaseOrderItemId: '2' },
            ],
            totalAmount: 5160,
            createdAt: new Date(),
          },
          {
            id: '2',
            grnNumber: 'GRN-002',
            date: new Date('2024-01-18'),
            status: 'pending',
            purchaseOrderId: '2',
            purchaseOrder: { 
              id: '2', 
              orderNumber: 'PO-002', 
              supplier: { id: '2', name: 'XYZ Distributors', email: 'info@xyzdist.com' } 
            },
            supplierId: '2',
            supplier: { id: '2', name: 'XYZ Distributors', email: 'info@xyzdist.com' },
            receivedById: '2',
            receiver: { id: '2', firstName: 'Charlie', lastName: 'Davis' },
            items: [
              { id: '3', productId: '3', productName: 'Keyboard', quantity: 10, unitPrice: 50, total: 500, purchaseOrderItemId: '3' },
            ],
            totalAmount: 500,
            createdAt: new Date(),
          },
        ];
        
        setSuppliers(mockSuppliers);
        setEmployees(mockEmployees);
        setPurchaseOrders(mockPurchaseOrders);
        setProducts(mockProducts);
        setPurchaseOrderItems(mockPurchaseOrderItems);
        setGoodsReceipts(mockGRNs);
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
    const orderItem = purchaseOrderItems.find(item => item.id === value);
    setCurrentItem({
      ...currentItem,
      purchaseOrderItemId: value,
      // Default quantity to the remaining quantity to receive
      quantity: orderItem ? orderItem.quantity - orderItem.receivedQty : 1,
    });
  };

  // Get available items for the selected purchase order
  const getAvailableItems = () => {
    if (!formData.purchaseOrderId) return purchaseOrderItems;
    
    // In a real app, we would filter based on the purchase order ID
    return purchaseOrderItems;
  };

  const addGRNItem = () => {
    if (!currentItem.purchaseOrderItemId || currentItem.quantity <= 0) {
      alert('Please select a purchase order item and enter a valid quantity');
      return;
    }

    const orderItem = purchaseOrderItems.find(item => item.id === currentItem.purchaseOrderItemId);
    if (!orderItem) return;

    const newItem: GoodsReceiptItem = {
      id: Date.now().toString(), // In real app, this would be generated by the backend
      productId: orderItem.productId,
      productName: orderItem.productName,
      quantity: currentItem.quantity,
      unitPrice: orderItem.unitPrice,
      total: orderItem.unitPrice * currentItem.quantity,
      purchaseOrderItemId: orderItem.id,
    };

    setGrnItems([...grnItems, newItem]);
    setCurrentItem({ purchaseOrderItemId: '', quantity: 1 });
  };

  const removeGRNItem = (id: string) => {
    setGrnItems(grnItems.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.grnNumber.trim()) {
      newErrors.grnNumber = 'GRN number is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'GRN date is required';
    }
    
    if (!formData.purchaseOrderId) {
      newErrors.purchaseOrderId = 'Purchase order is required';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (!formData.receivedById) {
      newErrors.receivedById = 'Received by is required';
    }
    
    if (grnItems.length === 0) {
      newErrors.grnItems = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return grnItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = calculateTotal();
      
      // Prepare GRN data
      const grnData = {
        ...formData,
        totalAmount,
        items: grnItems,
      };

      if (editingGRN) {
        // Update existing GRN
        // const updatedGRN = await updateGoodsReceipt(editingGRN.id, grnData);
        // setGoodsReceipts(goodsReceipts.map(g => g.id === editingGRN.id ? updatedGRN : g));
      } else {
        // Create new GRN
        // const newGRN = await createGoodsReceipt(grnData);
        // setGoodsReceipts([...goodsReceipts, newGRN]);
      }
      
      // Reset form and close dialog
      setFormData({
        grnNumber: editingGRN ? editingGRN.grnNumber : '',
        date: editingGRN ? new Date(editingGRN.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        purchaseOrderId: editingGRN ? editingGRN.purchaseOrderId : '',
        supplierId: editingGRN ? editingGRN.supplierId : '',
        receivedById: editingGRN ? editingGRN.receivedById : '',
        status: 'pending',
      });
      setGrnItems([]);
      setErrors({});
      setIsDialogOpen(false);
      setEditingGRN(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving goods receipt:', error);
    }
  };

  const handleEdit = (grn: GoodsReceipt) => {
    setEditingGRN(grn);
    setFormData({
      grnNumber: grn.grnNumber,
      date: new Date(grn.date).toISOString().split('T')[0],
      purchaseOrderId: grn.purchaseOrderId,
      supplierId: grn.supplierId,
      receivedById: grn.receivedById,
      status: grn.status,
    });
    setGrnItems(grn.items);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goods receipt?')) {
      try {
        // await deleteGoodsReceipt(id);
        // setGoodsReceipts(goodsReceipts.filter(grn => grn.id !== id));
        // For mock implementation, just remove from state
        setGoodsReceipts(goodsReceipts.filter(grn => grn.id !== id));
      } catch (error) {
        console.error('Error deleting goods receipt:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingGRN(null);
    setFormData({
      grnNumber: `GRN-${(goodsReceipts.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      purchaseOrderId: '',
      supplierId: '',
      receivedById: '',
      status: 'pending',
    });
    setGrnItems([]);
    setErrors({});
    setIsDialogOpen(true);
  };

  // Get items available for receipt based on selected purchase order
  const availableItems = getAvailableItems().filter(item => 
    item.quantity > item.receivedQty && 
    !grnItems.some(grnItem => grnItem.purchaseOrderItemId === item.id)
  );

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Goods Receipt Notes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your goods receipts
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add GRN
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">GRN #</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Purchase Order</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Supplier</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Received By</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goodsReceipts.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{grn.grnNumber}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(grn.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{grn.purchaseOrder.orderNumber}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{grn.supplier.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{grn.receiver.firstName} {grn.receiver.lastName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          grn.status === 'approved' ? 'default' : 
                          grn.status === 'confirmed' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {grn.status.replace('_', ' ').charAt(0).toUpperCase() + grn.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">${grn.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(grn)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(grn.id)}
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
                {editingGRN ? 'Edit Goods Receipt Note' : 'Add New Goods Receipt Note'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grnNumber" className="text-gray-700 dark:text-gray-300">
                      GRN Number *
                    </Label>
                    <Input
                      id="grnNumber"
                      name="grnNumber"
                      value={formData.grnNumber}
                      onChange={handleInputChange}
                      className={errors.grnNumber ? 'border-red-500' : ''}
                      readOnly={!!editingGRN}
                    />
                    {errors.grnNumber && <div className="text-red-500 text-sm">{errors.grnNumber}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                      GRN Date *
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
                    <Label htmlFor="purchaseOrderId" className="text-gray-700 dark:text-gray-300">
                      Purchase Order *
                    </Label>
                    <Select 
                      value={formData.purchaseOrderId} 
                      onValueChange={(value) => {
                        handleSelectChange('purchaseOrderId', value);
                        // Update supplier when purchase order changes
                        const po = purchaseOrders.find(p => p.id === value);
                        if (po) {
                          handleSelectChange('supplierId', po.supplier.id);
                        }
                      }}
                    >
                      <SelectTrigger className={errors.purchaseOrderId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a purchase order" />
                      </SelectTrigger>
                      <SelectContent>
                        {purchaseOrders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.orderNumber} - {order.supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.purchaseOrderId && <div className="text-red-500 text-sm">{errors.purchaseOrderId}</div>}
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
                    <Label htmlFor="receivedById" className="text-gray-700 dark:text-gray-300">
                      Received By *
                    </Label>
                    <Select value={formData.receivedById} onValueChange={(value) => handleSelectChange('receivedById', value)}>
                      <SelectTrigger className={errors.receivedById ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select receiver" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.receivedById && <div className="text-red-500 text-sm">{errors.receivedById}</div>}
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
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Receipt Items *
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <Select value={currentItem.purchaseOrderItemId} onValueChange={handleItemSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purchase item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.productName} - Qty: {item.quantity - item.receivedQty} left
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
                    
                    <Button type="button" onClick={addGRNItem} variant="outline">
                      Add Item
                    </Button>
                  </div>
                  
                  {errors.grnItems && <div className="text-red-500 text-sm">{errors.grnItems}</div>}
                  
                  {grnItems.length > 0 && (
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
                          {grnItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-gray-800 dark:text-gray-200">{item.productName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell>${item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeGRNItem(item.id)}
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
                  {editingGRN ? 'Update GRN' : 'Create GRN'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}