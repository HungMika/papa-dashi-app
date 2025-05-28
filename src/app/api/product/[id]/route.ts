import { NextRequest, NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/data/data-types';

//[PUT] with api/product/[id]
const filePath = path.resolve(process.cwd(), 'src/data/products.json');

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const updated: Product = await req.json();

  let products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  products = products.map(p => p.id === id ? updated : p);

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json({ message: 'Product updated' });
}

//[DELETE] with api/product/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  let products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  products = products.filter(p => p.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json({ message: 'Product deleted' });
}
