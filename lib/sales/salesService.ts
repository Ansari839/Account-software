import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client';

// Interface definitions
interface CreateSalesOrderInput {
  customerId: string;
  salesPersonId: string;
  orderItems: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  companyId: string;
  notes?: string;
  expectedDeliveryDate?: Date;
}

interface UpdateSalesOrderInput {
  id: string;
  status?: string;
  approvedById?: string;
  notes?: string;
}

// Service functions
export async function createSalesOrder(input: CreateSalesOrderInput) {
  const { 
    customerId, 
    salesPersonId, 
    orderItems, 
    companyId, 
    notes, 
    expectedDeliveryDate 
  } = input;

  // Validate order items
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error('Order must have at least one item');
  }

  // Check stock availability for each item
  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }
  }

  // Calculate total amount
  let totalAmount = 0;
  for (const item of orderItems) {
    totalAmount += Number(item.unitPrice) * item.quantity;
  }

  // Generate unique order number
  const orderNumber = generateOrderNumber();
  
  // Create the sales order
  const salesOrder = await prisma.salesOrder.create({
    data: {
      orderNumber,
      customerId,
      salesPersonId,
      companyId,
      totalAmount: new Decimal(totalAmount),
      status: 'pending',
      notes: notes || null,
      expectedDeliveryDate: expectedDeliveryDate || null,
      orderItems: {
        create: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: new Decimal(item.unitPrice),
          total: new Decimal(Number(item.unitPrice) * item.quantity),
        })),
      },
    },
    include: {
      customer: true,
      salesPerson: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // Update product stock and create ledger entries
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });

    // Create stock movement record
    await prisma.stockMovement.create({
      data: {
        productId: item.productId,
        quantity: item.quantity,
        movementType: 'OUT',
        referenceType: 'sales_order',
        referenceId: salesOrder.id,
        description: `Sales order ${salesOrder.orderNumber}`,
        companyId,
      },
    });

    // Create stock ledger record
    await prisma.stockLedger.create({
      data: {
        productId: item.productId,
        transactionType: 'sales_order',
        referenceId: salesOrder.id,
        description: `Sales order ${salesOrder.orderNumber}`,
        qtyOut: item.quantity,
        balance: {
          decrement: item.quantity,
        },
        companyId,
      },
    });
  }

  // Create customer ledger entry
  await prisma.customerLedger.create({
    data: {
      customerId,
      transactionType: 'sales_order',
      referenceId: salesOrder.id,
      description: `Sales order ${salesOrder.orderNumber}`,
      debit: new Decimal(totalAmount),
      credit: new Decimal(0),
      balance: new Decimal(totalAmount),
      date: new Date(),
      companyId,
    },
  });

  return salesOrder;
}

