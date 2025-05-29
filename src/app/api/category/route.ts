// src/app/api/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/categories.json');

// [GET] all or filter by name
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name')?.toLowerCase();

  const categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];

  const filtered = name
    ? categories.filter(c => c.name.toLowerCase().includes(name))
    : categories;

  return NextResponse.json(filtered);
}

// [POST] add new category
export async function POST(request: Request) {
  const newCategory: Category = await request.json();
  const categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];

  categories.push(newCategory);
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));

  return NextResponse.json({ message: 'Category added' });
}
