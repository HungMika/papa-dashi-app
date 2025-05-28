// src/app/api/category/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/data/data-types';

const filePath = path.resolve(process.cwd(), 'src/data/categories.json');

// [GET] categories
export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];
  return NextResponse.json(data);
}

// [POST] add a new category
export async function POST(request: Request) {
  const newCategory: Category = await request.json();
  const categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];

  categories.push(newCategory);
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));

  return NextResponse.json({ message: 'Category added' });
}