export async function getSalesOrders(companyId: string, status?: string) {
  let whereClause: any = { companyId };
  if (status) whereClause.status = status;

  return prisma.salesOrder.findMany({
    where: whereClause,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      salesPerson: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateSalesOrder(input: UpdateSalesOrderInput) {
  const { id, status, approvedById, notes } = input;

  const updatedOrder = await prisma.salesOrder.update({
    where: { id },
    data: {
      status,
      approvedById: approvedById || undefined,
      notes: notes || undefined,
      updatedAt: new Date(),
    },
    include: {
      customer: true,
      salesPerson: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // Handle status changes that require additional actions
  if (status === 'confirmed') {
    const existingLedger = await prisma.customerLedger.findFirst({
      where: {
        referenceId: id,
        transactionType: 'sales_order',
      },
    });

    if (!existingLedger) {
      await prisma.customerLedger.create({
        data: {
          customerId: updatedOrder.customerId,
          transactionType: 'sales_order',
          referenceId: id,
          description: `Sales order ${updatedOrder.orderNumber} confirmed`,
          debit: updatedOrder.totalAmount,
          credit: new Decimal(0),
          balance: updatedOrder.totalAmount,
          date: new Date(),
          companyId: updatedOrder.companyId,
        },
      });
    }
  } else if (status === 'cancelled') {
    // When order is cancelled, restore stock
    for (const item of updatedOrder.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      // Create stock movement record for cancellation
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          movementType: 'IN',
          referenceType: 'sales_order_cancel',
          referenceId: id,
          description: `Sales order ${updatedOrder.orderNumber} cancelled`,
          companyId: updatedOrder.companyId,
        },
      });

      // Create stock ledger record for cancellation
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          transactionType: 'sales_order_cancel',
          referenceId: id,
          description: `Sales order ${updatedOrder.orderNumber} cancelled`,
          qtyIn: item.quantity,
          balance: {
            increment: item.quantity,
          },
          companyId: updatedOrder.companyId,
        },
      });
    }

    // Create customer ledger entry for cancellation
    await prisma.customerLedger.create({
      data: {
        customerId: updatedOrder.customerId,
        transactionType: 'sales_order_cancel',
        referenceId: id,
        description: `Sales order ${updatedOrder.orderNumber} cancelled`,
        debit: new Decimal(0),
        credit: updatedOrder.totalAmount,
        balance: new Decimal(0).minus(updatedOrder.totalAmount),
        date: new Date(),
        companyId: updatedOrder.companyId,
      },
    });
  }

  return updatedOrder;
}

export async function deleteSalesOrder(id: string) {
  // Get the sales order to access its items before deletion
  const salesOrder = await prisma.salesOrder.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });

  if (!salesOrder) {
    throw new Error('Sales order not found');
  }

  // If order is not cancelled, we need to restore stock
  if (salesOrder.status !== 'cancelled') {
    for (const item of salesOrder.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      // Create stock movement record for deletion
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          movementType: 'IN',
          referenceType: 'sales_order_delete',
          referenceId: id,
          description: `Sales order ${salesOrder.orderNumber} deleted`,
          companyId: salesOrder.companyId,
        },
      });

      // Create stock ledger record for deletion
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          transactionType: 'sales_order_delete',
          referenceId: id,
          description: `Sales order ${salesOrder.orderNumber} deleted`,
          qtyIn: item.quantity,
          balance: {
            increment: item.quantity,
          },
          companyId: salesOrder.companyId,
        },
      });
    }

    // Create customer ledger entry for deletion
    await prisma.customerLedger.create({
      data: {
        customerId: salesOrder.customerId,
        transactionType: 'sales_order_delete',
        referenceId: id,
        description: `Sales order ${salesOrder.orderNumber} deleted`,
        debit: new Decimal(0),
        credit: salesOrder.totalAmount,
        balance: new Decimal(0).minus(salesOrder.totalAmount),
        date: new Date(),
        companyId: salesOrder.companyId,
      },
    });
  }

  // Delete the sales order (this will cascade delete orderItems due to Prisma relation)
  return prisma.salesOrder.delete({
    where: { id },
  });
}

export async function checkInventoryAvailability(items: Array<{ productId: string; quantity: number }>) {
  const results = [];
  
  for (const item of items) {
    const { productId, quantity } = item;
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
      },
    });

    if (!product) {
      results.push({
        productId,
        error: 'Product not found',
        isSufficient: false,
        availableStock: 0,
      });
      continue;
    }

    const isSufficient = product.stock >= quantity;
    const availableStock = product.stock;

    results.push({
      productId: product.id,
      productName: product.name,
      required: quantity,
      available: availableStock,
      isSufficient,
      status: availableStock === 0 ? 'out_of_stock' : 
              availableStock <= product.minStock ? 'low' : 'available',
    });
  }

  const allAvailable = results.every(result => result.isSufficient);

  return {
    allAvailable,
    results,
    summary: {
      totalItems: results.length,
      availableItems: results.filter(r => r.isSufficient).length,
      unavailableItems: results.filter(r => !r.isSufficient).length,
    }
  };
}

// Helper function to generate a unique order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SO-${year}${month}${day}-${randomNum}`;
}