import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/products.json');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nameQuery = searchParams.get('name')?.toLowerCase();

  const products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];

  let filteredProducts = products;

  if (nameQuery) {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(nameQuery)
    );
  }

  return NextResponse.json(filteredProducts);
}

export async function POST(request: Request) {
  const newProduct: Product = await request.json();
  const products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json({ message: 'Product added' });
}
