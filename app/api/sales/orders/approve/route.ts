import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client';

// PUT /api/sales/orders/{id}/approve
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const body = await request.json();
    const { approvedById, status, notes } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the sales order exists
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id: orderId },
    });

    if (!salesOrder) {
      return new Response(
        JSON.stringify({ error: 'Sales order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the sales order status and approval info
    const updatedOrder = await prisma.salesOrder.update({
      where: { id: orderId },
      data: {
        status: status || 'confirmed', // Default to confirmed if no status provided
        approvedById: approvedById || null, // Store the ID of the person who approved
        notes: notes || salesOrder.notes,
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

    // If the order is approved/confirmed, we may want to do additional actions
    if (status === 'confirmed') {
      // Create customer ledger entry if not already created
      const existingLedger = await prisma.customerLedger.findFirst({
        where: {
          referenceId: orderId,
          transactionType: 'sales_order',
        },
      });

      if (!existingLedger) {
        await prisma.customerLedger.create({
          data: {
            customerId: updatedOrder.customerId,
            transactionType: 'sales_order',
            referenceId: orderId,
            description: `Sales order ${updatedOrder.orderNumber} approved`,
            debit: updatedOrder.totalAmount,
            credit: new Decimal(0),
            balance: updatedOrder.totalAmount,
            date: new Date(),
            companyId: updatedOrder.companyId,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({ data: updatedOrder }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error approving sales order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to approve sales order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to check if sales order requires approval
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the sales order to check if it requires approval
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id: orderId },
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

    if (!salesOrder) {
      return new Response(
        JSON.stringify({ error: 'Sales order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // For this implementation, we'll consider any order over $1000 needs approval
    // This could be configured via system settings in a real implementation
    const requiresApproval = salesOrder.totalAmount.toNumber() > 1000;

    // Check system settings to see if approval is required for all orders
    const approvalRequiredSetting = await prisma.systemSetting.findFirst({
      where: {
        key: 'SALES_ORDER_APPROVAL_REQUIRED',
        companyId: salesOrder.companyId,
      },
    });

    const finalRequiresApproval = approvalRequiredSetting?.value === 'true' || requiresApproval;

    return new Response(
      JSON.stringify({ 
        requiresApproval: finalRequiresApproval,
        salesOrder,
        approvalThreshold: 1000, // Default threshold
        currentAmount: salesOrder.totalAmount.toNumber(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking approval requirement:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check approval requirement' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}