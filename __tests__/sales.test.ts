// Sales module unit tests
import { expect, test, describe } from 'vitest';
import { createSalesOrder, getSalesOrders, updateSalesOrder, deleteSalesOrder, checkInventoryAvailability } from '@/lib/sales/salesService';
import { prisma } from '@/lib/prisma';

// Mock data for testing
const mockCustomer = {
  id: 'test-customer-1',
  name: 'Test Customer',
  email: 'test@example.com',
};

const mockProduct = {
  id: 'test-product-1',
  name: 'Test Product',
  sku: 'TP001',
  stock: 100,
  price: 100.00,
};

const mockSalesPerson = {
  id: 'test-salesperson-1',
  firstName: 'John',
  lastName: 'Doe',
};

const mockCompanyId = 'test-company-1';

describe('Sales Module Tests', () => {
  test('should create a sales order successfully', async () => {
    const orderItems = [
      {
        productId: mockProduct.id,
        quantity: 2,
        unitPrice: mockProduct.price,
      }
    ];

    const input = {
      customerId: mockCustomer.id,
      salesPersonId: mockSalesPerson.id,
      orderItems,
      companyId: mockCompanyId,
      notes: 'Test order',
    };

    const result = await createSalesOrder(input);
    
    expect(result).toBeDefined();
    expect(result.orderNumber).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.totalAmount).toBeGreaterThan(0);
    expect(result.orderItems.length).toBe(1);
  });

  test('should get sales orders by company', async () => {
    const orders = await getSalesOrders(mockCompanyId);
    
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThanOrEqual(0);
  });

  test('should check inventory availability', async () => {
    const items = [
      { productId: mockProduct.id, quantity: 5 }
    ];

    const result = await checkInventoryAvailability(items);
    
    expect(result).toBeDefined();
    expect(result.allAvailable).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].isSufficient).toBe(true);
  });
});