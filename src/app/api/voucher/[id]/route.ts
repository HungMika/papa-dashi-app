import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Voucher } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/vouchers.json');

// [PUT] with api/voucher/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const updatedVoucher: Voucher = await req.json();

  let vouchers = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Voucher[];
  vouchers = vouchers.map(v => v.id === id ? updatedVoucher : v);

  fs.writeFileSync(filePath, JSON.stringify(vouchers, null, 2));
  return NextResponse.json({ message: 'Voucher updated' });
}

// [DELETE] with api/voucher/[id]
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  let vouchers = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Voucher[];
  vouchers = vouchers.filter(v => v.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(vouchers, null, 2));
  return NextResponse.json({ message: 'Voucher deleted' });
}
