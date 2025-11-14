'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
}

interface OrderItem {
  id?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SalesOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalesOrderForm({ onSuccess, onCancel }: SalesOrderFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState('');
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersRes = await fetch('/api/accounts/customers');
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData.data || []);
        } else {
          // Fallback for development
          setCustomers([
            { id: '1', name: 'John Doe', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          ]);
        }
        
        // Fetch products
        const productsRes = await fetch('/api/inventory/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.data || []);
        } else {
          // Fallback for development
          setProducts([
            { id: '1', name: 'Product A', sku: 'PROD-A', stock: 100 },
            { id: '2', name: 'Product B', sku: 'PROD-B', stock: 50 },
          ]);
        }
        
        // Fetch employees (for salespersons)
        const employeesRes = await fetch('/api/accounts/employees');
        if (employeesRes.ok) {
          const employeesData = await employeesRes.json();
          setSalesPersons(employeesData.data || []);
        } else {
          // Fallback for development
          setSalesPersons([
            { id: '1', firstName: 'John', lastName: 'Doe' },
            { id: '2', firstName: 'Jane', lastName: 'Smith' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = async (index: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedItems = [...orderItems];
    const item = updatedItems[index];
    
    // Get product details to check stock
    const product = products.find(p => p.id === item.productId);
    if (product && quantity > product.stock) {
      setErrors(prev => ({
        ...prev,
        [`quantity-${index}`]: `Insufficient stock. Available: ${product.stock}`
      }));
      return;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`quantity-${index}`];
        return newErrors;
      });
    }

    // Update quantity and recalculate total
    item.quantity = quantity;
    item.total = item.unitPrice * quantity;
    
    setOrderItems(updatedItems);
  };

  const handleProductChange = async (index: number, productId: string) => {
    const updatedItems = [...orderItems];
    const item = updatedItems[index];
    
    item.productId = productId;
    
    // Update unit price based on product
    const product = products.find(p => p.id === productId);
    if (product) {
      // In a real application, you'd fetch the actual price from the product API
      // For now, we'll assume a default price or use a fallback
      item.unitPrice = 100; // Default price - in real app, fetch actual price
      // To implement full functionality, you'd need a proper product API endpoint
      // const productRes = await fetch(`/api/inventory/products/${productId}`);
      // if (productRes.ok) {
      //   const productData = await productRes.json();
      //   item.unitPrice = Number(productData.data.price) || 0;
      // }
      item.total = item.quantity * item.unitPrice;
    }
    
    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { 
      productId: '', 
      quantity: 1, 
      unitPrice: 0, 
      total: 0 
    }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      const updatedItems = [...orderItems];
      updatedItems.splice(index, 1);
      setOrderItems(updatedItems);
    }
  };

  const calculateTotalAmount = () => {
    return orderItems.reduce((total, item) => total + item.total, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCustomerId) {
      newErrors.customer = 'Customer is required';
    }

    if (!selectedSalesPersonId) {
      newErrors.salesPerson = 'Sales person is required';
    }

    orderItems.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`product-${index}`] = 'Product is required';
      }
      if (item.quantity <= 0) {
        newErrors[`quantity-${index}`] = 'Quantity must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    
    try {
      // Check inventory availability
      const inventoryCheckRes = await fetch('/api/sales/inventory/availability/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          companyId: 'default-company-id' // In real app, get actual company ID
        })
      });

      if (!inventoryCheckRes.ok) {
        throw new Error('Inventory check failed');
      }

      const inventoryResult = await inventoryCheckRes.json();
      if (!inventoryResult.allAvailable) {
        toast.error('Insufficient inventory for one or more items');
        return;
      }

      // Submit the sales order
      const response = await fetch('/api/sales/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          salesPersonId: selectedSalesPersonId,
          orderItems: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          companyId: 'default-company-id', // In real app, get actual company ID
        })
      });

      if (response.ok) {
        toast.success('Sales order created successfully');
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create sales order');
      }
    } catch (error) {
      console.error('Error creating sales order:', error);
      toast.error('An error occurred while creating the sales order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales Order Form</CardTitle>
          <CardDescription>Loading form data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Order Form</CardTitle>
          <CardDescription>Create a new sales order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customer && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customer}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesPerson">Sales Person *</Label>
              <Select value={selectedSalesPersonId} onValueChange={setSelectedSalesPersonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sales person" />
                </SelectTrigger>
                <SelectContent>
                  {salesPersons.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.salesPerson && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.salesPerson}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Order Items</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addOrderItem}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5 space-y-1">
                    <Label>Product</Label>
                    <Select 
                      value={item.productId} 
                      onValueChange={(value) => handleProductChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`product-${index}`] && (
                      <div className="text-red-500 text-xs mt-1">{errors[`product-${index}`]}</div>
                    )}
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                    />
                    {errors[`quantity-${index}`] && (
                      <div className="text-red-500 text-xs mt-1">{errors[`quantity-${index}`]}</div>
                    )}
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const updatedItems = [...orderItems];
                        updatedItems[index].unitPrice = parseFloat(e.target.value) || 0;
                        updatedItems[index].total = updatedItems[index].unitPrice * updatedItems[index].quantity;
                        setOrderItems(updatedItems);
                      }}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <Label>Total</Label>
                    <Input
                      type="number"
                      readOnly
                      value={item.total.toFixed(2)}
                    />
                  </div>
                  
                  <div className="col-span-1 flex justify-center">
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOrderItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="text-lg font-bold">
              Total: ${calculateTotalAmount().toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Sales Order'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}