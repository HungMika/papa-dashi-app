import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Voucher } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/vouchers.json');

export async function GET() {
  const vouchers = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Voucher[];
  return NextResponse.json(vouchers);
}

export async function POST(request: Request) {
  const newVoucher: Voucher = await request.json();
  const vouchers = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Voucher[];

  const exists = vouchers.find(v => v.id === newVoucher.id);
  if (exists) {
    return NextResponse.json(
      { message: 'Voucher with this ID already exists' },
      { status: 400 }
    );
  }

  vouchers.push(newVoucher);
  fs.writeFileSync(filePath, JSON.stringify(vouchers, null, 2));
  return NextResponse.json({ message: 'Voucher added' });
}
