import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/users.json');

export async function POST(request: Request) {
  const {username, email, password} = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json({message: 'Name, email, and password are required.'}, {status: 400});
  }

  const users = JSON.parse(fs.readFileSync(filePath, 'utf8')) as User[];

  const existingUser = users.find(u => u.email === email || u.username === username);

  if (existingUser) {
    return NextResponse.json({message: 'User with this email or name already exists.'}, {status: 400});
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    password,
  }

  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return NextResponse.json({message: 'User registered successfully.'}, {status: 201});
}
