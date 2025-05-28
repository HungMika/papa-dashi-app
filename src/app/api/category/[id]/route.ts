// src/app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/categories.json');

// [PUT] category with api/category/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  const updated: Category = await req.json();

  let categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];
  categories = categories.map(c => c.id === id ? updated : c);

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
  return NextResponse.json({ message: 'Category updated' });
}

// [DELETE] category with api/category/[id]
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;

  let categories = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Category[];
  categories = categories.filter(c => c.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
  return NextResponse.json({ message: 'Category deleted' });
}
