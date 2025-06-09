import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Bill, BillItem, Voucher } from '@/data/types';

export async function POST(request: Request) {
  const reqBody = await request.json();

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = today.toTimeString().split(' ')[0]; // HH:mm:ss

  const billDir = path.resolve(process.cwd(), 'src/data/bills');
  const filePath = path.join(billDir, `bills-${dateStr}.json`);

  if (!fs.existsSync(billDir)) {
    fs.mkdirSync(billDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }

  const bills = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Bill[];

  // ✅ Tính tổng trước giảm (không có giảm giá từng món)
  const processedItems: BillItem[] = reqBody.items.map((item: any) => ({
    ...item,
    total: item.price * item.quantity,
  }));

  const totalBeforeDiscount = processedItems.reduce((sum, item) => sum + item.total, 0);

const appliedBillVoucher: Voucher | undefined = reqBody.voucherApplied;

  const percent = appliedBillVoucher ? Number(appliedBillVoucher.discountPercent) : 0;
  const billDiscountAmount = (percent / 100) * totalBeforeDiscount;

  const finalAmount = totalBeforeDiscount - billDiscountAmount;

  const billToSave: Bill = {
    id: uuidv4(),
    userId: reqBody.userId,
    date: dateStr,
    time: timeStr,
    note: reqBody.note,
    items: processedItems,
    totalBeforeDiscount,
    itemDiscountTotal: 0, // vì không giảm từng món
    billDiscountAmount,
    voucherApplied: appliedBillVoucher,
    finalAmount,
  };

  bills.push(billToSave);

  fs.writeFileSync(filePath, JSON.stringify(bills, null, 2));

  return NextResponse.json({ message: 'Bill saved', billId: billToSave.id });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ message: 'Missing date parameter' }, { status: 400 });
  }

  const filePath = path.resolve(process.cwd(), 'src/data/bills', `bills-${date}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json([]); // Trả về mảng rỗng nếu không có bill ngày đó
  }

  const bills = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Bill[];

  return NextResponse.json(bills);
}
