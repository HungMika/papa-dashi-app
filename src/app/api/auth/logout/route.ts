import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const sessionFilePath = path.resolve(process.cwd(), 'src/data/login-session.json');

export async function POST() {
  try {
    // Ghi đè file thành object rỗng
    fs.writeFileSync(sessionFilePath, JSON.stringify({}));

    return NextResponse.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Error clearing session:', err);
    return NextResponse.json({ message: 'Failed to clear session' }, { status: 500 });
  }
}
