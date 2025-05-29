import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/products.json');

// GET method to retrieve a product by ID
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];

  const product = products.find(p => p.id === id);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT method to update a product by ID
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const updated: Product = await req.json();

  let products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  let found = false;

  products = products.map(p => {
    if (p.id === id) {
      found = true;
      return updated;
    }
    return p;
  });

  if (!found) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json({ message: 'Product updated' });
}

// DELETE method to remove a product by ID
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  let products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  const originalLength = products.length;

  products = products.filter(p => p.id !== id);

  if (products.length === originalLength) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json({ message: 'Product deleted' });
}
