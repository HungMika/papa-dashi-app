import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(req: NextRequest) {
  const { path } = await req.json();

  try {
    const imageBuffer = fs.readFileSync(path);
    const base64 = imageBuffer.toString('base64');
    return NextResponse.json({ base64 });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
