// src/app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/categories.json');

// [GET] category by id
export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const id = await context.params.id;

  const categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];
  const category = categories.find(c => c.id === id);

  if (!category) {
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json(category);
}

// [PUT] update category
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = await context.params.id;
  const updated: Category = await req.json();

  let categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];
  categories = categories.map(c => c.id === id ? updated : c);

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
  return NextResponse.json({ message: 'Category updated' });
}

// [DELETE] remove category
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const id = await context.params.id;

  let categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];
  categories = categories.filter(c => c.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
  return NextResponse.json({ message: 'Category deleted' });
}
