import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client';

// Helper function to generate a unique challan number
function generateChallanNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DC-${year}${month}${day}-${randomNum}`;
}

// GET /api/sales/delivery-challan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salesOrderId = searchParams.get('salesOrderId');
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (salesOrderId) whereClause.salesOrderId = salesOrderId;
    if (companyId) whereClause.companyId = companyId;
    if (status) whereClause.status = status;

    const deliveryChallans = await prisma.deliveryChallan.findMany({
      where: whereClause,
      include: {
        salesOrder: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
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
                    unit: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(
      JSON.stringify({ data: deliveryChallans }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching delivery challans:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch delivery challans' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/sales/delivery-challan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salesOrderId, itemsToDispatch, companyId, vehicleNumber, driverName, notes } = body;

    if (!salesOrderId || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Sales order ID and company ID are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the sales order to validate
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id: salesOrderId },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!salesOrder) {
      return new Response(
        JSON.stringify({ error: 'Sales order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify that the sales order is confirmed before creating delivery challan
    if (salesOrder.status !== 'confirmed') {
      return new Response(
        JSON.stringify({ error: 'Sales order must be confirmed before creating delivery challan' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate items to dispatch match sales order items
    if (itemsToDispatch && Array.isArray(itemsToDispatch)) {
      for (const dispatchItem of itemsToDispatch) {
        const matchingOrderItem = salesOrder.orderItems.find(item => item.productId === dispatchItem.productId);
        if (!matchingOrderItem) {
          return new Response(
            JSON.stringify({ error: `Product ${dispatchItem.productId} is not part of sales order ${salesOrderId}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        if (dispatchItem.quantity > matchingOrderItem.quantity) {
          return new Response(
            JSON.stringify({ error: `Dispatch quantity exceeds sales order quantity for product ${dispatchItem.productId}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    } else {
      // Dispatch all items in the sales order
      itemsToDispatch = salesOrder.orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
    }

    // Create the delivery challan
    const challanNumber = generateChallanNumber();
    
    const deliveryChallan = await prisma.deliveryChallan.create({
      data: {
        challanNumber,
        salesOrderId,
        companyId,
        notes: notes || null,
      },
      include: {
        salesOrder: {
          include: {
            customer: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    // Create dispatch entry and gatepass
    const dispatchEntry = await prisma.dispatchEntry.create({
      data: {
        orderNumber: salesOrder.orderNumber,
        companyId,
        status: 'pending',
      },
    });

    // Create gatepass if vehicle and driver info provided
    if (vehicleNumber && driverName) {
      await prisma.gatepass.create({
        data: {
          dispatchId: dispatchEntry.id,
          vehicleNumber,
          driverName,
          companyId,
          status: 'active',
        },
      });
    }

    // Update sales order status to 'shipped'
    await prisma.salesOrder.update({
      where: { id: salesOrderId },
      data: {
        status: 'shipped',
        updatedAt: new Date(),
      },
    });

    // Update delivery status
    await prisma.deliveryStatus.create({
      data: {
        dispatchId: dispatchEntry.id,
        status: 'pending',
        companyId,
      },
    });

    // Update stock ledger to reflect dispatched items
    for (const item of itemsToDispatch) {
      // Create stock movement record for dispatch
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          movementType: 'OUT',
          referenceType: 'delivery_challan',
          referenceId: deliveryChallan.id,
          description: `Delivery challan ${deliveryChallan.challanNumber}`,
          companyId,
        },
      });

      // Update stock ledger
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          transactionType: 'delivery_challan',
          referenceId: deliveryChallan.id,
          description: `Delivery challan ${deliveryChallan.challanNumber}`,
          qtyOut: item.quantity,
          balance: {
            decrement: item.quantity,
          },
          companyId,
        },
      });
    }

    // Update customer ledger with delivery information
    await prisma.customerLedger.create({
      data: {
        customerId: salesOrder.customerId,
        transactionType: 'delivery_challan',
        referenceId: deliveryChallan.id,
        description: `Delivery challan ${deliveryChallan.challanNumber} for sales order ${salesOrder.orderNumber}`,
        debit: new Decimal(0),
        credit: new Decimal(0),
        balance: salesOrder.totalAmount,
        date: new Date(),
        companyId,
      },
    });

    return new Response(
      JSON.stringify({ 
        data: { 
          deliveryChallan, 
          dispatchEntry,
          message: 'Delivery challan created successfully and sales order status updated to shipped' 
        } 
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating delivery challan:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create delivery challan' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/sales/delivery-challan/{id}
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { status, deliveredById } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Delivery challan ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the delivery challan to update
    const deliveryChallan = await prisma.deliveryChallan.findUnique({
      where: { id },
      include: {
        salesOrder: true,
      },
    });

    if (!deliveryChallan) {
      return new Response(
        JSON.stringify({ error: 'Delivery challan not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the delivery challan status
    const updatedChallan = await prisma.deliveryChallan.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Update the related sales order status based on delivery status
    if (status === 'delivered') {
      await prisma.salesOrder.update({
        where: { id: deliveryChallan.salesOrderId },
        data: {
          status: 'delivered',
          updatedAt: new Date(),
        },
      });

      // Update customer ledger to mark as delivered
      await prisma.customerLedger.create({
        data: {
          customerId: deliveryChallan.salesOrder.customerId,
          transactionType: 'delivery_completed',
          referenceId: deliveryChallan.id,
          description: `Delivery completed for sales order ${deliveryChallan.salesOrder.orderNumber}`,
          debit: new Decimal(0),
          credit: new Decimal(0),
          balance: deliveryChallan.salesOrder.totalAmount,
          date: new Date(),
          companyId: deliveryChallan.companyId,
        },
      });
    }

    // Update dispatch status
    const dispatchEntry = await prisma.dispatchEntry.findFirst({
      where: {
        orderNumber: deliveryChallan.salesOrder.orderNumber,
      },
    });

    if (dispatchEntry) {
      await prisma.deliveryStatus.create({
        data: {
          dispatchId: dispatchEntry.id,
          status,
          companyId: deliveryChallan.companyId,
        },
      });

      // Update dispatch entry status
      await prisma.dispatchEntry.update({
        where: { id: dispatchEntry.id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });
    }

    return new Response(
      JSON.stringify({ data: updatedChallan }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating delivery challan:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update delivery challan' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}