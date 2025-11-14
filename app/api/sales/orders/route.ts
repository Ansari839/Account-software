import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client';

// Helper function to generate a unique order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SO-${year}${month}${day}-${randomNum}`;
}

// GET /api/sales/orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (companyId) whereClause.companyId = companyId;
    if (status) whereClause.status = status;

    const salesOrders = await prisma.salesOrder.findMany({
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

    return new Response(
      JSON.stringify({ data: salesOrders }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch sales orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/sales/orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      salesPersonId,
      orderItems,
      companyId,
      notes,
      expectedDeliveryDate,
    } = body;

    // Validate required fields
    if (!customerId || !salesPersonId || !orderItems || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order must have at least one item' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check stock availability for each item
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product with ID ${item.productId} not found` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (product.stock < item.quantity) {
        return new Response(
          JSON.stringify({ 
            error: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of orderItems) {
      totalAmount += Number(item.unitPrice) * item.quantity;
    }

    // Create the sales order with a unique order number
    const orderNumber = generateOrderNumber();
    
    const salesOrder = await prisma.salesOrder.create({
      data: {
        orderNumber,
        customerId,
        salesPersonId,
        companyId,
        totalAmount: new Decimal(totalAmount),
        status: 'pending',
        notes: notes || null,
        expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
        orderItems: {
          create: orderItems.map((item: any) => ({
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
        orderItems: true,
      },
    });

    // Update product stock (decrease stock based on order items)
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

    // Create customer ledger entry for pending order
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

    return new Response(
      JSON.stringify({ data: salesOrder }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating sales order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create sales order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/sales/orders/:id
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Sales order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { status, approvedById, notes } = body;

    // Update the sales order status
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
      // When order is confirmed, create customer ledger entry if not already created
      const ledgerEntry = await prisma.customerLedger.findFirst({
        where: {
          referenceId: id,
          transactionType: 'sales_order',
        },
      });

      if (!ledgerEntry) {
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

    return new Response(
      JSON.stringify({ data: updatedOrder }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating sales order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update sales order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/sales/orders/:id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Sales order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the sales order to access its items before deletion
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!salesOrder) {
      return new Response(
        JSON.stringify({ error: 'Sales order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
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
    await prisma.salesOrder.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: 'Sales order deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting sales order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete sales order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}