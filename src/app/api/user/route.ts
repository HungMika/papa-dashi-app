import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/data/data-types';

const filePath = path.resolve(process.cwd(), 'src/data/users.json');

export async function GET() {
  const users = JSON.parse(fs.readFileSync(filePath, 'utf8')) as User[];
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const newUser: User = await request.json();
  const users = JSON.parse(fs.readFileSync(filePath, 'utf8')) as User[];
  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return NextResponse.json({ message: 'User added' });
}
