import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/sales/inventory/availability
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const companyId = searchParams.get('companyId');

    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the product with its current stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true,
        unit: true,
      },
    });

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate if stock is sufficient
    const isSufficient = product.stock > 0;
    const isLowStock = product.stock <= product.minStock;

    return new Response(
      JSON.stringify({ 
        data: {
          ...product,
          isSufficient,
          isLowStock,
          status: isLowStock ? 'low' : isSufficient ? 'available' : 'out_of_stock'
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking inventory availability:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check inventory availability' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/sales/inventory/availability/batch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, companyId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Items array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check availability for each item
    const results = [];
    for (const item of items) {
      const { productId, quantity } = item;
      
      if (!productId || quantity === undefined) {
        results.push({
          productId,
          error: 'Missing productId or quantity',
          isSufficient: false,
          availableStock: 0,
        });
        continue;
      }

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

    // Determine if all items are available
    const allAvailable = results.every(result => result.isSufficient);

    return new Response(
      JSON.stringify({ 
        allAvailable,
        results,
        summary: {
          totalItems: results.length,
          availableItems: results.filter(r => r.isSufficient).length,
          unavailableItems: results.filter(r => !r.isSufficient).length,
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking batch inventory availability:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check batch inventory availability' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}