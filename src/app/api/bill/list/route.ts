// src\app\api\bill\list\route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const billsDir = path.resolve(process.cwd(), 'src/data/bills');
  if (!fs.existsSync(billsDir)) {
    return NextResponse.json({ files: [] });
  }

  const files = fs.readdirSync(billsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('bills-', '').replace('.json', ''));

  // files là array ngày: ['2025-06-08', '2025-06-07', ...]

  return NextResponse.json({ files });
}
