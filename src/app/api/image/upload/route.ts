import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const fileName = formData.get('fileName') as string;

  if (!file || !fileName) {
    return NextResponse.json({ error: 'Thiếu file hoặc tên file' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/product-img');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const savePath = path.join(uploadDir, fileName);
    await writeFile(savePath, buffer);

    return NextResponse.json({ success: true, path: `product-img/${fileName}` });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lưu file' }, { status: 500 });
  }
}
