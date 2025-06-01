// src/app/api/session/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const sessionFilePath = path.join(process.cwd(), 'src', 'data', 'login-session.json');

export async function GET() {
  try {
    if (!fs.existsSync(sessionFilePath)) {
      return NextResponse.json(null);
    }

    const data = fs.readFileSync(sessionFilePath, 'utf-8');
    const session = JSON.parse(data);

    // Kiểm tra session có đủ thông tin tối thiểu
    if (
      session &&
      typeof session === 'object' &&
      session.id &&
      session.username &&
      session.email
    ) {
      return NextResponse.json(session);
    }

    // Nếu file tồn tại nhưng không có dữ liệu hợp lệ
    return NextResponse.json(null);
  } catch (err) {
    console.error('Failed to read session file:', err);
    return NextResponse.json(null, { status: 500 });
  }
}
