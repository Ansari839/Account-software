import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client';

// GET /api/sales/customer-ledger
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const transactionType = searchParams.get('transactionType');

    let whereClause: any = {};
    if (customerId) whereClause.customerId = customerId;
    if (companyId) whereClause.companyId = companyId;
    if (transactionType) whereClause.transactionType = transactionType;

    // Add date range filtering if provided
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    }

    const customerLedgerEntries = await prisma.customerLedger.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Calculate running balance
    let runningBalance = new Decimal(0);
    const ledgerWithBalances = customerLedgerEntries.map(entry => {
      runningBalance = runningBalance.add(entry.debit).sub(entry.credit);
      return {
        ...entry,
        runningBalance: runningBalance,
      };
    });

    // Get customer summary
    let customerSummary = null;
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      // Calculate total outstanding
      const totalDebit = customerLedgerEntries.reduce((sum, entry) => sum.add(entry.debit), new Decimal(0));
      const totalCredit = customerLedgerEntries.reduce((sum, entry) => sum.add(entry.credit), new Decimal(0));
      const outstandingBalance = totalDebit.sub(totalCredit);

      customerSummary = {
        customer,
        totalDebit,
        totalCredit,
        outstandingBalance,
        transactionCount: customerLedgerEntries.length,
      };
    }

    return new Response(
      JSON.stringify({ 
        data: ledgerWithBalances,
        summary: customerSummary,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching customer ledger:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch customer ledger' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/sales/customer-ledger
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerId, 
      transactionType, 
      referenceId, 
      description, 
      debit, 
      credit, 
      companyId 
    } = body;

    if (!customerId || !transactionType || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Customer ID, transaction type, and company ID are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate the new balance
    // Get the current balance for the customer
    const lastLedgerEntry = await prisma.customerLedger.findFirst({
      where: { customerId },
      orderBy: { date: 'desc' },
    });

    const previousBalance = lastLedgerEntry ? lastLedgerEntry.balance : new Decimal(0);
    const newBalance = previousBalance.add(new Decimal(debit || 0)).sub(new Decimal(credit || 0));

    // Create the customer ledger entry
    const ledgerEntry = await prisma.customerLedger.create({
      data: {
        customerId,
        transactionType,
        referenceId: referenceId || null,
        description: description || '',
        debit: new Decimal(debit || 0),
        credit: new Decimal(credit || 0),
        balance: newBalance,
        date: new Date(),
        companyId,
      },
    });

    return new Response(
      JSON.stringify({ data: ledgerEntry }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating customer ledger entry:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create customer ledger entry' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/sales/customer-ledger/{id}
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Ledger entry ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // For this implementation, we'll only allow updating notes/description
    // In a real system, you might have specific business rules for ledger updates
    const { description } = body;

    const updatedEntry = await prisma.customerLedger.update({
      where: { id },
      data: {
        description: description || undefined,
        updatedAt: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ data: updatedEntry }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating customer ledger entry:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update customer ledger entry' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}