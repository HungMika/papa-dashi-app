import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/users.json');

// [PUT] with api/user/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const updatedUser: User = await req.json();
  
  let users = JSON.parse(fs.readFileSync(filePath, 'utf8')) as User[];
  users = users.map(u => u.id === id ? updatedUser : u);
  
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return NextResponse.json({ message: 'User updated' });
}

// [DELETE] with api/user/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  let users = JSON.parse(fs.readFileSync(filePath, 'utf8')) as User[];
  users = users.filter(u => u.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return NextResponse.json({ message: 'User deleted' });
}
