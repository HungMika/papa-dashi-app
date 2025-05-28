// GET all products, POST new product
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/products.json');

export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const newProduct: Product = await request.json();
  const products = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json({ message: 'Product added' });
}
