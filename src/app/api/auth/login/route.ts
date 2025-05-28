import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/users.json');

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Name and password are required' }, { status: 400 });
  }

  const users = JSON.parse(fs.readFileSync(filePath, 'utf8')) as User[];

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return NextResponse.json({ message: 'Invalid name or password' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}
