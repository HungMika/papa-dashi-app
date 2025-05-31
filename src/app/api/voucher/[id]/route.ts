import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Voucher } from '@/data/types';

const filePath = path.resolve(process.cwd(), 'src/data/vouchers.json');

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const updatedVoucher: Voucher = await req.json();

  let vouchers = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Voucher[];
  const index = vouchers.findIndex(v => v.id === id);

  if (index === -1) {
    return NextResponse.json(
      { message: 'Voucher not found' },
      { status: 404 }
    );
  }

  vouchers[index] = updatedVoucher;
  fs.writeFileSync(filePath, JSON.stringify(vouchers, null, 2));
  return NextResponse.json({ message: 'Voucher updated' });
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  let vouchers = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Voucher[];
  const exists = vouchers.find(v => v.id === id);

  if (!exists) {
    return NextResponse.json(
      { message: 'Voucher not found' },
      { status: 404 }
    );
  }

  vouchers = vouchers.filter(v => v.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(vouchers, null, 2));
  return NextResponse.json({ message: 'Voucher deleted' });
}
